import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFoods, createOrder } from "../services/api.js";
import FoodCard from "../components/FoodCard.jsx";
import OrderForm from "../components/OrderForm.jsx";

export default function Menu({ isLoggedIn }) {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [draft, setDraft] = useState(null); // the item currently being ordered

  useEffect(() => {
    getFoods().then(({ ok, data }) => {
      if (ok) setFoods(data);
      else setError(data.message || "Could not load the menu");
      setLoading(false);
    });
  }, []);

  // "Add to Order" opens the order form with the chosen food and quantity
  const handleAdd = (food, quantity) => {
    if (!isLoggedIn) return navigate("/login");
    setMessage("");
    setDraft({
      food_item_id: food.id,
      quantity,
      delivery_address: localStorage.getItem("userAddress") || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlaceOrder = async (order) => {
    const { ok, data } = await createOrder(order);
    if (ok) {
      setDraft(null);
      setMessage(data.message);
    } else {
      setError(data.message || "Could not place the order");
    }
  };

  return (
    <>
      <h1 className="page-title">Menu</h1>
      {message && <div className="alert alert-success">{message} You can see it under My Orders.</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {draft && (
        <OrderForm
          foods={foods}
          initial={draft}
          title="Place your order"
          submitLabel="Place Order"
          onSubmit={handlePlaceOrder}
          onCancel={() => setDraft(null)}
        />
      )}

      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="grid">
          {foods.map((f) => (
            <FoodCard key={f.id} food={f} onAdd={handleAdd} />
          ))}
        </div>
      )}
    </>
  );
}
