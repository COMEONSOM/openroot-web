import { useCallback, useEffect, useState } from "react";
import "../openrootClasses/OCStyle/OCHeader.css";
import logo from "../../assets-oc/openroot-white-nobg.png";

const HeaderNavbar = (): React.JSX.Element => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSectionJump = useCallback((sectionId: string): void => {
    try {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "auto" });
      } else {
        console.warn(`⚠️ Section with ID "${sectionId}" not found.`);
      }
    } catch (error) {
      console.error("❌ NAVIGATION ERROR:", (error as Error).message);
    } finally {
      setMenuOpen(false);
    }
  }, []);

  const handleHome = useCallback((): void => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    if (menuOpen) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header-navbar-wrapper">
      <div className="topbar">
        <div className="company-info">
          <img src={logo} alt="Company Logo" className="company-logo" />
          <span id="classes" className="brand-tag">
            #classes
          </span>
        </div>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <div className="nav-buttons">
            <button className="nav-button" onClick={handleHome}>
              Home
            </button>

            <button
              className="nav-button"
              onClick={() => handleSectionJump("available-courses")}
            >
              Courses
            </button>

            <button
              className="nav-button"
              onClick={() => handleSectionJump("free-content")}
            >
              Free Contents
            </button>

            <button
              className="nav-button"
              onClick={() => handleSectionJump("study-material")}
            >
              Study Material
            </button>
          </div>
        </nav>

        <button
          type="button"
          className="hamburger-btn"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-modal"
          onClick={() => setMenuOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {menuOpen && (
        <div
          className="mobile-menu-overlay"
          role="presentation"
          onClick={closeMenu}
        >
          <div
            id="mobile-nav-modal"
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-menu-header">
              <span className="mobile-menu-title">Navigation</span>
              <button
                type="button"
                className="mobile-close-btn"
                aria-label="Close menu"
                onClick={closeMenu}
              >
                ×
              </button>
            </div>

            <div className="mobile-menu-links">
              <button className="mobile-menu-link" onClick={handleHome}>
                Home
              </button>

              <button
                className="mobile-menu-link"
                onClick={() => handleSectionJump("available-courses")}
              >
                Courses
              </button>

              <button
                className="mobile-menu-link"
                onClick={() => handleSectionJump("free-content")}
              >
                Free Contents
              </button>

              <button
                className="mobile-menu-link"
                onClick={() => handleSectionJump("study-material")}
              >
                Study Material
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderNavbar;