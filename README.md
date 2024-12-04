# 🚀 Backend - Buddy Challenge

Backend service for the [App Buddy Challenge](https://github.com/aaoeclipse/app-buddy-challenge-native) mobile application. Built with modern technologies to provide a robust and scalable API.

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **Framework**: [Elysia](https://elysiajs.com)
- **ORM**: [Prisma](https://www.prisma.io)
- **Database**: MySQL

## 🔗 API Endpoints

### User Management

```http
POST /login              # User authentication
POST /create-user        # Register new user
GET  /get-user          # Get current user details
GET  /get-user-by-id    # Get specific user details
GET  /logout            # User logout
```

### Friend System

```http
POST /send-friend-request # Send a friend request
POST /accept-reject-friend # Accept or reject friend request
GET /get-friend-requests # List pending friend requests
GET /get-friends # List all friends
```

### Challenge System

```http
POST /new-challenge # Create a new challenge
POST /invite-to-challenge # Invite users to a challenge
GET /get-all-challenges # List all challenges
```

## 🚀 Getting Started

Clone the repository

```bash
git clone https://github.com/aaoeclipse/new-buddy-challenge-api
cd be-buddy-challenge
```

Install dependencies

```bash
bun install
```

Set up environment variables

```bash
cp .env.example .env
```

## 📚 Documentation

### Authentication

All endpoints except `/login` and `/user` require authentication via JWT token.

#### SingUp

```http
POST /user
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Login

````http
```http
POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
````

### 🤝 Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request
