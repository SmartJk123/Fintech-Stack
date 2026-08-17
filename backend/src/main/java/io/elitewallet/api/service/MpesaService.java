package io.elitewallet.api.service;

import com.fasterxml.jackson.databind.JsonNode;
import io.elitewallet.api.common.Money;
import io.elitewallet.api.domain.TransactionEntity;
import io.elitewallet.api.dto.WalletDtos.DepositResponse;
import io.elitewallet.api.dto.WalletDtos.WithdrawalResponse;
import io.elitewallet.api.mpesa.DarajaClient;
import io.elitewallet.api.mpesa.MpesaDtos.B2cResponse;
import io.elitewallet.api.mpesa.MpesaDtos.StkPushResponse;
import io.elitewallet.api.mpesa.MpesaProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * M-Pesa money movement.
 *
 * <p>Deposits: STK Push is initiated, a PENDING transaction is stored keyed by
 * Daraja's CheckoutRequestID, and the callback credits the wallet exactly once.
 *
 * <p>Withdrawals: the wallet is debited first (reserved), B2C is fired, and the
 * result callback settles the transaction — refunding the wallet on failure.
 */
@Service
public class MpesaService {

    private static final Logger log = LoggerFactory.getLogger(MpesaService.class);
    private static final String KES = "KES";

    private final DarajaClient daraja;
    private final MpesaProperties properties;
    private final TransactionService transactionService;
    private final LedgerService ledgerService;

    public MpesaService(
            DarajaClient daraja,
            MpesaProperties properties,
            TransactionService transactionService,
            LedgerService ledgerService) {
        this.daraja = daraja;
        this.properties = properties;
        this.transactionService = transactionService;
        this.ledgerService = ledgerService;
    }

    public DepositResponse initiateDeposit(String userId, BigDecimal amount, String phone) {
        String normalizedPhone = normalizePhone(phone);
        StkPushResponse response = daraja.stkPush(normalizedPhone, amount, accountReference(userId));
        if (!"0".equals(response.ResponseCode())) {
            throw new IllegalStateException("M-Pesa rejected the request: " + response.ResponseDescription());
        }
        transactionService.create(
                userId, "DEPOSIT", KES, amount, Money.ZERO, "MPESA_STK", normalizedPhone, "MPESA",
                response.CheckoutRequestID(), "PENDING", amount);
        return new DepositResponse(
                response.CheckoutRequestID(),
                "PENDING",
                "STK push sent to " + normalizedPhone + ". Complete the prompt on your phone.",
                null,
                false);
    }

    public void handleStkCallback(JsonNode body) {
        JsonNode callback = body.path("Body").path("stkCallback");
        String checkoutRequestId = callback.path("CheckoutRequestID").asText(null);
        int resultCode = callback.path("ResultCode").asInt(-1);
        if (checkoutRequestId == null || checkoutRequestId.isBlank()) {
            log.warn("STK callback without CheckoutRequestID");
            return;
        }
        TransactionEntity transaction = transactionService.findByReference(checkoutRequestId).orElse(null);
        if (transaction == null) {
            log.warn("STK callback for unknown reference {}", checkoutRequestId);
            return;
        }
        if (settled(transaction)) {
            return;
        }
        if (resultCode == 0) {
            BigDecimal amount = callbackItemAmount(callback);
            String phone = callbackItemString(callback, "PhoneNumber");
            if (phone != null && !phone.isBlank()) {
                transaction.setCounterparty(phone);
            }
            ledgerService.credit(transaction.getUserId(), transaction.getAsset(), amount, transaction);
            transactionService.updateStatus(transaction, "COMPLETED");
            log.info("Deposit completed: ref={} amount={} {}", checkoutRequestId, amount, transaction.getAsset());
        } else {
            transactionService.updateStatus(transaction, "FAILED");
            log.info("Deposit failed: ref={} code={} desc={}",
                    checkoutRequestId, resultCode, callback.path("ResultDesc").asText());
        }
    }

