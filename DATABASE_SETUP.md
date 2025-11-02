# Expense Tracker - Database Setup

## PostgreSQL Setup Instructions

### 1. Install PostgreSQL
```bash
# macOS
brew install postgresql@15

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# Windows
# Download installer from https://www.postgresql.org/download/windows/
```

### 2. Start PostgreSQL Service
```bash
# macOS
brew services start postgresql@15

# Ubuntu/Debian
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Windows
# PostgreSQL service starts automatically after installation
```

### 3. Create Database and User
```bash
# Access PostgreSQL
sudo -u postgres psql

# Or on macOS
psql postgres

# Run these SQL commands
CREATE DATABASE expense_tracker;
CREATE USER expense_user WITH ENCRYPTED PASSWORD 'changeme';
GRANT ALL PRIVILEGES ON DATABASE expense_tracker TO expense_user;

# PostgreSQL 15+ requires additional grants
\c expense_tracker
GRANT ALL ON SCHEMA public TO expense_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO expense_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO expense_user;

# Exit
\q
```

### 4. Initialize Database Schema
```bash
# From the project root directory
psql -U expense_user -d expense_tracker -f src/main/resources/db/schema.sql
```

### 5. Verify Setup
```bash
psql -U expense_user -d expense_tracker

# List tables
\dt

# View categories
SELECT * FROM categories;

# Exit
\q
```

## Redis Setup Instructions

### 1. Install Redis
```bash
# macOS
brew install redis

# Ubuntu/Debian
sudo apt-get install redis-server

# Windows
# Download from https://github.com/microsoftarchive/redis/releases
# Or use WSL with Ubuntu
```

### 2. Start Redis Service
```bash
# macOS
brew services start redis

# Ubuntu/Debian
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Or manually
redis-server
```

### 3. Verify Redis
```bash
redis-cli ping
# Should return: PONG
```

## Environment Variables

Create a `.env` file or set these environment variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expense_tracker
DB_USERNAME=expense_user
DB_PASSWORD=changeme

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your-secret-key-must-be-at-least-32-characters-long-for-hs256

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Running the Application

```bash
# Build the application
mvn clean install

# Run with dev profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Or run the JAR
java -jar target/expense-tracker-1.0.0-SNAPSHOT.jar --spring.profiles.active=dev
```

The API will be available at: http://localhost:8080/api

## Testing Database Connection

```bash
# Test database connectivity
psql -U expense_user -d expense_tracker -h localhost -p 5432

# Test Redis connectivity
redis-cli -h localhost -p 6379 ping
```

