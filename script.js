const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// 1. YOUR BACKEND URL (The Bridge)
const API_URL = 'https://expensetracker-backend-jpqw.onrender.com/api/transactions';

// 2. Fetch transactions from the Backend
async function getTransactions() {
  const res = await fetch(API_URL);
  const data = await res.json();

  // Clear current list and re-populate
  list.innerHTML = '';
  data.forEach(addTransactionDOM);
  updateValues(data);
}

// 3. Add transaction to the Database
async function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add a text and amount');
    return;
  }

  const newTransaction = {
    text: text.value,
    amount: +amount.value
  };

  // Send to Render Backend
  await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newTransaction)
  });

  // Refresh the UI
  getTransactions();

  text.value = '';
  amount.value = '';
}

// 4. Add transactions to DOM
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');

  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
  `;

  list.appendChild(item);
}

// 5. Update the balance, income and expense
function updateValues(transactions) {
  const amounts = transactions.map(transaction => Number(transaction.amount));

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}

// 6. Init
form.addEventListener('submit', addTransaction);
getTransactions();