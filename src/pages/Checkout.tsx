import React, { useState, useEffect } from "react";
import {
  MapPin,
  User,
  Mail,
  Phone,
  ShoppingBag,
  Shield,
  ChevronLeft,
  Check,
  CreditCard,
  Truck
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useCart } from "@/contexts/CartContext";
import { useLang } from "@/contexts/LangContext";
import { AnimatedTicket } from "@/components/ui/ticket-confirmation-card";

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

const PAYPAL_CLIENT_ID = "ARqnZKhHtXfL46-Ax9518KAgwI1UFwCs0ptPasKzz1sPumOdKctJpaUfbiyUw71ZmSnUeKTAt6nPGMVu";

export function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "card">("paypal");
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const { lang } = useLang();

  const translations = {
    es: {
      checkout: "Pago",
      backToCart: "Volver al Carrito",
      shippingPayment: "Envío y Pago",
      reviewOrder: "Revisar Orden",
      shippingInfo: "Información de Envío",
      firstName: "Nombre *",
      lastName: "Apellido *",
      email: "Correo *",
      phone: "Teléfono",
      address: "Dirección *",
      city: "Ciudad *",
      state: "Estado *",
      selectState: "Seleccionar estado",
      zipCode: "Código Postal *",
      paymentMethods: "Métodos de Pago",
      paymentDesc: "Seleccione su método de pago preferido.",
      orderSummary: "Resumen de Orden",
      subtotal: "Subtotal",
      shipping: "Envío",
      taxes: "Impuestos",
      total: "Total",
      secureEncrypted: "Seguro & Encriptado",
      secureDesc: "Sus datos están protegidos con encriptación SSL de 256 bits.",
      orderCompleted: "¡Orden Completada!",
      thankYou: "Gracias por tu compra. Hemos recibido tu orden y el pago exitosamente. Un correo de confirmación ha sido enviado a",
      shippingDetails: "Detalles de Envío",
      continueShopping: "Continuar Comprando",
      paypalLogin: "Inicio de sesión de PayPal",
      paypalLoginDesc: "Pague de forma rápida y segura usando su cuenta.",
      paypalCard: "Tarjeta de Crédito / Débito",
      paypalCardDesc: "Pague usando tarjeta sin necesidad de cuenta."
    },
    en: {
      checkout: "Checkout",
      backToCart: "Back to Cart",
      shippingPayment: "Shipping & Payment",
      reviewOrder: "Review Order",
      shippingInfo: "Shipping Information",
      firstName: "First Name *",
      lastName: "Last Name *",
      email: "Email *",
      phone: "Phone",
      address: "Address *",
      city: "City *",
      state: "State *",
      selectState: "Select state",
      zipCode: "ZIP Code *",
      paymentMethods: "Payment Methods",
      paymentDesc: "Select your preferred payment method.",
      orderSummary: "Order Summary",
      subtotal: "Subtotal",
      shipping: "Shipping",
      taxes: "Taxes",
      total: "Total",
      secureEncrypted: "Secure & Encrypted",
      secureDesc: "Your data is protected with 256-bit SSL encryption.",
      orderCompleted: "Order Completed!",
      thankYou: "Thank you for your purchase. We have received your order and payment successfully. An email confirmation has been sent to",
      shippingDetails: "Shipping Details",
      continueShopping: "Continue Shopping",
      paypalLogin: "PayPal Login",
      paypalLoginDesc: "Pay quickly and securely using your account.",
      paypalCard: "Credit / Debit Card",
      paypalCardDesc: "Pay using your card without an account."
    }
  };
  
  const t = translations[lang];

  // Redirect to cart if empty
  useEffect(() => {
    if (cartItems.length === 0 && currentStep !== 3) {
      navigate('/cart');
    }
  }, [cartItems, navigate, currentStep]);

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleApprove = (data: any, actions: any) => {
    return actions.order.capture().then(function (details: any) {
      setCompletedOrder({
         ticketId: `REQ-${Math.floor(Math.random() * 1000000)}`,
         amount: cartTotal,
         date: new Date(),
         cardHolder: `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim() || "Cliente",
         last4Digits: "3913",
         paymentType: paymentMethod === 'paypal' ? 'PayPal' : 'Visa',
         items: cartItems,
         shippingAddress: shippingAddress
      });
      // Simulate success flow
      setCurrentStep(3); 
      clearCart(); // Empty the cart on successful purchase
    });
  };

  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD" }}>
      
      {currentStep === 3 && completedOrder && (
        <AnimatedTicket
          ticketId={completedOrder.ticketId}
          amount={completedOrder.amount}
          date={completedOrder.date}
          cardHolder={completedOrder.cardHolder}
          last4Digits={completedOrder.last4Digits}
          paymentType={completedOrder.paymentType}
          items={completedOrder.items}
          shippingAddress={completedOrder.shippingAddress}
          onClose={() => {
            setCurrentStep(1);
            setCompletedOrder(null);
            navigate('/');
          }}
        />
      )}

      <div className={`w-full min-h-screen bg-[var(--color-brand-black)] text-[var(--color-brand-graylight)] pt-14 pb-16 overflow-x-hidden ${currentStep === 3 ? 'print:hidden' : ''}`}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative">
          
          {/* Header */}
          <div className="relative flex flex-col items-center justify-center text-center mb-1 pt-2 pb-0">
            {/* Decorative Bubbles Left */}
            <div className="absolute top-0 left-0 w-32 h-32 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, var(--color-brand-gold) 3px, transparent 4px)', backgroundSize: '16px 16px' }} />
            {/* Decorative Bubbles Right */}
            <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, var(--color-brand-gold) 3px, transparent 4px)', backgroundSize: '16px 16px' }} />
            
            <h1 className="font-serif font-bold text-[40px] md:text-[48px] text-[var(--color-brand-offwhite)] mb-4 relative z-10">
              {t.checkout}
            </h1>
            <nav className="flex items-center gap-2 text-[12px] font-sans font-semibold uppercase tracking-widest text-[var(--color-brand-graylight)] relative z-10">
              <Link to="/cart" className="flex items-center gap-1 hover:text-[var(--color-brand-gold)] transition-colors">
                <ChevronLeft className="h-4 w-4" />
                {t.backToCart}
              </Link>
            </nav>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 pt-0 pb-4 mb-4">
            {[
              { step: 1, label: t.shippingPayment, icon: Truck },
              { step: 3, label: t.reviewOrder, icon: Check },
            ].map(({ step, label, icon: Icon }, index) => (
              <div key={step} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center justify-center w-8 h-8 border-2 transition-colors rounded-none ${
                      currentStep >= step
                        ? "bg-[var(--color-brand-gold)] border-[var(--color-brand-gold)] text-[var(--color-brand-navy)]"
                        : "border-[var(--color-brand-gold)]/30 text-[var(--color-brand-graylight)]"
                    }`}
                  >
                    {currentStep > step ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className={`text-sm font-medium uppercase tracking-widest hidden sm:block ${currentStep >= step ? "text-[var(--color-brand-offwhite)]" : "text-[var(--color-brand-graylight)]"}`}>
                    {label}
                  </span>
                </div>
                {index === 0 && (
                  <div className={`w-8 h-0.5 ${currentStep > step ? "bg-[var(--color-brand-gold)]" : "bg-[var(--color-brand-gold)]/20"}`} />
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col-reverse lg:flex-row gap-12">
            
            {/* Main Content */}
            <div className="w-full lg:w-2/3 flex flex-col gap-8">
              
              <div className="bg-[var(--color-brand-navy)] border border-[var(--color-brand-gold)]/20 rounded-none flex flex-col gap-0">
                  <div className="p-4 sm:p-6 border-b border-[var(--color-brand-gold)]/20 bg-[var(--color-brand-navymid)]/30">
                    <h2 className="text-xl font-serif font-bold flex items-center gap-2 text-[var(--color-brand-offwhite)]">
                      <MapPin className="h-5 w-5 text-[var(--color-brand-gold)]" />
                      {t.shippingInfo}
                    </h2>
                  </div>
                  <div className="p-4 sm:p-6 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-graylight)]">{t.firstName}</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-brand-gold)]" />
                          <input
                            type="text"
                            className="w-full pl-10 pr-4 py-3 bg-[var(--color-brand-navymid)] border border-[var(--color-brand-gold)]/30 text-[var(--color-brand-offwhite)] focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors rounded-none text-base"
                            placeholder="John"
                            value={shippingAddress.firstName}
                            onChange={(e) => handleAddressChange("firstName", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-graylight)]">{t.lastName}</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-[var(--color-brand-navymid)] border border-[var(--color-brand-gold)]/30 text-[var(--color-brand-offwhite)] focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors rounded-none text-base"
                          placeholder="Doe"
                          value={shippingAddress.lastName}
                          onChange={(e) => handleAddressChange("lastName", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-graylight)]">{t.email}</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-brand-gold)]" />
                          <input
                            type="email"
                            className="w-full pl-10 pr-4 py-3 bg-[var(--color-brand-navymid)] border border-[var(--color-brand-gold)]/30 text-[var(--color-brand-offwhite)] focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors rounded-none text-base"
                            placeholder="john@example.com"
                            value={shippingAddress.email}
                            onChange={(e) => handleAddressChange("email", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-graylight)]">{t.phone}</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-brand-gold)]" />
                          <input
                            type="tel"
                            className="w-full pl-10 pr-4 py-3 bg-[var(--color-brand-navymid)] border border-[var(--color-brand-gold)]/30 text-[var(--color-brand-offwhite)] focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors rounded-none text-base"
                            placeholder="+1 (555) 123-4567"
                            value={shippingAddress.phone}
                            onChange={(e) => handleAddressChange("phone", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-graylight)]">{t.address}</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-[var(--color-brand-navymid)] border border-[var(--color-brand-gold)]/30 text-[var(--color-brand-offwhite)] focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors rounded-none text-base"
                        placeholder="123 Main Street"
                        value={shippingAddress.address}
                        onChange={(e) => handleAddressChange("address", e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-graylight)]">{t.city}</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-[var(--color-brand-navymid)] border border-[var(--color-brand-gold)]/30 text-[var(--color-brand-offwhite)] focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors rounded-none text-base"
                          placeholder="New York"
                          value={shippingAddress.city}
                          onChange={(e) => handleAddressChange("city", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-graylight)]">{t.state}</label>
                        <select
                          className="w-full px-4 py-3 bg-[var(--color-brand-navymid)] border border-[var(--color-brand-gold)]/30 text-[var(--color-brand-offwhite)] focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors rounded-none appearance-none"
                          value={shippingAddress.state}
                          onChange={(e) => handleAddressChange("state", e.target.value)}
                        >
                          <option value="">{t.selectState}</option>
                          <option value="CA">California</option>
                          <option value="NY">New York</option>
                          <option value="TX">Texas</option>
                          <option value="FL">Florida</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-graylight)]">{t.zipCode}</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-[var(--color-brand-navymid)] border border-[var(--color-brand-gold)]/30 text-[var(--color-brand-offwhite)] focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors rounded-none text-base"
                          placeholder="10001"
                          value={shippingAddress.zipCode}
                          onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="flex flex-col gap-4 border-t border-[var(--color-brand-gold)]/20 pt-8 mt-4">
                      <label className="text-xl font-serif font-bold text-[var(--color-brand-offwhite)] flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-[var(--color-brand-gold)]" />
                        {t.paymentMethods}
                      </label>
                      <p className="text-[14px] text-[var(--color-brand-graylight)] mb-2">{t.paymentDesc}</p>
                      
                      {/* Payment Method Selector Component */}
                      <div className="w-full space-y-4 mb-4">
                        {/* Option 1: PayPal Login */}
                        <div 
                          className="flex flex-col border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-navymid)] transition-all duration-300"
                          style={{
                            borderColor: paymentMethod === 'paypal' ? 'var(--color-brand-gold)' : '',
                            boxShadow: paymentMethod === 'paypal' ? '0 0 0 1px var(--color-brand-gold)' : 'none',
                          }}
                        >
                          <div 
                            className="flex items-center p-4 cursor-pointer hover:bg-[var(--color-brand-navy)]"
                            onClick={() => setPaymentMethod('paypal')}
                          >
                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[var(--color-brand-navy)] text-[var(--color-brand-gold)] rounded-sm">
                              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.92a.641.641 0 0 1 .633-.543h6.927c3.299 0 5.049 1.587 4.54 4.672-.458 2.774-2.582 4.672-5.498 4.672H9.64a.641.641 0 0 0-.633.543l-1.93 12.073zm.886-5.554h2.584c4.378 0 7.155-2.022 7.82-5.901.542-3.176-.902-5.06-3.847-5.06H9.176a.641.641 0 0 0-.633.543L6.8 15.24a.641.641 0 0 0 .633.543z"/>
                                <path fill="currentColor" d="M10.51 21.337h4.606a.641.641 0 0 0 .633-.74l1.328-8.312a.641.641 0 0 1 .633-.543h1.906c2.916 0 5.04-1.898 5.498-4.672.338-2.046-.226-3.565-1.505-4.54l-1.306 8.163a.641.641 0 0 1-.633.543h-2.584c-4.378 0-7.155 2.022-7.82 5.901l-1.39 8.7z"/>
                              </svg>
                            </div>
                            <div className="ml-4 flex-grow">
                              <p className="font-semibold text-[var(--color-brand-offwhite)]">{t.paypalLogin}</p>
                              <p className="text-sm text-[var(--color-brand-graylight)]">{t.paypalLoginDesc}</p>
                            </div>
                            <div className="ml-4 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors"
                              style={{ borderColor: paymentMethod === 'paypal' ? 'var(--color-brand-gold)' : 'rgba(255,255,255,0.2)' }}
                            >
                              {paymentMethod === 'paypal' && (
                                <div className="h-3 w-3 rounded-full bg-[var(--color-brand-gold)] animate-pulse" />
                              )}
                            </div>
                          </div>
                          
                          {/* Expanded Content: PayPal Buttons */}
                          {paymentMethod === 'paypal' && (
                            <div className="p-4 border-t border-[var(--color-brand-gold)]/20 bg-transparent relative z-0">
                              <PayPalButtons 
                                fundingSource="paypal"
                                style={{ layout: "vertical", shape: "rect", color: "gold" }} 
                                createOrder={(data, actions) => {
                                  return actions.order.create({
                                    intent: "CAPTURE",
                                    purchase_units: [{ amount: { currency_code: "USD", value: cartTotal.toFixed(2) } }],
                                  });
                                }}
                                onApprove={handleApprove}
                              />
                            </div>
                          )}
                        </div>

                        {/* Option 2: Credit Card */}
                        <div 
                          className="flex flex-col border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-navymid)] transition-all duration-300"
                          style={{
                            borderColor: paymentMethod === 'card' ? 'var(--color-brand-gold)' : '',
                            boxShadow: paymentMethod === 'card' ? '0 0 0 1px var(--color-brand-gold)' : 'none',
                          }}
                        >
                          <div 
                            className="flex items-center p-4 cursor-pointer hover:bg-[var(--color-brand-navy)]"
                            onClick={() => setPaymentMethod('card')}
                          >
                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-[var(--color-brand-navy)] bg-[var(--color-brand-gold)] rounded-sm">
                              <CreditCard className="w-5 h-5" />
                            </div>
                            <div className="ml-4 flex-grow">
                              <p className="font-semibold text-[var(--color-brand-offwhite)]">{t.paypalCard}</p>
                              <p className="text-sm text-[var(--color-brand-graylight)]">{t.paypalCardDesc}</p>
                            </div>
                            <div className="ml-4 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors"
                              style={{ borderColor: paymentMethod === 'card' ? 'var(--color-brand-gold)' : 'rgba(255,255,255,0.2)' }}
                            >
                              {paymentMethod === 'card' && (
                                <div className="h-3 w-3 rounded-full bg-[var(--color-brand-gold)] animate-pulse" />
                              )}
                            </div>
                          </div>

                          {/* Expanded Content: Credit Card Form */}
                          {paymentMethod === 'card' && (
                            <div className="p-4 border-t border-[var(--color-brand-gold)]/20 bg-transparent relative z-0">
                              <PayPalButtons 
                                fundingSource="card"
                                style={{ layout: "vertical", shape: "rect", color: "gold" }} 
                                createOrder={(data, actions) => {
                                  return actions.order.create({
                                    intent: "CAPTURE",
                                    purchase_units: [{ amount: { currency_code: "USD", value: cartTotal.toFixed(2) } }],
                                  });
                                }}
                                onApprove={handleApprove}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6 shrink-0">
              <div className="bg-[var(--color-brand-navy)] border border-[var(--color-brand-gold)]/30 p-4 sm:p-8 rounded-none flex flex-col gap-6 lg:sticky top-24">
                <h3 className="font-serif font-bold text-[24px] flex items-center gap-2 text-[var(--color-brand-offwhite)] border-b border-[var(--color-brand-gold)]/20 pb-4">
                  <ShoppingBag className="h-5 w-5 text-[var(--color-brand-gold)]" />
                  {t.orderSummary}
                </h3>
                
                <div className="flex flex-col gap-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="relative w-16 h-20 shrink-0 bg-[var(--color-brand-navymid)] border border-[var(--color-brand-gold)]/30">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <span className="absolute -top-2 -right-2 bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] font-bold text-[10px] w-5 h-5 flex items-center justify-center rounded-none shadow-sm">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif font-bold text-[16px] text-[var(--color-brand-offwhite)] line-clamp-2">{item.name}</p>
                        <p className="text-[12px] font-semibold uppercase tracking-widest text-[var(--color-brand-gold)] mt-1">${item.price}</p>
                      </div>
                      <div className="text-[16px] font-bold text-[var(--color-brand-offwhite)]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 border-t border-[var(--color-brand-gold)]/20 pt-6 mt-2">
                  <div className="flex justify-between text-[14px] text-[var(--color-brand-graylight)]">
                    <span>{t.subtotal}</span>
                    <span className="text-[var(--color-brand-offwhite)] font-semibold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[14px] text-[var(--color-brand-graylight)]">
                    <span>{t.shipping}</span>
                    <span className="text-[var(--color-brand-offwhite)] font-semibold">$0.00</span>
                  </div>
                  <div className="flex justify-between text-[14px] text-[var(--color-brand-graylight)]">
                    <span>{t.taxes}</span>
                    <span className="text-[var(--color-brand-offwhite)] font-semibold">$0.00</span>
                  </div>
                  <div className="flex justify-between font-serif font-bold text-[28px] border-t border-[var(--color-brand-gold)]/20 pt-4 mt-2 text-[var(--color-brand-gold)]">
                    <span>{t.total}</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--color-brand-navymid)] border border-[var(--color-brand-gold)]/20 p-6 rounded-none">
                <div className="flex items-start gap-4">
                  <Shield className="h-6 w-6 text-[var(--color-brand-gold)] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[14px] text-[var(--color-brand-offwhite)] uppercase tracking-wider mb-1">{t.secureEncrypted}</div>
                    <div className="text-[13px] text-[var(--color-brand-graylight)] leading-relaxed">{t.secureDesc}</div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
