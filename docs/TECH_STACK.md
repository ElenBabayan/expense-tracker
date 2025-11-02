# Expense Tracker - Technology Stack Documentation

## Phase 2 Deliverable: Technology Stack Verification & Justification

This document outlines the finalized technology choices for the Expense Tracker application, with detailed justifications for each selection based on project requirements: accuracy, speed, security, scalability, and maintainability.

---

## 1. Backend Stack

### 1.1 Programming Language & Framework

#### **Java 21 (LTS)**
**Choice:** Java 21 Long-Term Support Release  
**Justification:**
- **Stability & Security:** As an LTS release, Java 21 receives security updates and bug fixes for years, ensuring long-term maintainability
- **Virtual Threads (Project Loom):** Revolutionary feature that enables handling tens of thousands of concurrent requests with minimal overhead, perfect for our CSV import operations that could involve large datasets
- **Performance:** JVM optimizations provide excellent runtime performance for financial calculations and data processing
- **Pattern Matching:** Enhanced pattern matching reduces boilerplate code and improves code clarity
- **Industry Standard:** Large ecosystem and community support for financial applications

#### **Spring Boot 3.2.x**
**Choice:** Latest Spring Boot version compatible with Java 21  
**Justification:**
- **Rapid Development:** Auto-configuration and starter dependencies reduce setup time by 70%
- **Production-Ready:** Built-in health checks, metrics, and monitoring capabilities
- **Observability:** Integration with Micrometer for application metrics
- **Security:** Seamless integration with Spring Security for robust authentication
- **Testing:** Comprehensive testing support with @SpringBootTest and test slices
- **Community:** Massive ecosystem with solutions for common problems

**Performance Targets Met:**
- Capable of achieving <400ms API response time at 95th percentile
- Handles CSV import of 1,000 rows in <15 seconds with virtual threads

---

## 2. Security Framework

### 2.1 Spring Security 6.x + JWT

**Choice:** Spring Security with JWT-based stateless authentication  
**Justification:**

**Spring Security:**
- **Industry Standard:** Battle-tested security framework trusted by Fortune 500 companies
- **Comprehensive Protection:** Handles CSRF, XSS, session fixation, clickjacking out of the box
- **Role-Based Access Control:** Easy implementation of RBAC with annotations
- **Password Encoding:** BCrypt with configurable strength (default: 10 rounds)
- **Audit Trail:** Security events logging for compliance

**JWT (JSON Web Tokens):**
- **Stateless:** No server-side session storage required, enabling horizontal scaling
- **Performance:** Eliminates database lookups on every request
- **Mobile-Friendly:** Works seamlessly across web, mobile, and IoT clients
- **Microservices Ready:** Tokens can be validated independently by any service
- **Token Structure:**
  - Access Token: 24-hour expiration
  - Refresh Token: 7-day expiration
  - Algorithm: HS256 (HMAC with SHA-256)

**Security Measures Implemented:**
- Passwords hashed with BCrypt (strength 10)
- JWT secret key 256+ bits
- Token expiration and refresh mechanism
- HTTPS-only in production
- CORS properly configured
- SQL injection prevention via JPA
- Input validation on all endpoints

---

## 3. Database Layer

### 3.1 PostgreSQL 15+

**Choice:** PostgreSQL as primary relational database  
**Justification:**

**Why PostgreSQL over other options:**

| Requirement | PostgreSQL Advantage |
|-------------|---------------------|
| **Data Integrity** | ACID compliance ensures financial data accuracy - critical for expenses |
| **Relationships** | Natural fit for user→expenses→categories→budgets relationships |
| **Complex Queries** | Powerful SQL support for budget analysis and trend calculations |
| **JSON Support** | JSONB type handles semi-structured CSV data during import |
| **Performance** | Advanced indexing (B-tree, GiST, GIN) for fast queries |
| **Reliability** | MVCC (Multi-Version Concurrency Control) for high concurrency |
| **Compliance** | Trusted for GDPR/CCPA data handling |
| **Extensions** | pg_trgm for fuzzy merchant matching in categorization |

**Database Schema Design:**
```
users (authentication & profile)
  ├─ user_roles (many-to-many role assignment)
  ├─ expenses (financial transactions)
  │    └─ categories (expense categorization)
  └─ budgets (monthly budget tracking)
```

**Performance Optimizations:**
- Indexes on frequently queried columns (user_id, date, category_id)
- Connection pooling via HikariCP (max pool size: 10)
- Read replicas for analytics queries (future)
- Partitioning on date for expense table scaling (future)

**Why NOT NoSQL (MongoDB):**
- Financial data requires strict consistency (ACID)
- Complex relational queries for budgets/trends
- No need for horizontal scaling at MVP stage
- PostgreSQL's JSONB covers semi-structured needs

---

