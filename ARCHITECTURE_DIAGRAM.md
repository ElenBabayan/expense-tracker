# Expense Tracker - System Architecture Diagram

## Visual System Architecture

```mermaid
flowchart TB
    subgraph Client["CLIENT LAYER"]
        Browser[Web Browser]
        subgraph ReactApp["React 18 + TypeScript SPA"]
            LoginPage[Login Page]
            RegisterPage[Register Page]
            Dashboard[Dashboard Page]
            ProfilePage[Profile Page]
            StateManagement[Zustand State Management]
            APIClient[Axios API Client + Interceptors]
        end
    end

    subgraph Backend["BACKEND LAYER - Spring Boot 3"]
        subgraph Security["Security Layer"]
            JWTFilter[JWT Authentication Filter]
            SpringSecurity[Spring Security Config]
            PasswordEncoder[BCrypt Password Encoder]
            UserDetailsService[Custom UserDetailsService]
        end
        
        subgraph Controllers["Controller Layer"]
            AuthController[Auth Controller]
            ExpenseController[Expense Controller]
            BudgetController[Budget Controller]
        end
        
        subgraph Services["Service Layer"]
            AuthService[Auth Service]
            ExpenseService[Expense Service]
            BudgetService[Budget Service]
            JWTProvider[JWT Token Provider]
        end
        
        subgraph Repositories["Repository Layer - Spring Data JPA"]
            UserRepo[User Repository]
            ExpenseRepo[Expense Repository]
            CategoryRepo[Category Repository]
            BudgetRepo[Budget Repository]
        end
    end

    subgraph DataLayer["DATA LAYER"]
        PostgreSQL[(PostgreSQL Database<br/>Users, Expenses,<br/>Categories, Budgets)]
        Redis[(Redis Cache<br/>Sessions,<br/>JWT Tokens,<br/>Rate Limiting)]
    end

    Browser --> LoginPage
    Browser --> RegisterPage
    LoginPage --> StateManagement
    RegisterPage --> StateManagement
    Dashboard --> StateManagement
    ProfilePage --> StateManagement
    
    StateManagement --> APIClient
    APIClient -->|HTTPS/REST API| JWTFilter
    
    JWTFilter --> SpringSecurity
    SpringSecurity --> UserDetailsService
    SpringSecurity --> PasswordEncoder
    JWTFilter --> AuthController
    JWTFilter --> ExpenseController
    JWTFilter --> BudgetController
    
    AuthController --> AuthService
    ExpenseController --> ExpenseService
    BudgetController --> BudgetService
    
    AuthService --> JWTProvider
    AuthService --> UserRepo
    ExpenseService --> ExpenseRepo
    ExpenseService --> CategoryRepo
    BudgetService --> BudgetRepo
    
    UserRepo --> PostgreSQL
    ExpenseRepo --> PostgreSQL
    CategoryRepo --> PostgreSQL
    BudgetRepo --> PostgreSQL
    
    AuthService --> Redis
    JWTFilter --> Redis

    style Client fill:#e1f5ff
    style Backend fill:#fff4e1
    style DataLayer fill:#f0f0f0
    style Security fill:#ffe1e1
```

## User Login Request Flow - Detailed Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Browser
    participant ReactApp as React App
    participant Zustand as Zustand Store
    participant AxiosClient as Axios Client
    participant Backend as Spring Boot API
    participant JWTFilter as JWT Filter
    participant AuthController as Auth Controller
    participant AuthService as Auth Service
    participant PasswordEncoder as BCrypt Encoder
    participant UserRepo as User Repository
    participant PostgreSQL as PostgreSQL DB
    participant JWTProvider as JWT Provider
    participant Redis as Redis Cache

    User->>Browser: Enter email & password
    User->>Browser: Click "Login" button
    Browser->>ReactApp: Submit login form
    
    ReactApp->>ReactApp: Validate form (Zod schema)
    ReactApp->>AxiosClient: POST /api/auth/login<br/>{email, password}
    
    AxiosClient->>Backend: HTTPS Request<br/>Content-Type: application/json
    
    Backend->>JWTFilter: Intercept request
    JWTFilter->>JWTFilter: Check if public endpoint<br/>(login is public)
    JWTFilter->>AuthController: Forward to controller
    
    AuthController->>AuthService: login(LoginRequest)
    
    AuthService->>UserRepo: findByEmail(email)
    UserRepo->>PostgreSQL: SELECT * FROM users<br/>WHERE email = ?
    PostgreSQL-->>UserRepo: User record
    UserRepo-->>AuthService: User entity
    
    alt User not found
        AuthService-->>AuthController: BadCredentialsException
        AuthController-->>AxiosClient: 401 Unauthorized
        AxiosClient-->>ReactApp: Error: Invalid credentials
        ReactApp-->>User: Display error message
    else User found
        AuthService->>PasswordEncoder: matches(rawPassword, encodedPassword)
        PasswordEncoder->>PasswordEncoder: BCrypt verification
        
        alt Password mismatch
            PasswordEncoder-->>AuthService: false
            AuthService-->>AuthController: BadCredentialsException
            AuthController-->>AxiosClient: 401 Unauthorized
            AxiosClient-->>ReactApp: Error: Invalid credentials
            ReactApp-->>User: Display error message
        else Password matches
            PasswordEncoder-->>AuthService: true
            
            AuthService->>JWTProvider: generateToken(userDetails)
            JWTProvider->>JWTProvider: Create JWT with<br/>HS256 algorithm
            JWTProvider-->>AuthService: accessToken (24h)
            
            AuthService->>JWTProvider: generateRefreshToken(userDetails)
            JWTProvider-->>AuthService: refreshToken (7d)
            
            AuthService->>UserRepo: Update last_login_at
            UserRepo->>PostgreSQL: UPDATE users SET<br/>last_login_at = NOW()
            
            AuthService->>Redis: Cache user session
            Redis-->>AuthService: Session stored
            
            AuthService-->>AuthController: AuthResponse<br/>{accessToken, refreshToken, user}
            AuthController-->>AxiosClient: 200 OK + JSON response
            
            AxiosClient->>AxiosClient: Response interceptor
            AxiosClient->>Browser: Store tokens in localStorage
            AxiosClient->>Zustand: Update auth state<br/>isAuthenticated = true
            Zustand->>ReactApp: State updated
            
            ReactApp->>Browser: Navigate to /dashboard
            Browser->>User: Dashboard displayed
        end
    end

    Note over User,Redis: All subsequent API requests include:<br/>Authorization: Bearer {accessToken}
