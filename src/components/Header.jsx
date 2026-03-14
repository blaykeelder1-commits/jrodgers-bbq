import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Header.css';

const announcements = [
  'Welcome Home — Authentic BBQ & Soul Food',
  'Open Wed-Sat 10AM-9PM, Sun 11AM-5PM | Order Online & Skip the Wait!',
  'Now Accepting Online Orders for Pickup',
  'Catering Available — Let Us Feed Your Next Event!'
];

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [dismissed, setDismissed] = useState(() => {
    return sessionStorage.getItem('jrodgers-banner-dismissed') === 'true';
  });

  useEffect(() => {
    if (dismissed) return;
    let timeoutId;
    const interval = setInterval(() => {
      setAnnouncementVisible(false);
      timeoutId = setTimeout(() => {
        setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
        setAnnouncementVisible(true);
      }, 400);
    }, 5000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, [dismissed]);

  const dismissBanner = () => {
    setDismissed(true);
    sessionStorage.setItem('jrodgers-banner-dismissed', 'true');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          <span className="logo-text">J Rodgers</span>
          <span className="logo-tagline">BBQ & Soul Food</span>
        </Link>

        <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
          <NavLink
            to="/"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={closeMobileMenu}
          >
            Home
          </NavLink>
          <NavLink
            to="/menu"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={closeMobileMenu}
          >
            Menu
          </NavLink>
          <NavLink
            to="/order"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={closeMobileMenu}
          >
            Order Online
          </NavLink>
          <NavLink
            to="/catering"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={closeMobileMenu}
          >
            Catering
          </NavLink>
          <NavLink
            to="/gallery"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={closeMobileMenu}
          >
            Gallery
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={closeMobileMenu}
          >
            Contact
          </NavLink>
        </nav>

        <div className="header-actions">
          <Link to="/order" className="cart-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>

          <button
            className={`mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {!dismissed && (
        <div className="announcement-bar">
          <span className={`announcement-text ${announcementVisible ? 'visible' : ''}`}>
            {announcements[announcementIndex]}
          </span>
          <button className="announcement-dismiss" onClick={dismissBanner} aria-label="Dismiss">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
