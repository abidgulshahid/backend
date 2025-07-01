# Visa Application API Schema

## Base URL

```
http://localhost:3000
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

---

## 1. Authentication Endpoints

### 1.1 User Registration

**POST** `/auth/register`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "user" // optional, defaults to "user"
}
```

**Response (200):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Error Response (409 - Email already exists):**

```json
{
  "statusCode": 409,
  "message": "Email already registered",
  "error": "Conflict"
}
```

### 1.2 User Login

**POST** `/auth/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Error Response (401 - Invalid credentials):**

```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

### 1.3 Create Admin (Admin Only)

**POST** `/users/admin`

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
```

**Request Body:**

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response (201):**

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "email": "admin@example.com",
  "role": "admin",
  "createdAt": "2024-01-07T10:30:00.000Z",
  "updatedAt": "2024-01-07T10:30:00.000Z"
}
```

**Error Response (403 - Not admin):**

```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

---

## 2. Application Endpoints

### 2.1 Get User's Applications

**GET** `/applications`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "passportNumber": "AB1234567",
    "nationality": "United States",
    "visaType": "Tourist",
    "purposeOfVisit": "Vacation",
    "intendedArrivalDate": "2024-06-15T00:00:00.000Z",
    "intendedDepartureDate": "2024-06-30T00:00:00.000Z",
    "status": "pending",
    "adminNotes": null,
    "createdAt": "2024-01-07T10:30:00.000Z",
    "updatedAt": "2024-01-07T10:30:00.000Z"
  }
]
```

### 2.2 Submit New Application

**POST** `/applications`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "passportNumber": "AB1234567",
  "nationality": "United States",
  "visaType": "Tourist",
  "purposeOfVisit": "Vacation",
  "intendedArrivalDate": "2024-06-15",
  "intendedDepartureDate": "2024-06-30"
}
```

**Response (201):**

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "userId": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "passportNumber": "AB1234567",
  "nationality": "United States",
  "visaType": "Tourist",
  "purposeOfVisit": "Vacation",
  "intendedArrivalDate": "2024-06-15T00:00:00.000Z",
  "intendedDepartureDate": "2024-06-30T00:00:00.000Z",
  "status": "pending",
  "adminNotes": null,
  "createdAt": "2024-01-07T10:30:00.000Z",
  "updatedAt": "2024-01-07T10:30:00.000Z"
}
```

**Error Response (400 - Validation error):**

```json
{
  "statusCode": 400,
  "message": [
    "firstName should not be empty",
    "intendedArrivalDate must be a valid ISO 8601 date string"
  ],
  "error": "Bad Request"
}
```

### 2.3 Get All Applications (Admin Only)

**GET** `/admin/applications`

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
```

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "userId": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com"
    },
    "firstName": "John",
    "lastName": "Doe",
    "passportNumber": "AB1234567",
    "nationality": "United States",
    "visaType": "Tourist",
    "purposeOfVisit": "Vacation",
    "intendedArrivalDate": "2024-06-15T00:00:00.000Z",
    "intendedDepartureDate": "2024-06-30T00:00:00.000Z",
    "status": "pending",
    "adminNotes": null,
    "createdAt": "2024-01-07T10:30:00.000Z",
    "updatedAt": "2024-01-07T10:30:00.000Z"
  }
]
```

---

## 3. Data Types

### 3.1 User Roles

```typescript
enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
```

### 3.2 Application Status

```typescript
enum ApplicationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}
```

### 3.3 Visa Types (Examples)

- Tourist
- Business
- Student
- Work
- Family Visit
- Transit

---

## 4. Error Handling

### 4.1 Common HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (Validation errors)
- **401**: Unauthorized (Invalid/missing JWT)
- **403**: Forbidden (Insufficient permissions)
- **404**: Not Found
- **409**: Conflict (Email already exists)
- **500**: Internal Server Error

### 4.2 Error Response Format

```json
{
  "statusCode": 400,
  "message": "Error description or array of validation errors",
  "error": "Error type"
}
```

---

## 5. Frontend Integration Examples

### 5.1 React/JavaScript Example

```javascript
// Login function
const login = async (email, password) => {
  try {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Get user applications
const getUserApplications = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch('http://localhost:3000/applications', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

// Submit new application
const submitApplication = async (applicationData) => {
  const token = localStorage.getItem('token');

  const response = await fetch('http://localhost:3000/applications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(applicationData),
  });

  return response.json();
};
```

### 5.2 Axios Example

```javascript
import axios from 'axios';

// Configure base URL
const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  createAdmin: (adminData) => api.post('/users/admin', adminData),
};

export const applicationsAPI = {
  getUserApplications: () => api.get('/applications'),
  submitApplication: (data) => api.post('/applications', data),
  getAllApplications: () => api.get('/admin/applications'),
};
```

---

## 6. Testing

### 6.1 Using Postman/Insomnia

1. **Register a user:**

   ```
   POST http://localhost:3000/auth/register
   Body: {"email": "test@example.com", "password": "password123"}
   ```

2. **Login:**

   ```
   POST http://localhost:3000/auth/login
   Body: {"email": "test@example.com", "password": "password123"}
   ```

3. **Submit application (with token):**
   ```
   POST http://localhost:3000/applications
   Headers: Authorization: Bearer <token_from_login>
   Body: {
     "firstName": "John",
     "lastName": "Doe",
     "passportNumber": "AB1234567",
     "nationality": "United States",
     "visaType": "Tourist",
     "purposeOfVisit": "Vacation",
     "intendedArrivalDate": "2024-06-15",
     "intendedDepartureDate": "2024-06-30"
   }
   ```

### 6.2 Using curl

```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Get applications (with token)
curl -X GET http://localhost:3000/applications \
  -H "Authorization: Bearer <your_token_here>"
```

---

## 7. Notes for Frontend Team

1. **Token Management**: Store JWT tokens securely (localStorage/sessionStorage for development, httpOnly cookies for production).

2. **Error Handling**: Always handle API errors gracefully and show user-friendly messages.

3. **Loading States**: Implement loading states for all API calls.

4. **Validation**: Client-side validation should match server-side validation rules.

5. **Date Format**: Send dates as ISO 8601 strings (YYYY-MM-DD) for application dates.

6. **Role-based UI**: Show/hide features based on user role (user vs admin).

7. **CORS**: The API has CORS enabled for development.

8. **Pagination**: Currently not implemented - all applications are returned at once.

9. **File Uploads**: Not implemented - only text data is supported.

10. **Real-time Updates**: Not implemented - polling or WebSocket would be needed for real-time status updates.
