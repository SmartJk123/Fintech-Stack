package io.elitewallet.api.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Global asset registry: fiat currencies (ISO 4217) and crypto assets.
 * Any asset listed here can hold a wallet balance; the ledger itself is
 * currency-agnostic.
 */
public final class AssetRegistry {

    private AssetRegistry() {}

    public record Asset(String symbol, String name, String type, int precision) {}

    private static final Map<String, Asset> ASSETS = new LinkedHashMap<>();

    static {
        // Fiat (ISO 4217)
        add("KES", "Kenyan Shilling", "fiat", 2);
        add("USD", "US Dollar", "fiat", 2);
        add("EUR", "Euro", "fiat", 2);
        add("GBP", "British Pound", "fiat", 2);
        add("NGN", "Nigerian Naira", "fiat", 2);
        add("GHS", "Ghanaian Cedi", "fiat", 2);
        add("ZAR", "South African Rand", "fiat", 2);
        add("TZS", "Tanzanian Shilling", "fiat", 2);
        add("UGX", "Ugandan Shilling", "fiat", 2);
        add("EGP", "Egyptian Pound", "fiat", 2);
        add("ZMW", "Zambian Kwacha", "fiat", 2);
        add("CAD", "Canadian Dollar", "fiat", 2);
        add("AUD", "Australian Dollar", "fiat", 2);
        add("JPY", "Japanese Yen", "fiat", 0);
        add("CNY", "Chinese Yuan", "fiat", 2);
        add("INR", "Indian Rupee", "fiat", 2);
        add("SAR", "Saudi Riyal", "fiat", 2);
        add("AED", "UAE Dirham", "fiat", 2);
        add("CHF", "Swiss Franc", "fiat", 2);
        add("SEK", "Swedish Krona", "fiat", 2);
        add("NOK", "Norwegian Krone", "fiat", 2);
        add("DKK", "Danish Krone", "fiat", 2);
        add("BRL", "Brazilian Real", "fiat", 2);
        add("MXN", "Mexican Peso", "fiat", 2);
        // Crypto
        add("BTC", "Bitcoin", "crypto", 8);
        add("ETH", "Ethereum", "crypto", 8);
        add("USDT", "Tether USD", "crypto", 6);
        add("USDC", "USD Coin", "crypto", 6);
        add("BNB", "BNB", "crypto", 8);
        add("SOL", "Solana", "crypto", 8);
        add("XRP", "XRP", "crypto", 8);
        add("ADA", "Cardano", "crypto", 8);
        add("DOGE", "Dogecoin", "crypto", 8);
        add("LTC", "Litecoin", "crypto", 8);
        add("DOT", "Polkadot", "crypto", 8);
        add("AVAX", "Avalanche", "crypto", 8);
        add("TRX", "TRON", "crypto", 6);
        add("BCH", "Bitcoin Cash", "crypto", 8);
        add("UNI", "Uniswap", "crypto", 8);
        add("LINK", "Chainlink", "crypto", 8);
        add("TON", "Toncoin", "crypto", 8);
        add("ATOM", "Cosmos", "crypto", 8);
        add("XLM", "Stellar", "crypto", 8);
        add("SHIB", "Shiba Inu", "crypto", 8);
        add("DAI", "Dai", "crypto", 8);
        add("POL", "Polygon", "crypto", 8);
    }

    private static void add(String symbol, String name, String type, int precision) {
        ASSETS.put(symbol, new Asset(symbol, name, type, precision));
    }

    public static Optional<Asset> get(String symbol) {
        return Optional.ofNullable(ASSETS.get(symbol.toUpperCase()));
    }

    public static Asset require(String symbol) {
        return get(symbol).orElseThrow(() -> new IllegalArgumentException("Unsupported asset: " + symbol));
    }

    public static boolean supports(String symbol) {
        return ASSETS.containsKey(symbol.toUpperCase());
    }

    public static boolean isCrypto(String symbol) {
        return get(symbol).map(a -> "crypto".equals(a.type())).orElse(false);
    }

    public static boolean isFiat(String symbol) {
        return get(symbol).map(a -> "fiat".equals(a.type())).orElse(false);
    }

    public static List<Asset> all() {
        return List.copyOf(ASSETS.values());
    }
}