# CaseMate Pro - Spring Boot Backend API Documentation

## Overview
This document outlines all the REST API endpoints your Spring Boot backend needs to implement for the CaseMate Pro frontend.

**Base URL:** `http://localhost:8080/api` (or your deployment URL)

---

## Authentication Endpoints

### 1. Register User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "email": "lawyer@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "role": "lawyer" // or "client"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-string",
    "email": "lawyer@example.com",
    "name": "John Doe",
    "role": "lawyer"
  }
}
```

### 2. Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "lawyer@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-string",
    "email": "lawyer@example.com",
    "name": "John Doe",
    "role": "lawyer"
  }
}
```

### 3. Get Current User
**GET** `/api/auth/me`

**Headers:** 
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "email": "lawyer@example.com",
  "name": "John Doe",
  "role": "lawyer"
}
```

---

## Dashboard Stats Endpoints

### 4. Get Lawyer Dashboard Stats
**GET** `/api/stats/dashboard`

**Headers:** 
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "activeCases": 24,
  "totalClients": 156,
  "monthlyRevenue": 45230.50,
  "pendingTasks": 8,
  "recentActivity": [
    {
      "id": "activity-1",
      "type": "case_update",
      "message": "Case CS-2025-001 updated",
      "timestamp": "2025-01-10T14:30:00Z"
    }
  ]
}
```

---

## Case Management Endpoints

### 5. Get All Cases (Lawyer)
**GET** `/api/cases`

**Headers:** 
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `limit` (optional): Number of results (default: 10)
- `offset` (optional): Pagination offset (default: 0)
- `status` (optional): Filter by status (active, pending, closed)
- `sort` (optional): Sort by field (recent, name, status)

**Response (200 OK):**
```json
{
  "cases": [
    {
      "id": "case-uuid-1",
      "caseNumber": "CS-2025-001",
      "title": "Smith v. Johnson Corp",
      "clientId": "client-uuid",
      "clientName": "Sarah Smith",
      "status": "active",
      "createdAt": "2025-01-01T10:00:00Z",
      "updatedAt": "2025-01-10T14:30:00Z",
      "nextHearing": "2025-01-15T09:00:00Z"
    }
  ],
  "total": 24,
  "limit": 10,
  "offset": 0
}
```

### 6. Get Client's Cases
**GET** `/api/client/cases`

**Headers:** 
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "cases": [
    {
      "id": "case-uuid-1",
      "caseNumber": "CS-2025-001",
      "title": "Smith v. Johnson Corp",
      "lawyerName": "John Doe",
      "status": "active",
      "createdAt": "2025-01-01T10:00:00Z",
      "updatedAt": "2025-01-10T14:30:00Z",
      "nextHearing": "2025-01-15T09:00:00Z"
    }
  ]
}
```

### 7. Get Single Case Details
**GET** `/api/cases/:id`

**Headers:** 
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "case-uuid-1",
  "caseNumber": "CS-2025-001",
  "title": "Smith v. Johnson Corp",
  "description": "Employment discrimination case...",
  "clientId": "client-uuid",
  "clientName": "Sarah Smith",
  "lawyerId": "lawyer-uuid",
  "lawyerName": "John Doe",
  "status": "active",
  "createdAt": "2025-01-01T10:00:00Z",
  "updatedAt": "2025-01-10T14:30:00Z",
  "nextHearing": "2025-01-15T09:00:00Z",
  "notes": "Important case details...",
  "documents": [
    {
      "id": "doc-uuid-1",
      "name": "Complaint.pdf",
      "type": "pdf",
      "uploadedAt": "2025-01-05T12:00:00Z"
    }
  ]
}
```

### 8. Create New Case
**POST** `/api/cases`

