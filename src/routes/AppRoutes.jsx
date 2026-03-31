import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import ProtectedRoute from "./ProtectedRoute";

/* Public */
import Main           from "../components/Main";
import Login          from "../components/Login";
import Signup         from "../components/Signup";

/* User */
import UserDashboard    from "../pages/user/UserDashboard";
import PropertyDetail   from "../pages/user/PropertyDetail";
import MyProperties     from "../pages/user/MyProperties";
import InitiateTransfer from "../pages/user/InitiateTransfer";
import TransferStatus   from "../pages/user/TransferStatus";
import MutationRequest  from "../pages/user/MutationRequest";
import Disputes         from "../pages/user/Disputes";
import Certificates     from "../pages/user/Certificates";

/* Registrar */
import RegistrarDashboard from "../pages/registrar/RegistrarDashboard";
import ApprovalsQueue     from "../pages/registrar/ApprovalsQueue";
import TransferReview     from "../pages/registrar/TransferReview";
import DisputeManagement  from "../pages/registrar/DisputeManagement";
import MutationReview     from "../pages/registrar/MutationReview";
import AuditLog           from "../pages/registrar/AuditLog";

export default function AppRoutes() {
  const { user, logout } = useAuth();
  const userDash = user?.role === "registrar" ? "/registrar/dashboard" : "/user/dashboard";

  return (
    <>
      <Header user={user} onLogout={logout} />

      <Routes>

        {/* ── Public ── */}
        <Route path="/"             element={<Main />} />
        <Route path="/login"        element={user ? <Navigate to={userDash} replace /> : <Login />} />
        <Route path="/signup"       element={user ? <Navigate to="/user/dashboard" replace /> : <Signup />} />
        <Route path="/property/:id" element={<PropertyDetail />} />

        {/* User*/}
        <Route path="/user/dashboard"       element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
        <Route path="/user/properties"      element={<ProtectedRoute role="user"><MyProperties /></ProtectedRoute>} />
        <Route path="/user/transfer"        element={<ProtectedRoute role="user"><InitiateTransfer /></ProtectedRoute>} />
        <Route path="/user/transfer-status" element={<ProtectedRoute role="user"><TransferStatus /></ProtectedRoute>} />
        <Route path="/user/mutation"        element={<ProtectedRoute role="user"><MutationRequest /></ProtectedRoute>} />
        <Route path="/user/disputes"        element={<ProtectedRoute role="user"><Disputes /></ProtectedRoute>} />
        <Route path="/user/certificates"    element={<ProtectedRoute role="user"><Certificates /></ProtectedRoute>} />

        {/* Registrar */}
        <Route path="/registrar/dashboard" element={<ProtectedRoute role="registrar"><RegistrarDashboard /></ProtectedRoute>} />
        <Route path="/registrar/approvals" element={<ProtectedRoute role="registrar"><ApprovalsQueue /></ProtectedRoute>} />
        <Route path="/registrar/review"    element={<ProtectedRoute role="registrar"><TransferReview /></ProtectedRoute>} />
        <Route path="/registrar/review/:id"element={<ProtectedRoute role="registrar"><TransferReview /></ProtectedRoute>} />
        <Route path="/registrar/disputes"  element={<ProtectedRoute role="registrar"><DisputeManagement /></ProtectedRoute>} />
        <Route path="/registrar/mutations" element={<ProtectedRoute role="registrar"><MutationReview /></ProtectedRoute>} />
        <Route path="/registrar/audit"     element={<ProtectedRoute role="registrar"><AuditLog /></ProtectedRoute>} />

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </>
  );
}
