package io.elitewallet.api.domain;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import java.util.List;
import java.util.Optional;

public interface WalletAccountRepository extends JpaRepository<WalletAccount, String> {
    List<WalletAccount> findAllByUserId(String userId);
    Optional<WalletAccount> findByIdAndUserId(String id, String userId);

    /**
     * Pessimistic write lock: concurrent credits/debits to the same wallet are
     * serialised so balances can never go negative or double-spend.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<WalletAccount> findByUserIdAndAsset(String userId, String asset);
}