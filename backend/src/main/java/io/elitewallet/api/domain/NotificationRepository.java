package io.elitewallet.api.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, String> {
    List<Notification> findAllByUserIdOrderByDateDesc(String userId);
    Optional<Notification> findByIdAndUserId(String id, String userId);
}
