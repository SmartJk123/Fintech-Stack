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
@Table(name = "beneficiaries")
@Getter
@Setter
@NoArgsConstructor
public class Beneficiary {

    @Id
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 32)
    private String type;

    @Column(nullable = false)
    private String identifier;

    @Column(nullable = false, length = 16)
    private String asset;

    private String network;
    private String bank;

    @Column(name = "added_date", nullable = false)
    private LocalDate addedDate = LocalDate.now();

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
