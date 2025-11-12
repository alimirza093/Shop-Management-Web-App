const API_URL = "http://127.0.0.1:8000";

export async function checkPassword() {
  const res = await fetch(`${API_URL}/check_password`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  try {
    return await res.json();
  } catch (err) {
    console.error("Error parsing checkPassword response:", err);
    throw err;
  }
}

export async function createPassword(pass) {
  const res = await fetch(`${API_URL}/create_password`,{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      password: pass
    }),
  });
  return res.json();
}

export async function changePassword(newPass, oldPass){
  const res = await fetch(`${API_URL}/change_password`,{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      old_password: oldPass,
      new_password: newPass
    }),
  });
  return res.json();
}

export async function loginUser(password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function getItemSuggestions(query) {
  if (!query) return { data: [] };
  const res = await fetch(`${API_URL}/get_item_suggestions?q=${encodeURIComponent(query)}`);
  return res.json();
}


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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quantity)
    }
  );
  return res.json();
}
