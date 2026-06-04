-- ==============================================
-- AI Code Reviewer - MySQL Schema
-- Run this in MySQL Workbench or CLI
-- ==============================================

CREATE DATABASE IF NOT EXISTS ai_code_reviewer
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ai_code_reviewer;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  username    VARCHAR(50)  NOT NULL UNIQUE,
  email       VARCHAR(100) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email    (email),
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Code reviews table
CREATE TABLE IF NOT EXISTS code_reviews (
  id                  INT PRIMARY KEY AUTO_INCREMENT,
  user_id             INT NOT NULL,
  language            VARCHAR(50) NOT NULL,
  original_code       TEXT NOT NULL,
  score               FLOAT,
  bugs                JSON,
  vulnerabilities     JSON,
  performance_issues  JSON,
  code_smells         JSON,
  suggestions         JSON,
  readability         JSON,
  fixed_code          LONGTEXT,
  summary             TEXT,
  created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_created (user_id, created_at),
  INDEX idx_language     (language)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
