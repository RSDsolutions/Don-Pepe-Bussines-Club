import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Minus, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLang } from "@/contexts/LangContext";

export function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartSubtotal, cartTotal } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");

  const { lang } = useLang();
  
  const translations = {
    es: {
      title: "Carrito de Compras",
      home: "Inicio",
      empty: "Tu carrito está vacío.",
      backStore: "Volver a la tienda",
      product: "Producto",
      price: "Precio",
      quantity: "Cantidad",
      subtotal: "Subtotal",
      couponPlaceholder: "Código de Cupón",
      applyCoupon: "Aplicar",
      clearCart: "Vaciar Carrito",
      orderSummary: "Resumen de Orden",
      items: "Artículos",
      shipping: "Envío",
      taxes: "Impuestos",
      couponDiscount: "Descuento",
      total: "Total",
      proceed: "Proceder al Pago",
      couponApplied: "Cupón aplicado (simulación)"
    },
    en: {
      title: "Shopping Cart",
      home: "Home",
      empty: "Your cart is empty.",
      backStore: "Back to store",
      product: "Product",
      price: "Price",
      quantity: "Quantity",
      subtotal: "Subtotal",
      couponPlaceholder: "Coupon Code",
      applyCoupon: "Apply",
      clearCart: "Clear Cart",
      orderSummary: "Order Summary",
      items: "Items",
      shipping: "Shipping",
      taxes: "Taxes",
      couponDiscount: "Discount",
      total: "Total",
      proceed: "Proceed to Checkout",
      couponApplied: "Coupon applied (simulation)"
    }
  };
  
  const t = translations[lang];

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      alert(`${t.couponApplied}: ${couponCode}`);
      setCouponCode("");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[var(--color-brand-black)] text-[var(--color-brand-graylight)] pt-14 pb-16 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 relative">
        
        {/* Page Header */}
        <div className="relative text-center mb-4 py-2">
          {/* Decorative Bubbles Left */}
          <div className="absolute top-0 left-0 w-32 h-32 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, var(--color-brand-gold) 3px, transparent 4px)', backgroundSize: '16px 16px' }} />
          {/* Decorative Bubbles Right */}
          <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, var(--color-brand-gold) 3px, transparent 4px)', backgroundSize: '16px 16px' }} />
          
          <h1 className="font-serif font-bold text-[40px] md:text-[48px] text-[var(--color-brand-offwhite)] mb-4 relative z-10">
            {t.title}
          </h1>
          <nav className="text-[12px] font-sans font-semibold uppercase tracking-widest text-[var(--color-brand-graylight)] relative z-10">
            <Link to="/" className="hover:text-[var(--color-brand-gold)] transition-colors">{t.home}</Link>
            <span className="mx-2">/</span>
            <span className="text-[var(--color-brand-gold)]">{t.title}</span>
          </nav>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center bg-[var(--color-brand-navy)] border border-[var(--color-brand-gold)]/20 p-12 rounded-none relative z-10">
            <p className="text-[18px] text-[var(--color-brand-offwhite)] mb-6">{t.empty}</p>
            <Link 
              to="/productos" 
              className="inline-block bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] px-8 py-3 font-semibold uppercase tracking-widest text-sm hover:scale-[1.02] transition-transform rounded-none"
            >
              {t.backStore}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 relative z-10">
            
            {/* Left Column: Cart Items */}
            <div className="flex-1 flex flex-col">
              
              {/* Table Header */}
              <div className="grid grid-cols-12 bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] py-4 px-6 font-semibold uppercase tracking-wider text-sm mb-6 rounded-none">
                <div className="col-span-6">{t.product}</div>
                <div className="col-span-2 text-center">{t.price}</div>
                <div className="col-span-2 text-center">{t.quantity}</div>
                <div className="col-span-2 text-right">{t.subtotal}</div>
              </div>

              {/* Cart Items List */}
              <div className="flex flex-col gap-6 mb-8">
                {cartItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 items-center bg-[var(--color-brand-navy)] p-4 border border-[var(--color-brand-gold)]/20 rounded-none group">
                    <div className="col-span-6 flex items-center gap-4">
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-[var(--color-brand-graylight)] hover:text-red-500 transition-colors p-2"
                        aria-label="Remove item"
                      >
                        <X size={18} />
                      </button>
                      <div className="w-20 h-24 overflow-hidden bg-[var(--color-brand-navymid)] border border-[var(--color-brand-gold)]/20 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex flex-col gap-1 pr-4">
                        <h3 className="font-serif font-bold text-[20px] text-[var(--color-brand-offwhite)] leading-tight">{item.name}</h3>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-gold)]">
                          {item.tag}
                        </span>
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-center text-[var(--color-brand-offwhite)] font-serif text-[18px]">
                      ${item.price.toFixed(2)}
                    </div>
                    
                    <div className="col-span-2 flex justify-center">
                      <div className="flex items-center border border-[var(--color-brand-gold)]/30 h-10 w-[100px] bg-[var(--color-brand-navymid)] rounded-none">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-full flex items-center justify-center text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/10 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <input 
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-full text-center bg-transparent text-[var(--color-brand-offwhite)] font-sans text-sm focus:outline-none appearance-none m-0"
                          style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                        />
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-full flex items-center justify-center text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/10 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-right font-serif font-bold text-[20px] text-[var(--color-brand-gold)]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear Cart */}
              <div className="flex justify-end pt-4 border-t border-[var(--color-brand-gold)]/20">
                <button 
                  onClick={clearCart}
                  className="text-[var(--color-brand-graylight)] hover:text-[var(--color-brand-gold)] font-semibold uppercase tracking-widest text-xs border-b border-[var(--color-brand-graylight)] hover:border-[var(--color-brand-gold)] transition-colors pb-1"
                >
                  {t.clearCart}
                </button>
              </div>

            </div>

            {/* Right Column: Order Summary */}
            <div className="w-full lg:w-[350px] shrink-0">
              <div className="bg-[var(--color-brand-navy)] border border-[var(--color-brand-gold)]/30 p-8 rounded-none flex flex-col gap-6 sticky top-24">
                <h2 className="font-serif font-bold text-[24px] text-[var(--color-brand-offwhite)] border-b border-[var(--color-brand-gold)]/20 pb-4">
                  {t.orderSummary}
                </h2>
                
                <div className="flex flex-col gap-4 text-[14px]">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--color-brand-graylight)]">{t.items}</span>
                    <span className="text-[var(--color-brand-offwhite)] font-semibold">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--color-brand-graylight)]">{t.subtotal}</span>
                    <span className="text-[var(--color-brand-offwhite)] font-semibold">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--color-brand-graylight)]">{t.shipping}</span>
                    <span className="text-[var(--color-brand-offwhite)] font-semibold">$0.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--color-brand-graylight)]">{t.taxes}</span>
                    <span className="text-[var(--color-brand-offwhite)] font-semibold">$0.00</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-[var(--color-brand-gold)]/20">
                    <span className="text-[var(--color-brand-graylight)]">{t.couponDiscount}</span>
                    <span className="text-[var(--color-brand-offwhite)] font-semibold">-$0.00</span>
                  </div>
                  
                  {/* Coupon Area Inside Order Summary */}
                  <form onSubmit={handleApplyCoupon} className="flex flex-col gap-2 pb-4 border-b border-[var(--color-brand-gold)]/20">
                    <input 
                      type="text" 
                      placeholder={t.couponPlaceholder}
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="bg-[var(--color-brand-navymid)] border border-[var(--color-brand-gold)]/30 px-4 py-2 text-[var(--color-brand-offwhite)] focus:outline-none focus:border-[var(--color-brand-gold)] rounded-none w-full text-sm"
                    />
                    <button 
                      type="submit"
                      className="bg-[var(--color-brand-navymid)] text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)] hover:text-[var(--color-brand-navy)] px-4 py-2 font-semibold uppercase tracking-widest text-[11px] transition-colors rounded-none border border-[var(--color-brand-gold)]/50 w-full"
                    >
                      {t.applyCoupon}
                    </button>
                  </form>

                  <div className="flex justify-between items-center pt-2">
                    <span className="font-semibold text-[16px] text-[var(--color-brand-offwhite)]">{t.total}</span>
                    <span className="font-serif font-bold text-[28px] text-[var(--color-brand-gold)]">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] px-8 py-4 font-semibold uppercase tracking-widest text-[13px] hover:scale-[1.02] transition-transform rounded-none mt-2"
                >
                  {t.proceed}
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
