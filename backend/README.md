# CaseMate Pro Backend

A comprehensive Spring Boot backend for the CaseMate Pro legal CRM system.

## Features

- **JWT Authentication** - Secure user authentication with role-based access control
- **Case Management** - Complete CRUD operations for legal cases
- **Document Management** - File upload, download, and management for case documents
- **User Management** - Separate interfaces for lawyers and clients
- **Dashboard Analytics** - Statistics and metrics for lawyers and clients
- **RESTful API** - Complete REST API following OpenAPI standards

## Technology Stack

- **Spring Boot 3.2.2**
- **Spring Security** with JWT
- **Spring Data JPA** for database operations
- **PostgreSQL** for production database
- **H2** for development/testing
- **Maven** for dependency management
- **Lombok** for reducing boilerplate code

## Quick Start

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12+ (for production)

### Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Configure the database**
   
   For development (H2 in-memory database):
   ```properties
   # Uncomment these lines in application.properties
   spring.datasource.url=jdbc:h2:mem:testdb
   spring.datasource.driverClassName=org.h2.Driver
   spring.datasource.username=sa
   spring.datasource.password=password
   spring.h2.console.enabled=true
   ```

   For production (PostgreSQL):
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/casemate_pro
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. **Install dependencies and run**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

The API will be available at `http://localhost:8080/api`

### Environment Variables

For production deployment, set these environment variables:

```bash
DATABASE_URL=jdbc:postgresql://localhost:5432/casemate_pro
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
JWT_SECRET=your-super-secret-jwt-key-here
CORS_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "lawyer@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "role": "lawyer"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "lawyer@example.com",
  "password": "securePassword123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <your-jwt-token>
```

### Case Management

#### Get Cases
```http
GET /api/cases?page=0&size=10&status=active&sort=recent
Authorization: Bearer <your-jwt-token>
```

#### Create Case (Lawyers only)
```http
POST /api/cases
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "New Case Title",
  "description": "Case description...",
  "clientId": "client-uuid",
  "status": "pending"
}
```

### Document Management

#### Upload Document
```http
POST /api/documents
Authorization: Bearer <your-jwt-token>
Content-Type: multipart/form-data

file: <your-file>
caseId: <case-uuid>
description: Optional description
```

#### Download Document
```http
GET /api/documents/{id}/download
Authorization: Bearer <your-jwt-token>
```

### Dashboard Stats

#### Get Lawyer Dashboard Stats
```http
GET /api/stats/dashboard
Authorization: Bearer <your-jwt-token>
```

For complete API documentation, see the main `API_DOCUMENTATION.md` file.

## Security Features

- **JWT Authentication** with configurable expiration
- **Role-based Access Control** (LAWYER/CLIENT)
- **CORS Configuration** for frontend integration
- **Input Validation** on all endpoints
- **File Upload Security** with type and size validation
- **Database Security** with parameterized queries

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Cases Table
```sql
CREATE TABLE cases (
    id UUID PRIMARY KEY,
    case_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    next_hearing TIMESTAMP,
    notes TEXT,
    lawyer_id UUID REFERENCES users(id),
    client_id UUID REFERENCES users(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Documents Table
```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    type VARCHAR(50) NOT NULL,
    size BIGINT NOT NULL,
    description TEXT,
    case_id UUID REFERENCES cases(id),
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP
);
```

## Development

### Running Tests
```bash
mvn test
```

### Building for Production
```bash
mvn clean package -Pprod
```

### Code Style
This project uses standard Spring Boot conventions and Lombok for reducing boilerplate code.

## Deployment

### Docker (Optional)
Create a `Dockerfile`:
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/casemate-pro-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Heroku
```bash
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set CORS_ORIGINS=https://your-frontend-domain.com

# Deploy
git push heroku main
```

### Railway/Render
Upload the project and set the required environment variables.

## Project Structure

```
src/main/java/com/casemate/pro/
├── config/              # Security and CORS configuration
├── controller/          # REST API controllers
├── dto/                 # Data Transfer Objects
├── entity/              # JPA entities
├── exception/           # Custom exceptions and error handling
├── repository/          # Spring Data repositories
├── security/            # JWT and authentication logic
└── service/             # Business logic services
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@casemate-pro.com or create an issue in this repository.