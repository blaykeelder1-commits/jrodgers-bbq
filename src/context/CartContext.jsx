import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const CartContext = createContext();

const initialState = {
  items: [],
  orderType: 'pickup',
  customerInfo: {
    name: '',
    phone: '',
    email: ''
  },
  pickupTime: ''
};

// Generate a unique key for a cart item based on its id + selections
function generateCartItemId(item) {
  const parts = [item.id];
  if (item.selectedSides) parts.push('s:' + [...item.selectedSides].sort().join(','));
  if (item.selectedMeats) parts.push('m:' + [...item.selectedMeats].sort().join(','));
  if (item.specialInstructions) parts.push('i:' + item.specialInstructions);
  return parts.join('|');
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const cartItemId = generateCartItemId(action.payload);
      const existingIndex = state.items.findIndex(
        item => item.cartItemId === cartItemId
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
        items: [...state.items, { ...action.payload, cartItemId, quantity: 1 }]
      };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(item => item.cartItemId !== action.payload)
      };
    }

    case 'UPDATE_QUANTITY': {
      const { cartItemId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.cartItemId !== cartItemId)
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity } : item
        )
      };
    }

    case 'UPDATE_ITEM': {
      const { oldCartItemId, updatedItem } = action.payload;
      const newCartItemId = generateCartItemId(updatedItem);
      const oldItem = state.items.find(item => item.cartItemId === oldCartItemId);
      if (!oldItem) return state;

      return {
        ...state,
        items: state.items.map(item =>
          item.cartItemId === oldCartItemId
            ? { ...item, ...updatedItem, cartItemId: newCartItemId }
            : item
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
          const parsed = JSON.parse(saved);
          // Migrate old cart items that lack cartItemId
          if (parsed.items && parsed.items.length > 0) {
            const needsMigration = parsed.items.some(item => !item.cartItemId);
            if (needsMigration) {
              parsed.items = parsed.items.map(item => {
                if (!item.cartItemId) {
                  return { ...item, cartItemId: generateCartItemId(item) };
                }
                return item;
              });
            }
          }
          return parsed;
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

  const removeItem = (cartItemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: cartItemId });
  };

  const updateQuantity = (cartItemId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { cartItemId, quantity } });
  };

  const updateItem = (oldCartItemId, updatedItem) => {
    dispatch({ type: 'UPDATE_ITEM', payload: { oldCartItemId, updatedItem } });
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

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

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
    updateItem,
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
