package io.elitewallet.api.service;

import io.elitewallet.api.common.Money;
import io.elitewallet.api.domain.LedgerEntry;
import io.elitewallet.api.domain.LedgerEntryRepository;
import io.elitewallet.api.domain.TransactionEntity;
import io.elitewallet.api.domain.WalletAccount;
import io.elitewallet.api.domain.WalletAccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * The heart of the wallet. Every balance change:
 *
 * <ul>
 *   <li>locks the wallet row (PESSIMISTIC_WRITE) so concurrent operations cannot race;</li>
 *   <li>posts a double-entry pair (user wallet + system float) that always sums to zero;</li>
 *   <li>is idempotent per transaction — a repeated webhook can never double-credit.</li>
 * </ul>
 */
@Service
public class LedgerService {

    private final WalletAccountRepository walletRepository;
    private final LedgerEntryRepository ledgerEntryRepository;

    public LedgerService(WalletAccountRepository walletRepository, LedgerEntryRepository ledgerEntryRepository) {
        this.walletRepository = walletRepository;
        this.ledgerEntryRepository = ledgerEntryRepository;
    }

    @Transactional
    public WalletAccount getOrCreate(String userId, String asset) {
        String symbol = AssetRegistry.require(asset).symbol();
        return walletRepository.findByUserIdAndAsset(userId, symbol)
                .orElseGet(() -> {
                    WalletAccount wallet = new WalletAccount();
                    wallet.setUserId(userId);
                    wallet.setAsset(symbol);
                    wallet.setBalance(Money.ZERO);
                    wallet.setPending(Money.ZERO);
                    wallet.setType(AssetRegistry.get(symbol).orElseThrow().type());
                    return walletRepository.save(wallet);
                });
    }

    @Transactional
    public void ensureDefaultWallets(String userId) {
        for (String asset : List.of("KES", "USD", "EUR", "GBP", "BTC", "ETH", "USDT", "USDC")) {
            getOrCreate(userId, asset);
        }
    }

    /** Credits a user wallet for the transaction, with the matching system-float debit. Idempotent. */
    @Transactional
    public void credit(String userId, String asset, BigDecimal amount, TransactionEntity transaction) {
        if (alreadyPosted(transaction)) {
            return;
        }
        BigDecimal value = Money.normalize(amount);
        WalletAccount wallet = getOrCreate(userId, asset);
        wallet.setBalance(wallet.getBalance().add(value));
        walletRepository.save(wallet);
        post(transaction.getId(), wallet.getId(), asset, value, LedgerEntry.SIDE_CREDIT);
        post(transaction.getId(), null, asset, value.negate(), LedgerEntry.SIDE_DEBIT);
    }

    /** Debits a user wallet after an availability check, with the matching system-float credit. Idempotent. */
    @Transactional
    public void debit(String userId, String asset, BigDecimal amount, TransactionEntity transaction) {
        if (alreadyPosted(transaction)) {
            return;
        }
        BigDecimal value = Money.normalize(amount);
        WalletAccount wallet = getOrCreate(userId, asset);
        if (wallet.getBalance().compareTo(value) < 0) {
            throw new IllegalArgumentException("Insufficient " + asset + " balance");
        }
        wallet.setBalance(wallet.getBalance().subtract(value));
        walletRepository.save(wallet);
        post(transaction.getId(), wallet.getId(), asset, value.negate(), LedgerEntry.SIDE_DEBIT);
        post(transaction.getId(), null, asset, value, LedgerEntry.SIDE_CREDIT);
    }

    private boolean alreadyPosted(TransactionEntity transaction) {
        return transaction.getId() != null && ledgerEntryRepository.existsByTransactionId(transaction.getId());
    }

    private void post(String transactionId, String walletId, String asset, BigDecimal amount, String side) {
        LedgerEntry entry = new LedgerEntry();
        entry.setTransactionId(transactionId);
        entry.setWalletId(walletId);
        entry.setAsset(asset.toUpperCase());
        entry.setAmount(Money.normalize(amount));
        entry.setSide(side);
        ledgerEntryRepository.save(entry);
    }
}