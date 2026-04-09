const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 1. Connection to Render PostgreSQL
// You get this "Internal Database URL" from the Render Dashboard
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for Render
});

// 2. Fetch all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Add a transaction
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));