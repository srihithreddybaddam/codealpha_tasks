import React, { createContext, useState, useEffect, useRef } from 'react';
import { getStorage, setStorage } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { cartService } from '../services/cart.service';
import { useAuth } from '../hooks/useAuth';

export const CartContext = createContext();

const getCartKey = (userId) => (userId ? `basketly_cart_${userId}` : 'basketly_cart_guest');
const getSavedKey = (userId) => (userId ? `basketly_saved_for_later_${userId}` : 'basketly_saved_for_later_guest');

const getInitialUser = () => {
  try {
    const user =
      getStorage(STORAGE_KEYS.USER, null) ||
      getStorage('basketly_user', null) ||
      getStorage('aetheria_user', null);
    return user;
  } catch {
    return null;
  }
};

const getInitialUserId = () => {
  const user = getInitialUser();
  return user?._id || user?.id || user?.email || null;
};

const loadInitialCart = (id) => {
  const key = getCartKey(id);
  const data = getStorage(key, null);
  if (data && Array.isArray(data)) return data;

  // Fallback to legacy key if applicable
  const legacyKey = id ? `aetheria_cart_${id}` : 'aetheria_cart_guest';
  const legacyData = getStorage(legacyKey, null);
  if (legacyData && Array.isArray(legacyData)) return legacyData;

  return [];
};

