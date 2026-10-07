import { useState, useEffect } from "react";

// Used for BOTH placing a new order and editing an existing one.
// props:
//   foods        - list of all food items (for the dropdown)
//   initial      - { food_item_id, quantity, delivery_address }
//   title        - heading text
//   submitLabel  - text of the submit button
//   onSubmit     - called with { food_item_id, quantity, delivery_address }
//   onCancel     - called when the user closes the form
export default function OrderForm({ foods, initial, title, submitLabel, onSubmit, onCancel }) {
  const [foodId, setFoodId] = useState(initial.food_item_id);
  const [quantity, setQuantity] = useState(initial.quantity);
  const [address, setAddress] = useState(initial.delivery_address);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // If a different item is chosen while the form is open, reset the fields
  useEffect(() => {
    setFoodId(initial.food_item_id);
    setQuantity(initial.quantity);
    setAddress(initial.delivery_address);
    setError("");
  }, [initial]);

  const selected = foods.find((f) => String(f.id) === String(foodId));
  const price = selected ? Number(selected.price) : 0;
  const total = price * Number(quantity || 0); // Total = price x quantity

  const handleSubmit = async (e) => {
    e.preventDefault();
    const qty = Number(quantity);
    if (!foodId) return setError("Please choose a food item");
    if (!Number.isInteger(qty) || qty < 1 || qty > 20) return setError("Quantity must be between 1 and 20");
    if (!address.trim()) return setError("Please enter a delivery address");

    setError("");
    setSaving(true);
    await onSubmit({ food_item_id: Number(foodId), quantity: qty, delivery_address: address.trim() });
    setSaving(false);
  };

  return (
    <form className="card form-card order-form" onSubmit={handleSubmit} noValidate>
      <div className="form-head">
        <h2>{title}</h2>
        <button type="button" className="link-btn" onClick={onCancel}>Close</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <label>
        Food item
        <select value={foodId} onChange={(e) => setFoodId(e.target.value)}>
          {foods.map((f) => (
            <option key={f.id} value={f.id}>{f.name} — ₹{Number(f.price).toFixed(0)}</option>
          ))}
        </select>
      </label>

      <label>
        Quantity
        <input type="number" min="1" max="20" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      </label>

      <label>
        Delivery address
        <textarea rows="3" value={address} placeholder="Enter delivery address" onChange={(e) => setAddress(e.target.value)} />
      </label>

      <div className="total-row">
        <span>Price: ₹{price.toFixed(0)} × {Number(quantity) || 0}</span>
        <strong>Total: ₹{total.toFixed(0)}</strong>
      </div>

      <button className="btn btn-primary btn-block" disabled={saving}>
        {saving ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
