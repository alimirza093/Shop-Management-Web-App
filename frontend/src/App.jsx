import React, { useEffect, useState } from "react";
import { getItems, addItem, deleteItem, updateItem, sellItem } from "./api.js";

function App() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [form, setForm] = useState({ name: "", quantity: 0, Rprice: 0, Wprice: 0 });
  const [prevName, setPrevName] = useState("");
  const [isSell, setIsSell] = useState(false);
  const [mode, setMode] = useState("add");

  // Fetch items from backend
  useEffect(() => {
    getItems().then((data) => {
      if (data.data) setItems(data.data);
    });
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const result = await addItem(form);
    if (result.data) {
      setItems([...items, result.data]);
      setForm({ name: "", quantity: 0, Rprice: 0, Wprice: 0 });
      setShowForm(false);
    } else {
      alert(result.error || "غلطی ہوئی");
    }
  };

  const handleDelete = async (name) => {
    if (!window.confirm("کیا آپ واقعی اس آئٹم کو حذف کرنا چاہتے ہیں؟")) return;
    await deleteItem(name);
    setItems(items.filter((item) => item.name !== name));
  };

  const handleDecreaseQty = async (e) => {
    e.preventDefault();
    const res = await sellItem(form.name, { quantity: form.quantity });
    if (!res.error) {
      setItems(items.map((item) => (item.name === form.name ? { ...item, quantity: res.data.remaining_quantity } : item)))
      setShowForm(false);
      setForm({ name: "", quantity: 0, Rprice: 0, Wprice: 0 });
    } else {
      alert(res.error || "غلطی ہوئی");
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await updateItem(prevName, form);
    if (!res.error) {
      setItems(items.map((item) => (item.name === prevName ? form : item)));
      setIsUpdating(false);
      setShowForm(false);
      setForm({ name: "", quantity: 0, Rprice: 0, Wprice: 0 });
    } else {
      alert(res.error || "غلطی ہوئی");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "add") {
      handleAdd(e);
    } else if (mode === "update") {
      handleUpdate(e);
    } else if (mode === "decrease") {
      handleDecreaseQty(e);
    }
  }

  return (
    <div style={{ maxWidth: "auto", margin: "auto", padding: "1rem", direction: "rtl" }}>
      <h1 style={{ textAlign: "center", marginTop: 0 }}>📦 دکان کا ذخیرہ</h1>

      {/* Add Item Button */}
      {!showForm && (
        <div style={{ textAlign: "left", marginBottom: "1rem" }}>
          <button
            onClick={() => {
              setShowForm(true)
              setMode("add");
              setForm({
                name: "",
                quantity: null,
                Rprice: null,
                Wprice: null
              })
            }}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            آئٹم شامل کریں
            ➕
          </button>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
          <input
            placeholder="نام"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            disabled={isSell}
          />
          <input
            type="number"
            placeholder="مقدار"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: +e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="قیمت"
            value={form.Rprice}
            onChange={(e) => setForm({ ...form, Rprice: +e.target.value })}
            required
            disabled={isSell}
          />
          <input
            type="number"
            placeholder="تھوک قیمت"
            value={form.Wprice}
            onChange={(e) => setForm({ ...form, Wprice: +e.target.value })}
            required
            disabled={isSell}
          />
          <button type="submit">{!isUpdating ? "محفوظ کریں" : "ترمیم کریں"}</button>
          <button type="button" onClick={() => {
            setShowForm(false);
            setIsUpdating(false);
            setPrevName("");
            setIsSell(false);
          }}>
            منسوخ کریں
          </button>
        </form>
      )}

      {/* Inventory Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "center",
          marginTop: "1rem",
        }}
      >
        <thead style={{ backgroundColor: "#f2f2f2" }}>
          <tr>
            <th>نام</th>
            <th>مقدار</th>
            <th>قیمت</th>
            <th>تھوک قیمت</th>
            <th>اعمال</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <tr key={item.name} style={{ borderBottom: "1px solid #ddd" }}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.Rprice}</td>
                <td>{item.Wprice}</td>
                <td>
                  <button
                    onClick={() => {
                      setPrevName(item.name)
                      setForm(item)
                      setIsUpdating(true)
                      setShowForm(true)
                      setMode("update");
                    }}
                    style={{ marginRight: "5px" }}
                  >
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(item.name)}>🗑️</button>
                  <button onClick={() => {
                    setForm({...item,quantity: null})
                    setShowForm(true)
                    setIsSell(true)
                    setMode("decrease");
                  }}>➖</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">کوئی آئٹمز موجود نہیں ہیں۔</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
