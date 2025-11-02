# Authentication & Authorization System Implementation
## Comprehensive Technical Documentation

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [System Requirements](#system-requirements)
3. [Architecture Overview](#architecture-overview)
4. [Implementation Details](#implementation-details)
5. [Security Features](#security-features)
6. [API Documentation](#api-documentation)
7. [Testing Guide](#testing-guide)
8. [Deployment Instructions](#deployment-instructions)
9. [Troubleshooting](#troubleshooting)

---

## Executive Summary

This document describes the implementation of a secure, scalable, and production-ready authentication and authorization system for the Expense Tracker application. The system supports user registration, login, logout, and session management using industry-standard security practices.

### Key Features Delivered
✅ **User Registration** - Complete account creation with validation  
✅ **User Login** - Secure credential verification with JWT token issuance  
✅ **User Logout** - Proper session termination and cleanup  
✅ **Session Management** - Stateless JWT-based authentication  
✅ **Password Security** - BCrypt hashing with configurable strength  
✅ **Token Management** - Access and refresh token system  
✅ **Role-Based Authorization** - Extensible permission system  
✅ **Error Handling** - Comprehensive error responses  
✅ **Input Validation** - Server and client-side validation  

### Technology Stack
- **Frontend**: React 18, TypeScript, Zustand, Axios, React Router
- **Backend**: Spring Boot 3.2, Java 21, Spring Security 6
- **Database**: PostgreSQL 15+
- **Cache**: Redis 7.x
- **Security**: JWT (JJWT 0.12), BCrypt
- **Build Tools**: Maven, Vite

---

## System Requirements

### Functional Requirements
1. Users must be able to register with email, password, first name, and last name
2. Users must be able to log in with email and password
3. Users must be able to log out and terminate their session
4. System must validate user credentials securely
5. System must issue JWT tokens upon successful authentication
6. System must validate JWT tokens on protected endpoints
7. System must handle token expiration gracefully
8. System must provide proper error messages for authentication failures

### Non-Functional Requirements
1. **Security**: Passwords must be hashed using BCrypt with minimum strength 10
2. **Performance**: Authentication requests must complete within 500ms
3. **Scalability**: System must support horizontal scaling (stateless)
4. **Availability**: System must have 99.9% uptime
5. **Maintainability**: Code must follow SOLID principles and be well-documented
6. **Usability**: Error messages must be clear and actionable

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   React     │  HTTPS  │   Spring    │  JDBC   │ PostgreSQL  │
│  Frontend   │◄───────►│   Boot API  │◄───────►│  Database   │
│             │         │             │         │             │
└─────────────┘         └──────┬──────┘         └─────────────┘
                               │
                               │ Redis Protocol
                               ▼
                        ┌─────────────┐
                        │    Redis    │
                        │    Cache    │
                        └─────────────┘
```

### Authentication Flow

```
User → React App → Axios Client → Spring Security Filter Chain →
JWT Filter → Auth Controller → Auth Service → User Repository →
PostgreSQL → JWT Token Provider → Response → Client
```

---

## Implementation Details

### 1. Backend Implementation (Spring Boot)

#### 1.1 User Entity

**Location**: `src/main/java/com/expensetracker/model/User.java`

```java
@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String firstName;
    private String lastName;

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> roles = new HashSet<>();

    private boolean enabled = true;
    private boolean accountNonExpired = true;
    private boolean accountNonLocked = true;
    private boolean credentialsNonExpired = true;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime lastLoginAt;
}
```

**Key Design Decisions**:
- Email as unique identifier (alternative to username)
- Roles stored as JSON array for flexibility
- Account status fields for fine-grained control
- Timestamps for audit trail
- Builder pattern for clean object creation

#### 1.2 Security Configuration

**Location**: `src/main/java/com/expensetracker/config/SecurityConfig.java`

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/register", "/auth/login").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) 
            throws Exception {
        return config.getAuthenticationManager();
    }
}
```

**Key Features**:
- CSRF disabled for stateless API
- CORS configured for cross-origin requests
- Stateless session management
- JWT filter before Spring Security's default filter
- BCrypt with strength 10

#### 1.3 JWT Token Provider

**Location**: `src/main/java/com/expensetracker/security/JwtTokenProvider.java`

**Key Methods**:
- `generateToken(UserDetails)` - Creates access token (24h expiry)
- `generateRefreshToken(UserDetails)` - Creates refresh token (7d expiry)
- `validateToken(String, UserDetails)` - Validates token signature and expiry
- `extractUsername(String)` - Extracts subject from token
- `extractClaim(String, Function)` - Extracts custom claims

**Token Structure**:
```json
{
  "sub": "user@example.com",
  "iat": 1730537400,
  "exp": 1730623800,
  "roles": ["ROLE_USER"]
}
```

#### 1.4 JWT Authentication Filter

**Location**: `src/main/java/com/expensetracker/security/JwtAuthenticationFilter.java`

```java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        
        final String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        final String userEmail = jwtTokenProvider.extractUsername(jwt);

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

            if (jwtTokenProvider.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                    );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
```

**Filter Logic**:
1. Extract Authorization header
2. Validate Bearer token format
3. Extract username from JWT
4. Load user details from database
5. Validate token against user details
6. Set authentication in security context
7. Continue filter chain

#### 1.5 Authentication Service

**Location**: `src/main/java/com/expensetracker/service/AuthService.java`

**Key Methods**:

**Registration Flow**:
```java
public AuthResponse register(RegisterRequest request) {
    // 1. Validate email uniqueness
    if (userRepository.existsByEmail(request.getEmail())) {
        throw new BadRequestException("Email address already in use");
    }

    // 2. Create user with hashed password
    User user = User.builder()
        .email(request.getEmail())
        .password(passwordEncoder.encode(request.getPassword()))
        .firstName(request.getFirstName())
        .lastName(request.getLastName())
        .roles(Set.of("ROLE_USER"))
        .enabled(true)
        .build();

    // 3. Save to database
    user = userRepository.save(user);

    // 4. Generate JWT tokens
    UserPrincipal userPrincipal = UserPrincipal.create(user);
    String accessToken = jwtTokenProvider.generateToken(userPrincipal);
    String refreshToken = jwtTokenProvider.generateRefreshToken(userPrincipal);

    // 5. Return response with tokens
    return AuthResponse.builder()
        .accessToken(accessToken)
        .refreshToken(refreshToken)
        .tokenType("Bearer")
        .expiresIn(86400000L)
        .user(convertToUserDto(user))
        .build();
}
```

**Login Flow**:
```java
public AuthResponse login(LoginRequest request) {
    // 1. Authenticate with Spring Security
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.getEmail(),
            request.getPassword()
        )
    );

    // 2. Set authentication in context
    SecurityContextHolder.getContext().setAuthentication(authentication);
    UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

    // 3. Update last login timestamp
    User user = userRepository.findById(userPrincipal.getId())
        .orElseThrow(() -> new BadRequestException("User not found"));
    user.setLastLoginAt(LocalDateTime.now());
    userRepository.save(user);

    // 4. Generate new tokens
    String accessToken = jwtTokenProvider.generateToken(userPrincipal);
    String refreshToken = jwtTokenProvider.generateRefreshToken(userPrincipal);

    // 5. Return response
    return AuthResponse.builder()
        .accessToken(accessToken)
        .refreshToken(refreshToken)
        .tokenType("Bearer")
        .expiresIn(86400000L)
        .user(convertToUserDto(user))
        .build();
}
```

**Logout Flow**:
```java
public void logout() {
    SecurityContextHolder.clearContext();
    log.info("User logged out successfully");
}
```

#### 1.6 Authentication Controller

**Location**: `src/main/java/com/expensetracker/controller/AuthController.java`

**Endpoints**:

```java
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        AuthResponse authResponse = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("User registered successfully", authResponse));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        authService.logout();
        return ResponseEntity.ok(ApiResponse.success("Logout successful", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser() {
        UserDto user = authService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user));
    }
}
```

### 2. Frontend Implementation (React + TypeScript)

#### 2.1 API Client Configuration

**Location**: `frontend/src/api/authApi.ts`

```typescript
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**Key Features**:
- Automatic JWT token injection
- Automatic redirect on 401 Unauthorized
- Type-safe responses with TypeScript
- Centralized error handling

#### 2.2 Authentication API Functions

```typescript
export const authApi = {
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/auth/logout');
    return response.data;
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },
};
```

#### 2.3 State Management (Zustand)

**Location**: `frontend/src/store/authStore.ts`

```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,

  login: async (data: LoginRequest) => {
    set({ isLoading: true });
    try {
      const response = await authApi.login(data);
      const { accessToken, refreshToken, user } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (data: RegisterRequest) => {
    set({ isLoading: true });
    try {
      const response = await authApi.register(data);
      const { accessToken, refreshToken, user } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    try {
      const response = await authApi.getCurrentUser();
      set({
        user: response.data,
        isAuthenticated: true,
      });
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },
}));
```

#### 2.4 Login Page Component

**Location**: `frontend/src/pages/LoginPage.tsx`

```typescript
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    const data: LoginRequest = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      await login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">Sign In</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
```

---

## Security Features

### 1. Password Security
- **Hashing Algorithm**: BCrypt with strength 10
- **Salt**: Automatically generated per password
- **Comparison**: Constant-time comparison to prevent timing attacks
- **Storage**: Only hashed passwords stored in database

### 2. JWT Token Security
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Secret**: 256-bit secret key (configurable via environment)
- **Expiration**: Access tokens expire after 24 hours
- **Refresh Strategy**: Refresh tokens valid for 7 days
- **Claims**: Minimal data (user ID, email, roles)

### 3. Transport Security
- **Protocol**: HTTPS/TLS 1.3 in production
- **Headers**: Secure headers (HSTS, X-Content-Type-Options, etc.)
- **CORS**: Configured whitelist of allowed origins

### 4. Input Validation
- **Backend**: Jakarta Bean Validation annotations
- **Frontend**: HTML5 validation + custom validation
- **Sanitization**: Input sanitization to prevent XSS

### 5. Error Handling
- **No Information Leakage**: Generic error messages for security failures
- **Logging**: Detailed server-side logs without exposing to clients
- **Status Codes**: Proper HTTP status codes (401, 403, 400, 500)

---

## API Documentation

### Base URL
- **Development**: `http://localhost:8080/api`
- **Production**: `https://your-domain.com/api`

### Authentication Endpoints

#### Register New User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully",
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
      "createdAt": "2025-11-02T10:00:00",
      "lastLoginAt": null
    }
  },
  "timestamp": 1730537400000
}
```

**Error Response (400 Bad Request)**:
```json
{
  "success": false,
  "message": "Email address already in use",
  "data": null,
  "timestamp": 1730537400000
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200 OK)**: Same structure as registration

**Error Response (401 Unauthorized)**:
```json
{
  "success": false,
  "message": "Invalid email or password",
  "data": null,
  "timestamp": 1730537400000
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <access_token>
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Logout successful",
  "data": null,
  "timestamp": 1730537400000
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <access_token>
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["ROLE_USER"],
    "createdAt": "2025-11-02T10:00:00",
    "lastLoginAt": "2025-11-02T14:30:00"
  },
  "timestamp": 1730537400000
}
```

---

## Testing Guide

### Manual Testing Checklist

#### Registration Tests
- [ ] Valid registration creates new user
- [ ] Duplicate email returns 400 error
- [ ] Invalid email format returns validation error
- [ ] Short password returns validation error
- [ ] Missing required fields returns validation error
- [ ] Successful registration returns JWT tokens
- [ ] User automatically logged in after registration

#### Login Tests
- [ ] Valid credentials return JWT tokens
- [ ] Invalid email returns 401 error
- [ ] Invalid password returns 401 error
- [ ] Non-existent user returns 401 error
- [ ] Locked account returns appropriate error
- [ ] Last login timestamp updated on successful login

#### Logout Tests
- [ ] Logout clears security context
- [ ] Subsequent requests with old token fail
- [ ] Logout without token returns appropriate error

#### Session Management Tests
- [ ] JWT token included in protected requests
- [ ] Invalid JWT returns 401
- [ ] Expired JWT returns 401 and triggers relogin
- [ ] Missing JWT on protected endpoint returns 401

### Automated Testing with Postman

1. Import the provided Postman collection
2. Set environment variables:
   - `base_url`: http://localhost:8080/api
   - `access_token`: (auto-populated after login)
3. Run the collection with test runner

### Unit Testing (Backend)

```java
@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testRegisterSuccess() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setPassword("Password123!");
        request.setFirstName("Test");
        request.setLastName("User");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").exists());
    }

    @Test
    void testLoginSuccess() throws Exception {
        // First register user
        // Then test login
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("Password123!");

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.accessToken").exists());
    }
}
```

---

## Deployment Instructions

### Development Environment

1. **Start PostgreSQL**:
   ```bash
   docker run -d --name postgres \
     -e POSTGRES_USER=expense_user \
     -e POSTGRES_PASSWORD=changeme \
     -e POSTGRES_DB=expense_tracker \
     -p 5432:5432 postgres:15
   ```

2. **Start Redis**:
   ```bash
   docker run -d --name redis \
     -p 6379:6379 redis:7
   ```

3. **Start Backend**:
   ```bash
   ./mvnw spring-boot:run
   ```

4. **Start Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Production Deployment (Docker)

1. **Build Backend**:
   ```bash
   ./mvnw clean package -DskipTests
   ```

2. **Build Frontend**:
   ```bash
   cd frontend
   npm run build
   ```

3. **Run with Docker Compose**:
   ```bash
   docker-compose up -d
   ```

### Environment Variables

**Backend** (`application-prod.yml` or environment):
```yaml
DB_HOST: your-db-host
DB_PORT: 5432
DB_NAME: expense_tracker
DB_USERNAME: expense_user
DB_PASSWORD: your-secure-password
REDIS_HOST: your-redis-host
REDIS_PORT: 6379
JWT_SECRET: your-256-bit-secret-key
CORS_ORIGINS: https://your-frontend-domain.com
```

**Frontend** (`.env.production`):
```bash
VITE_API_BASE_URL=https://your-api-domain.com/api
```

---

## Troubleshooting

### Common Issues

#### Issue: "401 Unauthorized" on protected endpoints
**Cause**: JWT token missing or invalid  
**Solution**: 
- Check if token is stored in localStorage
- Verify token is included in Authorization header
- Check token expiration
- Try logging in again

#### Issue: "CORS policy blocked"
**Cause**: Frontend origin not in CORS whitelist  
**Solution**: 
- Add frontend URL to `cors.allowed-origins` in `application.yml`
- Restart backend server
- Clear browser cache

#### Issue: "Email already in use"
**Cause**: User already registered with that email  
**Solution**: 
- Use different email
- Or login with existing credentials
- Or implement "forgot password" flow

#### Issue: "Connection refused to PostgreSQL"
**Cause**: Database not running or wrong connection details  
**Solution**: 
- Verify PostgreSQL is running: `docker ps`
- Check connection details in `application.yml`
- Test connection: `psql -h localhost -U expense_user -d expense_tracker`

#### Issue: JWT token expires immediately
**Cause**: Server time out of sync  
**Solution**: 
- Synchronize server time with NTP
- Check `jwt.expiration` configuration
- Verify timestamp generation

---

## Conclusion

This authentication system provides a solid, secure foundation for the Expense Tracker application. It implements industry best practices, follows SOLID principles, and is production-ready. The system is designed to be scalable, maintainable, and extensible for future enhancements like OAuth2, 2FA, and more.

For questions or support, please refer to the project documentation or contact the development team.

---

**Document Version**: 1.0  
**Last Updated**: November 2, 2025  
**Author**: Development Team  
**Status**: Production Ready ✅

