import { useState, useEffect, useRef } from 'react';
import { PREMIUM_SIDES, PREMIUM_SIDE_UPCHARGE } from '../data/menuData';
import './CustomizeModal.css';

function CustomizeModal({ item, onAdd, onClose, initialSelections }) {
  const [selectedSides, setSelectedSides] = useState(initialSelections?.selectedSides || []);
  const [selectedMeats, setSelectedMeats] = useState(initialSelections?.selectedMeats || []);
  const [selectedSize, setSelectedSize] = useState(() => {
    if (initialSelections?.selectedSize && item.customization?.size) {
      const idx = item.customization.size.options.findIndex(o => o.label === initialSelections.selectedSize);
      return idx >= 0 ? idx : null;
    }
    return null;
  });
  const [specialInstructions, setSpecialInstructions] = useState(initialSelections?.specialInstructions || '');
  const overlayRef = useRef(null);

  const { customization } = item;
  const sidesConfig = customization?.sides;
  const meatsConfig = customization?.meats;
  const sizeConfig = customization?.size;

  const sidesComplete = !sidesConfig || selectedSides.length === sidesConfig.count;
  const meatsComplete = !meatsConfig || selectedMeats.length === meatsConfig.count;
  const sizeComplete = !sizeConfig || selectedSize !== null;
  const canAdd = sidesComplete && meatsComplete && sizeComplete;

  // Premium-side upcharge: $1.75 per premium side when chosen as an included side on a combo/plate.
  const sidesUpcharge = sidesConfig
    ? selectedSides.filter((s) => PREMIUM_SIDES.has(s)).length * PREMIUM_SIDE_UPCHARGE
    : 0;

  const basePrice = selectedSize !== null && sizeConfig
    ? sizeConfig.options[selectedSize].price
    : item.price;
  const displayPrice = basePrice + sidesUpcharge;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  const toggleSide = (side) => {
    setSelectedSides((prev) => {
      if (prev.includes(side)) return prev.filter((s) => s !== side);
      if (prev.length >= sidesConfig.count) return prev;
      return [...prev, side];
    });
  };

  const toggleMeat = (meat) => {
    setSelectedMeats((prev) => {
      if (prev.includes(meat)) return prev.filter((m) => m !== meat);
      if (prev.length >= meatsConfig.count) return prev;
      return [...prev, meat];
    });
  };

  const handleAdd = () => {
    if (!canAdd) return;
    const sizeOption = sizeConfig && selectedSize !== null ? sizeConfig.options[selectedSize] : null;
    onAdd({
      selectedSides: sidesConfig ? selectedSides : undefined,
      selectedMeats: meatsConfig ? selectedMeats : undefined,
      selectedSize: sizeOption ? sizeOption.label : undefined,
      sizePrice: sizeOption ? sizeOption.price : undefined,
      sidesUpcharge: sidesUpcharge || undefined,
      specialInstructions: specialInstructions.trim() || undefined,
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const getIncompleteLabel = () => {
    if (!sizeComplete) return 'Select a size to continue';
    if (!meatsComplete) return 'Select your meats to continue';
    return 'Select your sides to continue';
  };

  return (
    <div className="customize-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="customize-modal" role="dialog" aria-label={`Customize ${item.name}`}>
        <button className="customize-close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="customize-header">
          <h2>{item.name}</h2>
          <span className="customize-price">${displayPrice.toFixed(2)}</span>
        </div>

        {sizeConfig && (
          <div className="customize-section">
            <div className="customize-section-header">
              <h3>Choose Size</h3>
              {selectedSize !== null && (
                <span className="customize-count complete">Selected</span>
              )}
            </div>
            <div className="customize-size-options">
              {sizeConfig.options.map((option, index) => (
                <button
                  key={option.label}
                  className={`customize-size-option ${selectedSize === index ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(index)}
                  type="button"
                >
                  <span className="size-label">{option.label}</span>
                  <span className="size-price">${option.price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {meatsConfig && (
          <div className="customize-section">
            <div className="customize-section-header">
              <h3>Choose Your Meats</h3>
              <span className={`customize-count ${selectedMeats.length === meatsConfig.count ? 'complete' : ''}`}>
                {selectedMeats.length} of {meatsConfig.count} selected
              </span>
            </div>
            <div className="customize-options">
              {meatsConfig.options.map((meat) => (
                <button
                  key={meat}
                  className={`customize-option ${selectedMeats.includes(meat) ? 'selected' : ''} ${selectedMeats.length >= meatsConfig.count && !selectedMeats.includes(meat) ? 'maxed' : ''}`}
                  onClick={() => toggleMeat(meat)}
                  type="button"
                >
                  {selectedMeats.includes(meat) && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                  {meat}
                </button>
              ))}
            </div>
          </div>
        )}

        {sidesConfig && (
          <div className="customize-section">
            <div className="customize-section-header">
              <h3>Choose Your Sides</h3>
              <span className={`customize-count ${selectedSides.length === sidesConfig.count ? 'complete' : ''}`}>
                {selectedSides.length} of {sidesConfig.count} selected
              </span>
            </div>
            <div className="customize-options">
              {sidesConfig.options.map((side) => (
                <button
                  key={side}
                  className={`customize-option ${selectedSides.includes(side) ? 'selected' : ''} ${selectedSides.length >= sidesConfig.count && !selectedSides.includes(side) ? 'maxed' : ''}`}
                  onClick={() => toggleSide(side)}
                  type="button"
                >
                  {selectedSides.includes(side) && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                  <span className="customize-option__label">{side}</span>
                  {PREMIUM_SIDES.has(side) && (
                    <span className="customize-option__upcharge">+${PREMIUM_SIDE_UPCHARGE.toFixed(2)}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="customize-section">
          <h3>Special Instructions</h3>
          <textarea
            className="customize-instructions"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Extra sauce, no onions, etc..."
            rows="2"
          />
        </div>

        <button
          className="customize-add-btn"
          onClick={handleAdd}
          disabled={!canAdd}
          type="button"
        >
          {canAdd ? (initialSelections ? 'Update Order' : `Add to Order — $${displayPrice.toFixed(2)}`) : getIncompleteLabel()}
        </button>
      </div>
    </div>
  );
}

export default CustomizeModal;