    public WithdrawalResponse initiateWithdrawal(String userId, BigDecimal amount, String phone, String idempotencyKey) {
        String normalizedPhone = normalizePhone(phone);
        String reference = idempotencyKey == null || idempotencyKey.isBlank()
                ? "WDR-" + UUID.randomUUID()
                : "WDR-" + idempotencyKey;
        if (transactionService.findByReference(reference).isPresent()) {
            return new WithdrawalResponse(reference, "PROCESSING", "Withdrawal already in progress.", null, false);
        }
        TransactionEntity transaction = transactionService.create(
                userId, "WITHDRAWAL", KES, amount, Money.ZERO, "MPESA_B2C", normalizedPhone, "MPESA",
                reference, "PROCESSING", amount);
        try {
            ledgerService.debit(userId, KES, amount, transaction);
        } catch (IllegalArgumentException e) {
            transactionService.updateStatus(transaction, "FAILED");
            throw e;
        }
        B2cResponse response = daraja.b2c(normalizedPhone, amount, "EW-" + transaction.getId());
        if (!"0".equals(response.ResponseCode())) {
            refund(transaction);
            throw new IllegalStateException("M-Pesa rejected the withdrawal: " + response.ResponseDescription());
        }
        transaction.setReference(response.OriginatorConversationID());
        transactionService.updateStatus(transaction, "PROCESSING");
        return new WithdrawalResponse(
                response.OriginatorConversationID(),
                "PROCESSING",
                "Withdrawal of KES " + amount.toPlainString() + " to " + normalizedPhone + " sent.",
                response.ConversationID(),
                false);
    }

    public void handleB2cResult(JsonNode body) {
        JsonNode result = body.path("Result");
        String originatorConversationId = result.path("OriginatorConversationID").asText(null);
        int resultCode = result.path("ResultCode").asInt(-1);
        if (originatorConversationId == null || originatorConversationId.isBlank()) {
            log.warn("B2C result without OriginatorConversationID");
            return;
        }
        TransactionEntity transaction = transactionService.findByReference(originatorConversationId).orElse(null);
        if (transaction == null) {
            log.warn("B2C result for unknown reference {}", originatorConversationId);
            return;
        }
        if (settled(transaction)) {
            return;
        }
        if (resultCode == 0) {
            transactionService.updateStatus(transaction, "COMPLETED");
            log.info("Withdrawal completed: ref={}", originatorConversationId);
        } else {
            refund(transaction);
            log.info("Withdrawal failed and refunded: ref={} code={}", originatorConversationId, resultCode);
        }
    }

    private void refund(TransactionEntity transaction) {
        transactionService.updateStatus(transaction, "FAILED");
        TransactionEntity refund = transactionService.create(
                transaction.getUserId(), "WITHDRAWAL_REFUND", transaction.getAsset(), transaction.getAmount(),
                Money.ZERO, transaction.getMethod(), transaction.getCounterparty(), transaction.getNetwork(),
                transaction.getReference() + "-REFUND", "COMPLETED", transaction.getKesValue());
        ledgerService.credit(transaction.getUserId(), transaction.getAsset(), transaction.getAmount(), refund);
    }

    private boolean settled(TransactionEntity transaction) {
        return "COMPLETED".equals(transaction.getStatus()) || "FAILED".equals(transaction.getStatus());
    }

    private String accountReference(String userId) {
        String base = properties.accountReference() == null || properties.accountReference().isBlank()
                ? "EliteWallet" : properties.accountReference();
        String ref = base + "-" + userId;
        return ref.length() > 12 ? ref.substring(0, 12) : ref;
    }

    private String normalizePhone(String phone) {
        String cleaned = phone.replaceAll("[^0-9]", "");
        if (cleaned.startsWith("254")) {
            return cleaned;
        }
        if (cleaned.startsWith("0")) {
            return "254" + cleaned.substring(1);
        }
        if (cleaned.startsWith("7") || cleaned.startsWith("1")) {
            return "254" + cleaned;
        }
        throw new IllegalArgumentException("Phone must be a Kenyan number like 07XX or 2547XX");
    }

    private BigDecimal callbackItemAmount(JsonNode callback) {
        JsonNode item = findCallbackItem(callback, "Amount");
        if (item != null && item.path("Value").isNumber()) {
            return item.path("Value").decimalValue();
        }
        TransactionEntity transaction = transactionService.findByReference(callback.path("CheckoutRequestID").asText()).orElse(null);
        return transaction != null ? transaction.getAmount() : BigDecimal.ZERO;
    }

    private String callbackItemString(JsonNode callback, String name) {
        JsonNode item = findCallbackItem(callback, name);
        return item != null ? item.path("Value").asText(null) : null;
    }

    private JsonNode findCallbackItem(JsonNode callback, String name) {
        JsonNode metadata = callback.path("CallbackMetadata").path("Item");
        if (metadata.isArray()) {
            for (JsonNode item : metadata) {
                if (name.equals(item.path("Name").asText())) {
                    return item;
                }
            }
        }
        return null;
    }
}