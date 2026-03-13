import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import CustomizeModal from './CustomizeModal';
import './MenuCard.css';

function MenuCard({ item, showAddButton = true }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [showCustomize, setShowCustomize] = useState(false);

  const handleAddToCart = () => {
    if (item.customization) {
      setShowCustomize(true);
    } else {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image
      });
      showToast(`${item.name} added to cart!`);
    }
  };

  const handleCustomizeAdd = (selections) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      ...selections
    });
    setShowCustomize(false);
    showToast(`${item.name} added to cart!`);
  };

  return (
    <>
      <div className="menu-card">
        <div className="menu-card-image">
          <img src={item.image} alt={item.name} loading="lazy" />
        </div>
        <div className="menu-card-content">
          <div className="menu-card-header">
            <h3 className="menu-card-name">{item.name}</h3>
            <span className="menu-card-price">${item.price.toFixed(2)}</span>
          </div>
          <p className="menu-card-description">{item.description}</p>
          {showAddButton && (
            <button className="menu-card-btn" onClick={handleAddToCart}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              {item.customization ? 'Customize & Add' : 'Add to Order'}
            </button>
          )}
        </div>
      </div>

      {showCustomize && (
        <CustomizeModal
          item={item}
          onAdd={handleCustomizeAdd}
          onClose={() => setShowCustomize(false)}
        />
      )}
    </>
  );
}

export default MenuCard;
