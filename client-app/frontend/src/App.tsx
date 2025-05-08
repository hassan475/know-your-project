import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddProductForm from "./components/AddProductForm";
import Products from "./components/Products";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
      <Route path="/products" element={<Products />} />
        <Route path="/add-product" element={<AddProductForm />} />
        {/* Later you can add: <Route path="/product/:id" element={<ProductDetails />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
