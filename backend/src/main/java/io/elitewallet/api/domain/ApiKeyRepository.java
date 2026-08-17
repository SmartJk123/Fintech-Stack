package io.elitewallet.api.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApiKeyRepository extends JpaRepository<ApiKey, String> {
    List<ApiKey> findAllByUserIdOrderByCreatedDesc(String userId);
}
