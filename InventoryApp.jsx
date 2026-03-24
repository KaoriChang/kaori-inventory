import React, { useState, useEffect } from "react";

const LOCAL_STORAGE_KEY = "kaori-inventory-data";

export default function InventoryApp() {
  const [materials, setMaterials] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [newMaterial, setNewMaterial] = useState({ name: "", qty: 0 });
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    cost: 0,
    materialsUsed: [],
    image: "",
  });

  // 讀取 LocalStorage
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (savedData) {
      setMaterials(savedData.materials || []);
      setProducts(savedData.products || []);
      setCart(savedData.cart || []);
    }
  }, []);

  // 儲存 LocalStorage
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ materials, products, cart })
    );
  }, [materials, products, cart]);

  // 材料管理
  const addMaterial = () => {
    if (!newMaterial.name) return;
    setMaterials([...materials, { ...newMaterial }]);
    setNewMaterial({ name: "", qty: 0 });
  };
  const deleteMaterial = (index) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  // 商品管理
  const addProduct = () => {
    if (!newProduct.name) return;
    setProducts([...products, { ...newProduct }]);
    setNewProduct({
      name: "",
      price: 0,
      cost: 0,
      materialsUsed: [],
      image: "",
    });
  };
  const deleteProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  // 處理本地圖片選擇
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct({ ...newProduct, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // 購物車
  const addToCart = (product) => {
    setCart([...cart, { ...product, qty: 1 }]);
  };
  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  // 計算總額
  const totalRevenue = cart.reduce((sum, p) => sum + p.price * p.qty, 0);
  const totalCost = cart.reduce((sum, p) => sum + p.cost * p.qty, 0);
  const profit = totalRevenue - totalCost;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Kaori Inventory 系統</h1>

      {/* 材料管理 */}
      <section style={{ border: "1px solid #f0c", padding: "10px", margin: "10px 0" }}>
        <h2>材料管理</h2>
        <input
          placeholder="材料名稱"
          value={newMaterial.name}
          onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="數量"
          value={newMaterial.qty}
          onChange={(e) => setNewMaterial({ ...newMaterial, qty: Number(e.target.value) })}
        />
        <button onClick={addMaterial}>新增材料</button>
        <ul>
          {materials.map((m, i) => (
            <li key={i}>
              {m.name} - {m.qty} 
              <button onClick={() => deleteMaterial(i)}>刪除</button>
            </li>
          ))}
        </ul>
      </section>

      {/* 商品管理 */}
      <section style={{ border: "1px solid #0cf", padding: "10px", margin: "10px 0" }}>
        <h2>商品管理</h2>
        <input
          placeholder="商品名稱"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="售價"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
        />
        <input
          type="number"
          placeholder="成本"
          value={newProduct.cost}
          onChange={(e) => setNewProduct({ ...newProduct, cost: Number(e.target.value) })}
        />
        <input
          type="text"
          placeholder="圖片 URL"
          value={newProduct.image.startsWith("data:") ? "" : newProduct.image}
          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={addProduct}>新增商品</button>

        <ul>
          {products.map((p, i) => (
            <li key={i} style={{ margin: "10px 0" }}>
              {p.name} - 售價: {p.price} - 成本: {p.cost}{" "}
              {p.image && <img src={p.image} alt={p.name} width={50} />}
              <button onClick={() => addToCart(p)}>加入購物車</button>
              <button onClick={() => deleteProduct(i)}>刪除</button>
            </li>
          ))}
        </ul>
      </section>

      {/* 購物車 */}
      <section style={{ border: "1px solid #fc0", padding: "10px", margin: "10px 0" }}>
        <h2>購物車</h2>
        {cart.length === 0 ? (
          <p>購物車空</p>
        ) : (
          <ul>
            {cart.map((c, i) => (
              <li key={i}>
                {c.name} - 價格: {c.price} - 成本: {c.cost} - 數量: {c.qty}{" "}
                <button onClick={() => removeFromCart(i)}>移除</button>
              </li>
            ))}
          </ul>
        )}
        <p>總營收: {totalRevenue}</p>
        <p>總成本: {totalCost}</p>
        <p>利潤: {profit}</p>
      </section>
    </div>
  );
}