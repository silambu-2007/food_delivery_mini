// Table of a user's orders with View / Edit / Delete buttons.
export default function OrderTable({ orders, onView, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Food Name</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
            <th>Delivery Address</th>
            <th>Status</th>
            <th>Order Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>#{o.id}</td>
              <td>{o.food_name}</td>
              <td>{o.quantity}</td>
              <td>₹{Number(o.unit_price).toFixed(0)}</td>
              <td><strong>₹{Number(o.total_price).toFixed(0)}</strong></td>
              <td className="addr">{o.delivery_address}</td>
              <td><span className="status">{o.order_status}</span></td>
              <td>{new Date(o.order_date).toLocaleDateString("en-IN")}</td>
              <td className="actions">
                <button className="btn btn-outline btn-sm" onClick={() => onView(o.id)}>View</button>
                <button className="btn btn-outline btn-sm" onClick={() => onEdit(o)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(o.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
