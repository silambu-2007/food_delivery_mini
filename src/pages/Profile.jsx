import { useEffect, useState } from "react";
import { getUser } from "../services/api.js";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getUser(localStorage.getItem("userId")).then(({ ok, data }) => {
      if (ok) setUser(data);
      else setError(data.message || "Could not load your profile");
    });
  }, []);

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!user) return <div className="spinner" />;

  return (
    <>
      <h1 className="page-title">My Profile</h1>
      <div className="card details">
        <dl>
          <dt>Name</dt><dd>{user.name}</dd>
          <dt>Email</dt><dd>{user.email}</dd>
          <dt>Phone</dt><dd>{user.phone}</dd>
          <dt>Address</dt><dd>{user.address}</dd>
          <dt>Member since</dt><dd>{new Date(user.created_at).toLocaleDateString("en-IN")}</dd>
        </dl>
      </div>
    </>
  );
}
