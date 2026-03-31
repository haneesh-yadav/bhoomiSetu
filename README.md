# 🏛 BhoomiSetu

> **Blockchain-Ready Land Registry Platform for India**
> Transparent. Tamper-Proof. Built for every citizen.

---

## Overview

BhoomiSetu digitizes India's land registry system — every ownership transfer, mutation, and inheritance is recorded on a tamper-proof, time-stamped ledger. The platform serves two user roles: **Citizens** (property owners) and **Registrars** (government officials), each with a dedicated dashboard and workflow.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React (Create React App) |
| Routing | React Router v6 |
| Styling | CSS-in-JSX (no external CSS framework) |
| Icons | Material Icons Sharp |
| Fonts | Poppins · Bricolage Grotesque · DM Mono |
| Data | Mock data (ready for API integration) |
| Auth | React Context API + localStorage |

---

## Project Structure

```
src/
├── components/
│   ├── Header.jsx           
│   ├── Navbar1.jsx          
│   ├── Navbar2.jsx          
│   ├── Login.jsx            
│   ├── Main.jsx             
│   └── Signup.jsx           
│
├── context/
│   └── AuthContext.jsx      
│
├── database/
│   ├── Users.js             
│   ├── Properties.js        
│   └── Transfers.js         
│
├── pages/
│   ├── user/
│   │   ├── UserDashboard.jsx
│   │   ├── MyProperties.jsx
│   │   ├── PropertyDetail.jsx
│   │   ├── InitiateTransfer.jsx
│   │   ├── TransferStatus.jsx
│   │   ├── MutationRequest.jsx
│   │   ├── Disputes.jsx
│   │   └── Certificates.jsx
│   │
│   └── registrar/
│       ├── RegistrarDashboard.jsx
│       ├── ApprovalsQueue.jsx
│       ├── TransferReview.jsx
│       ├── DisputeManagement.jsx
│       ├── MutationReview.jsx
│       └── AuditLog.jsx
│
└── routes/
    ├── AppRoutes.jsx        # All route definitions
    └── ProtectedRoute.jsx   # Role-based route guard
```

---

## Getting Started

### Prerequisites
- Node.js ≥ 16
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/bhoomisetu.git
cd bhoomisetu

# Install dependencies
npm install

# Start development server
npm start
```

The app will run at `http://localhost:3000`.

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Citizen | `haneesh@bhoomi.in` | `24BCE2609` |
| Registrar | `modi@bhoomi.in` | `modi` |

> **Note:** Registrar accounts are admin-created and cannot be self-registered.

---

## Features

### Citizen Dashboard
- View and manage all registered properties
- Initiate ownership transfers (multi-step: seller → buyer → registrar)
- Track transfer status in real time (outgoing + incoming)
- Submit mutation / inheritance requests
- File dispute reports against suspicious records
- Download verified property certificates
- Blockchain status panel with cryptographic hashes

### Registrar Dashboard
- Approvals queue with priority-based sorting
- Full transfer review — document checklist, party verification, decision recording
- Dispute management — investigate, resolve, or dismiss
- Mutation review — approve, query, or reject
- Immutable audit log of all registrar actions

---

## Design System

| Token | Value |
|---|---|
| Background | `#EFEFEB` |
| Primary (Dark Green) | `#0D3D2B` |
| Citizen Accent | `#F07060` (coral) |
| Registrar Accent | `#5B4FD4` (purple) |
| Lime Highlight | `#C8F135` |
| Mint | `#2EC4A0` |
| Card Shadow | `5px 5px 0 #0D3D2B` |
| Outline Weight | `2.5px` |

**Fonts**
- Dashboard pages → `Poppins`
- Landing / Auth pages → `Bricolage Grotesque`
- IDs, hashes, mono values → `DM Mono`

---

## Architecture Notes

- **Privacy-first:** All property data is login-gated. No public property search.
- **Role separation:** Citizen and Registrar have completely separate route trees, dashboards, and navigation components.
- **Registrar provisioning:** Registrar accounts are not self-service — they are admin-injected into the mock data. This mirrors real government workflows.
- **Blockchain-ready:** Every record carries a cryptographic hash field. The UI is fully wired for blockchain integration — only the contract calls need to be added.
- **Mock → API:** All data lives in `database/`. Replace the mock functions with `fetch`/`axios` calls to wire up a real backend without touching any page component.

---

## Roadmap

- [ ] Real backend API integration (springboot)
- [ ] Blockchain smart contract integration (Ethereum / Hyperledger)
- [ ] Aadhaar-based identity verification
- [ ] Multi-language support (Hindi, punjabi, gujrati)
- [ ] Admin panel for registrar account management
- [ ] PDF certificate generation

---

## License

This project is built for educational and demonstration purposes.

---

*Built with ❤️ for transparent land governance in India.*