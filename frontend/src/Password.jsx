import React, { useState } from "react";
import Cookies from "js-cookie";
import { changePassword, createPassword, loginUser } from "./api";

function Password({ mode = "set" }) {
  // mode can be "set", "change", or "login"
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let result;

      if (mode === "set") {
        // 🆕 Create new password
        if (newPassword !== confirmPassword) {
          alert("پاس ورڈ میچ نہیں کر رہے!");
          return;
        }
        result = await createPassword(newPassword);

      } else if (mode === "change") {
        // 🔁 Change password
        if (!oldPassword) {
          alert("پرانا پاس ورڈ لازمی ہے");
          return;
        }
        if (newPassword !== confirmPassword) {
          alert("پاس ورڈ میچ نہیں کر رہے!");
          return;
        }
        result = await changePassword(newPassword, oldPassword);

      } else if (mode === "login") {
        // 🔐 Login mode
        if (!oldPassword) {
          alert("پاس ورڈ درج کریں");
          return;
        }
        result = await loginUser(oldPassword);
      }

      if (result) {
        Cookies.set("auth", oldPassword || newPassword, { expires: 7 });
        alert(
          mode === "set"
            ? "پاس ورڈ سیٹ ہو گیا 🎉"
            : mode === "change"
            ? "پاس ورڈ تبدیل ہو گیا ✅"
            : "لاگ اِن کامیاب ✅"
        );
        window.location.href = "/";
      } else {
        alert(result?.error || "کچھ غلط ہو گیا!");
      }
    } catch (err) {
      console.error(err);
      alert("سرور سے کنکشن میں مسئلہ ہے۔");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem", direction: "rtl" }}>
      <h2>
        {mode === "set"
          ? "🔒 نیا پاس ورڈ سیٹ کریں"
          : mode === "change"
          ? "🔑 پاس ورڈ تبدیل کریں"
          : "🚪 لاگ اِن کریں"}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* For Login */}
        {mode === "login" && (
          <input
            type="password"
            placeholder="پاس ورڈ درج کریں"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            style={{
              padding: "8px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid gray",
              width: "250px",
              marginBottom: "1.2rem",
              display: "block",
              margin: "0 auto",
            }}
          />
        )}

        {/* For Change Password */}
        {mode === "change" && (
          <input
            type="text"
            placeholder="پرانا پاس ورڈ"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            style={{
              padding: "8px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid gray",
              width: "250px",
              marginBottom: "1.2rem",
              display: "block",
              margin: "0 auto",
            }}
          />
        )}

        {/* For Set or Change */}
        {(mode === "set" || mode === "change") && (
          <>
            <input
              type="text"
              placeholder="نیا پاس ورڈ"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{
                padding: "8px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid gray",
                width: "250px",
                marginBottom: "1.2rem",
                display: "block",
                margin: ".7rem auto",
              }}
            />

            <input
              type="text"
              placeholder="نیا پاس ورڈ دوبارہ لکھیں"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                padding: "8px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid gray",
                width: "250px",
                marginBottom: "1.2rem",
                display: "block",
                margin: "0.7rem auto",
              }}
            />
          </>
        )}

        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {mode === "set"
            ? "پاس ورڈ سیٹ کریں"
            : mode === "change"
            ? "پاس ورڈ تبدیل کریں"
            : "لاگ اِن کریں"}
        </button>
      </form>
    </div>
  );
}

export default Password;