```

## Component Interaction - Data Flow Architecture

```mermaid
flowchart LR
    subgraph Frontend
        UI[User Interface]
        Store[Zustand Store]
        API[API Client]
    end

    subgraph SecurityLayer["Security & Auth"]
        CORS[CORS Filter]
        JWT[JWT Filter]
        Auth[Authentication Manager]
    end

    subgraph BusinessLayer["Business Logic"]
        Controllers[Controllers]
        Services[Services]
        Validation[Data Validation]
    end

    subgraph DataAccess["Data Access"]
        Repos[Repositories]
        Cache[Redis Cache]
        DB[PostgreSQL]
    end

    UI -->|User Action| Store
    Store -->|API Call| API
    API -->|HTTPS Request<br/>+ JWT Token| CORS
    
    CORS -->|Validate Origin| JWT
    JWT -->|Extract & Validate Token| Auth
    Auth -->|Authenticated Request| Controllers
    
    Controllers -->|Business Logic| Services
    Services -->|Validate Data| Validation
    Validation -->|Query/Persist| Repos
    
    Repos -->|Check Cache| Cache
    Cache -->|Cache Miss| DB
    DB -->|Data| Repos
    Repos -->|Update Cache| Cache
    
    Repos -->|Response| Services
    Services -->|DTO| Controllers
    Controllers -->|JSON Response| API
    API -->|Update State| Store
    Store -->|Re-render| UI

    style Frontend fill:#e3f2fd
    style SecurityLayer fill:#ffebee
    style BusinessLayer fill:#f3e5f5
    style DataAccess fill:#e8f5e9
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

## Deployment Architecture (Production)

```mermaid
flowchart TB
    Internet[Internet Users]
    
    subgraph CDN["Content Delivery Network"]
        CloudFront[CloudFront / CDN]
    end
    
    subgraph Frontend["Frontend Hosting"]
        S3[S3 Bucket<br/>React Build]
        StaticAssets[Static Assets<br/>JS, CSS, Images]
    end
    
    subgraph LoadBalancing["Load Balancing"]
        ALB[Application Load Balancer]
    end
    
    subgraph AppServers["Application Servers"]
        EC2_1[EC2 Instance 1<br/>Spring Boot]
        EC2_2[EC2 Instance 2<br/>Spring Boot]
        EC2_3[EC2 Instance 3<br/>Spring Boot]
    end
    
    subgraph DataServices["Data Services"]
        RDS[(RDS PostgreSQL<br/>Multi-AZ)]
        ElastiCache[(ElastiCache Redis<br/>Cluster Mode)]
    end
    
    subgraph Monitoring["Monitoring & Logging"]
        CloudWatch[CloudWatch]
        CloudTrail[CloudTrail]
    end

    Internet --> CloudFront
    CloudFront --> S3
    S3 --> StaticAssets
    CloudFront --> ALB
    
    ALB --> EC2_1
    ALB --> EC2_2
    ALB --> EC2_3
    
    EC2_1 --> RDS
    EC2_2 --> RDS
    EC2_3 --> RDS
    
    EC2_1 --> ElastiCache
    EC2_2 --> ElastiCache
    EC2_3 --> ElastiCache
    
    EC2_1 --> CloudWatch
    EC2_2 --> CloudWatch
    EC2_3 --> CloudWatch
    ALB --> CloudTrail

    style CDN fill:#e3f2fd
    style Frontend fill:#f3e5f5
    style LoadBalancing fill:#fff3e0
    style AppServers fill:#e8f5e9
    style DataServices fill:#fce4ec
    style Monitoring fill:#f1f8e9
```

