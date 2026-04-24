import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import './Specials.css';

const specials = [
  {
    id: 'pulled-pork-combo',
    badge: 'Limited Time',
    title: 'Pulled Pork Combo Special — Free Sandwich',
    description: 'Order our Pulled Pork Sandwich Combo (sandwich + 2 sides + tea) and we\'ll throw in a second Pulled Pork Sandwich on the house. Slow-smoked all day, piled high on a toasted bun.',
    cta: { text: 'Order Now', to: '/order' },
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12H4" /><path d="M20 6H4" /><path d="M20 18H4" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    )
  },
  {
    id: 'bogo-pulled-pork-pound',
    badge: 'Limited Time',
    title: 'BOGO — Pound of Pulled Pork',
    description: 'Buy one full pound of our slow-smoked Evans pulled pork, get a second pound free. Feeds the whole table and then some.',
    cta: { text: 'Order Now', to: '/order' },
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v10M8 12h8" />
      </svg>
    )
  },
  {
    id: 'kids-pulled-pork-wed',
    badge: 'Wednesdays 2-6 PM',
    title: 'Kids Eat — $1.99 Pulled Pork Sandwich',
    description: 'Bring the kids in on Wednesday between 2 and 6 PM and they eat a Pulled Pork Sandwich for just $1.99. One per child, dine-in only.',
    schedule: 'Available Wednesdays, 2 PM – 6 PM • Dine-In Only',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="4" />
        <path d="M5 22v-4a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v4" />
      </svg>
    )
  },
  {
    id: 'college-lunch-discount',
    badge: 'Weekdays — Lunch',
    title: 'College Students — 10% Off Lunch',
    description: 'Show your valid college ID at the counter on weekdays during lunch (10 AM – 2 PM) and take 10% off your order. Not valid Saturday or Sunday.',
    schedule: 'Mon–Fri, 10 AM – 2 PM • Valid College ID Required',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10L12 4 2 10l10 6 10-6z" />
        <path d="M6 12v5a6 6 0 0 0 12 0v-5" />
      </svg>
    )
  },
  {
    id: 'highschool-lunch-discount',
    badge: 'Weekdays — Lunch',
    title: 'Local High Schoolers — 10% Off Lunch',
    description: 'Saraland-area high school students get 10% off lunch with a valid student ID. Mon–Fri during lunch hours only. Show your ID at the counter.',
    schedule: 'Mon–Fri, 10 AM – 2 PM • Valid Student ID Required',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    )
  },
  {
    id: 'knuckle-ends',
    badge: 'Wed & Thu Only',
    title: '25% Off Knuckle Ends',
    description: 'Every Wednesday and Thursday, get 25% off our tender, smoky knuckle ends. Slow-smoked until they fall apart with a caramelized bark that keeps people coming back for more.',
    schedule: 'Available Wednesdays & Thursdays',
    cta: { text: 'Order Now', to: '/order' },
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    )
  },
  {
    id: 'delivery-announcement',
    badge: 'New',
    title: 'Now Delivering on Mondays & Tuesdays',
    description: 'Can\'t make it to Saraland? We\'re now available on DoorDash, Grubhub, and Uber Eats every Monday and Tuesday. Get J Rodgers BBQ & Soul Food delivered straight to your door.',
    schedule: 'Available Mondays & Tuesdays via delivery apps',
    platforms: ['DoorDash', 'Grubhub', 'Uber Eats'],
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    )
  }
];

function Specials() {
  usePageTitle('Specials & Deals');

  return (
    <div className="specials">
      <section className="specials-hero">
        <div className="container">
          <h1>Specials & Deals</h1>
          <p>Check back often for our latest promotions, weekly specials, and limited-time offers.</p>
        </div>
      </section>

      <section className="section specials-list-section">
        <div className="container">
          <div className="specials-grid">
            {specials.map((special) => (
              <div key={special.id} className="special-card">
                <div className="special-card__icon">{special.icon}</div>
                <span className="special-card__badge">{special.badge}</span>
                <h2 className="special-card__title">{special.title}</h2>
                <p className="special-card__description">{special.description}</p>
                {special.schedule && (
                  <p className="special-card__schedule">{special.schedule}</p>
                )}
                {special.platforms && (
                  <div className="special-card__platforms">
                    {special.platforms.map((p) => (
                      <span key={p} className="special-card__platform">{p}</span>
                    ))}
                  </div>
                )}
                {special.cta && (
                  <Link to={special.cta.to} className="btn btn-primary">
                    {special.cta.text}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="specials-cta-section">
        <div className="container">
          <h2>Don't Miss Out</h2>
          <p>Our specials change regularly. Follow us on social media or check back here to stay in the loop on new deals and limited-time offers.</p>
          <Link to="/menu" className="btn btn-primary btn-lg">
            View Full Menu
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Specials;
