CREATE DATABASE database_links;

USE database_links;

-- USERS TABLE
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(60) NOT NULL,
    fullname VARCHAR(100) NOT NULL
);

DESCRIBE users;

-- LINKS TABLE
CREATE TABLE links (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    title VARCHAR(100) NOT NULL,
    url VARCHAR(255) NOT NULL,
    description TEXT,
    user_id INT,
    created_at NOT NULL TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

