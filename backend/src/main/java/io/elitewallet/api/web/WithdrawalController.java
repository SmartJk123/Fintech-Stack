package io.elitewallet.api.web;

import io.elitewallet.api.dto.WalletDtos.CryptoWithdrawalRequest;
import io.elitewallet.api.dto.WalletDtos.MpesaWithdrawalRequest;
import io.elitewallet.api.dto.WalletDtos.WithdrawalResponse;
import io.elitewallet.api.security.AuthenticatedUser;
import io.elitewallet.api.service.CryptoService;
import io.elitewallet.api.service.MpesaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/withdrawals")
public class WithdrawalController {

    private final MpesaService mpesaService;
    private final CryptoService cryptoService;

    public WithdrawalController(MpesaService mpesaService, CryptoService cryptoService) {
        this.mpesaService = mpesaService;
        this.cryptoService = cryptoService;
    }

    @PostMapping("/mpesa")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public WithdrawalResponse mpesa(@AuthenticationPrincipal AuthenticatedUser user,
                                    @Valid @RequestBody MpesaWithdrawalRequest request) {
        return mpesaService.initiateWithdrawal(user.id(), request.amount(), request.phone(), request.idempotencyKey());
    }

    @PostMapping("/crypto")
    public WithdrawalResponse crypto(@AuthenticationPrincipal AuthenticatedUser user,
                                     @Valid @RequestBody CryptoWithdrawalRequest request) {
        return cryptoService.withdraw(user.id(), request);
    }
}