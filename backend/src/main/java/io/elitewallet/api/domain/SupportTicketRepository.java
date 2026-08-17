package io.elitewallet.api.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, String> {
    List<SupportTicket> findAllByUserIdOrderByDateDesc(String userId);
}
