package io.elitewallet.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * One side of a double-entry ledger post. For every transaction the sum of all
 * ledger amounts must be zero (a credit to one wallet is matched by a debit to
 * the system float or another wallet).
 */
@Entity
@Table(name = "ledger_entries")
@Getter
@Setter
@NoArgsConstructor
public class LedgerEntry {

    public static final String SIDE_DEBIT = "DEBIT";
    public static final String SIDE_CREDIT = "CREDIT";

    @Id
    private String id;

    @Column(name = "transaction_id", nullable = false)
    private String transactionId;

    /** Nullable: the system float side has no user wallet. */
    @Column(name = "wallet_id")
    private String walletId;

    @Column(nullable = false, length = 16)
    private String asset;

    @Column(nullable = false, precision = 38, scale = 8)
    private BigDecimal amount;

    @Column(nullable = false, length = 8)
    private String side;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @PrePersist
    void ensureId() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
    }
}