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
  const [activeCategory, setActiveCategory] = useState(menuCategories[0].id);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  useEffect(() => {
    // Handle hash navigation
    const hash = window.location.hash.slice(1);
    if (hash && menuCategories.find(c => c.id === hash)) {
      setActiveCategory(hash);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  // Re-check time every minute for lunch special availability
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const scrollToCategory = (categoryId) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(categoryId);
    if (element) {
      const headerOffset = 150;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="menu-page">
      {/* Page Header */}
      <div className="menu-header">
        <div className="container">
          <h1>Our Menu</h1>
          <p>Authentic Southern soul food & BBQ made with love</p>
        </div>
      </div>

      {/* Category Navigation */}
      <nav className="menu-nav">
        <div className="menu-nav-container">
          {menuCategories.map((category) => (
            <button
              key={category.id}
              className={`menu-nav-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => scrollToCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Menu Content */}
      <div className="menu-content">
        <div className="container">
          {menuCategories.map((category) => {
            const categoryUnavailable = category.timeRestricted && !isWithinTimeRange(category.timeRestricted);
            return (
              <section
                key={category.id}
                id={category.id}
                className="menu-category"
              >
                <div className="category-header">
                  <h2>{category.name}</h2>
                  {category.description && (
                    <p className="category-description">{category.description}</p>
                  )}
                </div>
                <div className="menu-grid">
                  {category.items.map((item) => (
                    <MenuCard
                      key={item.id}
                      item={item}
                      unavailable={categoryUnavailable}
                    />
                  ))}
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
