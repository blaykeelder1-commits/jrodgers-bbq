import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import usePageTitle from '../hooks/usePageTitle';
import './Order.css';

function OrderConfirmation() {
  usePageTitle('Order Confirmed');
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    clearCart();

    const saved = localStorage.getItem('jrodgers-last-order');
    if (saved) {
      setOrderDetails(JSON.parse(saved));
    }
  }, [clearCart]);

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
        {orderDetails && (
          <>
            <p className="order-id">Order #{orderDetails.orderNumber}</p>
            {orderDetails.pickupTime && (
              <p>Pickup Time: <strong>{orderDetails.pickupTime}</strong></p>
            )}
            <p>Total: <strong>${orderDetails.total?.toFixed(2)}</strong></p>
          </>
        )}
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

export default OrderConfirmation;
