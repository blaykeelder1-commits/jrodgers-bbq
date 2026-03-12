import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { restaurantInfo } from '../data/menuData';
import usePageTitle from '../hooks/usePageTitle';
import './Order.css';

function Order() {
  usePageTitle('Order Online');

  const {
    items,
    orderType,
    customerInfo,
    pickupTime,
    cartTotal,
    removeItem,
    updateQuantity,
    setOrderType,
    setCustomerInfo,
    setPickupTime,
    clearCart
  } = useCart();

  const [step, setStep] = useState(1); // 1: Cart, 2: Info, 3: Confirmation
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const TAX_RATE = 0.10; // 10% tax
  const taxAmount = cartTotal * TAX_RATE;
  const orderTotal = cartTotal + taxAmount;

  // Generate pickup time options
  const generatePickupTimes = () => {
    const times = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Start from next available 15-minute slot
    let startMinute = Math.ceil(currentMinute / 15) * 15 + 30; // 30 mins from now minimum
    let startHour = currentHour;

    if (startMinute >= 60) {
      startMinute -= 60;
      startHour += 1;
    }

    // Generate times from now until 9 PM
    for (let hour = startHour; hour <= 21; hour++) {
      const minuteStart = hour === startHour ? startMinute : 0;
      for (let minute = minuteStart; minute < 60; minute += 15) {
        if (hour === 21 && minute > 0) break; // Stop at 9 PM
        const timeString = `${hour > 12 ? hour - 12 : hour}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
        times.push(timeString);
      }
    }

    return times;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({ [name]: value });
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Generate order number
    const newOrderNumber = `JR${Date.now().toString().slice(-6)}`;
    setOrderNumber(newOrderNumber);

    // Save order details to localStorage for reference
    const orderDetails = {
      orderNumber: newOrderNumber,
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
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

    // Redirect to Square payment
    clearCart();
    window.location.href = restaurantInfo.squarePaymentLink;
  };

  if (orderComplete) {
    return (
      <div className="order-page">
        <div className="order-success">
          <div className="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h1>Order Confirmed!</h1>
          <p>Thank you for your order. Your payment has been processed through Square.</p>
          <p className="order-id">Order #{orderNumber}</p>
          <div className="success-actions">
            <Link to="/menu" className="btn btn-primary">
              Order More
            </Link>
            <Link to="/" className="btn btn-outline">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      <div className="order-header">
        <div className="container">
          <h1>Order Online</h1>
          <p>Order ahead for pickup or to-go</p>
        </div>
      </div>

      <div className="order-container">
        <div className="container">
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
                            Pickup
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
                            To-Go
                          </button>
                        </div>
                      </div>

                      {/* Cart Items */}
                      <div className="cart-items">
                        {items.map((item) => (
                          <div key={item.id} className="cart-item">
                            <img src={item.image} alt={item.name} />
                            <div className="cart-item-info">
                              <h4>{item.name}</h4>
                              <span className="cart-item-price">
                                ${item.price.toFixed(2)}
                              </span>
                            </div>
                            <div className="cart-item-quantity">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            <span className="cart-item-total">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                            <button
                              className="cart-item-remove"
                              onClick={() => removeItem(item.id)}
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

                      <div className="cart-actions">
                        <Link to="/menu" className="btn btn-outline">
                          Add More Items
                        </Link>
                        <button
                          className="btn btn-primary"
                          onClick={() => setStep(2)}
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
                            required
                            placeholder="John Smith"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="phone">Phone Number *</label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={customerInfo.phone}
                            onChange={handleInputChange}
                            required
                            placeholder="(251) 555-0123"
                          />
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
                            required
                          >
                            <option value="">Select a time</option>
                            {generatePickupTimes().map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
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
                          disabled={!customerInfo.name || !customerInfo.phone || !pickupTime}
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
                            {isProcessing ? 'Redirecting...' : 'Proceed to Payment'}
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
                        <div key={item.id} className="summary-item">
                          <span>{item.quantity}x {item.name}</span>
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
  );
}

export default Order;