**Headers:** 
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "New Case Title",
  "description": "Case description...",
  "clientId": "client-uuid",
  "status": "pending"
}
```

**Response (201 Created):**
```json
{
  "id": "new-case-uuid",
  "caseNumber": "CS-2025-010",
  "title": "New Case Title",
  "description": "Case description...",
  "clientId": "client-uuid",
  "clientName": "Client Name",
  "status": "pending",
  "createdAt": "2025-01-10T15:00:00Z",
  "updatedAt": "2025-01-10T15:00:00Z"
}
```

### 9. Update Case
**PUT** `/api/cases/:id`

**Headers:** 
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Updated Case Title",
  "description": "Updated description...",
  "status": "active",
  "nextHearing": "2025-02-01T10:00:00Z"
}
```

**Response (200 OK):**
```json
{
  "id": "case-uuid",
  "caseNumber": "CS-2025-001",
  "title": "Updated Case Title",
  "description": "Updated description...",
  "status": "active",
  "updatedAt": "2025-01-10T16:00:00Z"
}
```

### 10. Delete Case
**DELETE** `/api/cases/:id`

**Headers:** 
```
Authorization: Bearer {token}
```

**Response (204 No Content)**

---

## Client Management Endpoints

### 11. Get All Clients (Lawyer Only)
**GET** `/api/clients`

**Headers:** 
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "clients": [
    {
      "id": "client-uuid-1",
      "name": "Sarah Smith",
      "email": "sarah@example.com",
      "phone": "+1234567890",
      "activeCases": 2,
      "totalCases": 5,
      "createdAt": "2024-06-15T10:00:00Z"
    }
  ],
  "total": 156
}
```

### 12. Get Client Details
**GET** `/api/clients/:id`

**Headers:** 
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "client-uuid-1",
  "name": "Sarah Smith",
  "email": "sarah@example.com",
  "phone": "+1234567890",
  "address": "123 Main St, City, State",
  "activeCases": 2,
  "totalCases": 5,
  "cases": [
    {
      "id": "case-uuid",
      "caseNumber": "CS-2025-001",
      "title": "Smith v. Johnson Corp",
      "status": "active"
    }
  ],
  "createdAt": "2024-06-15T10:00:00Z"
}
```

---

## Document Management Endpoints

### 13. Get Documents
**GET** `/api/documents`

**Headers:** 
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `caseId` (optional): Filter by case
- `limit` (optional): Number of results

**Response (200 OK):**
```json
{
  "documents": [
    {
      "id": "doc-uuid-1",
      "name": "Complaint.pdf",
      "type": "pdf",
      "size": 245678,
      "caseId": "case-uuid",
      "caseNumber": "CS-2025-001",
      "uploadedBy": "John Doe",
      "uploadedAt": "2025-01-05T12:00:00Z",
      "downloadUrl": "/api/documents/doc-uuid-1/download"
    }
  ],
  "total": 45
}
```

### 14. Upload Document
**POST** `/api/documents`

**Headers:** 
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
- `file`: Document file
- `caseId`: Associated case ID
- `description`: Optional description

**Response (201 Created):**
```json
{
  "id": "new-doc-uuid",
  "name": "document.pdf",
  "type": "pdf",
  "size": 123456,
  "caseId": "case-uuid",
  "uploadedAt": "2025-01-10T15:30:00Z",
  "downloadUrl": "/api/documents/new-doc-uuid/download"
}
```

### 15. Download Document
**GET** `/api/documents/:id/download`

**Headers:** 
```
Authorization: Bearer {token}
```

**Response:** Binary file download

### 16. Delete Document
**DELETE** `/api/documents/:id`

**Headers:** 
```
Authorization: Bearer {token}
```

**Response (204 No Content)**

---

## Error Responses

All endpoints should return appropriate error responses:

**400 Bad Request:**
```json
{
  "error": "Bad Request",
  "message": "Invalid input data",
  "details": ["Email is required", "Password must be at least 8 characters"]
}
```

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

