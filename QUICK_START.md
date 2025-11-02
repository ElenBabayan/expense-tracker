# Expense Tracker - Quick Start Guide

Get the Expense Tracker application running in 5 minutes!

## Prerequisites

Make sure you have installed:
- Java 21 (check with `java -version`)
- Node.js 18+ (check with `node -version`)
- Docker Desktop (for easy setup)

## Option 1: Docker Setup (Recommended)

The easiest way to get started:

```bash
# Clone the repository
git clone <repository-url>
cd expense-tracker

# Start all services (PostgreSQL, Redis, Backend)
docker-compose up -d

# Wait for services to be healthy (about 30 seconds)
docker-compose ps

# Initialize database (first time only)
docker exec expense-tracker-postgres psql -U expense_user -d expense_tracker -f /docker-entrypoint-initdb.d/schema.sql

# Start the frontend
cd frontend
npm install
npm run dev
```

Access the application at: http://localhost:3000

## Option 2: Local Setup

If you prefer running services locally:

### 1. Start PostgreSQL and Redis

**macOS:**
```bash
brew install postgresql@15 redis
brew services start postgresql@15
brew services start redis
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql-15 redis-server
sudo systemctl start postgresql redis-server
```

### 2. Create Database

```bash
psql postgres
CREATE DATABASE expense_tracker;
CREATE USER expense_user WITH ENCRYPTED PASSWORD 'changeme';
GRANT ALL PRIVILEGES ON DATABASE expense_tracker TO expense_user;
\c expense_tracker
GRANT ALL ON SCHEMA public TO expense_user;
\q

# Initialize schema
psql -U expense_user -d expense_tracker -f src/main/resources/db/schema.sql
```

### 3. Start Backend

```bash
# Set environment variables (or create .env file)
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=expense_tracker
export DB_USERNAME=expense_user
export DB_PASSWORD=changeme
export REDIS_HOST=localhost
export REDIS_PORT=6379
export JWT_SECRET=your-secret-key-must-be-at-least-32-characters-long-for-hs256

# Start Spring Boot
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

Backend runs at: http://localhost:8080

### 4. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:3000

## First Use

1. Open http://localhost:3000 in your browser
2. Click **"Sign up"** to create an account
3. Fill in your details:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: SecurePass123
4. Click **"Sign Up"**
5. You'll be automatically logged in and redirected to the dashboard

## Testing the Authentication

### Register API Test
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login API Test
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

### Get Current User (with token)
```bash
# Replace <TOKEN> with the accessToken from login response
curl http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

## Verify Services

### Check PostgreSQL
```bash
# Docker
docker exec -it expense-tracker-postgres psql -U expense_user -d expense_tracker -c "SELECT * FROM categories;"

# Local
psql -U expense_user -d expense_tracker -c "SELECT * FROM categories;"
```

### Check Redis
```bash
# Docker
docker exec -it expense-tracker-redis redis-cli ping

# Local
redis-cli ping
```

### Check Backend Health
```bash
curl http://localhost:8080/api/actuator/health
```

## Common Issues

### Port Already in Use

If port 8080 is taken:
```bash
# Find the process
lsof -i :8080

# Kill it
kill -9 <PID>
```

### Database Connection Failed

1. Check PostgreSQL is running: `brew services list` or `systemctl status postgresql`
2. Verify credentials in `application.yml`
3. Check connection: `psql -U expense_user -d expense_tracker -h localhost`

### Redis Connection Failed

1. Check Redis is running: `brew services list` or `systemctl status redis`
2. Test connection: `redis-cli ping`

### Frontend Can't Connect to Backend

1. Check backend is running: `curl http://localhost:8080/api/actuator/health`
2. Verify CORS settings in `application.yml`
3. Check browser console for errors

## Stopping Services

### Docker
```bash
docker-compose down
```

### Local
```bash
# Stop backend: Ctrl+C in terminal
# Stop frontend: Ctrl+C in terminal
brew services stop postgresql@15 redis  # macOS
sudo systemctl stop postgresql redis    # Linux
```

## Next Steps

- Read [README.md](./README.md) for full documentation
- Check [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) for architecture details
- Review [TECH_STACK.md](./TECH_STACK.md) for technology choices
- See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for advanced database configuration

## Support

Having issues? Check:
1. All prerequisites are installed correctly
2. Services are running (PostgreSQL, Redis)
3. Database is initialized with schema
4. Environment variables are set correctly

Still stuck? Create an issue on GitHub or contact the team.

Happy tracking! 🎉

