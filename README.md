# 💬 Real-Time Chat Application

A complete backend for a real-time chat system built with **Spring Boot**, **WebSocket**, **STOMP**, **SockJS**, and **MongoDB**.  
This project enables multi-user chat with persistent message storage and real-time delivery using WebSocket communication.

---

## 🚀 Features
- 🔌 **Real-time messaging** using WebSocket with STOMP protocol and SockJS fallback
- 🏠 **Chat rooms**: Create and join multiple chat rooms
- 💾 **MongoDB persistence** for storing users, messages, and rooms
- 📡 **REST APIs** for room creation, message history, and user management
- ⚡ **Message broadcasting** to all subscribed users
- 🛠️ Scalable, modular, and clean architecture for easy maintainability

---

## 🛠️ Tech Stack
- **Backend**: Spring Boot (Java)
- **WebSocket**: STOMP over WebSocket with SockJS fallback
- **Database**: MongoDB
- **Build Tool**: Maven
- **Testing**: Postman / REST clients

---

## ⚙️ Setup & Run Locally

### Prerequisites
- [Java 17+](https://adoptium.net/)
- [Maven](https://maven.apache.org/)
- [MongoDB](https://www.mongodb.com/)

### Steps
```bash
# Clone the repository
git clone https://github.com/NA-VNEET/chat-room.git
cd chat-room

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
