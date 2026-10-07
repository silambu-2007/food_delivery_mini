# FoodDelivery – Food Delivery Web Application

A simple full-stack food delivery website built as a college mini project. Users can register, log in, browse food, place orders, and view, update and cancel their orders (full **CRUD**).

## Features

- Register with validation; passwords hashed with **bcrypt**
- Login (user id kept in `localStorage`)
- Home page, food menu loaded from MySQL, quantity selector
- Order form with automatic total (price × quantity)
- **My Orders** table: View details, Edit, Delete (with confirmation)
- Each user sees only their own orders (checked on the server)
- Responsive layout, loading spinners, friendly success/error messages

## Technology Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React (Vite), HTML, CSS, JavaScript, Fetch API |
| Backend  | Node.js, Express.js, REST API       |
| Database | MySQL (`mysql2` with connection pool) |
| Security | bcrypt, parameterized queries, CORS, `.env` |

## Folder Structure

```text
food-delivery-app/
├── frontend/
│   ├── index.html
│   ├── package.json, vite.config.js
│   └── src/
│       ├── components/  Navbar, FoodCard, OrderForm, OrderTable
│       ├── pages/       Home, Register, Login, Menu, Orders, Profile
│       ├── services/    api.js  (all API calls)
│       ├── App.jsx, main.jsx, index.css
├── backend/
│   ├── config/db.js            MySQL pool
│   ├── controllers/            user, food, order logic
│   ├── middleware/requireUser.js
│   ├── routes/                 user, food, order routes
│   ├── server.js, package.json, .env
├── database/food_delivery.sql
└── README.md
```

## Database Setup

1. Install and start MySQL.
2. Open the MySQL command line or Workbench and run the script:
   ```sql
   SOURCE /full/path/to/database/food_delivery.sql;
   ```
   (or paste the file's content into a query tab and run it). It creates the `food_delivery` database, the three tables and 10 sample foods.
   Run it **only once**, otherwise the foods are inserted twice.
3. Open `backend/.env` and set your MySQL password:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=food_delivery
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```

## Installation & Running

Requirements: Node.js 18+ and MySQL.

**Backend** (terminal 1)
```bash
cd backend
npm install
npm start
```
You should see `Server running on http://localhost:5000`.
If you see "Database connection failed", check `.env` and that MySQL is running.

**Frontend** (terminal 2)
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## Quick Demo

1. Register with the sample data: Silambarasan, silambu@example.com, 9876543210, Thanjavur, any password (6+ characters).
2. Log in, open **Menu**, choose Chicken Biryani, quantity 2, click **Add to Order**.
3. Confirm the address and click **Place Order** (total ₹360).
4. Open **My Orders** to view, edit or cancel it.

## API Endpoints

Order and profile requests send the header `x-user-id` (added automatically by `api.js`).

| Method | Endpoint                    | Description                     |
|--------|-----------------------------|---------------------------------|
| POST   | `/api/users/register`       | Create account                  |
| POST   | `/api/users/login`          | Log in                          |
| GET    | `/api/users/:id`            | Get own profile                 |
| GET    | `/api/foods`                | List all foods                  |
| GET    | `/api/foods/:id`            | Get one food                    |
| POST   | `/api/orders`               | Create order (CREATE)           |
| GET    | `/api/orders/user/:userId`  | List a user's orders (READ)     |
| GET    | `/api/orders/:id`           | Get one order (READ)            |
| PUT    | `/api/orders/:id`           | Update order (UPDATE)           |
| DELETE | `/api/orders/:id`           | Cancel/delete order (DELETE)    |

Order body example:
```json
{ "food_item_id": 1, "quantity": 2, "delivery_address": "Thanjavur" }
```
The server recalculates `total_price` from the food's price, so the total cannot be faked from the browser.

## Testing Checklist

- Register: new user appears in `users` table; duplicate email, bad email, short password and mismatched passwords show messages.
- Login: wrong password shows "Invalid email or password"; Logout returns to Login.
- Menu: foods load, quantity buttons work, Add to Order opens the order form.
- Orders: create, view, edit quantity/address (total recalculates), delete with confirmation.
- Database: check `users`, `food_items`, `orders` tables in MySQL.

## Screenshots

Add your screenshots here (Home, Menu, Register, My Orders).

## Notes on Security

This is a learning project. The logged-in user id is kept in `localStorage` and sent as a header, which is simple but not tamper-proof. For a real product use JWT or session cookies.

## Future Improvements

- JWT authentication
- Shopping cart with several foods in one order
- Order status updates by an admin (Preparing, Out for delivery, Delivered)
- Online payment, restaurant panel, ratings and reviews
- Image upload for food items
