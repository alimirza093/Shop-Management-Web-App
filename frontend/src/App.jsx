import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie"
import { getItems, addItem, deleteItem, updateItem, sellItem, checkPassword, getItemSuggestions } from "./api.js";
import { Link, useNavigate } from 'react-router-dom'

function App() {
  const [items, setItems] = useState([]);
  const [items2, setItems2] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [form, setForm] = useState({ name: "", quantity: 0, Rprice: 0, Wprice: 0 });
  const [prevName, setPrevName] = useState("");
  const [isSell, setIsSell] = useState(false);
  const [mode, setMode] = useState("add");
  const [isNewUser, setIsNewUser] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Fetch items from backend
  useEffect(() => {
    checkPassword().then((data) => {
      if (data.data == 1) {
        setIsNewUser(false)
      }
      else {
        setIsNewUser(true)
        navigate("/set-password")
      }
    })

    const authCookie = Cookies.get("auth");
    if (!authCookie) {
      console.warn("🔒 Cookie missing — redirecting to login...");
      navigate("/login");
      return;
    }

    getItems().then((data) => {
      if (data.data) {
        setItems(data.data)
        setItems2(data.data)
      };

    });
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const term = searchTerm.trim();

      if (term.length > 0) {
        getItemSuggestions(term)
          .then((res) => {
            if (res.data && Array.isArray(res.data)) {
              setSuggestions(res.data);
              console.log("✅ Got suggestions:", res.data);

              // 🔍 Filter table live as you type
              const matched = items2.filter((i) =>
                i.name.toLowerCase().includes(term.toLowerCase())
              );
              setItems(matched);
            } else {
              setSuggestions([]);
              setItems(items2); // restore if nothing found
            }
          })
          .catch((err) => console.error("Suggestion error:", err));
      } else {
        getItems().then((data) => {
          if (data.data) {
            setItems(data.data)
            setItems2(data.data)
          };

        });
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false); // Hide suggestions when clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const setChangePassword = (e) => {

  }

  return (
    <div style={{ maxWidth: "auto", margin: "auto", padding: "1rem", direction: "rtl" }}>
      <div
        ref={searchRef}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          flexWrap: "wrap",
          gap: "10px",
        }}>
        <input
          type="text"
          placeholder="🔍 آئٹم تلاش کریں..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
          style={{
            padding: "8px",
            fontSize: "14px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "100%",
            textAlign: "right",
          }}
        />

        {/* ✅ Suggestions Dropdown
        {showSuggestions && suggestions.length > 0 && (
          <ul
            style={{
              position: "absolute",
              top: "4rem",
              left: "50%",
              transform: "translateX(-50%)", // ✅ Center dropdown under input
              width: "95%",
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: 0,
              listStyle: "none",
              zIndex: 9999,
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              maxHeight: "200px",
              overflowY: "auto",
              textAlign: "right",
              transition: "all 0.2s ease-in-out",
              margin: '0 auto'
            }}
          >
            {suggestions.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  setSearchTerm(item);
                  setShowSuggestions(false);
                  const matched = items2.filter((i) => i.name === item);
                  if (matched.length > 0) setItems(matched);

                }}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                }}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#f1f1f1")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
              >
                {item}
              </li>
            ))}
          </ul>
        )} */}

        <Link to="/change-password" style={{
          textDecoration: 'none',
          color: "white"
        }}>
          <button
            onClick={setChangePassword}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >

            پاس ورڈ تبدیل کریں 🔒
          </button>
        </Link>
      </div>
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
                    setForm({ ...item, quantity: null })
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
