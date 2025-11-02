# Expense Tracker

A full-stack expense tracking application with JWT authentication, built with React, Spring Boot, and PostgreSQL.

## Overview

This application allows users to securely track expenses with plans for CSV import and ML-powered categorization. Currently in Phase 2 with a complete authentication system.

## Features

**Current (Phase 2):**
- User registration and login
- JWT-based authentication
- Password encryption with BCrypt
- Session management with Redis
- Protected API endpoints
- Responsive React interface
- Form validation

**Planned:**
- Manual expense entry
- CSV import with auto-categorization
- ML-powered expense classification
- Budget tracking
- Spending analytics dashboard

## Tech Stack

**Backend:**
- Java 21 with Spring Boot 3
- Spring Security 6
- PostgreSQL 15
- Redis 7
- JWT authentication
- Maven

**Frontend:**
- React 18 with TypeScript
- Vite
- Zustand (state management)
- React Router
- Axios

**DevOps:**
- Docker
- Railway (deployment)
- GitHub Actions (CI/CD)

## Quick Start

### Prerequisites
- Java 21
- Node.js 18+
- PostgreSQL 15+
- Redis 7+

### Setup

1. **Clone and install:**
```bash
git clone <repository-url>
cd expense-tracker
mvn clean install
cd frontend && npm install
```

2. **Configure database:**
```bash
createdb expense_tracker
psql expense_tracker < src/main/resources/db/schema.sql
```

3. **Set environment variables:**
```bash
export DB_HOST=localhost
export DB_NAME=expense_tracker
export DB_USERNAME=postgres
export DB_PASSWORD=your_password
export JWT_SECRET=your-secret-key-min-256-chars
export REDIS_HOST=localhost
```

4. **Run:**
```bash
# Backend (port 8080)
mvn spring-boot:run

# Frontend (port 3000)
cd frontend && npm run dev
```

5. **Access:** http://localhost:3000

## API Endpoints

### Authentication

**Register:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Login:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Get Current User:**
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Logout:**
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

## Project Structure

```
expense-tracker/
├── src/main/java/com/expensetracker/
│   ├── controller/          # REST endpoints
│   ├── service/            # Business logic
│   ├── repository/         # Database access
│   ├── security/           # JWT & authentication
│   ├── model/              # JPA entities
│   ├── dto/                # Data transfer objects
│   └── config/             # Spring configuration
├── frontend/src/
│   ├── pages/              # React pages
│   ├── api/                # API client
│   ├── store/              # State management
│   └── App.tsx             # Main component
└── pom.xml                 # Maven dependencies
```

## Security

- **Passwords:** BCrypt hashed (strength 10)
- **Tokens:** JWT with HS256, 24-hour expiration
- **API:** CORS configured, protected endpoints
- **Database:** Prepared statements, connection pooling
- **Sessions:** Redis-backed, 1-hour expiration

## Deployment

### Using Docker

```bash
docker-compose up -d
```

### Using Railway

```bash
# Link PostgreSQL and Redis services
# Set environment variables:
# - DATABASE_URL
# - SPRING_PROFILES_ACTIVE=prod
# - JWT_SECRET
# Deploy from GitHub
```

## Testing

**Backend:**
```bash
mvn test
mvn verify  # Integration tests
```

**Frontend:**
```bash
cd frontend
npm test
```

## Performance

- API response time: <400ms (p95)
- Frontend load time: <2.5s (LCP)
- Crash-free rate: >99.5%

## Documentation

- [System Architecture](docs/SYSTEM_ARCHITECTURE.md) - Architecture diagrams
- [Tech Stack](docs/TECH_STACK.md) - Technology justifications
- [Database Setup](docs/DATABASE_SETUP.md) - Database configuration
- [Demo Speech](docs/DEMO_SPEECH.md) - Presentation guide

## Development

**Code style:**
- Backend: Google Java Style
- Frontend: Prettier + ESLint
- Commits: Conventional Commits

**Workflow:**
1. Create feature branch
2. Make changes and test
3. Commit with descriptive messages
4. Create pull request
5. Pass CI checks and code review
6. Merge to main

## Roadmap

- [x] Phase 1: Planning & Design
- [x] Phase 2: Authentication System
- [ ] Phase 3: Expense Management
- [ ] Phase 4: CSV Import & ML
- [ ] Phase 5: Budgets & Analytics
- [ ] Phase 6: Testing & Launch

## License

Proprietary

## Contact

For questions or issues, create a GitHub issue or contact the development team.

---

**Phase 2 Complete** | Authentication system fully functional | Ready for Phase 3
