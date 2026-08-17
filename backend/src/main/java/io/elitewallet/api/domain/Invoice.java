package io.elitewallet.api.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@NoArgsConstructor
public class Invoice {

    @Id
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(nullable = false, length = 64)
    private String number;

    @Column(nullable = false)
    private String customer;

    @Column(nullable = false, precision = 38, scale = 8)
    private BigDecimal amount;

    @Column(nullable = false, length = 8)
    private String currency = "KES";

    @Column(nullable = false, length = 32)
    private String status = "draft";

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate = LocalDate.now();

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
        if (number == null) {
            number = "INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
    }
}
