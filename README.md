# Todo App

A full-stack todo list application with user authentication, multiple todo lists, and per-todo status/priority tracking.

Built with **Node.js, Express, MongoDB** on the backend and **React (Vite) + Tailwind CSS** on the frontend.

## Features

- User registration & login with JWT (access + refresh tokens)
- Create, rename, and delete todo lists
- Create, edit, complete, and delete todos within a list
- Filter todos by status (pending / in-progress / completed)
- Priority levels (low / medium / high) with visual indicators
- Update profile details and change password

## Tech Stack

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- bcrypt for password hashing

**Frontend**
- React 18 + Vite
- React Router
- Axios
- Tailwind CSS

## Project Structure

```
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── app.js
│   └── index.js
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── context/
    │   ├── layout/
    │   ├── pages/
    │   ├── App.jsx
    │   └── main.jsx
    └── index.html
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend root:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
CROSS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
```

Run the server:

```bash
npm run dev
```

Server will start on `http://localhost:4000`.

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:4000/api/v1
```

Run the dev server:

```bash
npm run dev
```

App will be available at `http://localhost:5173`.

## API Overview

### Auth (`/api/v1/users`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Create a new account |
| POST | `/login` | Log in and receive tokens |
| POST | `/logout` | Log out (requires auth) |
| GET | `/currentUser` | Get logged-in user (requires auth) |
| PATCH | `/update` | Update name/email (requires auth) |
| POST | `/updatepassword` | Change password (requires auth) |

### Todo Lists (`/api/v1/todos`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/createTodolist` | Create a new list |
| GET | `/getUserlist/:userId` | Get all lists for a user |
| GET | `/getlistById/:todoListId` | Get a single list |
| PATCH | `/updatetodoList/:todoListId` | Rename/update a list |
| DELETE | `/deletetodoList/:todoListId` | Delete a list |

### Todos (`/api/v1/todo`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/createTodo/:todolistId` | Add a todo to a list |
| GET | `/getTodoByTodolist/:todolistId` | Get all todos in a list |
| GET | `/gettodo/:todoId` | Get a single todo |
| PATCH | `/updateTodo/:todoId` | Update a todo |
| DELETE | `/deleteTodo/:todoId` | Delete a todo |

All routes except register/login require a valid access token, sent either as an `AccessToken` cookie or an `Authorization: Bearer <token>` header.

## License

MIT
