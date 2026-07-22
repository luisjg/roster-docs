---
title: Dashboard API
description: Core dashboard functionality for the Class Roster Web App.
---

## 1. Overview
This document outlines the core dashboard functionality for the Class Roster Web App. The current scope focuses exclusively on roster management and attendance tracking without authentication/login flows. The architecture is a decoupled client-server model where the frontend communicates with the backend via HTTP requests, and the backend responds with JSON payloads.

:::tip[Architectural Decision]
This API adopts the proposed HTTP `QUERY` method (IETF draft) for fetching records. This allows the frontend to send complex pagination, sorting, and filtering parameters within a request body while maintaining the safe and idempotent semantics of a read operation.
:::

## 2. Supported Features
*   Retrieve student records with pagination.
*   Add a new student to the roster.
*   Delete a student from the roster.
*   Update daily attendance (Mark as Present, Absent, or Tardy).

---

## 3. Data Models

### 3.1 Student Object
```json
{
  "id": "stu_12345",
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane.doe@example.com",
  "enrollment_date": "2026-08-15T00:00:00Z",
  "status": "active"
}
```

### 3.2 Attendance Record Object
```json
{
  "student_id": "stu_12345",
  "date": "2026-07-21",
  "status": "present" 
}
```
*(Valid status values: `"present"`, `"absent"`, `"tardy"`, or `"excused"`)*

---

## 4. API Endpoints Specification

### 4.1 Retrieve Roster Records
Fetches a list of students for the dashboard view.

*   **Method:** `QUERY`
*   **Path:** `/api/v1/roster`
*   **Description:** Utilizes the HTTP `QUERY` verb to safely pass complex filter and pagination parameters in the request body rather than relying on a long query string in a `GET` request.

**Request Body:**
```json
{
  "pagination": {
    "page": 1,
    "limit": 25
  },
  "sort": {
    "field": "last_name",
    "order": "asc"
  },
  "filters": {
    "status": "active"
  }
}
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "stu_12345",
      "first_name": "Jane",
      "last_name": "Doe",
      "status": "active"
    }
  ],
  "meta": {
    "total_records": 104,
    "current_page": 1,
    "total_pages": 5
  }
}
```

### 4.2 Add a Student
Adds a new student to the class roster.

*   **Method:** `POST`
*   **Path:** `/api/v1/roster`

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "email": "john.smith@example.com"
}
```

**Response (201 Created):**
```json
{
  "message": "Student successfully added.",
  "data": {
    "id": "stu_67890",
    "first_name": "John",
    "last_name": "Smith",
    "email": "john.smith@example.com",
    "status": "active"
  }
}
```

### 4.3 Update Student Attendance
Marks a student's attendance for a specific date.

*   **Method:** `PATCH`
*   **Path:** `/api/v1/roster/{student_id}/attendance`

**Request Body:**
```json
{
  "date": "2026-07-21",
  "status": "tardy" 
}
```

**Response (200 OK):**
```json
{
  "message": "Attendance updated successfully.",
  "data": {
    "student_id": "stu_12345",
    "date": "2026-07-21",
    "status": "tardy"
  }
}
```

### 4.4 Delete a Student
Removes a student from the active class roster.

*   **Method:** `DELETE`
*   **Path:** `/api/v1/roster/{student_id}`

**Request Body:** *None*

**Response (204 No Content):** 
*(Empty body, indicates successful deletion)*

---

## 5. Error Handling

The backend returns standard HTTP status codes for errors, along with a JSON body explaining the issue.

:::note[Common Status Codes]
*   **`400 Bad Request`:** Missing or invalid fields in the request body.
*   **`404 Not Found`:** The specified `student_id` does not exist.
*   **`405 Method Not Allowed`:** Usually if `QUERY` is not yet supported by an intermediary proxy.
*   **`500 Internal Server Error`:** Unexpected backend issues.
:::

**Standard Error Response Format:**
```json
{
  "error": {
    "code": "INVALID_ATTENDANCE_STATUS",
    "message": "Status must be 'present', 'absent', or 'tardy'."
  }
}
```
