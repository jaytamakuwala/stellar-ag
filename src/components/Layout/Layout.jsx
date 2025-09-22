import { Outlet, NavLink } from "react-router-dom";
import logoImg from "@/assets/Images/logo-dark.png";
import "./Layout.css";

const Layout = () => {
  return (
    <div className="home-container">
      <header className="header">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active-link" : undefined)}
        >
          <img src={logoImg} alt="Logo" className="logo" />
        </NavLink>

        <nav className="nav-links">
          <NavLink
            to="/feature"
            className={({ isActive }) => (isActive ? "active-link" : undefined)}
          >
            Feature
          </NavLink>
          <NavLink
            to="/pricing"
            className={({ isActive }) => (isActive ? "active-link" : undefined)}
          >
            Pricing
          </NavLink>
        </nav>

        <div className="header-buttons">
          <NavLink
            to="/pricing"
            className={({ isActive }) => (isActive ? "active-link" : undefined)}
          >
            <button className="home-btn home-btn-gradient">Start Trial</button>
          </NavLink>
          <NavLink
            to="/signin"
            className={({ isActive }) => (isActive ? "active-link" : undefined)}
          >
            <button className="home-btn home-btn-yellow">Login</button>
          </NavLink>{" "}
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
