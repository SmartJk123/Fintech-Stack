package io.elitewallet.api.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
public class TransactionEntity {

    @Id
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(nullable = false, length = 64)
    private String reference;

    @Column(nullable = false, length = 32)
    private String type;

    @Column(nullable = false, length = 16)
    private String asset;

    @Column(nullable = false, precision = 38, scale = 8)
    private BigDecimal amount;

    @Column(nullable = false, precision = 38, scale = 8)
    private BigDecimal fee = BigDecimal.ZERO;

    @Column(nullable = false, length = 32)
    private String status;

    private String method;
    private String counterparty;
    private String network;

    @Column(name = "kes_value", precision = 38, scale = 8)
    private BigDecimal kesValue;

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
        if (reference == null) {
            reference = "TX-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
        }
    }
}
