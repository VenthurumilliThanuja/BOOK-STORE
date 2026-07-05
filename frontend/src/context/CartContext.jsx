import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("bookstoreCart") || "[]"));

  const persist = (items) => {
    localStorage.setItem("bookstoreCart", JSON.stringify(items));
    setCart(items);
  };

  const addToCart = (book, quantity = 1) => {
    const safeQuantity = Math.max(1, Number(quantity) || 1);
    const existing = cart.find((item) => item._id === book._id);
    const items = existing
      ? cart.map((item) => item._id === book._id ? { ...item, quantity: Math.min((book.stock || 99), item.quantity + safeQuantity) } : item)
      : [...cart, { ...book, quantity: Math.min((book.stock || 99), safeQuantity) }];
    persist(items);
  };

  const updateQuantity = (id, quantity) => {
    const nextQuantity = Math.max(1, Number(quantity) || 1);
    persist(cart.map((item) => item._id === id ? { ...item, quantity: Math.min(item.stock || 99, nextQuantity) } : item));
  };

  const removeFromCart = (id) => persist(cart.filter((item) => item._id !== id));
  const clearCart = () => persist([]);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 && subtotal < 999 ? 49 : 0;
  const total = subtotal + shipping;

  const value = useMemo(() => ({ cart, addToCart, updateQuantity, removeFromCart, clearCart, itemCount, subtotal, shipping, total }), [cart, itemCount, subtotal, shipping, total]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);

