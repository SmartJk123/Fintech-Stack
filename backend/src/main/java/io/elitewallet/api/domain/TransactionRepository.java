package io.elitewallet.api.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<TransactionEntity, String> {
    List<TransactionEntity> findAllByUserIdOrderByDateDesc(String userId);
    Optional<TransactionEntity> findByIdAndUserId(String id, String userId);
}
