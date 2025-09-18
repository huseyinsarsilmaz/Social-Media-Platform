# 🐦 Social Media Platform

A **full-stack social media platform** inspired by **Twitter** — built with a **Spring Boot microservices** backend and a **Next.js + MUI** frontend.

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

- User registration & login via API Gateway
- JWT-based session management

### 📝 Posts

- Create, update, and delete posts
- List posts per user

### 📄 Feed

- Aggregates data from User and Post services

### 👥 User Profiles

- View own and others' profiles
- Update profile info and profile image
- Display posts on profile page

### 🧠 Architecture

- API Gateway with routing & authentication
- Microservices communicating over REST
- Redis caching for performance
- Docker Compose setup for local development

## 📦 Local Development

```bash
docker-compose up --build
```
