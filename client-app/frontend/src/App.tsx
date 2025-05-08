import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AddProductForm from "./components/AddProductForm";
import Products from "./components/Products";
import EditProductForm from "./components/EditProductForm";
import DisplayProduct from "./components/DisplayProduct";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/products"        element={<Products />} />
        <Route path="/add-product"     element={<AddProductForm />} />
        <Route path="/edit-product/:id" element={<EditProductForm />} />
        <Route path="/product/:id"      element={<DisplayProduct />} />
        <Route path="*"                 element={<Navigate to="/products" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
