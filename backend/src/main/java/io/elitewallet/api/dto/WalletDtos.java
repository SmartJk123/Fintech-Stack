package io.elitewallet.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;

public final class WalletDtos {

    private WalletDtos() {}

    public record WalletResponse(
            String id,
            String asset,
            BigDecimal balance,
            BigDecimal pending,
            String type,
            String name) {}

    public record TransactionResponse(
            String id,
            String reference,
            String type,
            String asset,
            BigDecimal amount,
            BigDecimal fee,
            String status,
            String method,
            String counterparty,
            String network,
            BigDecimal kesValue,
            Instant date) {}

    public record AssetRate(
            String symbol,
            String name,
            String type,
            int precision,
            BigDecimal usd,
            BigDecimal kes) {}

    public record MpesaDepositRequest(
            @NotNull @DecimalMin(value = "1", message = "Minimum deposit is 1") BigDecimal amount,
            @NotBlank String phone) {}

    public record CryptoDepositRequest(
            @NotBlank String asset,
            @NotNull @DecimalMin(value = "0.00000001") BigDecimal amount) {}

    public record MpesaWithdrawalRequest(
            @NotNull @DecimalMin(value = "1", message = "Minimum withdrawal is 1") BigDecimal amount,
            @NotBlank String phone,
            String idempotencyKey) {}

    public record CryptoWithdrawalRequest(
            @NotBlank String asset,
            @NotNull @DecimalMin(value = "0.00000001") BigDecimal amount,
            @NotBlank String address,
            String idempotencyKey) {}

    public record DepositResponse(
            String reference,
            String status,
            String message,
            String address,
            boolean demo) {}

    public record WithdrawalResponse(
            String reference,
            String status,
            String message,
            String transactionId,
            boolean demo) {}
}