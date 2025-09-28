import React, { useState } from "react";

function ActionsMenu({ item, onEdit, onDelete, onDecrease }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
        ⋮
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "100%",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "5px",
            zIndex: 100,
            minWidth: "120px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <button
            style={{ display: "block", width: "100%", padding: "5px", textAlign: "right" }}
            onClick={() => { onEdit(item); setOpen(false); }}
          >
            ✏️ ترمیم کریں
          </button>
          <button
            style={{ display: "block", width: "100%", padding: "5px", textAlign: "right" }}
            onClick={() => { onDelete(item.name); setOpen(false); }}
          >
            🗑️ حذف کریں
          </button>
          <button
            style={{ display: "block", width: "100%", padding: "5px", textAlign: "right" }}
            onClick={() => { onDecrease(item.name); setOpen(false); }}
          >
            ➖ مقدار کم کریں
          </button>
        </div>
      )}
    </div>
  );
}

export default ActionsMenu;
