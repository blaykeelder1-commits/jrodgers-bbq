import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import MenuCard from '../components/MenuCard';
import { featuredItems, restaurantInfo } from '../data/menuData';
import usePageTitle from '../hooks/usePageTitle';
import './Home.css';

const reviews = [
  {
    text: "Best BBQ in the Mobile area, hands down. The ribs fall right off the bone and those Yo-Jo Beans are addictive!",
    author: "Marcus T."
  },
  {
    text: "We had J Rodgers cater our family reunion and everyone is STILL talking about it. The pulled pork was incredible.",
    author: "Denise W."
  },
  {
    text: "This is real soul food. Reminds me of my grandmother's cooking. The banana pudding alone is worth the drive.",
    author: "James R."
  },
  {
    text: "Order online every week for Friday dinner. Fast, easy, and the food is always hot and fresh when we pick up.",
    author: "Crystal M."
  }
];

function Home() {
  usePageTitle(null);

  return (
    <div className="home">
      <Hero />

      {/* About Section */}
      <section className="section about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-image">
              <img
                src="/images/menu/combo-dinner.jpg"
                alt="J Rodgers BBQ combo dinner plate"
              />
            </div>
            <div className="about-content">
              <h2>Our Story</h2>
              <p>
                J Rodgers BBQ &amp; Soul Food has been serving Saraland, Alabama
                with authentic, slow-smoked BBQ and soul food that keeps families
                coming back. Every rack of ribs is smoked low and slow, every side
                is made from scratch, and every plate is served with pride.
              </p>
              <p>
                From our signature Yo-Jo Beans to our fall-off-the-bone ribs, we
                put love into every dish. Whether you're grabbing a quick lunch
                special, feeding the whole family, or planning your next big
                event &mdash; we've got you covered.
              </p>
              <p className="about-highlight">
                Located at 1444 Industrial Parkway in Saraland. Come hungry, leave happy.
              </p>
              <Link to="/menu" className="btn btn-primary">
                Explore Our Menu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gumbo Feature Section */}
      <section className="section gumbo-feature-section">
        <div className="container">
          <div className="gumbo-feature-grid">
            <div className="gumbo-feature-content">
              <span className="gumbo-feature-badge">New on the Menu</span>
              <h2>30 Years in the Making</h2>
              <p>
                Our gumbo is more than a dish &mdash; it's a legacy. Perfected over
                three decades, this recipe brings together baby crab legs, smoked
                turkey necks, tender chicken, and savory sausage, all simmered
                in a beautifully dark roux and served with a generous side of rice.
              </p>
              <p>
                Four premium proteins and seafood in every bowl. This isn't your
                average gumbo &mdash; it's the one your taste buds have been
                waiting for.
              </p>
              <div className="gumbo-feature-pricing">
                <span className="gumbo-price-item">Small $6.99</span>
                <span className="gumbo-price-divider">|</span>
                <span className="gumbo-price-item">Medium $10.99</span>
                <span className="gumbo-price-divider">|</span>
                <span className="gumbo-price-item">Large $19.99</span>
              </div>
              <Link to="/menu#gumbo" className="btn btn-primary">
                Order Gumbo Now
              </Link>
            </div>
            <div className="gumbo-feature-image">
              <img
                src="https://images.unsplash.com/photo-1708790303870-452d9f872d1f?w=800&h=600&fit=crop"
                alt="J Rodgers famous gumbo with crab legs, smoked turkey necks, chicken and sausage"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="section featured-section">
        <div className="container">
          <h2 className="section-title">Fan Favorites</h2>
          <div className="featured-grid">
            {featuredItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
          <div className="featured-cta">
            <Link to="/menu" className="btn btn-outline">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="section reviews-section">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="reviews-grid">
            {reviews.map((review, index) => (
              <div key={index} className="review-card">
                <div className="review-stars">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="var(--color-gold)" stroke="var(--color-gold)" strokeWidth="1">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="review-text">"{review.text}"</p>
                <p className="review-author">— {review.author}</p>
              </div>
            ))}
          </div>
          <div className="reviews-cta">
            <a
              href="https://www.google.com/maps/place/J+Rodgers+BBQ+%26+Soul+Food/"
              target="_blank"
              rel="noopener noreferrer"
              className="reviews-link"
            >
              See more reviews on Google
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Hours & Info Section */}
      <section className="section info-section">
        <div className="container">
          <div className="info-grid">
            <div className="info-card hours-card">
              <h3>Hours of Operation</h3>
              <ul className="hours-list">
                <li>
                  <span>Monday - Tuesday</span>
                  <span>Closed</span>
                </li>
                <li>
                  <span>Wednesday - Saturday</span>
                  <span>10AM - 9PM</span>
                </li>
                <li>
                  <span>Sunday</span>
                  <span>11AM - 5PM</span>
                </li>
              </ul>
            </div>

            <div className="info-card location-card">
              <h3>Find Us</h3>
              <address>
                <p>
                  <strong>{restaurantInfo.address}</strong><br />
                  {restaurantInfo.city}, {restaurantInfo.state} {restaurantInfo.zip}
                </p>
                <p>
                  <a href={`tel:${restaurantInfo.phone.replace(/[^0-9]/g, '')}`}>
                    {restaurantInfo.phone}
                  </a>
                </p>
              </address>
              <Link to="/contact" className="btn btn-outline">
                Get Directions
              </Link>
            </div>

            <div className="info-card order-card">
              <h3>Ready to Order?</h3>
              <p>
                Skip the wait! Order online for pickup or to-go and have your
                favorite soul food ready when you arrive.
              </p>
              <Link to="/order" className="btn btn-primary btn-lg">
                Order Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Hosting an Event?</h2>
          <p>
            Let us cater your next gathering with our delicious BBQ and soul food.
            From family reunions to corporate events, we've got you covered.
          </p>
          <Link to="/catering" className="btn btn-primary btn-lg">
            Catering Services
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
