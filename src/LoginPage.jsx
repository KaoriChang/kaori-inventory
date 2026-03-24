import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin(password)) {
      navigate("/admin");
    } else {
      setError("密碼錯誤");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>後台登入</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="輸入密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">登入</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default LoginPage;