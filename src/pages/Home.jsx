import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import MenuCard from '../components/MenuCard';
import { featuredItems, restaurantInfo } from '../data/menuData';
import usePageTitle from '../hooks/usePageTitle';
import './Home.css';

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
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop"
                alt="Soul food spread"
              />
            </div>
            <div className="about-content">
              <h2>Our Story</h2>
              <p>
                At J Rodgers BBQ & Soul Food, we believe in the power of good food
                to bring people together. For years, we've been serving up authentic
                Southern soul food and slow-smoked BBQ that reminds you of home.
              </p>
              <p>
                Every dish is prepared with love using time-honored recipes passed
                down through generations. From our mouth-watering ribs to our famous
                Yo-Jo Beans, each bite tells a story of tradition, family, and the
                rich culture of Southern cooking.
              </p>
              <p className="about-highlight">
                When you walk through our doors, you're not just a customer &mdash;
                you're family. Welcome home.
              </p>
              <Link to="/menu" className="btn btn-primary">
                Explore Our Menu
              </Link>
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

      {/* Hours & Info Section */}
      <section className="section info-section">
        <div className="container">
          <div className="info-grid">
            <div className="info-card hours-card">
              <h3>Hours of Operation</h3>
              <ul className="hours-list">
                <li>
                  <span>Monday - Tuesday</span>
                  <span>Closed*</span>
                </li>
                <li>
                  <span>Wednesday</span>
                  <span>12PM - 9PM</span>
                </li>
                <li>
                  <span>Thursday</span>
                  <span>12PM - 9PM</span>
                </li>
                <li>
                  <span>Friday</span>
                  <span>12PM - 9PM</span>
                </li>
                <li>
                  <span>Saturday</span>
                  <span>12PM - 9PM</span>
                </li>
                <li>
                  <span>Sunday</span>
                  <span>12PM - 9PM</span>
                </li>
              </ul>
              <p className="hours-note">*DoorDash delivery available Mon-Tue</p>
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
