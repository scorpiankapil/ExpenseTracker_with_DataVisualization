const express = require('express');
const path    = require('path');
const app     = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('home', { title: 'ExpenseIQ — Smart Finance Tracker' });
});

app.get('/auth/login', (req, res) => {
  res.render('login', { title: 'Login — ExpenseIQ', error: null, success: null });
});

app.get('/auth/register', (req, res) => {
  res.render('register', { title: 'Register — ExpenseIQ', error: null });
});

app.listen(3000, () => {
  console.log('');
  console.log('  ✅  Frontend running!');
  console.log('');
  console.log('  🏠  Home     →  http://localhost:3000/');
  console.log('  🔐  Login    →  http://localhost:3000/auth/login');
  console.log('  📝  Register →  http://localhost:3000/auth/register');
  console.log('');
});
