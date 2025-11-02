# Expense Tracker - System Architecture Diagram

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                  React 18 + TypeScript SPA                       │   │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────┐               │   │
│  │  │   Login    │  │  Register  │  │  Dashboard   │               │   │
│  │  │   Page     │  │   Page     │  │    Page      │               │   │
│  │  └────────────┘  └────────────┘  └──────────────┘               │   │
│  │                                                                   │   │
│  │  ┌─────────────────────────────────────────────────────────┐    │   │
│  │  │            State Management (Zustand)                   │    │   │
│  │  │  - Auth State  - User Data  - Session Management        │    │   │
│  │  └─────────────────────────────────────────────────────────┘    │   │
│  │                                                                   │   │
│  │  ┌─────────────────────────────────────────────────────────┐    │   │
│  │  │       API Client (Axios + Interceptors)                 │    │   │
│  │  │  - JWT Token Management  - Error Handling               │    │   │
│  │  └─────────────────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                    │                                     │
│                                    │ HTTPS/REST                          │
│                                    │                                     │
└────────────────────────────────────┼─────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          API GATEWAY / LOAD BALANCER                     │
│                          (CORS, Rate Limiting)                           │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         BACKEND API LAYER                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │         Spring Boot 3 Application (Java 21)                      │   │
│  │                                                                   │   │
│  │  ┌───────────────────────────────────────────────────────────┐  │   │
│  │  │              SECURITY LAYER                                │  │   │
│  │  │  ┌─────────────────┐    ┌─────────────────────────────┐   │  │   │
│  │  │  │ JWT Auth Filter │───▶│  Spring Security Config    │   │  │   │
│  │  │  └─────────────────┘    └─────────────────────────────┘   │  │   │
│  │  │  ┌─────────────────────────────────────────────────────┐   │  │   │
│  │  │  │      UserDetailsService + Password Encoder          │   │  │   │
│  │  │  └─────────────────────────────────────────────────────┘   │  │   │
│  │  └───────────────────────────────────────────────────────────┘  │   │
│  │                                                                   │   │
│  │  ┌───────────────────────────────────────────────────────────┐  │   │
│  │  │              CONTROLLER LAYER                             │  │   │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │  │   │
│  │  │  │   Auth       │  │   Expense    │  │   Budget     │    │  │   │
│  │  │  │  Controller  │  │  Controller  │  │  Controller  │    │  │   │
│  │  │  └──────────────┘  └──────────────┘  └──────────────┘    │  │   │
│  │  └───────────────────────────────────────────────────────────┘  │   │
│  │                              │                                   │   │
│  │  ┌───────────────────────────▼───────────────────────────────┐  │   │
│  │  │              SERVICE LAYER                                 │  │   │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │  │   │
│  │  │  │   Auth       │  │   Expense    │  │   Budget     │    │  │   │
│  │  │  │   Service    │  │   Service    │  │   Service    │    │  │   │
│  │  │  └──────────────┘  └──────────────┘  └──────────────┘    │  │   │
│  │  │  ┌──────────────────────────────────────────────────┐    │  │   │
│  │  │  │      Categorization Service (ML Integration)     │    │  │   │
│  │  │  └──────────────────────────────────────────────────┘    │  │   │
│  │  └───────────────────────────────────────────────────────────┘  │   │
│  │                              │                                   │   │
│  │  ┌───────────────────────────▼───────────────────────────────┐  │   │
│  │  │             REPOSITORY LAYER (Spring Data JPA)            │  │   │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │  │   │
│  │  │  │   User   │  │ Expense  │  │ Category │  │  Budget  │  │  │   │
│  │  │  │   Repo   │  │   Repo   │  │   Repo   │  │   Repo   │  │  │   │
│  │  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │  │   │
│  │  └───────────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                              │                    │                      │
└──────────────────────────────┼────────────────────┼──────────────────────┘
                               │                    │
                               ▼                    ▼
          ┌────────────────────────┐   ┌────────────────────────┐
          │   PostgreSQL Database   │   │    Redis Cache Store   │
          ├────────────────────────┤   ├────────────────────────┤
          │                        │   │                        │
          │  ┌──────────────────┐ │   │  ┌──────────────────┐ │
          │  │  users           │ │   │  │  Sessions        │ │
          │  │  user_roles      │ │   │  │  JWT Tokens      │ │
          │  │  expenses        │ │   │  │  Rate Limiting   │ │
          │  │  categories      │ │   │  │  Idempotency     │ │
          │  │  budgets         │ │   │  └──────────────────┘ │
          │  └──────────────────┘ │   │                        │
          │                        │   │                        │
          └────────────────────────┘   └────────────────────────┘
