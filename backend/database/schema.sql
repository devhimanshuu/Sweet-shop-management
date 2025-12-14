CREATE DATABASE sweetshop;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sweets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sweets_category ON sweets(category);
CREATE INDEX idx_sweets_price ON sweets(price);
CREATE INDEX idx_sweets_name ON sweets(name);

-- Insert admin user (password: admin123)
-- Note: If admin already exists, run: UPDATE users SET password = '$2b$10$EfEeKCu0tiaZ8/pIrvKOIuVwVT0JD7AhuMRm3KeiK1pKw/DlpDlA6' WHERE email = 'admin@sweetshop.com';
INSERT INTO users (email, password, name, role) 
VALUES ('admin@sweetshop.com', '$2b$10$EfEeKCu0tiaZ8/pIrvKOIuVwVT0JD7AhuMRm3KeiK1pKw/DlpDlA6', 'Admin User', 'admin')
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;

-- Insert normal user (password: user123)
-- To generate a new hash, use: node scripts/add-user.js user@sweetshop.com user123 "Regular User" user
INSERT INTO users (email, password, name, role) 
VALUES ('user@sweetshop.com', '$2b$10$tNoTlylDwvrJDGSZUPdZje0QeETwwyStCZbr2NRUPNmwVLjo56qpq', 'Regular User', 'user')
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;

-- Insert sample sweets
INSERT INTO sweets (name, category, price, quantity, description, image_url) VALUES
('Milk Chocolate Bar', 'Chocolate', 2.50, 100, 'Creamy milk chocolate', 'https://images.unsplash.com/photo-1606312619070-d48b4bcf4b83?w=800&h=600&fit=crop'),
('Dark Chocolate Bar', 'Chocolate', 3.00, 80, 'Rich dark chocolate 70% cocoa', 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&h=600&fit=crop'),
('Gummy Bears', 'Gummy', 1.50, 200, 'Assorted fruit gummy bears', 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800&h=600&fit=crop'),
('Lollipops', 'Hard Candy', 0.75, 300, 'Colorful fruit lollipops', 'https://images.unsplash.com/photo-1575224526797-a9b5e3e8e4e4?w=800&h=600&fit=crop'),
('Caramel Chews', 'Caramel', 2.00, 150, 'Soft caramel chews', 'https://images.unsplash.com/photo-1587228062745-315735d21f5e?w=800&h=600&fit=crop'),
('Sour Worms', 'Gummy', 1.75, 120, 'Tangy sour gummy worms', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop'),
('Peppermint Candies', 'Hard Candy', 1.25, 250, 'Refreshing peppermint candies', 'https://images.unsplash.com/photo-1569437061241-0cecbd6abf62?w=800&h=600&fit=crop'),
('Chocolate Truffles', 'Chocolate', 5.00, 50, 'Premium chocolate truffles', 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&h=600&fit=crop'),
('Marshmallows', 'Soft Candy', 1.80, 180, 'Fluffy white marshmallows', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
('Hard Candy Mix', 'Hard Candy', 2.25, 220, 'Assorted hard candies mix', 'https://images.unsplash.com/photo-1575224526797-a9b5e3e8e4e4?w=800&h=600&fit=crop'),
('Candy Canes', 'Hard Candy', 1.50, 150, 'Assorted candy canes', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop'),
('Gummy Worms', 'Gummy', 1.75, 120, 'Tangy sour gummy worms', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop'),
