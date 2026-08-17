package io.elitewallet.api.service;

import io.elitewallet.api.common.Money;
import io.elitewallet.api.domain.TransactionEntity;
import io.elitewallet.api.dto.WalletDtos.CryptoDepositRequest;
import io.elitewallet.api.dto.WalletDtos.CryptoWithdrawalRequest;
import io.elitewallet.api.dto.WalletDtos.DepositResponse;
import io.elitewallet.api.dto.WalletDtos.WithdrawalResponse;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Crypto deposits and withdrawals for any registered crypto asset.
 * Ledger-identical to the M-Pesa paths; only the rails differ.
 */
@Service
public class CryptoService {

    private final CryptoRails cryptoRails;
    private final TransactionService transactionService;
    private final LedgerService ledgerService;
    private final RatesService ratesService;

    public CryptoService(
            CryptoRails cryptoRails,
            TransactionService transactionService,
            LedgerService ledgerService,
            RatesService ratesService) {
        this.cryptoRails = cryptoRails;
        this.transactionService = transactionService;
        this.ledgerService = ledgerService;
        this.ratesService = ratesService;
    }

    public DepositResponse deposit(String userId, CryptoDepositRequest request) {
        String asset = requireCrypto(request.asset());
        String address = cryptoRails.addressFor(userId, asset);
        String reference = "CRYPTO-DEP-" + UUID.randomUUID();
        TransactionEntity transaction = transactionService.create(
                userId, "DEPOSIT", asset, request.amount(), Money.ZERO, "CRYPTO_DEMO", address,
                cryptoRails.networkFor(asset), reference, "COMPLETED", ratesService.toKes(request.amount(), asset));
        ledgerService.credit(userId, asset, request.amount(), transaction);
        return new DepositResponse(
                reference, "COMPLETED",
                "Demo credit of " + request.amount().stripTrailingZeros().toPlainString() + " " + asset
                        + " to " + address + ". Production: on-chain confirmation via provider webhook.",
                address, true);
    }

    public WithdrawalResponse withdraw(String userId, CryptoWithdrawalRequest request) {
        String asset = requireCrypto(request.asset());
        String reference = request.idempotencyKey() == null || request.idempotencyKey().isBlank()
                ? "CRYPTO-WDR-" + UUID.randomUUID()
                : "CRYPTO-WDR-" + request.idempotencyKey();
        if (transactionService.findByReference(reference).isPresent()) {
            return new WithdrawalResponse(reference, "PROCESSING", "Withdrawal already in progress.", null, true);
        }
        TransactionEntity transaction = transactionService.create(
                userId, "WITHDRAWAL", asset, request.amount(), Money.ZERO, "CRYPTO_DEMO",
                request.address(), cryptoRails.networkFor(asset), reference, "PROCESSING",
                ratesService.toKes(request.amount(), asset));
        try {
            ledgerService.debit(userId, asset, request.amount(), transaction);
        } catch (IllegalArgumentException e) {
            transactionService.updateStatus(transaction, "FAILED");
            throw e;
        }
        String txid = cryptoRails.broadcast(asset, request.amount(), request.address(), reference);
        transactionService.updateStatus(transaction, "COMPLETED");
        return new WithdrawalResponse(
                reference, "COMPLETED",
                request.amount().stripTrailingZeros().toPlainString() + " " + asset + " sent to "
                        + request.address() + " (demo broadcast).",
                txid, true);
    }

    private String requireCrypto(String asset) {
        String symbol = AssetRegistry.require(asset).symbol();
        if (!AssetRegistry.isCrypto(symbol)) {
            throw new IllegalArgumentException("Crypto rails only support crypto assets, got " + symbol);
        }
        return symbol;
    }
}