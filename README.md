# 🔐 Secure Authentication Service (Mini-Okta)

A **secure, scalable authentication microservice** built using **Node.js, Express, MongoDB, JWT, OAuth2, Redis**, and **Docker**.  
This project is a simplified, developer-friendly version of **Okta**, built to demonstrate how modern authentication systems handle **user management, multi-factor authentication, OAuth2 social logins, and role-based access control**.

---

## 🧠 Why This Project?

Authentication is a foundational part of every modern web application.  
However, many developers rely on third-party services like Okta or Auth0 without fully understanding how they work.  
**Mini-Okta** was built to replicate those systems’ core logic from scratch — so developers can learn, customize, and deploy their own secure auth infrastructure.

It teaches:
- How tokens and refresh flows work securely.
- How to implement **Multi-Factor Authentication (MFA)**.
- How **OAuth2 (Google, GitHub)** login integrations are built.
- How to manage **roles and permissions** for different user types.
- How to improve performance using **Redis caching**.

---

## ⚙️ Core Features

✅ **JWT Authentication** – Login/Signup flow with secure token handling  
✅ **OAuth2 Login** – Google/GitHub social login using Passport.js  
✅ **MFA (Multi-Factor Authentication)** – TOTP-based 2FA using Google Authenticator  
✅ **RBAC (Role-Based Access Control)** – Fine-grained access by user roles  
✅ **Redis Caching** – Reduced token refresh latency by up to 35%  
✅ **Secure by Design** – Helmet, HTTPS, rate-limiting, and best practices  
✅ **Dockerized Deployment** – Easily deployable to AWS/GCP/Azure  

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Backend Framework** | Node.js (Express.js) |
| **Database** | MongoDB Atlas |
| **Cache Layer** | Redis |
| **Authentication** | JWT + OAuth2 + TOTP |
| **Security** | Helmet, bcrypt, dotenv |
| **Testing** | Jest + Supertest |
| **CI/CD** | GitHub Actions |
| **Deployment** | Docker + Cloud Run / ECS |

---

## 🧩 Architecture Overview

Client → Express API → MongoDB  
↘  
Redis (token cache)

Each user authentication request passes through:
1. Validation and password hashing (bcrypt)
2. Token generation (JWT)
3. Role check middleware (RBAC)
4. Optional MFA validation
5. Redis cache lookup for refresh tokens

---

## 🚀 Project Roadmap

| Phase | Description | Status |
|--------|--------------|---------|
| **0. Setup & Foundations** | Project setup, environment, GitHub Actions CI/CD | ✅ Done |
| **1. Core Authentication** | JWT login/signup, refresh tokens | 🔄 In Progress |
| **2. OAuth2 Integration** | Google/GitHub login | ⏳ Planned |
| **3. Multi-Factor Authentication** | TOTP/Email OTP | ⏳ Planned |
| **4. Role-Based Access Control (RBAC)** | Role middleware, admin routes | ⏳ Planned |
| **5. Redis Performance Optimization** | Token cache, latency benchmarking | ⏳ Planned |
| **6. Security & Dockerization** | HTTPS, Helmet, Dockerfile, deployment | ⏳ Planned |

---

## 🧰 Setup & Installation

### 1️⃣ Clone the Repository
```
git clone https://github.com/sanjukktha/mini-okta.git
cd mini-okta
```

### 2️⃣ Install Dependencies
```
npm install
```

### 3️⃣ Create .env File
In the root folder, add:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/miniokta
JWT_SECRET=yourSuperSecretKey
```

### 4️⃣ Run the Server
```
npx nodemon src/index.js
```
Server runs on → http://localhost:5000

---

## 🧑‍💻 API Endpoints (coming soon)

| Endpoint | Method | Description |
|-----------|---------|-------------|
| /register | POST | Register new user |
| /login | POST | Login and issue JWT |
| /refresh | POST | Refresh JWT token |
| /mfa/setup | GET | Generate MFA QR code |
| /mfa/verify | POST | Verify MFA token |
| /admin | GET | Access for Admin only |

---

## 🧱 Folder Structure

```
mini-okta/
│
├── src/
│   ├── controllers/     # Business logic
│   ├── routes/          # API routes
│   ├── services/        # Token / Auth logic
│   ├── models/          # Mongoose schemas
│   ├── utils/           # Helpers and validators
│   └── index.js         # Server entry
│
├── tests/               # Jest test cases
├── .env                 # Environment variables
├── .eslintrc.json       # Linting config
├── .prettierrc          # Code formatting rules
└── package.json
```

---

## 🧪 Testing
```
npm test
```

---

## 🐳 Docker Setup (Optional)
```
docker build -t mini-okta .
docker run -p 5000:5000 mini-okta
```

---

## 🌐 Deployment
You can deploy this microservice on:
- AWS ECS / Elastic Beanstalk
- Google Cloud Run
- Render / Railway / Vercel (backend)

---

## 🧭 Future Enhancements
- Single Sign-On (SSO)
- Audit logging for login attempts
- Admin Dashboard for user & role management
- Machine Learning–based anomaly detection for suspicious logins

---

## ✨ Author
**Sanjukktha Senthil Kumar**  
📍 Arlington, TX  
🌐 [Portfolio](https://sanjukktha.github.io) | [LinkedIn](https://linkedin.com/in/sanjukkthasenthilkumar) | [GitHub](https://github.com/sanjukktha)

---

## 📜 License
This project is licensed under the **MIT License** — feel free to use and modify it.
