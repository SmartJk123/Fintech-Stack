package io.elitewallet.api.service;

import io.elitewallet.api.dto.WalletDtos.AssetRate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Exchange-rate service for every registered asset.
 *
 * <p>Crypto prices come from CoinGecko (no API key required for the simple
 * price endpoint); fiat cross-rates come from open.er-api.com. Results are
 * cached for a configurable TTL and a static fallback keeps the app usable
 * when the providers are unreachable.
 */
@Service
public class RatesService {

    private static final Logger log = LoggerFactory.getLogger(RatesService.class);
    private static final BigDecimal ZERO = BigDecimal.ZERO;

    private final RestClient coinGecko;
    private final RestClient erApi;
    private final long cacheTtlSeconds;
    private final BigDecimal fallbackUsdToKes;

    private volatile Cache cache;

    public RatesService(
            @Value("${app.rates.cache-ttl-seconds:300}") long cacheTtlSeconds,
            @Value("${app.rates.fallback-usd-to-kes:129.0}") BigDecimal fallbackUsdToKes) {
        this.cacheTtlSeconds = cacheTtlSeconds;
        this.fallbackUsdToKes = fallbackUsdToKes;
        this.coinGecko = restClient("https://api.coingecko.com");
        this.erApi = restClient("https://open.er-api.com");
    }

