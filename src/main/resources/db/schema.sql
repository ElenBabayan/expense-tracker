-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    account_non_expired BOOLEAN NOT NULL DEFAULT TRUE,
    account_non_locked BOOLEAN NOT NULL DEFAULT TRUE,
    credentials_non_expired BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, role),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    color VARCHAR(20),
    icon VARCHAR(50),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    amount DECIMAL(19, 2) NOT NULL,
    date DATE NOT NULL,
    merchant VARCHAR(200) NOT NULL,
    category_id BIGINT,
    description VARCHAR(500),
    payment_method VARCHAR(50),
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
    csv_import_batch VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    amount DECIMAL(19, 2) NOT NULL,
    month INT NOT NULL CHECK (month >= 1 AND month <= 12),
    year INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE (user_id, category_id, month, year)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_date ON expenses(user_id, date);
CREATE INDEX IF NOT EXISTS idx_category ON expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);

-- Insert default categories
INSERT INTO categories (name, description, color, icon, is_default) VALUES
    ('Food & Dining', 'Restaurants, groceries, and food delivery', '#FF6B6B', '🍔', TRUE),
    ('Transportation', 'Gas, public transit, rideshare, parking', '#4ECDC4', '🚗', TRUE),
    ('Shopping', 'Retail, online shopping, personal items', '#45B7D1', '🛍️', TRUE),
    ('Entertainment', 'Movies, concerts, streaming services', '#96CEB4', '🎬', TRUE),
    ('Bills & Utilities', 'Rent, electricity, water, internet', '#FFEAA7', '💡', TRUE),
    ('Healthcare', 'Medical, dental, pharmacy, insurance', '#DFE6E9', '⚕️', TRUE),
    ('Travel', 'Flights, hotels, vacation expenses', '#A29BFE', '✈️', TRUE),
    ('Education', 'Tuition, books, courses, training', '#74B9FF', '📚', TRUE),
    ('Personal Care', 'Haircuts, gym, spa, wellness', '#FD79A8', '💆', TRUE),
    ('Other', 'Miscellaneous expenses', '#B2BEC3', '📌', TRUE)
ON CONFLICT (name) DO NOTHING;

