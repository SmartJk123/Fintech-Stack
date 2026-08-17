package io.elitewallet.api.service;

import io.elitewallet.api.common.Money;
import io.elitewallet.api.domain.TransactionEntity;
import io.elitewallet.api.domain.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

/** Creates and updates transaction records. Provider references make them idempotent. */
@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    /**
     * Returns the existing transaction when the provider reference is already
     * known — the caller can then finish idempotently instead of double posting.
     */
    @Transactional
    public TransactionEntity create(
            String userId,
            String type,
            String asset,
            BigDecimal amount,
            BigDecimal fee,
            String method,
            String counterparty,
            String network,
            String reference,
            String status,
            BigDecimal kesValue) {
        if (reference != null && !reference.isBlank()) {
            Optional<TransactionEntity> existing = transactionRepository.findByReference(reference);
            if (existing.isPresent()) {
                return existing.get();
            }
        }
        TransactionEntity transaction = new TransactionEntity();
        transaction.setUserId(userId);
        transaction.setType(type);
        transaction.setAsset(AssetRegistry.require(asset).symbol());
        transaction.setAmount(Money.normalize(amount));
        transaction.setFee(Money.normalize(fee));
        transaction.setMethod(method);
        transaction.setCounterparty(counterparty);
        transaction.setNetwork(network);
        transaction.setStatus(status);
        transaction.setKesValue(kesValue);
        if (reference != null && !reference.isBlank()) {
            transaction.setReference(reference);
        }
        return transactionRepository.saveAndFlush(transaction);
    }

    @Transactional
    public TransactionEntity updateStatus(TransactionEntity transaction, String status) {
        transaction.setStatus(status);
        return transactionRepository.save(transaction);
    }

    public Optional<TransactionEntity> findByReference(String reference) {
        return transactionRepository.findByReference(reference);
    }
}