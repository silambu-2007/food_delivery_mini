-- Food Delivery App database
CREATE DATABASE IF NOT EXISTS food_delivery;
USE food_delivery;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address TEXT NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS food_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50),
    image VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    food_item_id INT NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    delivery_address TEXT NOT NULL,
    order_status VARCHAR(30) DEFAULT 'Pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (food_item_id) REFERENCES food_items(id)
);

-- Sample food items (run this file only once, or foods will be duplicated)
INSERT INTO food_items (name, description, price, category, image) VALUES
('Chicken Biryani', 'Aromatic basmati rice slow-cooked with tender chicken and spices.', 180.00, 'Rice', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600'),
('Veg Biryani', 'Fragrant rice layered with garden vegetables and mild masala.', 140.00, 'Rice', 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=600'),
('Chicken Fried Rice', 'Wok-tossed rice with chicken, egg and spring onions.', 150.00, 'Rice', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600'),
('Paneer Butter Masala', 'Soft paneer cubes in a rich, creamy tomato gravy.', 200.00, 'Curry', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600'),
('Masala Dosa', 'Crispy dosa filled with spiced potato, served with chutney and sambar.', 90.00, 'Tiffin', 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600'),
('Chicken 65', 'Spicy, deep-fried chicken bites with curry leaves.', 170.00, 'Starters', 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600'),
('Pizza', 'Hand-tossed pizza with mozzarella, tomato sauce and toppings.', 250.00, 'Fast Food', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600'),
('Burger', 'Juicy patty, lettuce, tomato and cheese in a toasted bun.', 120.00, 'Fast Food', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600'),
('French Fries', 'Golden, crispy fries with a pinch of salt.', 80.00, 'Snacks', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600'),
('Ice Cream', 'Creamy vanilla scoops with chocolate drizzle.', 70.00, 'Dessert', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600');
