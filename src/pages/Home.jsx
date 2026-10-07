import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getFoods } from "../services/api.js";
import FoodCard from "../components/FoodCard.jsx";

export default function Home() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getFoods().then(({ ok, data }) => {
      if (ok) setFoods(data.slice(0, 3)); // first three items = "popular"
      setLoading(false);
    });
  }, []);

  return (
    <>
      <section className="hero">
        <h1>Delicious food.<br />Delivered to your door.</h1>
        <p>Pick a dish, choose how many, and we bring it while it is hot.</p>
        <Link to="/menu" className="btn btn-accent btn-lg">Browse Menu</Link>
      </section>

      <section>
        <h2 className="section-title">Popular Foods</h2>
        {loading ? (
          <div className="spinner" />
        ) : foods.length === 0 ? (
          <p className="muted">Menu is not available right now.</p>
        ) : (
          <div className="grid">
            {foods.map((f) => (
              <FoodCard key={f.id} food={f} onAdd={() => navigate("/menu")} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="grid grid-4">
          {[
            ["Fast Delivery", "Orders reach you quickly."],
            ["Fresh Food", "Cooked after you order."],
            ["Easy Ordering", "Three taps from menu to order."],
            ["Affordable Prices", "Good food that fits a student budget."],
          ].map(([title, text]) => (
            <div className="card why" key={title}>
              <span className="check">✓</span>
              <h3>{title}</h3>
              <p className="muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
