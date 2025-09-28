const API_URL = "http://127.0.0.1:8000";

export async function getItems() {
  const res = await fetch(`${API_URL}/get_all_items`);
  return res.json();
}

export async function addItem(item) {
  const res = await fetch(`${API_URL}/add_item`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  return res.json();
}

export async function deleteItem(name) {
  const res = await fetch(`${API_URL}/delete_item/${name}`, { method: "DELETE" });
  return res.json();
}

export async function updateItem(name, updatedItem_body) {
  const res = await fetch(`${API_URL}/update_item/${name}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem_body),
    }
  );
  return res.json();
}

export async function sellItem(name, quantity) {
  const res = await fetch(`${API_URL}/sell_item/${name}`,
    {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(quantity)
    }
  );
  return res.json();
}
