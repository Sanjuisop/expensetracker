const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 1. Connection to Postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 2. Automatically create the table if it's missing
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        text VARCHAR(255) NOT NULL,
        amount DECIMAL NOT NULL
      );
    `);
    console.log("Database table is ready!");
  } catch (err) {
    console.error("Database init error:", err);
  }
};
initDB();

// 3. API Routes
app.get('/api/transactions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/transactions', async (req, res) => {
  const { text, amount } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO transactions (text, amount) VALUES ($1, $2) RETURNING *',
      [text, amount]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 10000; // Render uses 10000 often
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));