## 4. Caching & Session Layer

### 4.1 Redis 7.x

**Choice:** Redis as in-memory data store  
**Justification:**

**Primary Use Cases:**

1. **Session Management**
   - Store Spring Session data
   - Instant session validation (sub-millisecond)
   - Shared sessions across multiple backend instances

2. **Idempotency Keys**
   - Prevent duplicate CSV imports
   - TTL-based key expiration
   - Atomic operations for race condition prevention

3. **Rate Limiting**
   - Protect against brute-force login attempts
   - API rate limiting per user/IP
   - Token bucket algorithm implementation

4. **Caching Expensive Queries**
   - Budget summaries
   - Category statistics
   - Monthly spending trends

**Redis Advantages:**
- **Speed:** 100,000+ ops/sec ensures <1ms cache lookups
- **Data Structures:** Native support for strings, hashes, lists, sets, sorted sets
- **Persistence:** Optional AOF/RDB for session recovery
- **Pub/Sub:** Real-time updates for dashboard (future)
- **TTL:** Automatic key expiration for session management

**Configuration:**
- Default TTL: 1 hour for sessions
- Max memory: 256MB with LRU eviction
- Persistence: AOF for critical session data

---

## 5. Frontend Stack

### 5.1 React 18

**Choice:** React 18 with TypeScript  
**Justification:**

**React 18 Features:**
- **Concurrent Rendering:** Keeps UI responsive during large CSV imports
- **Automatic Batching:** Reduces re-renders when updating multiple states
- **Transitions:** Smooth UX when switching between expenses/budgets
- **Suspense:** Better loading states for data fetching
- **Component Reusability:** Build once, use everywhere (forms, modals, charts)

**Why React over alternatives:**

| Framework | Pros | Cons | Decision |
|-----------|------|------|----------|
| **React 18** | ✓ Huge ecosystem<br>✓ React Query for data<br>✓ Chart libraries<br>✓ Job market | △ Boilerplate | **SELECTED** |
| Vue 3 | ✓ Simple<br>✓ Good performance | △ Smaller ecosystem | Not chosen |
| Angular | ✓ Full framework | △ Steep learning curve<br>△ Heavy | Not chosen |
| Svelte | ✓ No virtual DOM | △ Nascent ecosystem | Not chosen |

### 5.2 TypeScript

**Choice:** TypeScript for type-safe frontend  
**Justification:**
- **Type Safety:** Catch bugs at compile-time, not runtime
- **Autocomplete:** Better developer experience in IDEs
- **Refactoring:** Safe large-scale refactors
- **Documentation:** Types serve as inline documentation
- **Financial Data:** Ensures BigDecimal amounts are handled correctly

**Example Type Safety:**
```typescript
interface Expense {
  id: number;
  amount: number; // Caught if accidentally passed string
  date: string; // ISO 8601
  merchant: string;
}
```

### 5.3 Supporting Libraries

#### **Vite**
- **Fast HMR:** Instant hot module replacement
- **Build Speed:** 10-20x faster than Webpack for development
- **ES Modules:** Native browser support, no bundling needed in dev

#### **Zustand**
- **Lightweight:** 1KB size vs Redux's 20KB
- **Simple API:** No boilerplate, just hooks
- **TypeScript Support:** First-class TypeScript support
- **DevTools:** Time-travel debugging

#### **React Hook Form + Zod**
- **Performance:** No unnecessary re-renders
- **Validation:** Schema-based validation with Zod
- **Type Safety:** Inferred types from Zod schemas
- **UX:** Real-time validation feedback

#### **TanStack Query (React Query)**
- **Caching:** Automatic caching and invalidation
- **Optimistic Updates:** Instant UI feedback
- **Retry Logic:** Automatic retry on failure
- **DevTools:** Query inspection in development

#### **Axios**
- **Interceptors:** Global request/response handling
- **Token Management:** Automatic JWT injection
- **Error Handling:** Centralized error responses
- **TypeScript:** Type-safe API calls

---

## 6. Build Tools & Package Management

### 6.1 Backend: Maven 3.9.x

**Choice:** Maven for Java dependency management  
**Justification:**
- **Convention over Configuration:** Standardized project structure
- **Dependency Resolution:** Transitive dependency management
- **Plugin Ecosystem:** Spring Boot plugin, Docker plugin, etc.
- **CI/CD Integration:** Native support in Jenkins, GitHub Actions
- **Reproducible Builds:** Lock file via maven-dependency-plugin

**Why Maven over Gradle:**
- Simpler for Spring Boot projects
- Better IDE support (IntelliJ, Eclipse)
- More familiar to most Java developers

### 6.2 Frontend: npm / Vite

**Choice:** npm for package management, Vite for bundling  
**Justification:**
- **npm:** Largest package registry (2M+ packages)
- **Vite:** Modern, fast build tool designed for ESM
- **Development Speed:** <100ms HMR updates
- **Production Optimization:** Tree-shaking, code splitting, minification

