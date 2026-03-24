import React, { useState } from "react";

function ShopPage() {
  const [cart, setCart] = useState([]);
  const products = [
    { id: 1, name: "蝴蝶結耳環", price: 390 },
    { id: 2, name: "花朵項鍊", price: 490 }
  ];

  const addToCart = (product) => setCart([...cart, product]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Kaori 香氣飾品</h2>
      <h3>商品列表</h3>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} - ${p.price}{" "}
            <button onClick={() => addToCart(p)}>加入購物車</button>
          </li>
        ))}
      </ul>

      <h3>購物車</h3>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
      <p>總額: ${cart.reduce((sum, item) => sum + item.price, 0)}</p>
    </div>
  );
}

export default ShopPage;