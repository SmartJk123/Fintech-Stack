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
@Table(name = "wallet_accounts")
@Getter
@Setter
@NoArgsConstructor
public class WalletAccount {

    @Id
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(nullable = false, length = 16)
    private String asset;

    @Column(nullable = false, precision = 38, scale = 8)
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(nullable = false, precision = 38, scale = 8)
    private BigDecimal pending = BigDecimal.ZERO;

    @Column(nullable = false, length = 16)
    private String type;

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
