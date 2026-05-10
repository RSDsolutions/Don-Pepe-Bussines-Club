/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Home } from "@/pages/Home";
import { Historia } from "@/pages/Historia";
import { Productos } from "@/pages/Productos";
import { Import } from "@/pages/Import";
import { Seafood } from "@/pages/Seafood";
import { Atm } from "@/pages/Atm";
import { Contacto } from "@/pages/Contacto";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="historia" element={<Historia />} />
          <Route path="productos" element={<Productos />} />
          <Route path="import" element={<Import />} />
          <Route path="seafood" element={<Seafood />} />
          <Route path="atm" element={<Atm />} />
          <Route path="contacto" element={<Contacto />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
