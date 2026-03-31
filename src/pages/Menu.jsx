import { useState, useEffect } from 'react';
import MenuCard from '../components/MenuCard';
import { menuCategories } from '../data/menuData';
import usePageTitle from '../hooks/usePageTitle';
import './Menu.css';

function isWithinTimeRange(timeRestricted) {
  if (!timeRestricted) return true;
  const now = new Date();
  const hour = now.getHours();
  return hour >= timeRestricted.start && hour < timeRestricted.end;
}

function Menu() {
  usePageTitle('Menu');
  const [expandedCategory, setExpandedCategory] = useState(menuCategories[0].id);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && menuCategories.find(c => c.id === hash)) {
      setExpandedCategory(hash);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleCategory = (categoryId) => {
    const isExpanding = expandedCategory !== categoryId;
    setExpandedCategory(isExpanding ? categoryId : null);

    if (isExpanding) {
      setTimeout(() => {
        const element = document.getElementById(categoryId);
        if (element) {
          const headerOffset = 150;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 50);
    }
  };

  return (
    <div className="menu-page">
      <div className="menu-header">
        <div className="container">
          <h1>Our Menu</h1>
          <p>Authentic Southern soul food & BBQ made with love</p>
        </div>
      </div>

      <nav className="menu-nav">
        <div className="menu-nav-container">
          {menuCategories.map((category) => (
            <button
              key={category.id}
              className={`menu-nav-btn ${expandedCategory === category.id ? 'active' : ''}`}
              onClick={() => toggleCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </nav>

      <div className="menu-content">
        <div className="container">
          {menuCategories.map((category) => {
            const categoryUnavailable = category.timeRestricted && !isWithinTimeRange(category.timeRestricted);
            const isExpanded = expandedCategory === category.id;
            return (
              <section
                key={category.id}
                id={category.id}
                className={`menu-category ${isExpanded ? 'menu-category--expanded' : ''}`}
              >
                <div
                  className="category-header"
                  onClick={() => toggleCategory(category.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleCategory(category.id); }}
                >
                  <div className="category-header-text">
                    <h2>{category.name}</h2>
                    {category.description && (
                      <p className="category-description">{category.description}</p>
                    )}
                  </div>
                  <span className="category-header-count">{category.items.length} items</span>
                  <svg
                    className={`category-chevron ${isExpanded ? 'category-chevron--open' : ''}`}
                    width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                <div className={`menu-category-items ${isExpanded ? 'expanded' : ''}`}>
                  <div className={`menu-grid ${isMobile ? 'menu-grid--compact' : ''}`}>
                    {category.items.map((item) => (
                      <MenuCard
                        key={item.id}
                        item={item}
                        unavailable={categoryUnavailable}
                        compact={isMobile}
                      />
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Menu;
