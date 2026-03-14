import { useState } from 'react';
import { restaurantInfo } from '../data/menuData';
import usePageTitle from '../hooks/usePageTitle';
import './Catering.css';

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || '9aa7860e-308f-4a26-90c7-21983d2c07e0';

function Catering() {
  usePageTitle('Catering Services');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    guestCount: '',
    eventType: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Catering Inquiry from ${formData.name}`,
          from_name: formData.name,
          ...formData
        })
      });

      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError('Something went wrong. Please try again or call us directly.');
      }
    } catch {
      setError('Unable to send inquiry. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cateringPackages = [
    {
      name: 'BBQ Essentials',
      description: 'Perfect for small gatherings',
      serves: '10-20 guests',
      includes: [
        'Choice of 2 meats',
        '2 large sides',
        'Bread',
        'Sauce & pickles'
      ],
      price: 'Starting at $12/person'
    },
    {
      name: 'Soul Food Spread',
      description: 'Our most popular package',
      serves: '20-50 guests',
      includes: [
        'Choice of 3 meats',
        '3 large sides',
        'Bread & butter',
        'Dessert option',
        'Sweet tea'
      ],
      price: 'Starting at $18/person'
    },
    {
      name: 'Welcome Home Feast',
      description: 'The full J Rodgers experience',
      serves: '50+ guests',
      includes: [
        'All meats available',
        '4 large sides',
        'Bread & cornbread',
        'Dessert selection',
        'Drinks included',
        'Setup & serving staff'
      ],
      price: 'Starting at $25/person'
    }
  ];

  return (
    <div className="catering-page">
      <div className="catering-header">
        <div className="container">
          <h1>Catering Services</h1>
          <p>Let us bring the soul food experience to your next event</p>
        </div>
      </div>

      <div className="catering-content">
        <div className="container">
          {/* Introduction */}
          <section className="catering-intro">
            <h2>Events Made Delicious</h2>
            <p>
              From family reunions to corporate events, graduation parties to
              wedding receptions, J Rodgers BBQ & Soul Food brings the taste of
              home to any occasion. Our catering team will work with you to create
              a custom menu that fits your needs and budget.
            </p>
          </section>

          {/* Packages */}
          <section className="catering-packages">
            <h2 className="section-title">Catering Packages</h2>
            <div className="packages-grid">
              {cateringPackages.map((pkg, index) => (
                <div key={index} className="package-card">
                  <h3>{pkg.name}</h3>
                  <p className="package-description">{pkg.description}</p>
                  <p className="package-serves">{pkg.serves}</p>
                  <ul className="package-includes">
                    {pkg.includes.map((item, i) => (
                      <li key={i}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="package-price">{pkg.price}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Inquiry Form */}
          <section className="catering-form-section">
            <div className="form-grid">
              <div className="form-info">
                <h2>Get a Quote</h2>
                <p>
                  Tell us about your event and we'll get back to you within
                  24 hours with a custom quote.
                </p>
                <div className="contact-info">
                  <h3>Prefer to call?</h3>
                  <a href={`tel:${restaurantInfo.phone.replace(/[^0-9]/g, '')}`} className="phone-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    {restaurantInfo.phone}
                  </a>
                  <p className="form-note">
                    Ask for our catering coordinator
                  </p>
                </div>
              </div>

              <div className="form-container">
                {submitted ? (
                  <div className="form-success">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <h3>Thank You!</h3>
                    <p>We've received your inquiry and will be in touch within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="catering-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name">Your Name *</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="phone">Phone Number *</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="eventDate">Event Date *</label>
                        <input
                          type="date"
                          id="eventDate"
                          name="eventDate"
                          value={formData.eventDate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="guestCount">Number of Guests *</label>
                        <input
                          type="number"
                          id="guestCount"
                          name="guestCount"
                          value={formData.guestCount}
                          onChange={handleChange}
                          min="10"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="eventType">Event Type *</label>
                      <select
                        id="eventType"
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select event type</option>
                        <option value="Corporate Event">Corporate Event</option>
                        <option value="Wedding/Reception">Wedding/Reception</option>
                        <option value="Birthday Party">Birthday Party</option>
                        <option value="Family Reunion">Family Reunion</option>
                        <option value="Graduation">Graduation</option>
                        <option value="Funeral/Memorial">Funeral/Memorial</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">Additional Details</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Tell us more about your event, dietary requirements, or specific menu requests..."
                      ></textarea>
                    </div>

                    {error && <p className="form-error">{error}</p>}

                    <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Catering;
