import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import InventoryApp from "./InventoryApp"; // 你的後台管理頁
import ShopPage from "./ShopPage";         // 前台購物頁
import LoginPage from "./LoginPage";       // 登入頁

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (password) => {
    if (password === "kaori123") {
      setLoggedIn(true);
      return true;
    }
    return false;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ShopPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="/admin"
          element={loggedIn ? <InventoryApp /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;