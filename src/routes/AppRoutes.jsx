import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import ProtectedRoute from "./ProtectedRoute";
import UserLayout from "../components/layouts/UserLayout";
import RegistrarLayout from "../components/layouts/RegistrarLayout";

/* Public */
import Main   from "../components/Main";
import Signin  from "../components/Signin";
import Signup from "../components/Signup";

/* User */
import UserDashboard   from "../pages/user/UserDashboard";
import MyProperties    from "../pages/user/MyProperties";
import Transfers       from "../pages/user/Transfers";
import MyMutations     from "../pages/user/MyMutations";
import FileMutation    from "../pages/user/FileMutation";
import MyDisputes      from "../pages/user/MyDisputes";
import FileDispute     from "../pages/user/FileDispute";
import Account         from "../pages/user/Account";
import ChangePassword  from "../pages/user/ChangePassword";



/* Registrar */
import RegistrarDashboard from "../pages/registrar/RegistrarDashboard";
import ApprovalsQueue     from "../pages/registrar/ApprovalsQueue";
import TransferReview     from "../pages/registrar/TransferReview";
import DisputeManagement  from "../pages/registrar/DisputeManagement";
import MutationReview     from "../pages/registrar/MutationReview";
import AuditLog           from "../pages/registrar/AuditLog";
import RegistrarAccount   from "../pages/registrar/Account";
import RegistrarChangePassword from "../pages/registrar/ChangePassword";

export default function AppRoutes() {
  const { user, logout } = useAuth();
  const userDash = user?.role?.toLowerCase() === "registrar" ? "/registrar/dashboard" : "/user/dashboard";

  return (
    <>
      <Header user={user} onLogout={logout} />
      <Routes>
        <Route path="/"        element={<Main />} />
        <Route path="/signin"   element={user ? <Navigate to={userDash} replace /> : <Signin />} />
        <Route path="/signup"  element={user ? <Navigate to="/user/dashboard" replace /> : <Signup />} />

        <Route element={<ProtectedRoute role="user"><UserLayout /></ProtectedRoute>}>
          <Route path="/user/dashboard"       element={<UserDashboard />} />
          <Route path="/user/properties"     element={<MyProperties />} />
          <Route path="/user/transfers"      element={<Transfers />} />
          <Route path="/user/my-mutations"    element={<MyMutations />} />
          <Route path="/user/file-mutation"   element={<FileMutation />} />
          <Route path="/user/my-disputes"    element={<MyDisputes />} />
          <Route path="/user/file-dispute"  element={<FileDispute />} />
          <Route path="/user/account"         element={<Account />} />
          <Route path="/user/change-password" element={<ChangePassword />} />
        </Route>

        <Route element={<ProtectedRoute role="registrar"><RegistrarLayout /></ProtectedRoute>}>
          <Route path="/registrar/dashboard"  element={<RegistrarDashboard />} />
          <Route path="/registrar/approvals"  element={<ApprovalsQueue />} />
          <Route path="/registrar/review"     element={<TransferReview />} />
          <Route path="/registrar/review/:id" element={<TransferReview />} />
          <Route path="/registrar/disputes"   element={<DisputeManagement />} />
          <Route path="/registrar/mutations"  element={<MutationReview />} />
          <Route path="/registrar/audit"      element={<AuditLog />} />
          <Route path="/registrar/account"    element={<RegistrarAccount />} />
          <Route path="/registrar/change-password" element={<RegistrarChangePassword />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

    </>

  );

}

