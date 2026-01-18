import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const initialState = {
  items: [],
  orderType: 'pickup', // pickup or to-go
  customerInfo: {
    name: '',
    phone: '',
    email: ''
  },
  pickupTime: ''
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );

      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + 1
        };
        return { ...state, items: newItems };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== id)
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      };
    }

    case 'SET_ORDER_TYPE': {
      return { ...state, orderType: action.payload };
    }

    case 'SET_CUSTOMER_INFO': {
      return {
        ...state,
        customerInfo: { ...state.customerInfo, ...action.payload }
      };
    }

    case 'SET_PICKUP_TIME': {
      return { ...state, pickupTime: action.payload };
    }

    case 'CLEAR_CART': {
      return { ...initialState };
    }

    case 'LOAD_CART': {
      return action.payload;
    }

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jrodgers-cart');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return initialState;
        }
      }
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem('jrodgers-cart', JSON.stringify(state));
  }, [state]);

  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const setOrderType = (type) => {
    dispatch({ type: 'SET_ORDER_TYPE', payload: type });
  };

  const setCustomerInfo = (info) => {
    dispatch({ type: 'SET_CUSTOMER_INFO', payload: info });
  };

  const setPickupTime = (time) => {
    dispatch({ type: 'SET_PICKUP_TIME', payload: time });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const cartTotal = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartCount = state.items.reduce(
    (count, item) => count + item.quantity,
    0
  );

  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    setOrderType,
    setCustomerInfo,
    setPickupTime,
    clearCart,
    cartTotal,
    cartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
