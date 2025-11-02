# Expense Tracker - System Architecture Diagram

## Simple System Overview

```mermaid
flowchart TB
    User[👤 User Browser]
    
    Frontend[React Frontend<br/>TypeScript + Zustand]
    
    Backend[Spring Boot Backend<br/>Java 21 + Spring Security]
    
    Database[(PostgreSQL<br/>Database)]
    
    Cache[(Redis<br/>Cache)]
    
    User -->|HTTPS| Frontend
    Frontend -->|REST API<br/>+ JWT Token| Backend
    Backend -->|SQL| Database
    Backend -->|Session| Cache

    style Frontend fill:#61dafb,stroke:#333,color:#000
    style Backend fill:#6db33f,stroke:#333,color:#fff
    style Database fill:#336791,stroke:#333,color:#fff
    style Cache fill:#dc382d,stroke:#333,color:#fff
```

## User Login Flow (Simplified)

```mermaid
sequenceDiagram
    participant User
    participant Frontend as React App
    participant Backend as Spring Boot
    participant DB as Database

    User->>Frontend: 1. Enter email & password
    Frontend->>Backend: 2. POST /api/auth/login
    Backend->>DB: 3. Verify credentials
    DB-->>Backend: 4. User found ✓
    Backend->>Backend: 5. Generate JWT token
    Backend-->>Frontend: 6. Return token + user data
    Frontend->>Frontend: 7. Store token
    Frontend-->>User: 8. Redirect to Dashboard ✓

    Note over User,DB: Future requests include JWT token in header
```

## Security Architecture - Multi-Layer Defense

```mermaid
flowchart TD
    Request[Incoming HTTP Request]
    
    subgraph Layer1["Layer 1: Network Security"]
        HTTPS[HTTPS/TLS Encryption]
        RateLimit[Rate Limiting]
    end
    
    subgraph Layer2["Layer 2: CORS"]
        CORSCheck[Origin Validation]
        HeaderCheck[Header Validation]
    end
    
    subgraph Layer3["Layer 3: Authentication"]
        JWTValidation[JWT Token Validation]
        TokenExpiry[Token Expiry Check]
        SignatureVerify[Signature Verification]
    end
    
    subgraph Layer4["Layer 4: Authorization"]
        RoleCheck[Role-Based Access Control]
        PermissionCheck[Permission Validation]
    end
    
    subgraph Layer5["Layer 5: Data Security"]
        InputValidation[Input Validation & Sanitization]
        PasswordEncryption[BCrypt Password Hashing]
        DataEncryption[Data Encryption at Rest]
    end
    
    Request --> HTTPS
    HTTPS --> RateLimit
    RateLimit --> CORSCheck
    CORSCheck --> HeaderCheck
    HeaderCheck --> JWTValidation
    JWTValidation --> TokenExpiry
    TokenExpiry --> SignatureVerify
    SignatureVerify --> RoleCheck
    RoleCheck --> PermissionCheck
    PermissionCheck --> InputValidation
    InputValidation --> PasswordEncryption
    PasswordEncryption --> DataEncryption
    DataEncryption --> Authorized[Authorized Request Processed]

    style Layer1 fill:#ffcdd2
    style Layer2 fill:#f8bbd0
    style Layer3 fill:#e1bee7
    style Layer4 fill:#d1c4e9
    style Layer5 fill:#c5cae9
```

## Database Schema Architecture

```mermaid
erDiagram
    USERS ||--o{ EXPENSES : creates
    USERS ||--o{ BUDGETS : manages
    USERS ||--o{ CATEGORIES : defines
    EXPENSES }o--|| CATEGORIES : belongs_to
    BUDGETS }o--|| CATEGORIES : tracks

    USERS {
        bigint id PK
        string email UK
        string password
        string first_name
        string last_name
        jsonb roles
        boolean enabled
        boolean account_non_expired
        boolean account_non_locked
        boolean credentials_non_expired
        timestamp created_at
        timestamp updated_at
        timestamp last_login_at
    }

    EXPENSES {
        bigint id PK
        bigint user_id FK
        bigint category_id FK
        decimal amount
        string description
        date expense_date
        string payment_method
        string merchant
        jsonb metadata
        timestamp created_at
        timestamp updated_at
    }

    CATEGORIES {
        bigint id PK
        bigint user_id FK
        string name
        string color
        string icon
        string type
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    BUDGETS {
        bigint id PK
        bigint user_id FK
        bigint category_id FK
        decimal amount
        string period_type
        date start_date
        date end_date
        decimal spent_amount
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
```

## Technology Stack Overview

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript | Modern UI with type safety |
| | Vite | Fast build tool |
| | Zustand | State management |
| | Axios | HTTP client |
| **Backend** | Spring Boot 3 + Java 21 | Enterprise framework |
| | Spring Security | Authentication & authorization |
| | JWT (JJWT) | Token-based auth |
| **Database** | PostgreSQL 15+ | Relational database |
| | Redis 7.x | Cache & session store |
| **Security** | BCrypt | Password hashing |
| | HTTPS/TLS | Transport security |

---

## Key Features

### Authentication System
✅ User registration with email/password  
✅ Secure login with JWT tokens  
✅ BCrypt password hashing (strength 10)  
✅ Stateless session management  
✅ Protected routes with automatic redirect  

### Security Features
✅ Multi-layer security architecture  
✅ CORS configuration  
✅ JWT token validation  
✅ Role-based access control  
✅ Input validation & sanitization  

### API Endpoints
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - Terminate session
- `GET /api/auth/me` - Get current user

---

**Document Version**: 1.0 (Simplified)  
**Last Updated**: November 2, 2025


