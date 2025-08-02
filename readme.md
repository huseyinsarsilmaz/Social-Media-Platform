# 🐦 Social Media Platform

A **full-stack social media platform** inspired by **Twitter** — built with a **Spring Boot microservices** backend and a **Next.js + MUI** frontend. Designed with scalability and modularity in mind, the platform supports a rich set of features including authentication, user interaction, infinite scrolling, and more.

> 🚧 **Currently under active development**

## 🛠️ Tech Stack

**Backend:**

- Java + Spring Boot (Microservices)
- Spring Cloud Gateway, Eureka (Service Discovery)
- Redis (Caching)
- PostgreSQL (Database)
- Docker & Docker Compose
- JWT (Authentication)

**Frontend:**

- Next.js (React)
- MUI (Material UI)

## ✅ Features

### 🔐 Authentication & Authorization

- ✅ User registration & login via API Gateway
- ✅ JWT-based session management
- 🔜 Role-based access control

### 📝 Posts

- ✅ Create, update, and delete posts
- ✅ Post listing per user
- ✅ Feed with infinite scrolling
- 🔜 Post search & filtering
- 🔜 Media (image/video) upload
- 🔜 Hashtags & mentions

### 👥 User Profiles

- ✅ View own and others' profiles
- ✅ Profile image & info update
- ✅ Display posts on profile page
- ✅ Follow/unfollow users
- ✅ Show followers/following list

### ❤️ Interactions

- 🔜 Like posts
- 🔜 Comment on posts
- 🔜 Repost/quote functionality

### 💬 Messaging

- 🔜 Real-time direct messaging with WebSockets

### 🔔 Notifications

- 🔜 Notifications for likes, comments, follows, messages

### 🧠 Architecture

- ✅ API Gateway with routing & auth handling
- ✅ Microservices communicating over REST
- ✅ Redis caching for performance
- ✅ Docker Compose setup for local dev
- 🔜 Rate limiting & service monitoring

## 📦 Local Development

```bash
# Start all services using Docker Compose
docker-compose up --build
```