const loadInitialSaved = (id) => {
  const key = getSavedKey(id);
  const data = getStorage(key, null);
  if (data && Array.isArray(data)) return data;

  const legacyKey = id ? `aetheria_saved_for_later_${id}` : 'aetheria_saved_for_later_guest';
  const legacyData = getStorage(legacyKey, null);
  if (legacyData && Array.isArray(legacyData)) return legacyData;

  return [];
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?._id || user?.id || user?.email || null;

  // Synchronous initialization from persistent storage on mount
  const [cart, setCart] = useState(() => loadInitialCart(getInitialUserId()));
  const [savedForLater, setSavedForLater] = useState(() => loadInitialSaved(getInitialUserId()));
  const [appliedCoupon, setAppliedCoupon] = useState(() => getStorage('basketly_applied_coupon', null));
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [includeCarryBag, setIncludeCarryBag] = useState(false);
  const [deliveryTip, setDeliveryTip] = useState(0);

  const prevUserIdRef = useRef(getInitialUserId());

  // Merge guest cart & load user cart on auth transition
  useEffect(() => {
    const prevUserId = prevUserIdRef.current;

    if (prevUserId !== userId) {
      if (userId) {
        // User logged in: Merge guest cart into account cart
        const guestCart = loadInitialCart(null);
        const userCart = loadInitialCart(userId);

        let mergedCart = [...userCart];

        if (guestCart.length > 0) {
          guestCart.forEach((guestItem) => {
            const idx = mergedCart.findIndex((item) => item._id === guestItem._id);
            if (idx > -1) {
              mergedCart[idx].quantity += guestItem.quantity || 1;
            } else {
              mergedCart.push(guestItem);
            }
          });

          // Clear guest cart
          setStorage(getCartKey(null), []);
          setStorage('aetheria_cart_guest', []);
        }

        setCart(mergedCart);
        setStorage(getCartKey(userId), mergedCart);

        // Merge saved for later
        const guestSaved = loadInitialSaved(null);
        const userSaved = loadInitialSaved(userId);
        let mergedSaved = [...userSaved];

        if (guestSaved.length > 0) {
          guestSaved.forEach((guestItem) => {
            if (!mergedSaved.some((item) => item._id === guestItem._id)) {
              mergedSaved.push(guestItem);
            }
          });
          setStorage(getSavedKey(null), []);
          setStorage('aetheria_saved_for_later_guest', []);
        }

        setSavedForLater(mergedSaved);
        setStorage(getSavedKey(userId), mergedSaved);

        // Sync with backend API
        cartService
          .getCart()
          .then((res) => {
            const backendItems = res.data?.cart?.items || res.cart?.items || res.data?.cart || [];
            if (Array.isArray(backendItems) && backendItems.length > 0) {
              const formattedBackend = backendItems
                .map((bi) => {
                  if (bi.product && typeof bi.product === 'object') {
                    return { ...bi.product, quantity: bi.quantity || 1 };
                  }
                  return bi;
                })
                .filter((bi) => bi && bi._id);

              if (formattedBackend.length > 0) {
                setCart((currentLocal) => {
                  const combined = [...currentLocal];
                  formattedBackend.forEach((bItem) => {
                    const idx = combined.findIndex((c) => c._id === bItem._id);
                    if (idx > -1) {
                      combined[idx].quantity = Math.max(combined[idx].quantity, bItem.quantity);
                    } else {
                      combined.push(bItem);
                    }
                  });
                  setStorage(getCartKey(userId), combined);
                  return combined;
                });
              }
            }
          })
          .catch(() => {});
      } else {
        // User logged out: Load guest cart
        const guestCart = loadInitialCart(null);
        const guestSaved = loadInitialSaved(null);
        setCart(guestCart);
        setSavedForLater(guestSaved);
      }

      prevUserIdRef.current = userId;
    }
  }, [userId]);

  // Persist cart state whenever cart or active userId changes
  useEffect(() => {
    const key = getCartKey(userId);
    setStorage(key, cart);
  }, [cart, userId]);

  useEffect(() => {
    const key = getSavedKey(userId);
    setStorage(key, savedForLater);
  }, [savedForLater, userId]);

  useEffect(() => {
    if (appliedCoupon) {
      setStorage('basketly_applied_coupon', appliedCoupon);
    } else {
      localStorage.removeItem('basketly_applied_coupon');
    }
  }, [appliedCoupon]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item._id === product._id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { ...product, quantity }];
    });

    if (userId) {
      cartService.addToCart(product, quantity).catch(() => {});
    }
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
    if (userId) {
      cartService.removeFromCart(productId).catch(() => {});
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item._id === productId ? { ...item, quantity } : item))
    );
    if (userId) {
      cartService.updateQuantity(productId, quantity).catch(() => {});
    }
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setIncludeCarryBag(false);
    setDeliveryTip(0);
    const key = getCartKey(userId);
    setStorage(key, []);

    if (userId) {
      cartService.clearCart().catch(() => {});
    }
  };

  const moveToSavedForLater = (product) => {
    removeFromCart(product._id);
    setSavedForLater((prev) => {
      if (prev.some((item) => item._id === product._id)) return prev;
      return [product, ...prev];
    });
  };

  const moveToCartFromSaved = (product) => {
    setSavedForLater((prev) => prev.filter((item) => item._id !== product._id));
    addToCart(product, 1);
  };

  const removeFromSavedForLater = (productId) => {
    setSavedForLater((prev) => prev.filter((item) => item._id !== productId));
  };

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'BASKETLY10' || cleanCode === 'AETHERIA10' || cleanCode === 'FRESH10') {
      const couponObj = { code: cleanCode, discountPercent: 10 };
      setAppliedCoupon(couponObj);
      return { success: true, message: '10% discount coupon applied successfully!' };
    } else if (cleanCode === 'WELCOME20' || cleanCode === 'FRESH20') {
      const couponObj = { code: cleanCode, discountPercent: 20 };
      setAppliedCoupon(couponObj);
      return { success: true, message: '20% welcome coupon applied successfully!' };
    } else {
      return { success: false, message: 'Invalid coupon code. Try BASKETLY10 or WELCOME20' };
    }
  };

  const removeCoupon = () => setAppliedCoupon(null);
  const toggleCarryBag = () => setIncludeCarryBag((prev) => !prev);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cart.reduce((acc, item) => {
    const itemPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;
    return acc + itemPrice * item.quantity;
  }, 0);

  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0;
  const shipping = subtotal === 0 ? 0 : subtotal >= 199 ? 0 : 30;
  const handlingFee = subtotal > 0 ? 5 : 0;
  const carryBagFee = includeCarryBag && subtotal > 0 ? 5 : 0;
  const tax = 0;

  const grandTotal = Math.max(
    0,
    subtotal - discountAmount + shipping + handlingFee + carryBagFee + deliveryTip
  );

  const totalSavings =
    cart.reduce((acc, item) => {
      if (item.discount > 0) {
        const original = item.price * item.quantity;
        const discounted = item.price * (1 - item.discount / 100) * item.quantity;
        return acc + (original - discounted);
      }
      return acc;
    }, 0) + discountAmount;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        savedForLater,
        moveToSavedForLater,
        moveToCartFromSaved,
        removeFromSavedForLater,
        totalItems,
        subtotal,
        discountAmount,
        shipping,
        handlingFee,
        tax,
        includeCarryBag,
        setIncludeCarryBag,
        toggleCarryBag,
        carryBagFee,
        deliveryTip,
        setDeliveryTip,
        grandTotal,
        totalSavings,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        deliveryMethod,
        setDeliveryMethod,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
