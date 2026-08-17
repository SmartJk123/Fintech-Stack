package io.elitewallet.api.mpesa;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "mpesa")
public record MpesaProperties(
        String env,
        String baseUrl,
        String consumerKey,
        String consumerSecret,
        String passkey,
        String shortcode,
        String initiatorName,
        String securityCredential,
        String accountReference,
        String callbackUrl,
        String b2cResultUrl,
        String b2cQueueTimeoutUrl) {
}