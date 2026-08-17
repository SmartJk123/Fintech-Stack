package io.elitewallet.api.web;

import io.elitewallet.api.domain.WalletAccount;
import io.elitewallet.api.domain.WalletAccountRepository;
import io.elitewallet.api.dto.WalletDtos.WalletResponse;
import io.elitewallet.api.security.AuthenticatedUser;
import io.elitewallet.api.service.AssetRegistry;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/v1/wallets")
public class WalletController {

    private final WalletAccountRepository walletRepository;

    public WalletController(WalletAccountRepository walletRepository) {
        this.walletRepository = walletRepository;
    }

    @GetMapping
    public List<WalletResponse> list(@AuthenticationPrincipal AuthenticatedUser user) {
        return walletRepository.findAllByUserId(user.id()).stream()
                .sorted(Comparator.comparing(WalletAccount::getAsset))
                .map(wallet -> new WalletResponse(
                        wallet.getId(),
                        wallet.getAsset(),
                        wallet.getBalance(),
                        wallet.getPending(),
                        wallet.getType(),
                        AssetRegistry.get(wallet.getAsset()).map(AssetRegistry.Asset::name).orElse(wallet.getAsset())))
                .toList();
    }
}