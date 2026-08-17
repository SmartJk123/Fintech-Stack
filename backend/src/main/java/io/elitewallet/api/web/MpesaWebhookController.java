package io.elitewallet.api.web;

import com.fasterxml.jackson.databind.JsonNode;
import io.elitewallet.api.service.MpesaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Public webhook endpoints called by Safaricom Daraja. They must be reachable
 * over HTTPS from the internet (use ngrok/tunneling in local development).
 */
@RestController
@RequestMapping("/api/v1/webhooks/mpesa")
public class MpesaWebhookController {

    private final MpesaService mpesaService;

    public MpesaWebhookController(MpesaService mpesaService) {
        this.mpesaService = mpesaService;
    }

    @PostMapping("/stk-callback")
    public ResponseEntity<Void> stkCallback(@RequestBody JsonNode body) {
        mpesaService.handleStkCallback(body);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/b2c-result")
    public ResponseEntity<Void> b2cResult(@RequestBody JsonNode body) {
        mpesaService.handleB2cResult(body);
        return ResponseEntity.ok().build();
    }
}