```

## User Login Flow Diagram

```
┌─────────┐                                                    ┌──────────┐
│  User   │                                                    │  React   │
│ Browser │                                                    │  Client  │
└────┬────┘                                                    └─────┬────┘
     │                                                               │
     │  1. User enters email/password and clicks "Login"            │
     │ ─────────────────────────────────────────────────────────▶   │
     │                                                               │
     │                                                               │
     │              ┌──────────────────────────────────────────┐    │
     │              │  2. Form validation (Zod + React Hook    │    │
     │              │     Form)                                │    │
     │              └──────────────────────────────────────────┘    │
     │                                                               │
     │                                                               │
                                                                     │
                    3. POST /api/auth/login                          │
                       { email, password }                           │
                    ─────────────────────────────────────────────────┼──────▶
                                                                     │       │
                                                                             │
                                                          ┌──────────────────┴─────┐
                                                          │   Spring Boot API      │
                                                          │                        │
                                                          │  4. JWT Auth Filter    │
                                                          │     (Skipped - public) │
                                                          │                        │
                                                          │  5. AuthController     │
                                                          │     receives request   │
                                                          │                        │
                                                          │  6. AuthService        │
                                                          │     validates creds    │
                                                          │                        │
                                                          └────────┬───────────────┘
                                                                   │
                                          7. Query user by email   │
                                          and verify password      │
                                          ─────────────────────────┼──────▶
                                                                   │       │
                                                                           │
                                                       ┌───────────────────┴────┐
                                                       │   PostgreSQL Database  │
                                                       │                        │
                                                       │   SELECT * FROM users  │
                                                       │   WHERE email = ?      │
                                                       │                        │
                                                       └───────────┬────────────┘
                                                                   │
                                          8. User record returned  │
                                          ◀─────────────────────────
                                                                   │
                                                          ┌────────┴───────────────┐
                                                          │   Spring Boot API      │
                                                          │                        │
                                                          │  9. BCrypt verifies    │
                                                          │     password hash      │
                                                          │                        │
                                                          │ 10. JWT Token Provider │
                                                          │     generates tokens:  │
                                                          │     - Access Token     │
                                                          │     - Refresh Token    │
                                                          │                        │
                                                          │ 11. Update last_login  │
                                                          │                        │
                                                          └────────┬───────────────┘
                                                                   │
                    12. Return AuthResponse with tokens            │
                       and user data                               │
                    ◀─────────────────────────────────────────────┼───────
                    │                                              │
                    │
     │              │
     │              │  13. Store tokens in localStorage and Zustand store
     │              │      Set isAuthenticated = true
     │              └──────────────────────────────────────────┘
     │
     │  14. Redirect to /dashboard
     │ ◀────────────────────────────────────────────────────────────
     │
     │
     │  15. All subsequent API requests include:
     │      Authorization: Bearer <access_token>
     │
```

## Component Interaction Flow

```
┌───────────────────────────────────────────────────────────────────────┐
│                        REQUEST LIFECYCLE                              │
└───────────────────────────────────────────────────────────────────────┘

