package io.elitewallet.api.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, String> {
    List<Invoice> findAllByUserIdOrderByIssueDateDesc(String userId);
}
