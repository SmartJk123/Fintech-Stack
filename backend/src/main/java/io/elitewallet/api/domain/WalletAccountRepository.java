package io.elitewallet.api.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WalletAccountRepository extends JpaRepository<WalletAccount, String> {
    List<WalletAccount> findAllByUserId(String userId);
    Optional<WalletAccount> findByIdAndUserId(String id, String userId);
    Optional<WalletAccount> findByUserIdAndAsset(String userId, String asset);
}
