# Student Management RESTful API

A RESTful API and web application for managing student information.

## Technologies
- Node.js
- TypeScript
- Hono
- PostgreSQL
- HTML
- CSS
- JavaScript
- Railway

## Student Information
- First Name
- Last Name
- Student ID
- Birth Date
- Gender

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/v1/students | Get all students |
| GET | /api/v1/students/:id | Get student by ID |
| POST | /api/v1/students | Create student |
| PUT | /api/v1/students/:id | Update student |
| DELETE | /api/v1/students/:id | Delete student |

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_postgresql_connection_string
PORT=3000
```

## Run Development Server

```bash
npm run dev
```

## Features
- Create student
- View student information
- Update student information
- Delete student information
- Display total, male, and female student counts
