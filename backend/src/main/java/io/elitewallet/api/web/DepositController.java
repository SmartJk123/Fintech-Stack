package io.elitewallet.api.web;

import io.elitewallet.api.dto.WalletDtos.CryptoDepositRequest;
import io.elitewallet.api.dto.WalletDtos.DepositResponse;
import io.elitewallet.api.dto.WalletDtos.MpesaDepositRequest;
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
@RequestMapping("/api/v1/deposits")
public class DepositController {

    private final MpesaService mpesaService;
    private final CryptoService cryptoService;

    public DepositController(MpesaService mpesaService, CryptoService cryptoService) {
        this.mpesaService = mpesaService;
        this.cryptoService = cryptoService;
    }

    @PostMapping("/mpesa")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public DepositResponse mpesa(@AuthenticationPrincipal AuthenticatedUser user,
                                 @Valid @RequestBody MpesaDepositRequest request) {
        return mpesaService.initiateDeposit(user.id(), request.amount(), request.phone());
    }

    @PostMapping("/crypto")
    public DepositResponse crypto(@AuthenticationPrincipal AuthenticatedUser user,
                                  @Valid @RequestBody CryptoDepositRequest request) {
        return cryptoService.deposit(user.id(), request);
    }
}