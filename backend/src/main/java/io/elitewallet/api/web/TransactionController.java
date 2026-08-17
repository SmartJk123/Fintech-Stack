package io.elitewallet.api.web;

import io.elitewallet.api.domain.TransactionEntity;
import io.elitewallet.api.domain.TransactionRepository;
import io.elitewallet.api.dto.WalletDtos.TransactionResponse;
import io.elitewallet.api.security.AuthenticatedUser;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionController {

    private final TransactionRepository transactionRepository;

    public TransactionController(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @GetMapping
    public List<TransactionResponse> list(@AuthenticationPrincipal AuthenticatedUser user) {
        return transactionRepository.findAllByUserIdOrderByDateDesc(user.id()).stream()
                .map(TransactionController::toResponse)
                .toList();
    }

    private static TransactionResponse toResponse(TransactionEntity t) {
        return new TransactionResponse(
                t.getId(),
                t.getReference(),
                t.getType(),
                t.getAsset(),
                t.getAmount(),
                t.getFee(),
                t.getStatus(),
                t.getMethod(),
                t.getCounterparty(),
                t.getNetwork(),
                t.getKesValue(),
                t.getDate());
    }
}