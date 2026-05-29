import { Outlet } from "react-router-dom";

/**
 * RegistrarLayout — wraps all /registrar/* routes.
 * Same logic as UserLayout — pages already offset 60px for Header.
 * This only adds 50px for the registrar navbar height.
 */
export default function RegistrarLayout() {
  return (
    <>
      <div style={{ paddingTop: "0px" }}>
        <Outlet />
      </div>
    </>
  );
}