    private static RestClient restClient(String baseUrl) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(8000);
        return RestClient.builder().baseUrl(baseUrl).requestFactory(factory).build();
    }

    public List<AssetRate> getRates() {
        return buildRates(getUsdRates());
    }

    public BigDecimal usdToKes() {
        BigDecimal usdRates = getUsdRates().get("KES");
        return usdRates != null && usdRates.signum() > 0 ? usdRates : fallbackUsdToKes;
    }

    public BigDecimal toKes(BigDecimal amount, String asset) {
        if (amount == null) {
            return null;
        }
        if ("KES".equalsIgnoreCase(asset)) {
            return amount.setScale(2, RoundingMode.HALF_UP);
        }
        Map<String, BigDecimal> rates = getUsdRates();
        BigDecimal usdRate = rates.getOrDefault(asset.toUpperCase(), ZERO);
        BigDecimal kesPerUsd = usdToKes();
        return amount.multiply(usdRate).multiply(kesPerUsd).setScale(2, RoundingMode.HALF_UP);
    }

    private List<AssetRate> buildRates(Map<String, BigDecimal> usdRates) {
        BigDecimal kesPerUsd = usdToKes();
        return AssetRegistry.all().stream().map(asset -> {
            BigDecimal usd = usdRates.getOrDefault(asset.symbol(), ZERO).setScale(8, RoundingMode.HALF_UP);
            BigDecimal kes = usd.multiply(kesPerUsd).setScale(2, RoundingMode.HALF_UP);
            return new AssetRate(asset.symbol(), asset.name(), asset.type(), asset.precision(), usd, kes);
        }).toList();
    }

    private Map<String, BigDecimal> getUsdRates() {
        Cache current = cache;
        if (current != null && current.fetchedAt().plusSeconds(cacheTtlSeconds).isAfter(Instant.now())) {
            return current.usdRates();
        }
        Map<String, BigDecimal> fresh = fetchRates();
        cache = new Cache(Instant.now(), fresh);
        return fresh;
    }

    private Map<String, BigDecimal> fetchRates() {
        Map<String, BigDecimal> rates = new HashMap<>();
        rates.putAll(fetchCryptoRates());
        rates.putAll(fetchFiatRates());
        // Fill any gaps with the static fallback so every registered asset has a rate.
        FALLBACK_USD.forEach((symbol, value) -> rates.putIfAbsent(symbol, value));
        log.info("Refreshed exchange rates for {} assets", rates.size());
        return rates;
    }

    @SuppressWarnings("unchecked")
    private Map<String, BigDecimal> fetchCryptoRates() {
        Map<String, BigDecimal> result = new HashMap<>();
        try {
            String ids = String.join(",", CRYPTO_IDS.keySet());
            Map<String, Map<String, Object>> body = coinGecko.get()
                    .uri("/api/v3/simple/price?ids={ids}&vs_currencies=usd", ids)
                    .retrieve()
                    .body(Map.class);
            if (body != null) {
                CRYPTO_IDS.forEach((id, symbol) -> {
                    Map<String, Object> price = body.get(id);
                    if (price != null && price.get("usd") instanceof Number n) {
                        result.put(symbol, BigDecimal.valueOf(n.doubleValue()));
                    }
                });
            }
        } catch (Exception e) {
            log.warn("CoinGecko rate fetch failed, using fallback crypto rates: {}", e.getMessage());
        }
        return result;
    }

    @SuppressWarnings("unchecked")
    private Map<String, BigDecimal> fetchFiatRates() {
        Map<String, BigDecimal> result = new HashMap<>();
        try {
            Map<String, Object> body = erApi.get()
                    .uri("/v6/latest/USD")
                    .retrieve()
                    .body(Map.class);
            if (body != null && body.get("rates") instanceof Map<?, ?> rates) {
                for (Map.Entry<?, ?> entry : rates.entrySet()) {
                    if (entry.getKey() instanceof String code && entry.getValue() instanceof Number n) {
                        result.put(code, BigDecimal.valueOf(n.doubleValue()));
                    }
                }
            }
        } catch (Exception e) {
            log.warn("er-api rate fetch failed, using fallback fiat rates: {}", e.getMessage());
        }
        return result;
    }

    private record Cache(Instant fetchedAt, Map<String, BigDecimal> usdRates) {}

    private static final Map<String, String> CRYPTO_IDS = Map.ofEntries(
            Map.entry("bitcoin", "BTC"), Map.entry("ethereum", "ETH"),
            Map.entry("tether", "USDT"), Map.entry("usd-coin", "USDC"),
            Map.entry("binancecoin", "BNB"), Map.entry("solana", "SOL"),
            Map.entry("ripple", "XRP"), Map.entry("cardano", "ADA"),
            Map.entry("dogecoin", "DOGE"), Map.entry("litecoin", "LTC"),
            Map.entry("polkadot", "DOT"), Map.entry("avalanche-2", "AVAX"),
            Map.entry("tron", "TRX"), Map.entry("bitcoin-cash", "BCH"),
            Map.entry("uniswap", "UNI"), Map.entry("chainlink", "LINK"),
            Map.entry("the-open-network", "TON"), Map.entry("cosmos", "ATOM"),
            Map.entry("stellar", "XLM"), Map.entry("shiba-inu", "SHIB"),
            Map.entry("dai", "DAI"), Map.entry("matic-network", "POL"));

    private static final Map<String, BigDecimal> FALLBACK_USD = Map.ofEntries(
            Map.entry("KES", new BigDecimal("0.0077519")),
            Map.entry("USD", BigDecimal.ONE),
            Map.entry("EUR", new BigDecimal("1.08")),
            Map.entry("GBP", new BigDecimal("1.26")),
            Map.entry("NGN", new BigDecimal("0.00062")),
            Map.entry("GHS", new BigDecimal("0.075")),
            Map.entry("ZAR", new BigDecimal("0.053")),
            Map.entry("TZS", new BigDecimal("0.00038")),
            Map.entry("UGX", new BigDecimal("0.00026")),
            Map.entry("EGP", new BigDecimal("0.0205")),
            Map.entry("ZMW", new BigDecimal("0.039")),
            Map.entry("CAD", new BigDecimal("0.73")),
            Map.entry("AUD", new BigDecimal("0.65")),
            Map.entry("JPY", new BigDecimal("0.0066")),
            Map.entry("CNY", new BigDecimal("0.14")),
            Map.entry("INR", new BigDecimal("0.012")),
            Map.entry("SAR", new BigDecimal("0.267")),
            Map.entry("AED", new BigDecimal("0.272")),
            Map.entry("CHF", new BigDecimal("1.11")),
            Map.entry("SEK", new BigDecimal("0.094")),
            Map.entry("NOK", new BigDecimal("0.093")),
            Map.entry("DKK", new BigDecimal("0.145")),
            Map.entry("BRL", new BigDecimal("0.18")),
            Map.entry("MXN", new BigDecimal("0.055")),
            Map.entry("BTC", new BigDecimal("67000")),
            Map.entry("ETH", new BigDecimal("3300")),
            Map.entry("USDT", BigDecimal.ONE),
            Map.entry("USDC", BigDecimal.ONE),
            Map.entry("BNB", new BigDecimal("600")),
            Map.entry("SOL", new BigDecimal("150")),
            Map.entry("XRP", new BigDecimal("0.50")),
            Map.entry("ADA", new BigDecimal("0.45")),
            Map.entry("DOGE", new BigDecimal("0.15")),
            Map.entry("LTC", new BigDecimal("80")),
            Map.entry("DOT", new BigDecimal("6.00")),
            Map.entry("AVAX", new BigDecimal("30")),
            Map.entry("TRX", new BigDecimal("0.12")),
            Map.entry("BCH", new BigDecimal("400")),
            Map.entry("UNI", new BigDecimal("10")),
            Map.entry("LINK", new BigDecimal("15")),
            Map.entry("TON", new BigDecimal("6.00")),
            Map.entry("ATOM", new BigDecimal("8.00")),
            Map.entry("XLM", new BigDecimal("0.10")),
            Map.entry("SHIB", new BigDecimal("0.00002")),
            Map.entry("DAI", BigDecimal.ONE),
            Map.entry("POL", new BigDecimal("0.50")));
}