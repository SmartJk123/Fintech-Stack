package io.elitewallet.api.service;

import java.math.BigDecimal;

/**
 * On-chain rails for crypto deposits and withdrawals.
 *
 * <p>The demo implementation simulates addresses and broadcasts so the full
 * wallet flow works end to end. For production, swap in a real provider
 * (BitGo, Coinbase Prime, Blockstream Greenlight, a self-hosted node, ...)
 * behind this interface — the ledger, idempotency and wallet code do not change.
 */
public interface CryptoRails {

    /** Returns a deposit address for the user/asset (provider-generated in production). */
    String addressFor(String userId, String asset);

    /** Human-readable network label, e.g. Bitcoin, Ethereum. */
    String networkFor(String asset);

    /**
     * Broadcasts a withdrawal and returns the on-chain transaction id.
     * Throws IllegalArgumentException when the broadcast fails.
     */
    String broadcast(String asset, BigDecimal amount, String destinationAddress, String reference);
}