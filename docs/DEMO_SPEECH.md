# Demo Speech: Expense Tracker Authentication System

## 2-Minute Presentation

---

### **Introduction (15 seconds)**

"Good afternoon. Today I'm presenting the authentication system I built for an Expense Tracker application. It's a full-stack solution using React, Spring Boot, PostgreSQL, and Redis."

---

### **What It Does (30 seconds)**

"The system handles complete user authentication:

Users can register with their email and password. The password gets hashed with BCrypt before storage—never stored as plain text. After registration, they're automatically logged in.

For login, the system validates credentials and issues a JWT token. This token is included with every request to authenticate the user. It's stateless, which means the application can scale easily.

Logout clears everything from both the browser and the server."

---

### **Security (30 seconds)**

"Security is built-in at multiple levels:

Passwords are hashed with BCrypt. JWT tokens expire after 24 hours. The system validates every request. CORS is configured to only allow trusted origins. And we use Spring Security for role-based access control.

The database is PostgreSQL with proper indexing, and Redis handles session caching for better performance."

---

### **Architecture (20 seconds)**

"The code is organized in layers: Controllers handle HTTP requests, Services contain the business logic, and Repositories manage database operations. This separation makes the code easier to test and maintain.

Everything is containerized with Docker for consistent deployment across environments."

---

### **Live Demo (20 seconds)**

[Show the application]

"Here's the registration page with real-time validation. After submitting, the user is automatically logged in and sees their dashboard. You can see the JWT token being sent in the network tab here. If I logout and try to access the dashboard directly, it redirects back to login—the route protection is working."

---

### **Closing (5 seconds)**

"That's the authentication system. It's secure, scalable, and ready for production. Happy to answer any questions."

---

## If You Have Questions

**About security:**
"We use BCrypt for passwords, JWT tokens that expire, and Spring Security for authorization. Multiple layers protect against common vulnerabilities."

**About scalability:**
"JWT tokens are stateless—any server can validate them. This means we can scale horizontally without session management issues. Redis caches frequently-accessed data to reduce database load."

**About tech choices:**
"Spring Boot gives us enterprise-grade security out of the box. React provides a modern, responsive UI. PostgreSQL handles relational data reliably. Redis speeds up session management. Java 21 brings performance improvements with virtual threads."

**About deployment:**
"Everything runs in Docker containers. I have separate configurations for development and production. Currently deployed on Railway, but it can run on AWS or any cloud platform."

---

## Before You Present

✅ Test the app—make sure it's running  
✅ Clear your browser cache  
✅ Have test credentials ready  
✅ Open browser dev tools to Network tab  
✅ Practice once to check timing  

---

## During Demo

1. Show registration with valid data
2. Point out automatic login after registration  
3. Logout
4. Login again with the same credentials
5. Show JWT token in network requests
6. Try to access dashboard without login (shows redirect)

---

**Remember:** You built this. You understand how it works. Just explain it clearly and show it working. Technical audiences appreciate seeing real, working code more than perfect slides.

Good luck! 🚀
