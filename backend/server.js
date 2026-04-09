const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 1. Middleware (The "Rules")
app.use(express.json()); // Allows the server to read JSON data
app.use(cors());         // Allows your website to talk to this server

// 2. Connect to the Database (The "Pantry")
// We will get this URL from MongoDB Atlas or Render later
const DB_URL = "your_mongodb_connection_string_here"; 

mongoose.connect(DB_URL)
  .then(() => console.log("Connected to Database!"))
  .catch(err => console.log(err));

// 3. Define what a "Transaction" looks like
const TransactionSchema = new mongoose.Schema({
  text: String,
  amount: Number
});
const Transaction = mongoose.model('Transaction', TransactionSchema);

// 4. Routes (The "Orders")
// Get all transactions
app.get('/api/transactions', async (req, res) => {
  const transactions = await Transaction.find();
  res.json(transactions);
});

// Add a new transaction
app.post('/api/transactions', async (req, res) => {
  const newTransaction = new Transaction(req.body);
  await newTransaction.save();
  res.json(newTransaction);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));