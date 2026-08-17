package io.elitewallet.api.web;

import io.elitewallet.api.dto.WalletDtos.AssetRate;
import io.elitewallet.api.service.RatesService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rates")
public class RatesController {

    private final RatesService ratesService;

    public RatesController(RatesService ratesService) {
        this.ratesService = ratesService;
    }

    @GetMapping
    public List<AssetRate> rates() {
        return ratesService.getRates();
    }
}