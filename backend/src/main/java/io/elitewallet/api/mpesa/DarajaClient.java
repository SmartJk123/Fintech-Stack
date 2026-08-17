package io.elitewallet.api.mpesa;

import io.elitewallet.api.mpesa.MpesaDtos.B2cResponse;
import io.elitewallet.api.mpesa.MpesaDtos.StkPushResponse;
import io.elitewallet.api.mpesa.MpesaDtos.TokenResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Thin client for the M-Pesa Daraja API (sandbox by default, production via
 * MPESA_BASE_URL). Handles OAuth tokens with caching, STK Push (customer
 * initiated deposit) and B2C (business payout for withdrawals).
 */
@Component
public class DarajaClient {

    private static final Logger log = LoggerFactory.getLogger(DarajaClient.class);
    private static final ZoneId NAIROBI = ZoneId.of("Africa/Nairobi");
    private static final DateTimeFormatter TIMESTAMP = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    private final MpesaProperties properties;
    private final RestClient rest;
    private volatile Token cachedToken;

    public DarajaClient(MpesaProperties properties) {
        this.properties = properties;
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(8000);
        factory.setReadTimeout(15000);
        this.rest = RestClient.builder().baseUrl(properties.baseUrl()).requestFactory(factory).build();
    }

    public synchronized String accessToken() {
        if (cachedToken != null && cachedToken.expiresAt().isAfter(Instant.now().plusSeconds(60))) {
            return cachedToken.value();
        }
        TokenResponse response = rest.get()
                .uri("/oauth/v1/generate?grant_type=client_credentials")
                .headers(headers -> headers.setBasicAuth(properties.consumerKey(), properties.consumerSecret()))
                .retrieve()
                .body(TokenResponse.class);
        if (response == null || response.access_token() == null) {
            throw new IllegalStateException("M-Pesa token request failed");
        }
        cachedToken = new Token(response.access_token(), Instant.now().plusSeconds(response.expires_in()));
        log.info("M-Pesa access token refreshed (expires in {}s)", response.expires_in());
        return cachedToken.value();
    }

    public StkPushResponse stkPush(String phone, BigDecimal amount, String accountReference) {
        String timestamp = nowTimestamp();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("BusinessShortCode", properties.shortcode());
        body.put("Password", stkPassword(timestamp));
        body.put("Timestamp", timestamp);
        body.put("TransactionType", "CustomerPayBillOnline");
        body.put("Amount", amount.toPlainString());
        body.put("PartyA", phone);
        body.put("PartyB", properties.shortcode());
        body.put("PhoneNumber", phone);
        body.put("CallBackURL", properties.callbackUrl());
        body.put("AccountReference", accountReference);
        body.put("TransactionDesc", "EliteWallet deposit");
        return post("/mpesa/stkpush/v1/processrequest", body, StkPushResponse.class);
    }

    public B2cResponse b2c(String phone, BigDecimal amount, String remarks) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("InitiatorName", properties.initiatorName());
        body.put("SecurityCredential", properties.securityCredential());
        body.put("CommandID", "BusinessPayment");
        body.put("Amount", amount.toPlainString());
        body.put("PartyA", properties.shortcode());
        body.put("PartyB", phone);
        body.put("Remarks", remarks);
        body.put("QueueTimeOutURL", properties.b2cQueueTimeoutUrl());
        body.put("ResultURL", properties.b2cResultUrl());
        body.put("Occasion", "");
        return post("/mpesa/b2c/v1/paymentrequest", body, B2cResponse.class);
    }

    private <T> T post(String uri, Map<String, Object> body, Class<T> type) {
        return rest.post()
                .uri(uri)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken())
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(type);
    }

    private String stkPassword(String timestamp) {
        String raw = properties.shortcode() + properties.passkey() + timestamp;
        return Base64.getEncoder().encodeToString(raw.getBytes(StandardCharsets.UTF_8));
    }

    private String nowTimestamp() {
        return TIMESTAMP.format(LocalDateTime.now(NAIROBI));
    }

    private record Token(String value, Instant expiresAt) {}
}