**403 Forbidden:**
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource"
}
```

**404 Not Found:**
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## Authentication Flow

1. User registers or logs in via `/api/auth/register` or `/api/auth/login`
2. Backend returns JWT token
3. Frontend stores token in localStorage or sessionStorage
4. All subsequent requests include token in Authorization header: `Bearer {token}`
5. Backend validates token on each protected endpoint

---

## Security Considerations

1. **JWT Token**: Use short-lived tokens (1-24 hours) with refresh token mechanism
2. **Password Hashing**: Use BCrypt or similar for password storage
3. **CORS**: Configure CORS to allow requests from your frontend domain
4. **Rate Limiting**: Implement rate limiting on authentication endpoints
5. **HTTPS**: Use HTTPS in production
6. **Input Validation**: Validate all inputs server-side
7. **File Upload**: Validate file types and sizes, scan for malware
8. **SQL Injection**: Use parameterized queries/JPA to prevent SQL injection
9. **Role-Based Access**: Ensure lawyers can't access other lawyers' data, clients can only see their own cases

---

## Database Schema Suggestions

### Users Table
- id (UUID, Primary Key)
- email (String, Unique)
- password_hash (String)
- name (String)
- role (Enum: 'lawyer', 'client')
- phone (String, Optional)
- created_at (Timestamp)
- updated_at (Timestamp)

### Cases Table
- id (UUID, Primary Key)
- case_number (String, Unique)
- title (String)
- description (Text)
- lawyer_id (UUID, Foreign Key → Users)
- client_id (UUID, Foreign Key → Users)
- status (Enum: 'active', 'pending', 'closed')
- next_hearing (Timestamp, Optional)
- created_at (Timestamp)
- updated_at (Timestamp)

### Documents Table
- id (UUID, Primary Key)
- name (String)
- file_path (String)
- type (String)
- size (Integer)
- case_id (UUID, Foreign Key → Cases)
- uploaded_by (UUID, Foreign Key → Users)
- uploaded_at (Timestamp)

---

## Next Steps

1. Set up Spring Boot project with dependencies:
   - Spring Web
   - Spring Security
   - Spring Data JPA
   - PostgreSQL/MySQL Driver
   - JWT Library (e.g., jjwt)
   - Lombok (optional)

2. Create entities for User, Case, Document

3. Implement repositories using Spring Data JPA

4. Create services for business logic

5. Implement JWT authentication filter

6. Create REST controllers following this API spec

7. Add validation and error handling

8. Test all endpoints with Postman/Thunder Client

9. Configure CORS to allow frontend access

10. Deploy backend to cloud service (Heroku, AWS, Azure, etc.)

---

## User Profile Management Endpoints

### Update User Profile
**PUT** `/api/users/{userId}`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1 (555) 123-4567",
  "address": "123 Main St, City, State, ZIP",
  "age": 35,
  "aboutClient": "Professional bio or client information"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "email": "john.doe@example.com",
  "name": "John Doe",
  "role": "lawyer",
  "phone": "+1 (555) 123-4567",
  "address": "123 Main St, City, State, ZIP",
  "age": 35,
  "aboutClient": "Professional bio or client information"
}
```

**Error Responses:**
- **400 Bad Request:** Invalid data or email already taken
- **401 Unauthorized:** Invalid or missing token
- **403 Forbidden:** Attempting to update another user's profile

### Change Password
**PUT** `/api/users/{userId}/password`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Response (200 OK):**
```json
{
  "message": "Password changed successfully"
}
```

**Error Responses:**
- **400 Bad Request:** Current password incorrect or new password too weak
- **401 Unauthorized:** Invalid or missing token
- **403 Forbidden:** Attempting to change another user's password

### Get User Profile
**GET** `/api/users/{userId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "email": "john.doe@example.com",
  "name": "John Doe",
  "role": "lawyer",
  "phone": "+1 (555) 123-4567",
  "address": "123 Main St, City, State, ZIP",
  "age": 35,
  "aboutClient": "Professional bio or client information"
}
```

**Error Responses:**
- **401 Unauthorized:** Invalid or missing token
- **403 Forbidden:** Attempting to view another user's profile
- **404 Not Found:** User not found
