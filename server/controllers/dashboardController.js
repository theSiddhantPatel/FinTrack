import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";
import { currentMonth, getMonthRange, isValidMonth } from "../utils.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const month = req.query.month || currentMonth();
    if (!isValidMonth(month)) {
      return res.status(400).json({ message: "Month must be YYYY-MM" });
    }

    const { start, end } = getMonthRange(month);

    const totals = await Transaction.aggregate([
      { $match: { user_id: req.user.id, date: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;
    totals.forEach((t) => {
      if (t._id === "income") totalIncome = t.total;
      if (t._id === "expense") totalExpense = t.total;
    });

    const expenseByCategory = await Transaction.aggregate([
      {
        $match: {
          user_id: req.user.id,
          type: "expense",
          date: { $gte: start, $lt: end },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      { $group: { _id: "$category.name", value: { $sum: "$amount" } } },
      { $project: { _id: 0, name: "$_id", value: 1 } },
      { $sort: { value: -1 } },
    ]);

    const recentTransactions = await Transaction.find({ user_id: req.user.id })
      .populate("category_id", "name")
      .sort({ date: -1, created_at: -1 })
      .limit(5);

    const budget = await Budget.findOne({ user_id: req.user.id, month });
    const budgetAmount = budget?.amount || 0;
    const budgetRemaining = Math.max(budgetAmount - totalExpense, 0);

    return res.json({
      month,
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      budgetRemaining,
      expenseByCategory,
      recentTransactions,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch dashboard summary" });
  }
};
