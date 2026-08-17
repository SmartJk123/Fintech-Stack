package io.elitewallet.api.common;

import java.math.BigDecimal;
import java.math.RoundingMode;

/** Shared money helpers. All wallet amounts are stored with 8 decimal places. */
public final class Money {

    public static final BigDecimal ZERO = new BigDecimal("0.00000000");

    private Money() {}

    public static BigDecimal normalize(BigDecimal value) {
        return value == null ? ZERO : value.setScale(8, RoundingMode.HALF_UP);
    }
}