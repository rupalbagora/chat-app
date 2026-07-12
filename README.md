# 💬 Real-Time Chat Application

A full-stack real-time chat application built with **React**, **Node.js**, **Express**, **Socket.io**, and **MongoDB**. The application enables users to exchange messages instantly, view previous conversations, and receive real-time updates without refreshing the page.

---

# 🚀 Features

### Authentication

* User registration
* User login using JWT authentication
* Protected routes
* Dummy username-based authentication

### Real-Time Messaging

* Send messages instantly
* Receive messages in real time using Socket.io
* Automatic message broadcasting
* Graceful handling of user connections and disconnections

### Chat

* One-to-one chat
* Persistent chat history
* Message timestamps
* Automatic scrolling to the latest message

### Bonus Features

* Typing indicator
* Online/Offline user status
* Message delivery status
* Message seen/read status

---

# 🛠 Tech Stack

## Frontend

* React
* Vite
* Axios
* React Context API
* Socket.io Client

## Backend

* Node.js
* Express.js
* Socket.io
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt

---

# 📁 Project Structure

```
chat-app/
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── utils/
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── constants/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── sockets/
│   │   ├── utils/
│   │   └── validators/
│   │
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

# ⚙️ Prerequisites

Before running the project, make sure you have installed:

* Node.js (v18 or later)
* npm
* MongoDB (Local or MongoDB Atlas)
* Git

---

# 🔧 Environment Variables

## Backend (`server/.env`)

```
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173
```

---

## Frontend (`client/.env`)

```
VITE_API_URL=http://localhost:5000/api

VITE_SOCKET_URL=http://localhost:5000
```

---

# ▶️ Installation

## Clone Repository

```bash
git clone https://github.com/rupalbagora/chat-app.git

cd chat-app
```

---

## Install Backend

```bash
cd server

npm install
```

---

## Install Frontend

```bash
cd ../client

npm install
```

---

# ▶️ Run the Application

## Start Backend

```bash
cd server

npm run dev
```

Backend runs at

```
http://localhost:5000
```

---

## Start Frontend

```bash
cd client

npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---

# 📡 REST APIs

## Authentication

| Method | Endpoint             | Description        |
| ------ | -------------------- | ------------------ |
| POST   | `/api/auth/register` | Register user      |
| POST   | `/api/auth/login`    | Login user         |
| GET    | `/api/auth/profile`  | Get logged-in user |

---

## Users

| Method | Endpoint         | Description      |
| ------ | ---------------- | ---------------- |
| GET    | `/api/users`     | Get all users    |
| GET    | `/api/users/:id` | Get user profile |

---

## Messages

| Method | Endpoint                | Description                |
| ------ | ----------------------- | -------------------------- |
| POST   | `/api/messages`         | Send message               |
| GET    | `/api/messages/:userId` | Fetch conversation history |

---

# ⚡ Socket.io Events

### Client → Server

* `join`
* `sendMessage`
* `typing`
* `stopTyping`
* `messageSeen`

### Server → Client

* `messageReceived`
* `typing`
* `stopTyping`
* `messageDelivered`
* `messageSeen`
* `userOnline`
* `userOffline`

---

# 🗄 Database

MongoDB is used to store:

* Users
* Messages
* Message timestamps
* Read status
* Delivery status

Messages remain available even after refreshing the application.

---

# 🏗 Architecture

The backend follows a layered architecture:

```
Routes
    ↓
Controllers
    ↓
Services
    ↓
Repositories
    ↓
MongoDB
```

Benefits:

* Clean code
* Separation of concerns
* Reusable business logic
* Easier testing and maintenance

---

# ❗ Error Handling

The application includes:

* Global error handling middleware
* JWT authentication middleware
* Request validation
* Socket error handling
* Proper HTTP status codes
* Consistent API responses

---

# 📌 Design Decisions

* React Context API is used for global authentication and socket state.
* Socket.io is used for real-time communication instead of polling.
* MongoDB stores all chat history for persistence.
* JWT provides secure user authentication.
* Repository pattern separates database operations from business logic.
* Modular folder structure improves scalability and maintainability.

---

# 📝 Assumptions

* Every registered user has a unique username.
* Users communicate through one-to-one chats.
* Authentication is required before accessing chat features.
* MongoDB is available locally or through MongoDB Atlas.
* Socket connection is established after successful login.

---

# 🚀 Deployment

## Frontend

Deploy on:

* Vercel

## Backend

Deploy on:

* Render

---

# 👨‍💻 Author

**Rupal Bagora**

GitHub: https://github.com/rupalbagora
