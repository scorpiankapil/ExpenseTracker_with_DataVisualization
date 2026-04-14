const Budget      = require('../models/Budget');
const Transaction = require('../models/Transaction');

const getBudget = async (req, res) => {
  try {
    const userId = req.user._id;
    const now    = new Date();

    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const budgets = await Budget.find({
      user:  userId,
      month: currentMonth,
    });

    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const spendingByCategory = await Transaction.aggregate([
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
          total: { $sum: '$amount' },
        },
      },
    ]);

    const spendingMap = {};
    spendingByCategory.forEach(item => {
      spendingMap[item._id] = item.total;
    });

    const budgetCards = budgets.map(b => {
      const spent = spendingMap[b.category] || 0;
      const pct   = Math.round((spent / b.limit) * 100);

      let status = 'safe';
      if (pct >= 100) status = 'exceeded';
      else if (pct >= 75) status = 'warning';

      return {
        _id:      b._id,
        category: b.category,
        limit:    b.limit,
        spent,
        pct:      Math.min(pct, 100),
        status,
        icon: getCategoryIcon(b.category),
        color: getCategoryColor(b.category),
      };
    });

    const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent  = budgetCards.reduce((sum, b) => sum + b.spent, 0);

    res.render('budget', {
      title:         'Budget — ExpenseIQ',
      user:          req.user,
      budgets:       budgetCards,
      budgetSummary: { spent: totalSpent, total: totalBudget },
      currentMonth,
    });

  } catch (error) {
    console.error('Budget Error:', error);
    res.render('budget', {
      title:         'Budget — ExpenseIQ',
      user:          req.user,
      budgets:       [],
      budgetSummary: { spent: 0, total: 0 },
    });
  }
};


const setBudget = async (req, res) => {
  try {
    const { category, limit, month } = req.body;

    if (!category || !limit || !month) {
      return res.redirect('/budget?error=Please fill all fields');
    }

    await Budget.findOneAndUpdate(
      { user: req.user._id, category, month },
      { limit: parseFloat(limit) },
      { upsert: true, new: true, runValidators: true }
    );

    res.redirect('/budget?success=Budget saved successfully');

  } catch (error) {
    console.error('Set Budget Error:', error);
    res.redirect('/budget?error=Could not save budget');
  }
};


const deleteBudget = async (req, res) => {
  try {
    await Budget.findOneAndDelete({
      _id:  req.params.id,
      user: req.user._id,
    });

    res.json({ success: true, message: 'Budget deleted' });

  } catch (error) {
    console.error('Delete Budget Error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};


const getCategoryIcon = (category) => {
  const icons = {
    Food:          '🍛',
    Travel:        '🚗',
    Health:        '💊',
    Shopping:      '🛒',
    Rent:          '🏠',
    Entertainment: '🎬',
    Education:     '📚',
    Utilities:     '⚡',
    Other:         '📝',
  };
  return icons[category] || '📝';
};

const getCategoryColor = (category) => {
  const colors = {
    Food:          '#f59e0b',
    Travel:        '#4f8dff',
    Health:        '#00c896',
    Shopping:      '#a78bfa',
    Rent:          '#ff4d6d',
    Entertainment: '#ff9500',
    Education:     '#00b4d8',
    Utilities:     '#48cae4',
    Other:         '#7a90b5',
  };
  return colors[category] || '#7a90b5';
};


module.exports = { getBudget, setBudget, deleteBudget };