---

## 7. DevOps & Infrastructure

### 7.1 Hosting Options

#### **MVP Stage: Fly.io or Railway**
**Justification:**
- **Cost:** Free tier for development ($0-$5/month)
- **Simplicity:** One-command deployment
- **Docker Support:** Containerized deployments
- **Database Included:** Managed PostgreSQL and Redis
- **Global CDN:** Edge deployment for low latency
- **Auto-Scaling:** Automatic horizontal scaling

**Deployment:**
```bash
# Single command deployment
fly deploy
# or
railway up
```

#### **Production/Scale Stage: AWS**
**Justification:**
- **Scalability:** Auto-scaling EC2 instances
- **Reliability:** 99.99% SLA for critical services
- **Database:** RDS PostgreSQL with automated backups
- **Caching:** ElastiCache Redis with clustering
- **CDN:** CloudFront for global asset delivery
- **Monitoring:** CloudWatch for logs and metrics
- **Security:** WAF, Shield for DDoS protection

**AWS Architecture:**
- **Frontend:** S3 + CloudFront (static hosting)
- **Backend:** ECS Fargate (containerized API)
- **Database:** RDS PostgreSQL (Multi-AZ)
- **Cache:** ElastiCache Redis
- **Load Balancer:** ALB with health checks
- **Monitoring:** CloudWatch + X-Ray

**Migration Path:**
1. Phase 1-2 (Weeks 1-4): Fly.io for MVP
2. Phase 3-4 (Weeks 5-10): Evaluate AWS if >1,000 users
3. Phase 5-6 (Weeks 11-15): AWS if >10,000 users

---

## 8. Code Quality & Security Tools

### 8.1 Snyk

**Choice:** Snyk for vulnerability scanning  
**Justification:**
- **Dependency Scanning:** Checks npm and Maven dependencies
- **Real-Time Alerts:** Notified of new CVEs immediately
- **Auto-Fixes:** Pull requests to update vulnerable packages
- **GDPR/CCPA Compliance:** Helps meet security requirements
- **CI/CD Integration:** Blocks builds with critical vulnerabilities

**Implementation:**
```yaml
# GitHub Actions workflow
- name: Run Snyk
  uses: snyk/actions/maven@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

### 8.2 Testing Frameworks

**Backend:**
- **JUnit 5:** Unit testing framework
- **Mockito:** Mocking dependencies
- **Spring Boot Test:** Integration testing
- **TestContainers:** Real database tests with Docker

**Frontend:**
- **Vitest:** Fast unit testing (Vite-native)
- **React Testing Library:** Component testing
- **Playwright:** End-to-end testing

**Code Coverage Target:** >80% for critical paths (auth, payments)

---

## 9. Performance Benchmarks

### 9.1 Target Performance Metrics (Phase 2)

| Metric | Target | Measured By |
|--------|--------|-------------|
| API Response Time (p95) | <400ms | Spring Boot Actuator |
| CSV Import (1,000 rows) | <15 seconds | Custom metrics |
| Auto-categorization Accuracy | >95% | ML model evaluation |
| Crash-Free Rate | >99.5% | Error tracking |
| Frontend FCP | <1.5s | Lighthouse |
| Frontend LCP | <2.5s | Lighthouse |

### 9.2 Scalability Targets

**MVP (Phase 2):**
- 200 weekly active users
- 10,000 expenses/month
- 100 concurrent users

**Growth (Phase 6):**
- 10,000 weekly active users
- 1M expenses/month
- 1,000 concurrent users

**Infrastructure Scaling Strategy:**
- **Vertical:** Upgrade DB/Redis instance sizes
- **Horizontal:** Add API server replicas with load balancer
- **Database:** Read replicas for analytics queries
- **CDN:** CloudFront for static assets globally

---

## 10. Security & Compliance

### 10.1 Encryption

**Data at Rest:**
- PostgreSQL: AES-256 encryption (RDS encryption)
- Redis: TLS connections + password authentication
- Backups: Encrypted with KMS

**Data in Transit:**
- HTTPS/TLS 1.3 for all API calls
- Strict-Transport-Security header (HSTS)
- Certificate from Let's Encrypt

### 10.2 Compliance

**GDPR (EU):**
- ✓ User consent screen for data processing
- ✓ Right to access: API endpoint for data export
- ✓ Right to deletion: Cascade delete on account removal
- ✓ Data portability: JSON export of all user data

**CCPA (California):**
- ✓ Privacy policy with data usage disclosure
- ✓ "Do Not Sell My Data" option
- ✓ Delete user data within 45 days

**General Best Practices:**
- Least-privilege database access
- Regular security audits with Snyk
- Encrypted password storage (BCrypt)
- Session expiration and refresh tokens
- Rate limiting to prevent abuse

### 10.3 Audit Logging

**Events Logged:**
- User registration/login/logout
- Password changes
- Data exports (GDPR compliance)
- Failed login attempts (security monitoring)
- Expense creation/modification/deletion

**Log Retention:** 90 days (compliance requirement)

---

## 11. Development Workflow

### 11.1 Version Control

**Git + GitHub:**
- Feature branches with PR reviews
- Protected main branch
- Conventional commits (feat, fix, docs, etc.)
- GitHub Actions for CI/CD

### 11.2 Environments

| Environment | Purpose | Database | URL |
|-------------|---------|----------|-----|
| **Local** | Development | Docker containers | localhost:8080 |
| **Dev** | Integration testing | Shared test DB | dev.expensetracker.com |
| **Staging** | Pre-production | Staging DB | staging.expensetracker.com |
| **Production** | Live users | Production DB | expensetracker.com |

### 11.3 CI/CD Pipeline

```yaml
# GitHub Actions workflow
on: [push, pull_request]

