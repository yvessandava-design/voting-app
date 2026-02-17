const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
});

const createTables = async () => {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create votes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS votes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        organizer_name VARCHAR(255) NOT NULL,
        single_vote BOOLEAN DEFAULT false,
        reference_example VARCHAR(255),
        vote_token VARCHAR(255) UNIQUE NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create vote_options table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vote_options (
        id SERIAL PRIMARY KEY,
        vote_id INTEGER NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
        option_text VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create votes_submitted table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS votes_submitted (
        id SERIAL PRIMARY KEY,
        vote_id INTEGER NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
        voter_name VARCHAR(255) NOT NULL,
        voter_reference VARCHAR(255) NOT NULL,
        option_id INTEGER NOT NULL REFERENCES vote_options(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Tables created successfully');
    await pool.end();
  } catch (err) {
    console.error('Error creating tables:', err);
    process.exit(1);
  }
};

createTables();
