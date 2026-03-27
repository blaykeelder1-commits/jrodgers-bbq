import { useState, useEffect, useRef, useCallback } from 'react';
import './KitchenOrders.css';

const POLL_INTERVAL = 30_000;
const STORAGE_KEY = 'jrodgers-seen-orders';

/** Generate an alert beep using the Web Audio API */
function playAlertSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    // Play three short beeps
    [0, 0.2, 0.4].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = 880;
      gain.gain.value = 0.3;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 0.15);
    });

    // Close context after beeps finish
    setTimeout(() => ctx.close(), 1000);
  } catch {
    // Audio not available — silently ignore
  }
}

function getSeen() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function setSeen(map) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function KitchenOrders() {
  const [orders, setOrders] = useState([]);
  const [seenMap, setSeenMap] = useState(getSeen);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const prevOrderIdsRef = useRef(new Set());
  const initialLoadRef = useRef(true);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders/pending');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const fetched = data.orders || [];

      // Detect truly new orders (not seen before, not in previous fetch)
      const newIds = new Set(fetched.map((o) => o.orderId));
      const currentSeen = getSeen();
      const hasNewUnseen = fetched.some(
        (o) =>
          !currentSeen[o.orderId] && !prevOrderIdsRef.current.has(o.orderId)
      );

      if (hasNewUnseen && !initialLoadRef.current) {
        playAlertSound();
      }

      prevOrderIdsRef.current = newIds;
      initialLoadRef.current = false;
      setOrders(fetched);
      setError(null);
    } catch (err) {
      console.error('[KitchenOrders] fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const id = setInterval(fetchOrders, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchOrders]);

  const markSeen = (orderId) => {
    const updated = { ...seenMap, [orderId]: Date.now() };
    setSeenMap(updated);
    setSeen(updated);
  };

  // Clean up seen entries older than 24 hours
  useEffect(() => {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    const cleaned = {};
    let changed = false;
    for (const [id, ts] of Object.entries(seenMap)) {
      if (ts > cutoff) {
        cleaned[id] = ts;
      } else {
        changed = true;
      }
    }
    if (changed) {
      setSeenMap(cleaned);
      setSeen(cleaned);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const unseenOrders = orders.filter((o) => !seenMap[o.orderId]);
  const seenOrders = orders.filter((o) => seenMap[o.orderId]);

  return (
    <div className="kitchen-orders">
      <div className="kitchen-orders__header">
        <h1>Order Board</h1>
        <div className="kitchen-orders__status">
          {loading && <span className="kitchen-orders__loading">Loading...</span>}
          {error && <span className="kitchen-orders__error">Error: {error}</span>}
          {!loading && !error && (
            <span className="kitchen-orders__count">
              {unseenOrders.length} new &middot; {orders.length} total
            </span>
          )}
        </div>
      </div>

      {unseenOrders.length === 0 && !loading && (
        <p className="kitchen-orders__empty">No new orders</p>
      )}

      <div className="kitchen-orders__grid">
        {unseenOrders.map((order) => (
          <OrderCard key={order.orderId} order={order} onSeen={markSeen} isNew />
        ))}
      </div>

      {seenOrders.length > 0 && (
        <>
          <div className="kitchen-orders__section-header">
            <h2 className="kitchen-orders__section-title">Completed</h2>
            <button
              className="kitchen-orders__clear-btn"
              onClick={() => {
                const allSeen = {};
                orders.forEach(o => { allSeen[o.orderId] = Date.now(); });
                setSeenMap(allSeen);
                setSeen(allSeen);
              }}
            >
              Clear All Orders
            </button>
          </div>
          <div className="kitchen-orders__grid kitchen-orders__grid--seen">
            {seenOrders.map((order) => (
              <OrderCard key={order.orderId} order={order} isNew={false} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function OrderCard({ order, onSeen, isNew }) {
  return (
    <div className={`order-card ${isNew ? 'order-card--new' : 'order-card--seen'}`}>
      <div className="order-card__badge">ONLINE ORDER</div>

      <div className="order-card__pickup">
        {order.pickupTime}
      </div>
      <div className="order-card__pickup-label">Pickup Time</div>

      <div className="order-card__customer">
        <span className="order-card__name">{order.customerName}</span>
        {order.customerPhone && (
          <a href={`tel:${order.customerPhone}`} className="order-card__phone">
            {order.customerPhone}
          </a>
        )}
      </div>

      <div className="order-card__type">
        {order.orderType === 'delivery' ? 'Delivery' : 'To-Go'}
      </div>

      <ul className="order-card__items">
        {order.items.map((item, i) => (
          <li key={i} className="order-card__item">
            <span className="order-card__qty">{item.quantity}x</span>
            <span className="order-card__item-name">{item.name}</span>
            <span className="order-card__item-price">{item.price}</span>
          </li>
        ))}
      </ul>

      <div className="order-card__total">Total: {order.total}</div>

      <div className="order-card__meta">
        Received {formatTime(order.createdAt)}
      </div>

      {isNew && onSeen && (
        <button
          className="order-card__btn"
          onClick={() => onSeen(order.orderId)}
        >
          Got It
        </button>
      )}
    </div>
  );
}

export default KitchenOrders;
