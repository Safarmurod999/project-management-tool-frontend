# 📡 API Documentation

Backend API bilan integratsiya hujjati.

## 📋 Mundarija

- [API Base URL](#api-base-url)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [Error Handling](#error-handling)
- [Request/Response Examples](#requestresponse-examples)

## API Base URL

```env
# Development
VITE_API_URL=http://localhost:3000/api

# Production
VITE_API_URL=https://api.yourdomain.com/api
```

## Authentication

### Token-based Authentication

Barcha protected endpointlar JWT token talab qiladi.

#### Login

```typescript
POST /auth/login

Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "admin"
  }
}
```

#### Token Refresh

```typescript
POST /auth/refresh

Request:
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Logout

```typescript
POST /auth/logout
Authorization: Bearer {access_token}

Response:
{
  "message": "Successfully logged out"
}
```

#### Get Profile

```typescript
GET /auth/profile
Authorization: Bearer {access_token}

Response:
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "admin",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Endpoints

### Projects

#### Get All Projects

```typescript
GET /projects
Authorization: Bearer {access_token}

Query Parameters:
- page: number (default: 1)
- limit: number (default: 10)
- search: string
- sortBy: string (name | createdAt | updatedAt)
- sortOrder: string (asc | desc)

Response:
{
  "data": [
    {
      "id": "project_id",
      "name": "Project Name",
      "description": "Project description",
      "status": "active",
      "owner": {
        "id": "user_id",
        "name": "Owner Name"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

#### Get Project by ID

```typescript
GET /projects/:id
Authorization: Bearer {access_token}

Response:
{
  "id": "project_id",
  "name": "Project Name",
  "description": "Project description",
  "status": "active",
  "owner": {
    "id": "user_id",
    "name": "Owner Name",
    "email": "owner@example.com"
  },
  "members": [
    {
      "id": "user_id",
      "name": "Member Name",
      "role": "developer"
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Create Project

```typescript
POST /projects
Authorization: Bearer {access_token}

Request:
{
  "name": "New Project",
  "description": "Project description",
  "status": "active"
}

Response:
{
  "id": "project_id",
  "name": "New Project",
  "description": "Project description",
  "status": "active",
  "owner": {
    "id": "user_id",
    "name": "Owner Name"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Update Project

```typescript
PATCH /projects/:id
Authorization: Bearer {access_token}

Request:
{
  "name": "Updated Project Name",
  "description": "Updated description",
  "status": "completed"
}

Response:
{
  "id": "project_id",
  "name": "Updated Project Name",
  "description": "Updated description",
  "status": "completed",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Delete Project

```typescript
DELETE /projects/:id
Authorization: Bearer {access_token}

Response:
{
  "message": "Project deleted successfully"
}
```

### Tasks

#### Get Tasks

```typescript
GET /tasks
Authorization: Bearer {access_token}

Query Parameters:
- projectId: string
- assigneeId: string
- status: string (todo | in_progress | done)
- priority: string (low | medium | high)

Response:
{
  "data": [
    {
      "id": "task_id",
      "title": "Task title",
      "description": "Task description",
      "status": "todo",
      "priority": "high",
      "assignee": {
        "id": "user_id",
        "name": "Assignee Name"
      },
      "project": {
        "id": "project_id",
        "name": "Project Name"
      },
      "dueDate": "2024-12-31T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Create Task

```typescript
POST /tasks
Authorization: Bearer {access_token}

Request:
{
  "title": "New Task",
  "description": "Task description",
  "projectId": "project_id",
  "assigneeId": "user_id",
  "priority": "high",
  "status": "todo",
  "dueDate": "2024-12-31T00:00:00.000Z"
}

Response:
{
  "id": "task_id",
  "title": "New Task",
  "description": "Task description",
  "status": "todo",
  "priority": "high",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Users

#### Get Users

```typescript
GET /users
Authorization: Bearer {access_token}

Query Parameters:
- search: string
- role: string

Response:
{
  "data": [
    {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "developer",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Error Handling

### Error Response Format

```typescript
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request",
  "details": [] // Optional: validation errors
}
```

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Token invalid yoki mavjud emas |
| 403 | Forbidden - Ruxsat yo'q |
| 404 | Not Found - Resurs topilmadi |
| 409 | Conflict - Data conflict |
| 500 | Internal Server Error |

### Frontend Error Handling

```typescript
// src/shared/api/client.ts - Automatic error handling

try {
  const response = await apiClient.get('/projects');
  return response.data;
} catch (error) {
  if (axios.isAxiosError(error)) {
    // 401 - Automatic token refresh
    // 403 - Forbidden
    // 404 - Not found
    // 500 - Server error
    
    notifications.show({
      title: 'Xatolik',
      message: error.response?.data?.message || 'Nimadadir xatolik yuz berdi',
      color: 'red',
    });
  }
  throw error;
}
```

## Request/Response Examples

### Using in Components

```typescript
// GET Request with React Query
import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '@/shared/api';

export function ProjectList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;

  return <div>{/* render projects */}</div>;
}
```

```typescript
// POST Request with Mutation
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '@/shared/api';

export function CreateProjectForm() {
  const queryClient = useQueryClient();
  
  const { mutate, isPending } = useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      notifications.show({
        title: 'Muvaffaqiyatli',
        message: 'Project yaratildi',
        color: 'green',
      });
    },
  });

  const handleSubmit = (values: CreateProjectDto) => {
    mutate(values);
  };

  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```

### Creating New API Module

```typescript
// src/shared/api/projects.ts
import { apiClient } from './client';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
}

export interface CreateProjectDto {
  name: string;
  description: string;
  status?: string;
}

export const projectsApi = {
  getAll: async () => {
    const response = await apiClient.get<{ data: Project[] }>('/projects');
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Project>(`/projects/${id}`);
    return response.data;
  },

  create: async (data: CreateProjectDto) => {
    const response = await apiClient.post<Project>('/projects', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateProjectDto>) => {
    const response = await apiClient.patch<Project>(`/projects/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/projects/${id}`);
  },
};
```

### Export in API Index

```typescript
// src/shared/api/index.ts
export { apiClient } from './client';
export { authApi } from './auth';
export { projectsApi } from './projects';
export { tasksApi } from './tasks';
export { usersApi } from './users';
```

## Pagination

```typescript
// Query with pagination
const { data } = useQuery({
  queryKey: ['projects', page, limit],
  queryFn: () => projectsApi.getAll({ page, limit }),
});

// Backend response
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

## Filtering & Sorting

```typescript
// API method with filters
const getProjects = async (params: {
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  const response = await apiClient.get('/projects', { params });
  return response.data;
};

// Usage
const { data } = useQuery({
  queryKey: ['projects', filters],
  queryFn: () => projectsApi.getAll(filters),
});
```

---

**Backend API hujjati:** [Backend repository link]

**API versiyasi:** v1

**Last updated:** February 7, 2026
