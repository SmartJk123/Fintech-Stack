package io.elitewallet.api.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.Map;
import java.util.UUID;

/**
 * Demo on-chain rails: deterministic per-user addresses and simulated
 * broadcasts so every crypto asset is fully usable in the running wallet.
 */
@Component
public class DemoCryptoRails implements CryptoRails {

    private static final Logger log = LoggerFactory.getLogger(DemoCryptoRails.class);

    private static final Map<String, String> NETWORKS = Map.of(
            "BTC", "Bitcoin",
            "ETH", "Ethereum",
            "SOL", "Solana",
            "XRP", "XRP Ledger",
            "ADA", "Cardano",
            "DOGE", "Dogecoin",
            "LTC", "Litecoin",
            "DOT", "Polkadot",
            "AVAX", "Avalanche C-Chain",
            "TRX", "TRON",
            "BCH", "Bitcoin Cash",
            "ATOM", "Cosmos",
            "XLM", "Stellar",
            "SHIB", "Ethereum",
            "POL", "Polygon");

    @Override
    public String addressFor(String userId, String asset) {
        String digest = sha256(userId + ":" + asset);
        return "demo-" + asset.toLowerCase() + "-" + digest.substring(0, 24);
    }

    @Override
    public String networkFor(String asset) {
        return NETWORKS.getOrDefault(asset, asset + " Network");
    }

    @Override
    public String broadcast(String asset, BigDecimal amount, String destinationAddress, String reference) {
        String txid = "demo-tx-" + UUID.randomUUID();
        log.info("Demo crypto broadcast: {} {} -> {} (ref {}, txid {})", amount, asset, destinationAddress, reference, txid);
        return txid;
    }

    private String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(input.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new IllegalStateException("SHA-256 unavailable", e);
        }
    }
}