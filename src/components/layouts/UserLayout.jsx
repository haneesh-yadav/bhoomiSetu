import { useAuth } from "../../context/AuthContext";
import Navbar1 from "../Navbar1";
import { Outlet } from "react-router-dom";

/**
 * UserLayout — wraps all /user/* routes.
 *
 * Header  = fixed, 60px  (rendered globally in AppRoutes)
 * Navbar1 = fixed, top: 60px, height: 52px
 *
 * Pages already have padding-top: 60px for the Header.
 * UserLayout adds another 52px so content clears the Navbar too.
 * Total visual offset from top of viewport = 112px ✓
 */
export default function UserLayout() {
  const { user, logout } = useAuth();

  return (
    <>
      <Navbar1 user={user} onLogout={logout} />
      <div style={{ paddingTop: "52px" }}>
        <Outlet />
      </div>
    </>
  );
}