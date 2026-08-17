package io.elitewallet.api.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BeneficiaryRepository extends JpaRepository<Beneficiary, String> {
    List<Beneficiary> findAllByUserIdOrderByAddedDateDesc(String userId);
    Optional<Beneficiary> findByIdAndUserId(String id, String userId);
}