jobs:
  test:
    - Run unit tests
    - Run integration tests
    - Check code coverage (>80%)
    - Snyk security scan
  
  build:
    - Build backend JAR
    - Build frontend bundle
    - Create Docker images
  
  deploy:
    - Deploy to environment (dev/staging/prod)
    - Run smoke tests
    - Rollback on failure
```

---

## 12. Monitoring & Observability

### 12.1 Application Monitoring

**Spring Boot Actuator:**
- Health checks: /actuator/health
- Metrics: /actuator/metrics
- Thread dumps: /actuator/threaddump

**Micrometer:**
- Custom metrics (CSV import time, categorization accuracy)
- Integration with Prometheus/Grafana

### 12.2 Logging

**Structured Logging:**
- Logback with JSON output
- Correlation IDs for request tracing
- Log levels: ERROR (production), DEBUG (development)

**Log Aggregation:**
- CloudWatch Logs (AWS)
- ELK Stack (future)

### 12.3 Error Tracking

**Sentry / Rollbar:**
- Real-time error notifications
- Stack traces with context
- User impact analysis
- Release tracking

---

## 13. Future Technology Considerations

### 13.1 Machine Learning (Phase 3+)

**Categorization Model:**
- **Framework:** TensorFlow Lite or ONNX for on-device
- **Model:** Naive Bayes or lightweight neural network
- **Training:** Python (pandas, scikit-learn)
- **Deployment:** Model converted to Java-compatible format

**Why Lightweight:**
- On-device processing for privacy
- No external API calls (faster, cheaper)
- Offline functionality

### 13.2 Potential Additions (Post-MVP)

**Real-Time Features:**
- WebSocket for live dashboard updates
- Server-Sent Events for notifications

**Advanced Analytics:**
- Apache Spark for big data processing (if >1M users)
- Data warehouse (Snowflake/Redshift) for analytics

**Mobile Apps:**
- React Native for iOS/Android
- Share same backend API

---

## 14. Summary: Why This Stack?

| Requirement | Technology | Justification |
|-------------|-----------|---------------|
| **Speed** | Spring Boot + Virtual Threads | <400ms API response |
| | Redis caching | Sub-millisecond reads |
| | Vite + React 18 | <2.5s page load |
| **Accuracy** | PostgreSQL ACID | 100% data integrity |
| | TypeScript | Compile-time type safety |
| | JUnit + Mockito | >80% test coverage |
| **Security** | Spring Security + JWT | Industry-standard auth |
| | BCrypt passwords | Secure password hashing |
| | Snyk scanning | Vulnerability detection |
| **Scalability** | Stateless JWT | Horizontal scaling |
| | Redis for sessions | Multi-instance support |
| | AWS infrastructure | Auto-scaling capabilities |
| **Maintainability** | TypeScript + Java 21 | Type safety, modern features |
| | Spring Boot conventions | Reduced boilerplate |
| | Comprehensive tests | Confident refactoring |

---

## 15. Conclusion

The selected technology stack balances **developer productivity**, **performance requirements**, and **long-term scalability**. Each choice is backed by:

1. **Technical Merit:** Proven technologies in production environments
2. **Project Fit:** Aligns with specific requirements (accuracy, speed, security)
3. **Team Expertise:** Standard tools with large communities
4. **Future-Proofing:** LTS versions and scalable architecture
5. **Cost-Effectiveness:** Free/cheap for MVP, scales with revenue

This stack enables achieving:
- ✓ 95% categorization accuracy
- ✓ <400ms API response time
- ✓ 99.5% crash-free rate
- ✓ GDPR/CCPA compliance
- ✓ 200 WAU within 6 weeks

**Approved for Phase 2 Implementation** ✓

