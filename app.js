const express      = require('express');
const path         = require('path');
const dotenv       = require('dotenv');
const mongoose     = require('mongoose');
const cookieParser = require('cookie-parser');

dotenv.config();
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected!'))
  .catch(err => console.error('❌ DB Error:', err.message));

const authRoutes        = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes      = require('./routes/budgetRoutes');
const reportRoutes      = require('./routes/reportRoutes');
const profileRoutes     = require('./routes/profileRoutes');

const protect               = require('./middleware/authMiddleware');
const transactionController = require('./controllers/transactionController');
const profileController     = require('./controllers/profileController');

app.get('/', (req, res) => res.render('home', { title: 'ExpenseIQ' }));
app.use('/auth', authRoutes);
app.get('/dashboard', protect, transactionController.getDashboard);
app.use('/transactions', transactionRoutes);
app.use('/budget', budgetRoutes);
app.use('/reports', reportRoutes);
app.use('/profile', profileRoutes);
app.get('/settings', protect, profileController.getSettings);

app.use((req, res) => {
  res.status(404).send(`
    <div style="font-family:sans-serif;background:#080d1a;color:#eef2ff;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;text-align:center;">
      <div style="font-size:60px;">💸</div>
      <h1>404 — Page Not Found</h1>
      <a href="/dashboard" style="color:#00c896;">← Back to Dashboard</a>
    </div>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('');
  console.log('  🚀  ExpenseIQ is running!');
  console.log('');
  console.log(`  🏠  Home         →  http://localhost:${PORT}/`);
  console.log(`  🔐  Login        →  http://localhost:${PORT}/auth/login`);
  console.log(`  📊  Dashboard    →  http://localhost:${PORT}/dashboard`);
  console.log(`  👤  Profile      →  http://localhost:${PORT}/profile`);
  console.log(`  ⚙️   Settings     →  http://localhost:${PORT}/settings`);
  console.log('');
});
