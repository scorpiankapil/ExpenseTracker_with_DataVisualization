const Transaction = require('../models/Transaction');


const getMonthlySummary = async (userId, month, year) => {
  const startDate = new Date(year, month, 1);
  const endDate   = new Date(year, month + 1, 0, 23, 59, 59);

  const result = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id:   '$type',
        total: { $sum: '$amount' },
      },
    },
  ]);

  let income = 0, expense = 0;
  result.forEach(item => {
    if (item._id === 'income')  income  = item.total;
    if (item._id === 'expense') expense = item.total;
  });

  return { income, expense };
};


const getLast6MonthsData = async (userId) => {
  const months = [];
  const now    = new Date();

  for (let i = 5; i >= 0; i--) {
    const date  = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = date.getMonth();
    const year  = date.getFullYear();

    const summary = await getMonthlySummary(userId, month, year);

    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    months.push({
      month:   monthNames[month],
      income:  summary.income,
      expense: summary.expense,
    });
  }

  return months;
};


const getCategoryData = async (userId, month, year) => {
  const startDate = new Date(year, month, 1);
  const endDate   = new Date(year, month + 1, 0, 23, 59, 59);

  const result = await Transaction.aggregate([
    {
      $match: {
        user:   userId,
        type:   'expense',
        date:   { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id:   '$category',
        amount: { $sum: '$amount' },
      },
    },
    { $sort: { amount: -1 } },
  ]);

  return result.map(item => ({
    category: item._id,
    amount:   item.amount,
  }));
};


const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const now    = new Date();

    const month = parseInt(req.query.month) || now.getMonth();
    const year  = now.getFullYear();

    const [summary, recentTransactions, monthlyData, categoryData] = await Promise.all([
      getMonthlySummary(userId, month, year),
      Transaction.find({ user: userId })
                 .sort({ date: -1 })
                 .limit(6),
      getLast6MonthsData(userId),
      getCategoryData(userId, month, year),
    ]);

    res.render('dashboard', {
      title:        'Dashboard — ExpenseIQ',
      user:         req.user,
      summary,
      transactions: recentTransactions,
      monthlyData,
      categoryData,
    });

  } catch (error) {
    console.error('Dashboard Error:', error);
    res.render('dashboard', {
      title:        'Dashboard — ExpenseIQ',
      user:         req.user,
      summary:      { income: 0, expense: 0 },
      transactions: [],
      monthlyData:  [],
      categoryData: [],
    });
  }
};


const getTransactions = async (req, res) => {
  try {
    const userId = req.user._id;

    const filter = { user: userId };

    if (req.query.type && req.query.type !== 'all') {
      filter.type = req.query.type;
    }
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }

    const transactions = await Transaction.find(filter)
                                          .sort({ date: -1 });

    const allTx = await Transaction.find({ user: userId });
    let totalIncome = 0, totalExpense = 0;
    allTx.forEach(tx => {
      if (tx.type === 'income')  totalIncome  += tx.amount;
      if (tx.type === 'expense') totalExpense += tx.amount;
    });

    res.render('transactions', {
      title:        'Transactions — ExpenseIQ',
      user:         req.user,
      transactions,
      summary:      { income: totalIncome, expense: totalExpense },
    });

  } catch (error) {
    console.error('Transactions Error:', error);
    res.render('transactions', {
      title:        'Transactions — ExpenseIQ',
      user:         req.user,
      transactions: [],
      summary:      { income: 0, expense: 0 },
    });
  }
};


const addTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, notes } = req.body;

    const trimmedTitle = title ? title.trim() : '';

    if (!trimmedTitle || !amount || !type || !category) {
      return res.redirect('/transactions?error=Please fill all required fields');
    }

    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.redirect('/transactions?error=Amount must be a valid positive number');
    }

    if (parseFloat(amount) > 500000) {
      return res.redirect('/transactions?error=Amount cannot exceed 500000');
    }

    const txDate = date ? new Date(date) : new Date();
    const txDateOnly = new Date(txDate);
    txDateOnly.setHours(0, 0, 0, 0);

    const todayOnly = new Date();
    todayOnly.setHours(0, 0, 0, 0);

    const minDate = new Date(todayOnly);
    minDate.setDate(todayOnly.getDate() - 3);

    const maxDate = new Date(todayOnly);
    maxDate.setDate(todayOnly.getDate() + 1);

    if (txDateOnly < minDate || txDateOnly > maxDate) {
      return res.redirect('/transactions?error=Date must be within the past 3 days and next 1 day');
    }

    await Transaction.create({
      user:     req.user._id,
      title:    trimmedTitle,
      amount:   parseFloat(amount),
      type,
      category,
      date:     txDate,
      notes:    notes ? notes.trim() : '',
    });

    res.redirect('/transactions?success=Transaction added successfully');

  } catch (error) {
    console.error('Add Transaction Error:', error);
    res.redirect('/transactions?error=Something went wrong');
  }
};


const editTransaction = async (req, res) => {
  try {
    const { id }                                          = req.params;
    const { title, amount, type, category, date, notes }  = req.body;

    const trimmedTitle = title ? title.trim() : '';

    if (!trimmedTitle || !amount || !type || !category) {
      return res.redirect('/transactions?error=Please fill all required fields');
    }

    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.redirect('/transactions?error=Amount must be a valid positive number');
    }

    if (parseFloat(amount) > 500000) {
      return res.redirect('/transactions?error=Amount cannot exceed 500000');
    }

    const txDate = date ? new Date(date) : new Date();
    const txDateOnly = new Date(txDate);
    txDateOnly.setHours(0, 0, 0, 0);

    const todayOnly = new Date();
    todayOnly.setHours(0, 0, 0, 0);

    const minDate = new Date(todayOnly);
    minDate.setDate(todayOnly.getDate() - 3);

    const maxDate = new Date(todayOnly);
    maxDate.setDate(todayOnly.getDate() + 1);

    if (txDateOnly < minDate || txDateOnly > maxDate) {
      return res.redirect('/transactions?error=Date must be within the past 3 days and next 1 day');
    }

    await Transaction.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { title: trimmedTitle, amount: parseFloat(amount), type, category, date: txDate, notes: notes ? notes.trim() : '' },
      { new: true, runValidators: true }
    );

    res.redirect('/transactions?success=Transaction updated');

  } catch (error) {
    console.error('Edit Transaction Error:', error);
    res.redirect('/transactions?error=Could not update transaction');
  }
};


const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Transaction.findOneAndDelete({
      _id:  id,
      user: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.json({ success: true, message: 'Transaction deleted' });

  } catch (error) {
    console.error('Delete Transaction Error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};


module.exports = {
  getDashboard,
  getTransactions,
  addTransaction,
  editTransaction,
  deleteTransaction,
};
