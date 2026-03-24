import React, { useState, useEffect } from "react";

export default function InventoryApp() {
  // -------------------- 後台資料 --------------------
  const [materials, setMaterials] = useState(() => JSON.parse(localStorage.getItem("materials")) || []);
  const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem("products")) || []);
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem("orders")) || []);

  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("materials", JSON.stringify(materials));
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [materials, products, orders]);

  // -------------------- 材料管理 --------------------
  const [materialName, setMaterialName] = useState("");
  const [materialStock, setMaterialStock] = useState(0);
  const [materialPrice, setMaterialPrice] = useState(0);

  const addMaterial = () => {
    if (!materialName) return;
    setMaterials([...materials, { name: materialName, stock: materialStock, price: materialPrice }]);
    setMaterialName(""); setMaterialStock(0); setMaterialPrice(0);
  };

  const deleteMaterial = (name) => setMaterials(materials.filter(m => m.name !== name));

  // -------------------- 商品管理 --------------------
  const [productName, setProductName] = useState("");
  const [productStock, setProductStock] = useState(0);
  const [productCategory, setProductCategory] = useState("");
  const [productMaterials, setProductMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [materialUsage, setMaterialUsage] = useState(0);
  const [productImage, setProductImage] = useState("");

  const addMaterialToProduct = () => {
    if (!selectedMaterial) return;
    setProductMaterials([...productMaterials, { name: selectedMaterial, qty: materialUsage }]);
    setSelectedMaterial(""); setMaterialUsage(0);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setProductImage(event.target.result);
    reader.readAsDataURL(file);
  };

  const addProduct = () => {
    if (!productName) return;
    setProducts([...products, {
      name: productName,
      stock: productStock,
      category: productCategory,
      materials: productMaterials,
      image: productImage,
    }]);
    setProductName(""); setProductStock(0); setProductCategory(""); setProductMaterials([]); setProductImage("");
  };

  const deleteProduct = (name) => setProducts(products.filter(p => p.name !== name));

  const calculateCost = (product) =>
    product.materials.reduce((sum, pm) => {
      const mat = materials.find(m => m.name === pm.name);
      return sum + (mat ? mat.price * pm.qty : 0);
    }, 0);

  // -------------------- 前台購物車 & 下單 --------------------
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerIG, setCustomerIG] = useState("");
  const [orderNote, setOrderNote] = useState("");

  const addToCart = (product) => setCart([...cart, { ...product, qty: 1 }]);
  const updateCartQty = (index, qty) => {
    const newCart = [...cart]; newCart[index].qty = qty; setCart(newCart);
  };
  const removeCartItem = (index) => { const newCart = [...cart]; newCart.splice(index, 1); setCart(newCart); };

  const placeOrder = () => {
    if (!customerName || cart.length === 0) return;
    const newOrder = { customerName, customerIG, note: orderNote, items: cart };
    setOrders([...orders, newOrder]);

    // 扣庫存
    let updatedProducts = [...products];
    let updatedMaterials = [...materials];
    cart.forEach(cartItem => {
      updatedProducts = updatedProducts.map(p =>
        p.name === cartItem.name ? { ...p, stock: p.stock - cartItem.qty } : p
      );
      const prod = products.find(p => p.name === cartItem.name);
      if (prod) {
        prod.materials.forEach(pm => {
          updatedMaterials = updatedMaterials.map(m =>
            m.name === pm.name ? { ...m, stock: m.stock - pm.qty * cartItem.qty } : m
          );
        });
      }
    });
    setProducts(updatedProducts); setMaterials(updatedMaterials);
    setCart([]); setCustomerName(""); setCustomerIG(""); setOrderNote("");
  };

  // -------------------- 後台統計 --------------------
  const totalRevenue = orders.reduce((sum, order) =>
    sum + order.items.reduce((s, i) => s + calculateCost(i) * i.qty, 0)
  , 0);

  const totalCost = orders.reduce((sum, order) =>
    sum + order.items.reduce((s, i) => {
      const prod = products.find(p => p.name === i.name);
      return s + (prod ? calculateCost(prod) * i.qty : 0);
    }, 0)
  , 0);

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const filteredProducts = products.filter(p =>
    p.name.includes(search) || p.category?.includes(search)
  );

  const deleteOrder = (index) => { const newOrders = [...orders]; newOrders.splice(index, 1); setOrders(newOrders); };

  return (
    <div style={{ padding: 12, fontFamily: "sans-serif", background: "#fff0f5", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", color: "hotpink" }}>🌸 Kaori香氣飾 - 商店 & 後台系統</h1>

      {/* 搜尋 & 分類 */}
      <input placeholder="搜尋商品或分類..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 5, borderRadius: 8 }} />
      <div style={{ marginBottom: 10 }}>
        {categories.map((c, i) => <button key={i} onClick={() => setSearch(c)} style={{ margin: 3, borderRadius: 8, background: "pink" }}>{c}</button>)}
      </div>

      {/* 商品展示 */}
      <h2>🛍 商店展示</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {filteredProducts.map((p, i) => (
          <div key={i} style={{ border: "1px solid pink", borderRadius: 12, margin: 5, padding: 8, width: 150 }}>
            <div style={{ height: 100, background: "#ffe6f0", marginBottom: 5, textAlign: "center", lineHeight: "100px" }}>
              {p.image ? <img src={p.image} alt={p.name} style={{ maxHeight: "100%" }} /> : "🖼 圖片"}
            </div>
            <p style={{ margin: 2, fontWeight: "bold" }}>{p.name}</p>
            <p style={{ margin: 2 }}>分類: {p.category}</p>
            <p style={{ margin: 2 }}>價格: ${calculateCost(p)}</p>
            <p style={{ margin: 2 }}>庫存: {p.stock}</p>
            <button onClick={() => addToCart(p)} style={{ width: "100%", borderRadius: 8, background: "hotpink", color: "white" }}>加入購物車</button>
          </div>
        ))}
      </div>

      {/* 購物車 & 下單 */}
      <h2>🛒 購物車</h2>
      {cart.length === 0 ? <p>購物車是空的</p> :
        <div>{cart.map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span>{item.name} x </span>
            <input type="number" value={item.qty} min={1} style={{ width: 40 }}
              onChange={e => updateCartQty(i, Number(e.target.value))} />
            <button onClick={() => removeCartItem(i)} style={{ background: "pink", borderRadius: 5 }}>刪除</button>
          </div>
        ))}</div>
      }

      <h3>下單資訊</h3>
      <input placeholder="姓名" value={customerName} onChange={e => setCustomerName(e.target.value)}
        style={{ width: "100%", marginBottom: 5, borderRadius: 8, padding: 5 }} />
      <input placeholder="IG帳號" value={customerIG} onChange={e => setCustomerIG(e.target.value)}
        style={{ width: "100%", marginBottom: 5, borderRadius: 8, padding: 5 }} />
      <input placeholder="備註" value={orderNote} onChange={e => setOrderNote(e.target.value)}
        style={{ width: "100%", marginBottom: 5, borderRadius: 8, padding: 5 }} />
      <button onClick={placeOrder} style={{ width: "100%", background: "hotpink", color: "white", borderRadius: 8, padding: 8 }}>送出訂單</button>

      {/* 後台管理 */}
      <h2>📦 後台管理</h2>

      <h3>新增商品</h3>
      <input placeholder="商品名稱" value={productName} onChange={e => setProductName(e.target.value)} style={{ width: "100%", marginBottom: 5, borderRadius: 8, padding: 5 }} />
      <input type="number" placeholder="庫存" value={productStock} onChange={e => setProductStock(Number(e.target.value))} style={{ width: "100%", marginBottom: 5, borderRadius: 8, padding: 5 }} />
      <input placeholder="分類" value={productCategory} onChange={e => setProductCategory(e.target.value)} style={{ width: "100%", marginBottom: 5, borderRadius: 8, padding: 5 }} />
      <select value={selectedMaterial} onChange={e => setSelectedMaterial(e.target.value)} style={{ width: "100%", marginBottom: 5, borderRadius: 8, padding: 5 }}>
        <option value="">選擇材料</option>
        {materials.map((m,i) => <option key={i} value={m.name}>{m.name}</option>)}
      </select>
      <input type="number" placeholder="使用量" value={materialUsage} onChange={e => setMaterialUsage(Number(e.target.value))} style={{ width: "100%", marginBottom: 5, borderRadius: 8, padding: 5 }} />
      <button onClick={addMaterialToProduct} style={{ background: "pink", borderRadius: 8, width: "100%", marginBottom: 5 }}>加入材料</button>
      <input type="file" onChange={handleImageUpload} style={{ marginBottom: 5 }} />
      <button onClick={addProduct} style={{ background: "hotpink", color: "white", borderRadius: 8, width: "100%", marginBottom: 5 }}>新增商品</button>

      <h3>商品管理</h3>
      {products.map((p, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span>{p.name} (庫存: {p.stock})</span>
          <button onClick={() => deleteProduct(p.name)} style={{ background: "pink", borderRadius: 5 }}>刪除</button>
        </div>
      ))}

      <h3>材料管理</h3>
      {materials.map((m, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span>{m.name} (庫存: {m.stock}, 成本: {m.price})</span>
          <button onClick={() => deleteMaterial(m.name)} style={{ background: "pink", borderRadius: 5 }}>刪除</button>
        </div>
      ))}

      <h3>訂單管理</h3>
      {orders.map((o, i) => (
        <div key={i} style={{ border: "1px solid pink", borderRadius: 8, padding: 5, marginBottom: 5 }}>
          <p>客戶: {o.customerName} ({o.customerIG})</p>
          <p>備註: {o.note}</p>
          <ul>{o.items.map((item, idx) => <li key={idx}>{item.name} x {item.qty}</li>)}</ul>
          <button onClick={() => deleteOrder(i)} style={{ background: "pink", borderRadius: 5 }}>刪除訂單</button>
        </div>
      ))}

      {/* 統計 */}
      <h2>📊 統計</h2>
      <p>訂單數量: {orders.length}</p>
      <p>營業額: ${totalRevenue}</p>
      <p>成本: ${totalCost}</p>
      <p style={{ color: "hotpink" }}>利潤: ${totalRevenue - totalCost}</p>
    </div>
  );
}