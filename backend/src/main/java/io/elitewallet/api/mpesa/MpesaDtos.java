package io.elitewallet.api.mpesa;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

public final class MpesaDtos {

    private MpesaDtos() {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record TokenResponse(String access_token, int expires_in) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record StkPushResponse(
            String MerchantRequestID,
            String CheckoutRequestID,
            String ResponseCode,
            String ResponseDescription,
            String CustomerMessage) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record B2cResponse(
            String ConversationID,
            String OriginatorConversationID,
            String ResponseCode,
            String ResponseDescription) {}
}