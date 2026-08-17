CREATE TABLE ledger_entries (
    id             VARCHAR(36) PRIMARY KEY,
    transaction_id VARCHAR(36) NOT NULL REFERENCES transactions(id),
    wallet_id      VARCHAR(36) REFERENCES wallet_accounts(id),
    asset          VARCHAR(16) NOT NULL,
    amount         NUMERIC(38, 8) NOT NULL,
    side           VARCHAR(8) NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Idempotency guard: a provider reference (M-Pesa CheckoutRequestID /
-- OriginatorConversationID, crypto txid, etc.) may only create one transaction.
CREATE UNIQUE INDEX uq_transactions_reference ON transactions(reference);

CREATE INDEX idx_ledger_tx ON ledger_entries(transaction_id);
CREATE INDEX idx_ledger_wallet ON ledger_entries(wallet_id);
