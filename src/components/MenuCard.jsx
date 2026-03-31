import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import CustomizeModal from './CustomizeModal';
import './MenuCard.css';

function MenuCard({ item, showAddButton = true, unavailable = false, compact = false }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [showCustomize, setShowCustomize] = useState(false);

  const hasSize = !!item.customization?.size;
  const hasCustomization = !!item.customization;
  const isDineInOnly = !!item.dineInOnly;
  const hideButton = isDineInOnly || unavailable;

  const handleAddToCart = () => {
    if (unavailable) return;
    if (hasCustomization) {
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
    const price = selections.sizePrice || item.price;
    const name = selections.selectedSize
      ? `${item.name} (${selections.selectedSize})`
      : item.name;
    addItem({
      id: item.id,
      name,
      price,
      image: item.image,
      selectedSides: selections.selectedSides,
      selectedMeats: selections.selectedMeats,
      selectedSize: selections.selectedSize,
      specialInstructions: selections.specialInstructions
    });
    setShowCustomize(false);
    showToast(`${name} added to cart!`);
  };

  return (
    <>
      <div className={`menu-card${compact ? ' compact' : ''}${unavailable ? ' menu-card--unavailable' : ''}`}>
        <div className="menu-card-image">
          <img src={item.image} alt={item.name} loading="lazy" />
        </div>
        <div className="menu-card-content">
          <div className="menu-card-header">
            <h3 className="menu-card-name">{item.name}</h3>
            <span className="menu-card-price">
              {hasSize ? `From $${item.price.toFixed(2)}` : `$${item.price.toFixed(2)}`}
            </span>
          </div>
          <p className="menu-card-description">{item.description}</p>
          {item.bogo && (
            <span className="menu-card-bogo">{item.bogo}</span>
          )}
          {isDineInOnly && (
            <span className="menu-card-dine-in">Dine In Only</span>
          )}
          {unavailable && (
            <span className="menu-card-unavailable-label">Available 10 AM - 2 PM</span>
          )}
          {showAddButton && !hideButton && (
            <button className="menu-card-btn" onClick={handleAddToCart}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              {hasCustomization ? 'Customize & Add' : 'Add to Order'}
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
