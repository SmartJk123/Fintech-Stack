CREATE TABLE users (
    id            VARCHAR(36) PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    full_name     VARCHAR(255),
    password_hash VARCHAR(255),
    role          VARCHAR(32) NOT NULL DEFAULT 'user',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE wallet_accounts (
    id         VARCHAR(36) PRIMARY KEY,
    user_id    VARCHAR(36) NOT NULL REFERENCES users(id),
    asset      VARCHAR(16) NOT NULL,
    balance    NUMERIC(38, 8) NOT NULL DEFAULT 0,
    pending    NUMERIC(38, 8) NOT NULL DEFAULT 0,
    type       VARCHAR(16) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, asset)
);

CREATE TABLE transactions (
    id           VARCHAR(36) PRIMARY KEY,
    user_id      VARCHAR(36) NOT NULL REFERENCES users(id),
    reference    VARCHAR(64) NOT NULL,
    type         VARCHAR(32) NOT NULL,
    asset        VARCHAR(16) NOT NULL,
    amount       NUMERIC(38, 8) NOT NULL,
    fee          NUMERIC(38, 8) NOT NULL DEFAULT 0,
    status       VARCHAR(32) NOT NULL,
    method       VARCHAR(64),
    counterparty VARCHAR(255),
    network      VARCHAR(32),
    kes_value    NUMERIC(38, 8),
    date         TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE beneficiaries (
    id          VARCHAR(36) PRIMARY KEY,
    user_id     VARCHAR(36) NOT NULL REFERENCES users(id),
    name        VARCHAR(255) NOT NULL,
    type        VARCHAR(32) NOT NULL,
    identifier  VARCHAR(255) NOT NULL,
    asset       VARCHAR(16) NOT NULL,
    network     VARCHAR(32),
    bank        VARCHAR(255),
    added_date  DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notifications (
    id         VARCHAR(36) PRIMARY KEY,
    user_id    VARCHAR(36) NOT NULL REFERENCES users(id),
    category   VARCHAR(64),
    title      VARCHAR(255) NOT NULL,
    message    TEXT,
    read       BOOLEAN NOT NULL DEFAULT FALSE,
    date       TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE support_tickets (
    id           VARCHAR(36) PRIMARY KEY,
    user_id      VARCHAR(36) NOT NULL REFERENCES users(id),
    subject      VARCHAR(255) NOT NULL,
    category     VARCHAR(64),
    priority     VARCHAR(32),
    status       VARCHAR(32) NOT NULL DEFAULT 'open',
    date         DATE NOT NULL DEFAULT CURRENT_DATE,
    last_update  DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE api_keys (
    id         VARCHAR(36) PRIMARY KEY,
    user_id    VARCHAR(36) NOT NULL REFERENCES users(id),
    name       VARCHAR(255) NOT NULL,
    key_hash   VARCHAR(255) NOT NULL,
    status     VARCHAR(32) NOT NULL DEFAULT 'active',
    created    DATE NOT NULL DEFAULT CURRENT_DATE,
    last_used  TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE invoices (
    id         VARCHAR(36) PRIMARY KEY,
    user_id    VARCHAR(36) NOT NULL REFERENCES users(id),
    number     VARCHAR(64) NOT NULL,
    customer   VARCHAR(255) NOT NULL,
    amount     NUMERIC(38, 8) NOT NULL,
    currency   VARCHAR(8) NOT NULL DEFAULT 'KES',
    status     VARCHAR(32) NOT NULL DEFAULT 'draft',
    due_date   DATE,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_wallet_user ON wallet_accounts(user_id);
CREATE INDEX idx_tx_user ON transactions(user_id);
CREATE INDEX idx_beneficiary_user ON beneficiaries(user_id);
CREATE INDEX idx_notification_user ON notifications(user_id);
CREATE INDEX idx_ticket_user ON support_tickets(user_id);
CREATE INDEX idx_api_key_user ON api_keys(user_id);
CREATE INDEX idx_invoice_user ON invoices(user_id);
