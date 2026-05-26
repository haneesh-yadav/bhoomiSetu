# BhoomiSetu 🏡

A full-stack land record management system built with React and Spring Boot.

---

## 🗂️ Project Structure

```
bhoomisetu/
├── src/              ← React frontend
├── backend/          ← Spring Boot backend
├── public/
└── vercel.json       ← Vercel SPA routing config
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- Java 17+
- MySQL 8+
- Maven

### 1. MySQL Setup
Create a database named `bhoomi_setu` in MySQL Workbench or via CLI:
```sql
CREATE DATABASE bhoomi_setu;
```

### 2. Backend Setup
```bash
cd backend

# Copy the example config and fill in your credentials
cp src/main/resources/application.properties.example src/main/resources/application.properties

# Edit application.properties with your MySQL username/password

# Run the backend
./mvnw spring-boot:run
```
Backend will start at `http://localhost:8080`

### 3. Frontend Setup
```bash
# In the root directory
cp .env.example .env.local

# .env.local is pre-configured for localhost — no changes needed for local dev

npm install
npm start
```
Frontend will start at `http://localhost:3000`

---

## 🌐 Production Deployment

### Frontend → Vercel
1. Connect this GitHub repo to Vercel
2. Set the **Build Command** to: `npm run build`
3. Set the **Output Directory** to: `build`
4. Add Environment Variable in Vercel dashboard:
   - `REACT_APP_API_URL` = your deployed backend URL (e.g. `https://your-backend.up.railway.app/api`)

### Backend → Railway / Render / Heroku
Deploy the `/backend` folder as a Spring Boot app. Set these environment variables on your hosting platform:
- `DB_URL` = your cloud MySQL JDBC URL
- `DB_USERNAME` = your DB user
- `DB_PASSWORD` = your DB password
- `JWT_SECRET` = a long random secret string
- `PORT` = 8080

---

## 🔑 Environment Variables

| Variable | Where | Description |
|---|---|---|
| `REACT_APP_API_URL` | Vercel / `.env.local` | Backend API base URL |
| `DB_URL` | Backend hosting | MySQL JDBC connection string |
| `DB_USERNAME` | Backend hosting | MySQL username |
| `DB_PASSWORD` | Backend hosting | MySQL password |
| `JWT_SECRET` | Backend hosting | JWT signing secret |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 7, Axios |
| Backend | Spring Boot 3, Spring Security, JWT |
| Database | MySQL 8 (JPA/Hibernate) |
| Hosting | Vercel (frontend) + Railway (backend) |