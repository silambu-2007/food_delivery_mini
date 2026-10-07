import { useState } from "react";

// Shows one food item with a quantity selector and an "Add to Order" button.
export default function FoodCard({ food, onAdd }) {
  const [quantity, setQuantity] = useState(1);
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="card food-card">
      {imageFailed || !food.image ? (
        <div className="food-img food-img-fallback">{food.name.charAt(0)}</div>
      ) : (
        <img
          className="food-img"
          src={food.image}
          alt={food.name}
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      )}

      <div className="food-body">
        <div className="food-top">
          <h3>{food.name}</h3>
          <span className="tag">{food.category}</span>
        </div>
        <p className="muted">{food.description}</p>
        <p className="price">₹{Number(food.price).toFixed(0)}</p>

        <div className="qty-row">
          <span>Quantity</span>
          <div className="qty">
            <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
            <span>{quantity}</span>
            <button type="button" onClick={() => setQuantity((q) => Math.min(20, q + 1))} aria-label="Increase">+</button>
          </div>
        </div>

        <button className="btn btn-primary btn-block" onClick={() => onAdd(food, quantity)}>
          Add to Order
        </button>
      </div>
    </article>
  );
}
