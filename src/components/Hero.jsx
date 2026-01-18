import { Link } from 'react-router-dom';
import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">Welcome Home</h1>
        <p className="hero-subtitle">
          Experience authentic Southern soul food &amp; BBQ made with love,
          just like mama used to make
        </p>
        <div className="hero-buttons">
          <Link to="/order" className="btn btn-primary btn-lg">
            Order Now
          </Link>
          <Link to="/menu" className="btn btn-outline btn-lg hero-outline-btn">
            View Menu
          </Link>
        </div>
      </div>
      <div className="hero-scroll-indicator">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
      </div>
    </section>
  );
}

export default Hero;