Frontend Request (with JWT)
    │
    ├──▶ Axios Interceptor adds Authorization header
    │
    ▼
Backend receives request
    │
    ├──▶ CORS Filter validates origin
    │
    ├──▶ JwtAuthenticationFilter extracts token
    │       │
    │       ├──▶ JwtTokenProvider validates token
    │       │
    │       └──▶ UserDetailsService loads user
    │
    ├──▶ Spring Security authorizes request
    │
    ├──▶ Controller handles request
    │
    ├──▶ Service layer processes business logic
    │       │
    │       ├──▶ Check Redis cache (if applicable)
    │       │
    │       └──▶ Repository queries PostgreSQL
    │
    ├──▶ Response serialized to JSON
    │
    └──▶ Response sent to client
        │
        └──▶ Axios Interceptor handles response/errors
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 1: CORS Configuration                                │
│  ├─ Whitelist allowed origins (localhost:3000, etc.)       │
│  └─ Configure allowed methods and headers                   │
│                                                             │
│  Layer 2: JWT Authentication                                │
│  ├─ Token generation with HS256                            │
│  ├─ Token expiration (24h access, 7d refresh)              │
│  └─ Token validation on each request                        │
│                                                             │
│  Layer 3: Spring Security                                   │
│  ├─ BCrypt password encoding (strength 10)                 │
│  ├─ Role-based access control (ROLE_USER, ROLE_ADMIN)      │
│  └─ Stateless session management                            │
│                                                             │
│  Layer 4: Database Security                                 │
│  ├─ PostgreSQL with encrypted connections                   │
│  ├─ Least-privilege database user                           │
│  └─ Data encryption at rest                                 │
│                                                             │
│  Layer 5: Redis Security                                    │
│  ├─ Password-protected connections                          │
│  ├─ Session data encryption                                 │
│  └─ Idempotency key validation                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Architecture (Production)

```
                         ┌─────────────────┐
                         │   Route 53 DNS  │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │  CloudFront CDN │
                         │  (Static Assets)│
                         └────────┬────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
         ┌──────────────────┐        ┌──────────────────┐
         │   S3 Bucket      │        │  Application     │
         │  (React Build)   │        │  Load Balancer   │
         └──────────────────┘        └─────────┬────────┘
                                               │
                                   ┌───────────┴────────────┐
                                   │                        │
                                   ▼                        ▼
                        ┌────────────────────┐  ┌────────────────────┐
                        │   EC2 Instance 1   │  │   EC2 Instance 2   │
                        │  Spring Boot App   │  │  Spring Boot App   │
                        └─────────┬──────────┘  └─────────┬──────────┘
                                  │                       │
                    ┌─────────────┴───────────────────────┘
                    │
        ┌───────────┴────────────┬──────────────────┐
        │                        │                  │
        ▼                        ▼                  ▼
┌───────────────┐     ┌───────────────────┐  ┌──────────────┐
│  RDS          │     │  ElastiCache      │  │  CloudWatch  │
│  PostgreSQL   │     │  Redis            │  │  Monitoring  │
└───────────────┘     └───────────────────┘  └──────────────┘
```

## Technology Stack Summary

| Layer          | Technology                 | Purpose                           |
|----------------|----------------------------|-----------------------------------|
| Frontend       | React 18 + TypeScript      | Modern UI with type safety        |
| State Mgmt     | Zustand                    | Lightweight global state          |
| Backend        | Spring Boot 3 + Java 21    | Robust API with virtual threads   |
| Security       | Spring Security + JWT      | Authentication & authorization    |
| Database       | PostgreSQL 15+             | Relational data with ACID         |
| Cache/Session  | Redis                      | Fast session & caching layer      |
| Build Tool     | Maven                      | Backend dependency management     |
| Dev Server     | Vite                       | Fast frontend development         |
| Hosting        | AWS / Fly.io / Railway     | Scalable cloud deployment         |

