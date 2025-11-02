#!/bin/bash

# Expense Tracker - Development Environment Setup Script
# This script sets up the complete development environment

set -e

echo "🚀 Expense Tracker Development Setup"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Print colored message
print_message() {
    echo -e "${2}${1}${NC}"
}

# Check prerequisites
print_message "📋 Checking prerequisites..." "$YELLOW"

# Check Java
if command_exists java; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
    if [ "$JAVA_VERSION" -ge 21 ]; then
        print_message "✓ Java $JAVA_VERSION found" "$GREEN"
    else
        print_message "✗ Java 21 or higher required (found Java $JAVA_VERSION)" "$RED"
        exit 1
    fi
else
    print_message "✗ Java not found. Please install Java 21+" "$RED"
    exit 1
fi

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge 18 ]; then
        print_message "✓ Node.js v$(node -v) found" "$GREEN"
    else
        print_message "✗ Node.js 18 or higher required (found v$(node -v))" "$RED"
        exit 1
    fi
else
    print_message "✗ Node.js not found. Please install Node.js 18+" "$RED"
    exit 1
fi

# Check Docker (optional)
if command_exists docker; then
    print_message "✓ Docker found" "$GREEN"
    DOCKER_AVAILABLE=true
else
    print_message "⚠ Docker not found (optional)" "$YELLOW"
    DOCKER_AVAILABLE=false
fi

# Setup method selection
echo ""
print_message "Select setup method:" "$YELLOW"
echo "1) Docker (Recommended - Easy setup with all services)"
echo "2) Local (Run PostgreSQL and Redis locally)"
read -p "Enter choice [1 or 2]: " setup_choice

if [ "$setup_choice" = "1" ]; then
    if [ "$DOCKER_AVAILABLE" = false ]; then
        print_message "✗ Docker is required for this option" "$RED"
        exit 1
    fi
    
    print_message "🐳 Starting services with Docker..." "$YELLOW"
    
    # Start Docker services
    docker-compose up -d
    
    print_message "⏳ Waiting for services to be ready..." "$YELLOW"
    sleep 10
    
    # Check if services are healthy
    if docker-compose ps | grep -q "Up"; then
        print_message "✓ Services started successfully" "$GREEN"
    else
        print_message "✗ Services failed to start. Check docker-compose logs" "$RED"
        exit 1
    fi
    
    print_message "🗄️ Initializing database..." "$YELLOW"
    docker exec expense-tracker-postgres psql -U expense_user -d expense_tracker -f /docker-entrypoint-initdb.d/schema.sql 2>/dev/null || true
    
elif [ "$setup_choice" = "2" ]; then
    print_message "💻 Local setup selected" "$YELLOW"
    
    # Check PostgreSQL
    if command_exists psql; then
        print_message "✓ PostgreSQL found" "$GREEN"
    else
        print_message "✗ PostgreSQL not found. Please install it first" "$RED"
        exit 1
    fi
    
    # Check Redis
    if command_exists redis-cli; then
        print_message "✓ Redis found" "$GREEN"
    else
        print_message "✗ Redis not found. Please install it first" "$RED"
        exit 1
    fi
    
    # Start PostgreSQL and Redis (macOS)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start postgresql@15 2>/dev/null || brew services start postgresql
        brew services start redis
    fi
    
    print_message "🗄️ Creating database..." "$YELLOW"
    
    # Create database
    psql postgres -c "CREATE DATABASE expense_tracker;" 2>/dev/null || echo "Database already exists"
    psql postgres -c "CREATE USER expense_user WITH ENCRYPTED PASSWORD 'changeme';" 2>/dev/null || echo "User already exists"
    psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE expense_tracker TO expense_user;"
    psql postgres -d expense_tracker -c "GRANT ALL ON SCHEMA public TO expense_user;"
    
    # Initialize schema
    psql -U expense_user -d expense_tracker -f src/main/resources/db/schema.sql
    
    print_message "✓ Database initialized" "$GREEN"
else
    print_message "✗ Invalid choice" "$RED"
    exit 1
fi

# Build backend
print_message "🔨 Building backend..." "$YELLOW"
./mvnw clean install -DskipTests

if [ $? -eq 0 ]; then
    print_message "✓ Backend built successfully" "$GREEN"
else
    print_message "✗ Backend build failed" "$RED"
    exit 1
fi

# Setup frontend
print_message "📦 Installing frontend dependencies..." "$YELLOW"
cd frontend
npm install

if [ $? -eq 0 ]; then
    print_message "✓ Frontend dependencies installed" "$GREEN"
else
    print_message "✗ Frontend dependency installation failed" "$RED"
    exit 1
fi

cd ..

# Create .env file
if [ ! -f .env ]; then
    print_message "📝 Creating .env file..." "$YELLOW"
    cat > .env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expense_tracker
DB_USERNAME=expense_user
DB_PASSWORD=changeme

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

JWT_SECRET=your-secret-key-must-be-at-least-32-characters-long-for-hs256

CORS_ORIGINS=http://localhost:3000,http://localhost:5173
EOF
    print_message "✓ .env file created" "$GREEN"
fi

# Print success message
echo ""
print_message "🎉 Setup completed successfully!" "$GREEN"
echo ""
print_message "Next steps:" "$YELLOW"
echo "1. Start the backend:"
echo "   ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev"
echo ""
echo "2. Start the frontend (in a new terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Open your browser:"
echo "   http://localhost:3000"
echo ""
print_message "📚 Documentation:" "$YELLOW"
echo "- Quick Start: QUICK_START.md"
echo "- Full README: README.md"
echo "- Architecture: SYSTEM_ARCHITECTURE.md"
echo ""
print_message "Happy coding! 🚀" "$GREEN"

