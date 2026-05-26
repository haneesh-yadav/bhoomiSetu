import { useAuth } from "../../context/AuthContext";
import RegistrarNavbar from "../Navbar2"; // swap for your actual registrar navbar
import { Outlet } from "react-router-dom";

/**
 * RegistrarLayout — wraps all /registrar/* routes.
 * Same logic as UserLayout — pages already offset 60px for Header.
 * This only adds 50px for the registrar navbar height.
 */
export default function RegistrarLayout() {
  const { user, logout } = useAuth();

  return (
    <>
      <RegistrarNavbar user={user} onLogout={logout} />
      <div style={{ paddingTop: "50px" }}>
        <Outlet />
      </div>
    </>
  );
}