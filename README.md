# BhoomiSetu 🏡 — Unified Land Record Management System

BhoomiSetu is a state-of-the-art, secure, and responsive full-stack land record management system. It digitizes property registries, mutation requests (succession, survey correction, partition, name change), land transfers, and legal dispute tracking, offering transparent tools for both citizens and registry officials.

---

## 👨‍💻 Developer
* **Developer:** **Haneesh Yadav**
* **GitHub Profile:** [@haneesh-yadav](https://github.com/haneesh-yadav)
* **Project Repository:** [haneesh-yadav/bhoomiSetu](https://github.com/haneesh-yadav/bhoomiSetu)

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 19, React Router 7, Axios | Premium UI built with DM Sans and Poppins typography, fully responsive hamburger menus, and state-of-the-art dashboard interfaces. |
| **Backend** | Spring Boot 3, Spring Security, JWT | Secured REST APIs using JWT tokens, stateless filters, and structured DTO mapping. |
| **Database** | TiDB Serverless (Cloud MySQL) | Serverless MySQL-compatible cloud database for scalable persistent records. |
| **Hosting** | Vercel (Frontend) + Render (Backend) | Dockerized backend microservice deployed on Render and frontend SPA routing deployed on Vercel. |

---

## ✨ Key Features

### 👤 Citizen (User) Portal
* **Dashboard Widgets**: View active properties, pending mutation applications, and ongoing disputes.
* **Property Ownership**: Check registered properties, view event timeline audits, and initiate transfers.
* **Mutation Submissions**: Digitally apply for land record updates:
  * *Inheritance/Succession*: Automatic record transfer to heirs.
  * *Survey Corrections*: Adjust survey boundaries.
  * *Partitions & Name Changes*: Direct revenue account corrections.
* **Legal Disputes**: File boundary, fraudulent registry, or ownership disputes and track investigation remarks.

### 🏛️ Registrar (Officer) Portal
* **Approvals Queue**: Process pending land transfers with deep audit trails.
* **Mutation & Dispute Reviews**: Approve or reject citizen requests with custom remarks.
* **Audit Trail**: Real-time logging of property lifecycle changes, including block hashes, seller/buyer history, and official approval logs.

---

## 🗂️ Project Structure

```
bhoomisetu/
├── src/              ← React frontend
├── backend/          ← Spring Boot backend (REST API, Security, JPA)
├── public/           ← Static frontend assets (illustrations, logos)
└── vercel.json       ← Vercel Single Page App (SPA) routing configuration
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- Java 17+
- MySQL 8+ (or TiDB local connection)
- Maven

### 1. MySQL Setup
Create a local database named `bhoomi_setu` in MySQL Workbench or via CLI:
```sql
CREATE DATABASE bhoomi_setu;
```

If you have a SQL backup file (`bhoomi_setu_backup.sql`), you can restore it using:
```bash
mysql -u root -p bhoomi_setu < bhoomi_setu_backup.sql
```

### 2. Backend Setup
```bash
cd backend

# Copy the example config and fill in your credentials
cp src/main/resources/application.properties.example src/main/resources/application.properties

# Edit application.properties with your MySQL/TiDB username and password

# Run the backend
./mvnw spring-boot:run
```
Backend will start at `http://localhost:8080`

### 3. Frontend Setup
```bash
# In the root directory (bhoomisetu/)
cp .env.example .env.local

# .env.local is pre-configured for localhost — no changes needed for local dev

npm install
npm start
```
Frontend will start at `http://localhost:3000`

---

## 🌐 Production Deployment

### Frontend (Vercel)
1. Import repository on Vercel.
2. Build Command: `npm run build`
3. Output Directory: `build`
4. Add Environment Variable in Vercel dashboard:
   - `REACT_APP_API_URL` = Your backend URL (e.g. `https://bhoomisetu-backend.onrender.com/api`)

### Backend (Render / Railway / Docker)
Deploy the `/backend` folder using the provided Docker settings or Spring boot runner. Set these environment variables:
- `DB_URL` = cloud JDBC URL (e.g., `jdbc:mysql://<host>:<port>/<db>?sslMode=VERIFY_IDENTITY`)
- `DB_USERNAME` = Database user
- `DB_PASSWORD` = Database password
- `JWT_SECRET` = Random signing key
- `PORT` = 8080

---

## 🔑 Environment Variables

| Variable | Scope | Description |
|---|---|---|
| `REACT_APP_API_URL` | Frontend (`.env.local` / Vercel) | Backend API base URL |
| `DB_URL` | Backend (`application.properties` / Cloud) | Database connection string |
| `DB_USERNAME` | Backend | Database username |
| `DB_PASSWORD` | Backend | Database password |
| `JWT_SECRET` | Backend | JWT token signature secret |