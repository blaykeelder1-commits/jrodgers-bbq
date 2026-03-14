import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { restaurantInfo, menuCategories } from '../data/menuData';
import CustomizeModal from '../components/CustomizeModal';
import usePageTitle from '../hooks/usePageTitle';
import './Order.css';

const MIN_ORDER_AMOUNT = 5.00;

// Look up an item's customization config from menuData by id
function getItemConfig(itemId) {
  for (const category of menuCategories) {
    const found = category.items.find(i => i.id === itemId);
    if (found) return found;
  }
  return null;
}

function Order() {
  usePageTitle('Order Online');

  const {
    items,
    orderType,
    customerInfo,
    pickupTime,
    cartTotal,
    addItem,
    removeItem,
    updateQuantity,
    updateItem,
    setOrderType,
    setCustomerInfo,
    setPickupTime,
    clearCart
  } = useCart();

  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [touched, setTouched] = useState({});
  const [editingItem, setEditingItem] = useState(null);

  const TAX_RATE = 0.10;
  const taxAmount = cartTotal * TAX_RATE;
  const orderTotal = cartTotal + taxAmount;
  const belowMinimum = items.length > 0 && cartTotal < MIN_ORDER_AMOUNT;

  // Load last order for "Order Again"
  const getLastOrder = () => {
    try {
      const saved = localStorage.getItem('jrodgers-last-order');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  };

  const handleReorder = () => {
    const lastOrder = getLastOrder();
    if (!lastOrder?.items) return;
    lastOrder.items.forEach(item => {
      const config = getItemConfig(item.name);
      for (let i = 0; i < item.quantity; i++) {
        addItem({
          id: config?.id || item.name,
          name: item.name,
          price: item.price,
          image: config?.image || '/images/menu/combo-dinner.jpg',
          selectedSides: item.selectedSides,
          selectedMeats: item.selectedMeats,
          specialInstructions: item.specialInstructions
        });
      }
    });
    showToast('Previous order added to cart!');
  };

  const handleEditItem = (cartItem) => {
    const config = getItemConfig(cartItem.id);
    if (!config?.customization) return;
    setEditingItem({ ...cartItem, customization: config.customization });
  };

  const handleEditSave = (selections) => {
    updateItem(editingItem.cartItemId, {
      selectedSides: selections.selectedSides,
      selectedMeats: selections.selectedMeats,
      specialInstructions: selections.specialInstructions
    });
    setEditingItem(null);
    showToast('Order updated!');
  };

  // Check if restaurant is currently open
  const getRestaurantStatus = () => {
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed...
    const hour = now.getHours();
    const isClosed = day === 1 || day === 2; // Mon or Tue
    const isAfterHours = hour < 12 || hour >= 21;
    const isDoorDashDay = isClosed;
    return { isClosed: isClosed || isAfterHours, isDoorDashDay, isClosedDay: isClosed };
  };

  const status = getRestaurantStatus();

  // Generate pickup time options
  const generatePickupTimes = () => {
    const times = [];
    const now = new Date();
    const day = now.getDay();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // If closed day or after hours, generate times for next open day
    const isClosed = day === 1 || day === 2 || currentHour >= 21;
    let targetDate = new Date(now);

    if (isClosed) {
      // Find next open day
      do {
        targetDate.setDate(targetDate.getDate() + 1);
      } while (targetDate.getDay() === 1 || targetDate.getDay() === 2);
    }

    const isToday = targetDate.toDateString() === now.toDateString();
    const dateLabel = isToday ? '' : ` (${targetDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })})`;

    let startHour = 12;
    let startMinute = 0;

    if (isToday) {
      startMinute = Math.ceil(currentMinute / 15) * 15 + 30;
      startHour = currentHour;
      if (startMinute >= 60) {
        startMinute -= 60;
        startHour += 1;
      }
      if (startHour < 12) {
        startHour = 12;
        startMinute = 0;
      }
    }

    for (let hour = startHour; hour <= 21; hour++) {
      const mStart = hour === startHour ? startMinute : 0;
      for (let minute = mStart; minute < 60; minute += 15) {
        if (hour === 21 && minute > 0) break;
        const timeString = `${hour > 12 ? hour - 12 : hour}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
        times.push(`${timeString}${dateLabel}`);
      }
    }

    return times;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({ [name]: value });
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isValidPhone = (phone) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setCheckoutError(null);

    const newOrderNumber = `JR${Date.now().toString().slice(-6)}`;

    const orderDetails = {
      orderNumber: newOrderNumber,
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        selectedSides: item.selectedSides,
        selectedMeats: item.selectedMeats,
        specialInstructions: item.specialInstructions
      })),
      customerInfo,
      pickupTime,
      orderType,
      subtotal: cartTotal,
      tax: taxAmount,
      total: orderTotal,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('jrodgers-last-order', JSON.stringify(orderDetails));

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderDetails.items,
          customerInfo,
          pickupTime,
          orderType,
          subtotal: cartTotal,
          tax: taxAmount,
          total: orderTotal
        })
      });

      const data = await response.json();

      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error || 'Failed to create checkout');
      }

      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      setIsProcessing(false);
      setCheckoutError(error.message || 'Something went wrong. Please try again or call us to place your order.');
    }
  };

  return (
    <>
    <div className="order-page">
      <div className="order-header">
        <div className="container">
          <h1>Order Online</h1>
          <p>Order ahead for pickup or to-go</p>
        </div>
      </div>

      <div className="order-container">
        <div className="container">
          {/* Closed banner */}
          {status.isClosed && (
            <div className="closed-banner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <div>
                <strong>We're currently closed.</strong> Open Wednesday – Sunday, 12PM – 9PM.
                Place your order now and select a pickup time!
                {status.isDoorDashDay && (
                  <span className="doordash-note">
                    {' '}DoorDash delivery is available today!{' '}
                    <a href="https://www.doordash.com" target="_blank" rel="noopener noreferrer">
                      Order on DoorDash
                    </a>
                  </span>
                )}
              </div>
            </div>
          )}

          {items.length === 0 && step === 1 ? (
            <div className="empty-cart">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <h2>Your cart is empty</h2>
              <p>Add some delicious items from our menu to get started!</p>
              <Link to="/menu" className="btn btn-primary btn-lg">
                Browse Menu
              </Link>
              {getLastOrder() && (
                <div className="reorder-section">
                  <p className="reorder-label">or reorder your last meal</p>
                  <button className="btn btn-outline" onClick={handleReorder}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 4 23 10 17 10"></polyline>
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                    </svg>
                    Order Again
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="order-layout">
              {/* Progress Steps */}
              <div className="order-progress">
                <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                  <span className="step-number">1</span>
                  <span className="step-label">Review Cart</span>
                </div>
                <div className="progress-line"></div>
                <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                  <span className="step-number">2</span>
                  <span className="step-label">Your Info</span>
                </div>
                <div className="progress-line"></div>
                <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                  <span className="step-number">3</span>
                  <span className="step-label">Payment</span>
                </div>
              </div>

              <div className="order-grid">
                {/* Main Content */}
                <div className="order-main">
                  {step === 1 && (
                    <div className="cart-section">
                      <h2>Your Order</h2>

                      {/* Order Type Selection */}
                      <div className="order-type-section">
                        <h3>Order Type</h3>
                        <div className="order-type-buttons">
                          <button
                            className={`order-type-btn ${orderType === 'pickup' ? 'active' : ''}`}
                            onClick={() => setOrderType('pickup')}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                              <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                            <div className="order-type-text">
                              <span className="order-type-label">Pickup</span>
                              <span className="order-type-sub">I'll grab it at the counter</span>
                            </div>
                          </button>
                          <button
                            className={`order-type-btn ${orderType === 'to-go' ? 'active' : ''}`}
                            onClick={() => setOrderType('to-go')}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="1" y="3" width="15" height="13"></rect>
                              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                              <circle cx="5.5" cy="18.5" r="2.5"></circle>
                              <circle cx="18.5" cy="18.5" r="2.5"></circle>
                            </svg>
                            <div className="order-type-text">
                              <span className="order-type-label">To-Go</span>
                              <span className="order-type-sub">Package it for the road</span>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Cart Items */}
                      <div className="cart-items">
                        {items.map((item) => (
                          <div key={item.cartItemId} className="cart-item">
                            <img src={item.image} alt={item.name} />
                            <div className="cart-item-info">
                              <h4>{item.name}</h4>
                              {item.selectedMeats && (
                                <p className="cart-item-customization">
                                  Meats: {item.selectedMeats.join(', ')}
                                </p>
                              )}
                              {item.selectedSides && (
                                <p className="cart-item-customization">
                                  Sides: {item.selectedSides.join(', ')}
                                </p>
                              )}
                              {item.specialInstructions && (
                                <p className="cart-item-customization cart-item-instructions">
                                  Note: {item.specialInstructions}
                                </p>
                              )}
                              <span className="cart-item-price">
                                ${item.price.toFixed(2)}
                              </span>
                            </div>
                            <div className="cart-item-quantity">
                              <button
                                onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            <span className="cart-item-total">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                            {(item.selectedSides || item.selectedMeats) && (
                              <button
                                className="cart-item-edit"
                                onClick={() => handleEditItem(item)}
                                aria-label="Edit item"
                              >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                              </button>
                            )}
                            <button
                              className="cart-item-remove"
                              onClick={() => removeItem(item.cartItemId)}
                              aria-label="Remove item"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>

                      {belowMinimum && (
                        <div className="minimum-order-warning">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                          </svg>
                          Minimum order is ${MIN_ORDER_AMOUNT.toFixed(2)}. Add ${(MIN_ORDER_AMOUNT - cartTotal).toFixed(2)} more to continue.
                        </div>
                      )}

                      <div className="cart-actions">
                        <Link to="/menu" className="btn btn-outline">
                          Add More Items
                        </Link>
                        <button
                          className="btn btn-primary"
                          onClick={() => setStep(2)}
                          disabled={belowMinimum}
                        >
                          Continue to Info
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="info-section">
                      <h2>Your Information</h2>
                      <form className="info-form">
                        <div className="form-group">
                          <label htmlFor="name">Full Name *</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={customerInfo.name}
                            onChange={handleInputChange}
                            onBlur={() => handleBlur('name')}
                            className={touched.name && !customerInfo.name ? 'input-error' : ''}
                            required
                            placeholder="John Smith"
                          />
                          {touched.name && !customerInfo.name && (
                            <span className="field-error">Name is required</span>
                          )}
                        </div>
                        <div className="form-group">
                          <label htmlFor="phone">Phone Number *</label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={customerInfo.phone}
                            onChange={handleInputChange}
                            onBlur={() => handleBlur('phone')}
                            className={touched.phone && (!customerInfo.phone || !isValidPhone(customerInfo.phone)) ? 'input-error' : ''}
                            required
                            placeholder="(251) 555-0123"
                          />
                          {touched.phone && !customerInfo.phone && (
                            <span className="field-error">Phone number is required</span>
                          )}
                          {touched.phone && customerInfo.phone && !isValidPhone(customerInfo.phone) && (
                            <span className="field-error">Please enter a valid 10-digit phone number</span>
                          )}
                        </div>
                        <div className="form-group">
                          <label htmlFor="email">Email Address</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={customerInfo.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="pickupTime">Pickup Time *</label>
                          <select
                            id="pickupTime"
                            value={pickupTime}
                            onChange={(e) => setPickupTime(e.target.value)}
                            onBlur={() => handleBlur('pickupTime')}
                            className={touched.pickupTime && !pickupTime ? 'input-error' : ''}
                            required
                          >
                            <option value="">Select a time</option>
                            {generatePickupTimes().map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                          {touched.pickupTime && !pickupTime && (
                            <span className="field-error">Please select a pickup time</span>
                          )}
                        </div>
                      </form>

                      <div className="cart-actions">
                        <button
                          className="btn btn-outline"
                          onClick={() => setStep(1)}
                        >
                          Back to Cart
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() => setStep(3)}
                          disabled={!customerInfo.name || !customerInfo.phone || !isValidPhone(customerInfo.phone) || !pickupTime}
                        >
                          Continue to Payment
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="payment-section">
                      <h2>Confirm Order</h2>
                      <form onSubmit={handleSubmitOrder} className="payment-form">
                        <div className="order-review">
                          <h3>Order Details</h3>
                          <p><strong>Name:</strong> {customerInfo.name}</p>
                          <p><strong>Phone:</strong> {customerInfo.phone}</p>
                          {customerInfo.email && <p><strong>Email:</strong> {customerInfo.email}</p>}
                          <p><strong>Pickup Time:</strong> {pickupTime}</p>
                          <p><strong>Order Type:</strong> {orderType === 'pickup' ? 'Pickup' : 'To-Go'}</p>
                        </div>

                        <div className="payment-info">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                          <div>
                            <h4>Pay Securely with Square</h4>
                            <p>You'll be redirected to Square's secure checkout to complete your payment.</p>
                          </div>
                        </div>

                        {checkoutError && (
                          <div className="checkout-error">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="15" y1="9" x2="9" y2="15"></line>
                              <line x1="9" y1="9" x2="15" y2="15"></line>
                            </svg>
                            <div>
                              <strong>Unable to process payment.</strong>
                              <p>{checkoutError}</p>
                              <p>Please try again or call us at <a href="tel:2516753282">(251) 675-3282</a> to place your order by phone.</p>
                            </div>
                          </div>
                        )}

                        <div className="cart-actions">
                          <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => setStep(2)}
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={isProcessing}
                          >
                            {isProcessing ? 'Redirecting...' : checkoutError ? 'Try Again' : 'Proceed to Payment'}
                          </button>
                        </div>
                      </form>

                      <p className="payment-notice">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"></path>
                        </svg>
                        Questions? Call us at (251) 675-3282
                      </p>
                    </div>
                  )}
                </div>

                {/* Order Summary Sidebar */}
                <div className="order-sidebar">
                  <div className="order-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-items">
                      {items.map((item) => (
                        <div key={item.cartItemId} className="summary-item">
                          <div className="summary-item-details">
                            <span>{item.quantity}x {item.name}</span>
                            {item.selectedSides && (
                              <span className="summary-item-custom">Sides: {item.selectedSides.join(', ')}</span>
                            )}
                            {item.selectedMeats && (
                              <span className="summary-item-custom">Meats: {item.selectedMeats.join(', ')}</span>
                            )}
                          </div>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="summary-totals">
                      <div className="summary-line">
                        <span>Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="summary-line">
                        <span>Tax</span>
                        <span>${taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="summary-line total">
                        <span>Total</span>
                        <span>${orderTotal.toFixed(2)}</span>
                      </div>
                    </div>
                    {pickupTime && (
                      <div className="pickup-info">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        Pickup at {pickupTime}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    {editingItem && (
      <CustomizeModal
        item={editingItem}
        onAdd={handleEditSave}
        onClose={() => setEditingItem(null)}
        initialSelections={{
          selectedSides: editingItem.selectedSides,
          selectedMeats: editingItem.selectedMeats,
          specialInstructions: editingItem.specialInstructions
        }}
      />
    )}
    </>
  );
}

export default Order;
