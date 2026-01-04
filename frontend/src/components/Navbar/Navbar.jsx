// src/components/Navbar/Navbar.jsx - UPGRADED v2.0

import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useCallback, useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  const handleNavClick = useCallback(
    (path) => {
      navigate(path);
      setIsMobileOpen(false);
    },
    [navigate]
  );

  // Scroll effect for subtle style change
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const navLinkClass = ({ isActive }) =>
    `nav-link ${isActive ? "active" : ""}`;

  const showMainNav = isAuthenticated;

  return (
    <header className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-inner">
        {/* LEFT: Logo / Brand */}
        <div
          className="navbar-left"
          onClick={() => handleNavClick(showMainNav ? "/games" : "/")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleNavClick(showMainNav ? "/games" : "/");
            }
          }}
        >
          <span className="navbar-logo">🎰</span>
          <span className="navbar-title">Casino</span>
        </div>

        {/* MOBILE TOGGLE */}
        {showMainNav && (
          <button
            className={`navbar-toggle ${isMobileOpen ? "open" : ""}`}
            onClick={() => setIsMobileOpen((prev) => !prev)}
            aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        )}

        {/* CENTER: Main Nav (desktop) */}
        {showMainNav && (
          <nav className="navbar-center">
            <NavLink to="/games" className={navLinkClass} end>
              Games
            </NavLink>
            <NavLink to="/favorites" className={navLinkClass}>
              Favorites
            </NavLink>
          </nav>
        )}

        {/* RIGHT: Auth / User */}
        <div className="navbar-right">
          {isAuthenticated ? (
            <>
              <span className="navbar-user">
                Hi,&nbsp;
                <strong>{user?.name || "Player"}</strong>
              </span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button
              className="login-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* MOBILE NAV MENU */}
      {showMainNav && (
        <nav className={`navbar-mobile ${isMobileOpen ? "open" : ""}`}>
          <NavLink
            to="/games"
            className={navLinkClass}
            onClick={() => setIsMobileOpen(false)}
            end
          >
            Games
          </NavLink>
          <NavLink
            to="/favorites"
            className={navLinkClass}
            onClick={() => setIsMobileOpen(false)}
          >
            Favorites
          </NavLink>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