## Technology Stack Overview

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | React | 18.x | Modern UI framework with hooks |
| | TypeScript | 5.x | Type-safe development |
| | Vite | 5.x | Fast build tool and dev server |
| | Zustand | 4.x | Lightweight state management |
| | Axios | 1.x | HTTP client with interceptors |
| | React Router | 6.x | Client-side routing |
| | Tailwind CSS | 3.x | Utility-first CSS framework |
| **Backend** | Spring Boot | 3.2.x | Enterprise Java framework |
| | Java | 21 | LTS version with virtual threads |
| | Spring Security | 6.x | Authentication & authorization |
| | Spring Data JPA | 3.x | Data access layer |
| | JWT (JJWT) | 0.12.x | JSON Web Token implementation |
| | Maven | 3.9.x | Build and dependency management |
| **Database** | PostgreSQL | 15+ | Relational database with JSONB |
| | Redis | 7.x | In-memory cache and session store |
| **Security** | BCrypt | - | Password hashing algorithm |
| | HTTPS/TLS | 1.3 | Transport layer security |
| | CORS | - | Cross-origin resource sharing |
| **DevOps** | Docker | 24.x | Containerization |
| | Docker Compose | 2.x | Multi-container orchestration |
| | GitHub Actions | - | CI/CD pipeline |
| **Deployment** | Railway/AWS | - | Cloud hosting platform |

## Key Architectural Decisions

### 1. **JWT-Based Stateless Authentication**
- **Decision**: Use JWT tokens instead of session-based authentication
- **Rationale**: 
  - Scalability: No server-side session storage needed
  - Microservices ready: Tokens can be validated independently
  - Mobile-friendly: Easy to implement in mobile apps
- **Implementation**: 
  - Access tokens: 24-hour expiry
  - Refresh tokens: 7-day expiry
  - Redis cache for token blacklisting (logout)

### 2. **React + TypeScript for Frontend**
- **Decision**: Use React with TypeScript instead of JavaScript
- **Rationale**:
  - Type safety reduces runtime errors
  - Better IDE support and autocomplete
  - Easier refactoring and maintenance
  - Industry standard for modern web apps

### 3. **Spring Boot 3 with Java 21**
- **Decision**: Use latest Spring Boot with Java 21
- **Rationale**:
  - Virtual threads for better performance
  - Enhanced security features
  - Modern Java features (records, pattern matching)
  - Active community and long-term support

### 4. **PostgreSQL + Redis Architecture**
- **Decision**: Use PostgreSQL for persistent data and Redis for caching
- **Rationale**:
  - PostgreSQL: ACID compliance, JSONB support, complex queries
  - Redis: Fast session management, rate limiting, caching
  - Best of both worlds: Reliability + Performance

### 5. **Layered Architecture Pattern**
- **Decision**: Separate concerns into Controller → Service → Repository layers
- **Rationale**:
  - Clear separation of concerns
  - Easy to test each layer independently
  - Maintainable and scalable codebase
  - Industry best practice

## Security Features Implemented

✅ **Authentication**
- Email/password registration with validation
- Secure login with JWT token generation
- Password hashing with BCrypt (strength 10)
- Token-based session management

✅ **Authorization**
- Role-based access control (ROLE_USER, ROLE_ADMIN)
- JWT token validation on protected endpoints
- Automatic token refresh mechanism

✅ **Data Protection**
- HTTPS/TLS encryption in transit
- Password hashing at rest
- CORS configuration for allowed origins
- Input validation and sanitization

✅ **Session Management**
- Stateless JWT tokens
- Redis-based session storage
- Secure logout with context clearing
- Token expiration handling

✅ **Error Handling**
- Global exception handler
- Secure error messages (no sensitive data exposure)
- Proper HTTP status codes
- User-friendly error responses

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Authenticate user | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/me` | Get current user | Yes |

### Request/Response Examples

#### Login Request
```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

#### Login Response
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400000,
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "roles": ["ROLE_USER"],
      "createdAt": "2025-11-01T10:00:00",
      "lastLoginAt": "2025-11-02T08:30:00"
    }
  },
  "timestamp": 1730537400000
}
```

## Performance Considerations

- **Caching Strategy**: Redis caching for frequently accessed data
- **Connection Pooling**: HikariCP for efficient database connections
- **Lazy Loading**: JPA lazy loading for related entities
- **Index Optimization**: Database indexes on frequently queried columns
- **Stateless Design**: Horizontal scaling without session affinity
- **CDN Usage**: Static assets served from CDN for faster load times

## Future Enhancements

1. **OAuth2 Integration**: Google, Facebook, GitHub login
2. **Two-Factor Authentication (2FA)**: Enhanced security with TOTP
3. **Rate Limiting**: API rate limiting per user/IP
4. **Audit Logging**: Track all user actions for compliance
5. **Email Verification**: Verify user email on registration
6. **Password Reset**: Secure password reset flow
7. **Websocket Support**: Real-time notifications
8. **Mobile App**: React Native mobile application

