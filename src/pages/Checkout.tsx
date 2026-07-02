import React, { useState, useEffect } from "react";
import {
  MapPin,
  User,
  Mail,
  Phone,
  ShoppingBag,
  Shield,
  ChevronLeft,
  Percent,
  X,
  Check,
  CreditCard,
  Truck
} from "lucide-react";
import { Link } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  discount?: number;
}

interface CheckoutSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const PAYPAL_CLIENT_ID = "ARqnZKhHtXfL46-Ax9518KAgwI1UFwCs0ptPasKzz1sPumOdKctJpaUfbiyUw71ZmSnUeKTAt6nPGMVu";

export function Checkout() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
    country: "US",
  });
  const [appliedPromo, setAppliedPromo] = useState<string>("SAVE10");

  const sampleOrderItems: OrderItem[] = [
    {
      id: "1",
      name: "Wireless Bluetooth Headphones",
      price: 89.99,
      originalPrice: 129.99,
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1165&auto=format&fit=crop",
      quantity: 2,
      discount: 31,
    },
    {
      id: "2",
      name: "Minimalist Desk Lamp",
      price: 45.99,
      image: "https://images.unsplash.com/photo-1617363020293-62faac14783d?q=80&w=687&auto=format&fit=crop",
      quantity: 1,
    }
  ];

  useEffect(() => {
    const loadCheckout = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setOrderItems(sampleOrderItems);
      setIsLoading(false);
    };
    loadCheckout();
  }, []);

  const calculateSummary = (): CheckoutSummary => {
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = appliedPromo === "SAVE10" ? subtotal * 0.1 : 0;
    const shipping = 9.99; // Standard fixed shipping since we removed methods
    const tax = (subtotal - discount) * 0.08;
    const total = subtotal - discount + shipping + tax;

    return { subtotal, discount, shipping, tax, total };
  };

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const summary = calculateSummary();

  const handleApprove = (data: any, actions: any) => {
    return actions.order.capture().then(function (details: any) {
      alert("Transaction completed by " + details.payer.name.given_name);
      setCurrentStep(3); // Go to success/review page
    });
  };

  if (isLoading) {
    return (
      <div className="w-full mx-auto p-6 flex flex-col gap-6 max-w-7xl animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-gray-200 rounded-lg"></div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD" }}>
      <div className="w-full mx-auto p-6 flex flex-col gap-6 max-w-7xl pt-24">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-4 flex-col">
            <Link to="/productos" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors">
              <ChevronLeft className="h-4 w-4" />
              Back to Store
            </Link>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold flex items-center gap-2">Checkout</h1>
              <p className="text-gray-500 text-sm">Complete your purchase securely</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
            <Shield className="h-3 w-3" />
            SSL Secured
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-start gap-4 sm:gap-6 py-4">
          {[
            { step: 1, label: "Shipping & Payment", icon: Truck },
            { step: 3, label: "Review Order", icon: Check },
          ].map(({ step, label, icon: Icon }, index) => (
            <div key={step} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                    currentStep >= step
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {currentStep > step ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${currentStep >= step ? "text-gray-900" : "text-gray-400"}`}>
                  {label}
                </span>
              </div>
              {index === 0 && (
                <div className={`w-8 h-0.5 ${currentStep > step ? "bg-blue-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {currentStep === 1 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col gap-6">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Shipping Information
                  </h2>
                </div>
                <div className="p-6 flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">First Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="John"
                          value={shippingAddress.firstName}
                          onChange={(e) => handleAddressChange("firstName", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Last Name *</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Doe"
                        value={shippingAddress.lastName}
                        onChange={(e) => handleAddressChange("lastName", e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="email"
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="john@example.com"
                          value={shippingAddress.email}
                          onChange={(e) => handleAddressChange("email", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="tel"
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="+1 (555) 123-4567"
                          value={shippingAddress.phone}
                          onChange={(e) => handleAddressChange("phone", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Address *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="123 Main Street"
                      value={shippingAddress.address}
                      onChange={(e) => handleAddressChange("address", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">City *</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="New York"
                        value={shippingAddress.city}
                        onChange={(e) => handleAddressChange("city", e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">State *</label>
                      <select
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                        value={shippingAddress.state}
                        onChange={(e) => handleAddressChange("state", e.target.value)}
                      >
                        <option value="">Select state</option>
                        <option value="CA">California</option>
                        <option value="NY">New York</option>
                        <option value="TX">Texas</option>
                        <option value="FL">Florida</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">ZIP Code *</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="10001"
                        value={shippingAddress.zipCode}
                        onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Payment Methods (Replaces Shipping Method) */}
                  <div className="flex flex-col gap-4 border-t border-gray-200 pt-6 mt-2">
                    <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      Métodos de Pago
                    </label>
                    <p className="text-sm text-gray-500 mb-2">Seleccione su método de pago preferido mediante PayPal.</p>
                    <div className="w-full max-w-md mx-auto md:mx-0 z-0 relative">
                      <PayPalButtons 
                        style={{ layout: "vertical", shape: "rect", color: "blue" }} 
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            intent: "CAPTURE",
                            purchase_units: [
                              {
                                amount: {
                                  currency_code: "USD",
                                  value: summary.total.toFixed(2),
                                },
                              },
                            ],
                          });
                        }}
                        onApprove={handleApprove}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col gap-6">
                <div className="p-6 border-b border-gray-100 bg-green-50">
                  <h2 className="text-xl font-semibold flex items-center gap-2 text-green-800">
                    <Check className="h-6 w-6 text-green-600" />
                    Order Completed!
                  </h2>
                </div>
                <div className="p-6 flex flex-col gap-6">
                  <p className="text-gray-600">
                    Thank you for your purchase. We have received your order and payment successfully. 
                    An email confirmation has been sent to <strong>{shippingAddress.email || "your email"}</strong>.
                  </p>
                  
                  <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900">Shipping Details</h3>
                    <div className="text-sm text-gray-600">
                      <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
                      <p>{shippingAddress.address}</p>
                      <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Link to="/productos" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-5">
              <h3 className="font-semibold flex items-center gap-2 text-gray-800 border-b border-gray-100 pb-4">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
                Order Summary
              </h3>
              <div className="flex flex-col gap-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md border border-gray-200" />
                      <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs min-w-[1.25rem] h-5 flex items-center justify-center rounded-full px-1 shadow-sm">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold text-gray-900">${item.price}</span>
                        {item.originalPrice && (
                          <span className="text-xs text-gray-500 line-through">${item.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 flex items-center">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {appliedPromo && (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200 mt-2">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">{appliedPromo}</span>
                  </div>
                  <button onClick={() => setAppliedPromo("")} className="text-green-600 hover:text-green-800 p-1">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 mt-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">${summary.subtotal.toFixed(2)}</span>
                </div>
                {summary.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-${summary.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">${summary.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax</span>
                  <span className="font-medium text-gray-900">${summary.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-3 mt-1 text-gray-900">
                  <span>Total</span>
                  <span>${summary.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-sm text-gray-900">Secure & Encrypted</div>
                  <div className="text-xs text-gray-500 mt-1">Your data is protected with 256-bit SSL encryption</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
