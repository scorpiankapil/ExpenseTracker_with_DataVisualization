/*
  app.js — ExpenseIQ Main Server File
  ─────────────────────────────────────
  Yahan se poora app start hota hai.

  Flow:
  1. Dependencies import
  2. Express app setup
  3. View Engine (EJS)
  4. Static Files (CSS, JS)
  5. Middleware (body parser, cookie parser)
  6. MongoDB connect
  7. Routes connect
  8. Server start
*/

const express      = require('express');
const path         = require('path');
const dotenv       = require('dotenv');
const mongoose     = require('mongoose');
const cookieParser = require('cookie-parser');

// .env file se PORT, MONGO_URI, JWT_SECRET load karo
dotenv.config();

const app = express();

// ── View Engine: EJS templates render karega
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Static Files: CSS, JS, images serve karega
app.use(express.static(path.join(__dirname, 'public')));

// ── Middleware
app.use(express.urlencoded({ extended: true })); // Form data parse karo
app.use(express.json());                          // JSON body parse karo
app.use(cookieParser());                          // Cookie parse karo (JWT ke liye)

// ── MongoDB Connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully!'))
  .catch((err) => {
    console.error('❌ MongoDB Error:', err.message);
    console.log('💡 .env file mein MONGO_URI check karo');
  });

// ── Routes Import
const authRoutes        = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes      = require('./routes/budgetRoutes');
const reportRoutes      = require('./routes/reportRoutes');

// ── Middleware + Controller (dashboard ke liye)
const protect               = require('./middleware/authMiddleware');
const transactionController = require('./controllers/transactionController');

// ── Routes Connect

// Home page (landing)
app.get('/', (req, res) => {
  res.render('home', { title: 'ExpenseIQ — Smart Finance Tracker' });
});

// Auth: /auth/login, /auth/register, /auth/logout
app.use('/auth', authRoutes);

// Dashboard (login required)
app.get('/dashboard', protect, transactionController.getDashboard);

// Transactions: /transactions, /transactions/add, etc.
app.use('/transactions', transactionRoutes);

// Budget: /budget, /budget/set, /budget/delete/:id
app.use('/budget', budgetRoutes);

// Reports: /reports, /reports/export
app.use('/reports', reportRoutes);

// ── 404 Page
app.use((req, res) => {
  res.status(404).send(`
    <div style="font-family:sans-serif;background:#080d1a;color:#eef2ff;
    height:100vh;display:flex;flex-direction:column;align-items:center;
    justify-content:center;gap:16px;text-align:center;">
      <div style="font-size:60px;">💸</div>
      <h1>404 — Page Not Found</h1>
      <a href="/dashboard" style="color:#00c896;">← Back to Dashboard</a>
    </div>
  `);
});

// ── Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('');
  console.log('  🚀  ExpenseIQ is running!');
  console.log('');
  console.log(`  🏠  Home         →  http://localhost:${PORT}/`);
  console.log(`  🔐  Login        →  http://localhost:${PORT}/auth/login`);
  console.log(`  📝  Register     →  http://localhost:${PORT}/auth/register`);
  console.log(`  📊  Dashboard    →  http://localhost:${PORT}/dashboard`);
  console.log(`  💸  Transactions →  http://localhost:${PORT}/transactions`);
  console.log(`  🎯  Budget       →  http://localhost:${PORT}/budget`);
  console.log(`  📈  Reports      →  http://localhost:${PORT}/reports`);
  console.log('');
});
