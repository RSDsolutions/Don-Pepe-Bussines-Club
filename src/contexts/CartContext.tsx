import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  tag: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartSubtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('donpepe_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [toastData, setToastData] = useState<{name: string, show: boolean}>({name: '', show: false});
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem('donpepe_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });

    // Clear pending timer
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);

    // Show Toast
    setToastData({ name: item.name, show: true });
    
    // Schedule hide
    toastTimerRef.current = window.setTimeout(() => {
      setToastData(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartTotal = cartSubtotal; // Add tax/shipping later if needed

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartSubtotal, cartTotal }}>
      {children}
      {/* Toast Notification */}
      <div 
        className={`fixed top-24 right-0 z-[100] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          toastData.show
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-full pointer-events-none'
        }`}
      >
        <div className="bg-[var(--color-brand-navymid)] border-l-4 border-[var(--color-brand-gold)] shadow-2xl p-4 flex items-center gap-4 min-w-[280px]">
           <div className="w-10 h-10 rounded-none bg-[var(--color-brand-gold)]/10 flex items-center justify-center text-[var(--color-brand-gold)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
           </div>
           <div className="flex flex-col">
             <span className="text-white text-[13px] font-bold uppercase tracking-wider">Añadido al carrito</span>
             <span className="text-[var(--color-brand-gold)] text-[11px] font-semibold">{toastData.name}</span>
           </div>
        </div>
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
