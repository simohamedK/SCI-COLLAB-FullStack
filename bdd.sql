-- 1. Création de la base
CREATE DATABASE IF NOT EXISTS sci_collab;
USE sci_collab;

-- 2. Table des Utilisateurs
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    institution VARCHAR(100),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table de Référence des Compétences (Skills)
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(50) NOT NULL UNIQUE
);

-- 4. Liaison Utilisateurs <-> Compétences (N:N)
CREATE TABLE user_skills (
    user_id INT,
    skill_id INT,
    PRIMARY KEY (user_id, skill_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- 5. Table des Problèmes (Posts)
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('OPEN', 'SOLVED') DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Liaison Posts <-> Tags/Compétences requises (N:N)
CREATE TABLE post_skills (
    post_id INT,
    skill_id INT,
    PRIMARY KEY (post_id, skill_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- 7. Données de test (Seed)
INSERT INTO skills (label) VALUES 
('Python'), ('Java'), ('Deep Learning'), ('Biologie Moléculaire'), 
('Statistiques'), ('React'), ('Angular'), ('SQL');