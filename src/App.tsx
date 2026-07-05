/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Home } from "@/pages/Home";
import { Historia } from "@/pages/Historia";
import { Productos } from "@/pages/Productos";
import { Import } from "@/pages/Import";
import { Seafood } from "@/pages/Seafood";
import { Atm } from "@/pages/Atm";
import { Contacto } from "@/pages/Contacto";
import { ProductDetail } from "@/pages/ProductDetail";
import { Checkout } from "@/pages/Checkout";
import { Cart } from "@/pages/Cart";
import { LangProvider } from "@/contexts/LangContext";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminLayout, RequireAuth } from "@/components/admin/AdminLayout";
import { AdminLogin } from "@/pages/admin/AdminLogin";
import { Dashboard } from "@/pages/admin/Dashboard";
import { AdminProducts } from "@/pages/admin/AdminProducts";
import { AdminOrders } from "@/pages/admin/AdminOrders";
import { AdminInventory } from "@/pages/admin/AdminInventory";
import { AdminLedger } from "@/pages/admin/AdminLedger";

export default function App() {
  return (
    <AuthProvider>
      <LangProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Public storefront */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="historia" element={<Historia />} />
                <Route path="productos" element={<Productos />} />
                <Route path="import" element={<Import />} />
                <Route path="seafood" element={<Seafood />} />
                <Route path="atm" element={<Atm />} />
                <Route path="contacto" element={<Contacto />} />
                <Route path="producto/:id" element={<ProductDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
              </Route>

              {/* Admin platform */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <RequireAuth>
                    <AdminLayout />
                  </RequireAuth>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="productos" element={<AdminProducts />} />
                <Route path="ordenes" element={<AdminOrders />} />
                <Route path="inventario" element={<AdminInventory />} />
                <Route path="contabilidad" element={<AdminLedger />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </LangProvider>
    </AuthProvider>
  );
}
