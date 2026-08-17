package io.elitewallet.api.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
public class Notification {

    @Id
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    private String category;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "text")
    private String message;

    @Column(nullable = false)
    private boolean read = false;

    @Column(nullable = false)
    private Instant date = Instant.now();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    void ensureId() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
    }
}
