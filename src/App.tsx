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

export default function App() {
  return (
    <LangProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
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
      </Routes>
    </BrowserRouter>
    </CartProvider>
    </LangProvider>
  );
}
