package io.elitewallet.api.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "support_tickets")
@Getter
@Setter
@NoArgsConstructor
public class SupportTicket {

    @Id
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(nullable = false)
    private String subject;

    private String category;
    private String priority;

    @Column(nullable = false, length = 32)
    private String status = "open";

    @Column(nullable = false)
    private LocalDate date = LocalDate.now();

    @Column(name = "last_update", nullable = false)
    private LocalDate lastUpdate = LocalDate.now();

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
