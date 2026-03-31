import { Link } from 'react-router-dom';
import { restaurantInfo } from '../data/menuData';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3 className="footer-logo">J Rodgers</h3>
            <p className="footer-tagline">BBQ & Soul Food</p>
            <p className="footer-welcome">"Welcome Home"</p>
            <div className="footer-social">
              <a href={restaurantInfo.socialMedia.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href={restaurantInfo.socialMedia.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <nav className="footer-nav">
              <Link to="/">Home</Link>
              <Link to="/menu">Menu</Link>
              <Link to="/order">Order Online</Link>
              <Link to="/catering">Catering</Link>
              <Link to="/gallery">Gallery</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/privacy">Privacy Policy</Link>
            </nav>
          </div>

          <div className="footer-section">
            <h4>Hours</h4>
            <ul className="footer-hours">
              <li><span>Mon - Tue:</span> <span>Closed</span></li>
              <li><span>Wed - Sat:</span> <span>10AM - 9PM</span></li>
              <li><span>Sunday:</span> <span>11AM - 5PM</span></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <address className="footer-contact">
              <p>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {restaurantInfo.address}<br />
                {restaurantInfo.city}, {restaurantInfo.state} {restaurantInfo.zip}
              </p>
              <p>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <a href={`tel:${restaurantInfo.phone.replace(/[^0-9]/g, '')}`}>
                  {restaurantInfo.phone}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} J Rodgers BBQ & Soul Food. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
