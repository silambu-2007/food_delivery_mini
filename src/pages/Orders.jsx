import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFoods, getOrders, getOrder, updateOrder, deleteOrder } from "../services/api.js";
import OrderTable from "../components/OrderTable.jsx";
import OrderForm from "../components/OrderForm.jsx";

export default function Orders() {
  const userId = localStorage.getItem("userId");
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // order being edited
  const [details, setDetails] = useState(null); // order being viewed

  // Load (or reload) this user's orders
  const loadOrders = async () => {
    const { ok, data } = await getOrders(userId);
    if (ok) setOrders(data);
    else setError(data.message || "Could not load your orders");
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
    getFoods().then(({ ok, data }) => ok && setFoods(data));
  }, []);

  const showSuccess = (text) => { setError(""); setMessage(text); };
  const showError = (text) => { setMessage(""); setError(text); };

  // READ one order in detail
  const handleView = async (id) => {
    const { ok, data } = await getOrder(id);
    if (ok) { setEditing(null); setDetails(data); window.scrollTo({ top: 0, behavior: "smooth" }); }
    else showError(data.message);
  };

  // UPDATE
  const handleUpdate = async (values) => {
    const { ok, data } = await updateOrder(editing.id, values);
    if (ok) {
      showSuccess(data.message);
      setEditing(null);
      loadOrders(); // refresh the list
    } else showError(data.message || "Could not update the order");
  };

  // DELETE (with confirmation)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    const { ok, data } = await deleteOrder(id);
    if (ok) {
      showSuccess(data.message);
      if (details?.id === id) setDetails(null);
      loadOrders();
    } else showError(data.message || "Could not cancel the order");
  };

  const startEdit = (order) => {
    setDetails(null);
    setEditing(order);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <h1 className="page-title">My Orders</h1>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {editing && (
        <OrderForm
          foods={foods}
          initial={{
            food_item_id: editing.food_item_id,
            quantity: editing.quantity,
            delivery_address: editing.delivery_address,
          }}
          title={`Edit order #${editing.id}`}
          submitLabel="Update Order"
          onSubmit={handleUpdate}
          onCancel={() => setEditing(null)}
        />
      )}

      {details && (
        <div className="card details">
          <div className="form-head">
            <h2>Order #{details.id}</h2>
            <button className="link-btn" onClick={() => setDetails(null)}>Close</button>
          </div>
          <dl>
            <dt>Food</dt><dd>{details.food_name}</dd>
            <dt>Unit price</dt><dd>₹{Number(details.unit_price).toFixed(0)}</dd>
            <dt>Quantity</dt><dd>{details.quantity}</dd>
            <dt>Total</dt><dd><strong>₹{Number(details.total_price).toFixed(0)}</strong></dd>
            <dt>Delivery address</dt><dd>{details.delivery_address}</dd>
            <dt>Status</dt><dd>{details.order_status}</dd>
            <dt>Placed on</dt><dd>{new Date(details.order_date).toLocaleString("en-IN")}</dd>
          </dl>
        </div>
      )}

      {loading ? (
        <div className="spinner" />
      ) : orders.length === 0 ? (
        <div className="card empty">
          <p>You have not placed any orders yet.</p>
          <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
        </div>
      ) : (
        <OrderTable orders={orders} onView={handleView} onEdit={startEdit} onDelete={handleDelete} />
      )}
    </>
  );
}
