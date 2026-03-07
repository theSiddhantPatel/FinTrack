import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";
import { getMonthRange, isValidMonth } from "../utils.js";

export const getBudgetByMonth = async (req, res) => {
  try {
    const { month } = req.params;
    if (!isValidMonth(month)) {
      return res.status(400).json({ message: "Month must be YYYY-MM" });
    }

    const budget = await Budget.findOne({ user_id: req.user.id, month });
    const { start, end } = getMonthRange(month);

    const spendAgg = await Transaction.aggregate([
      {
        $match: {
          user_id: budget?.user_id || req.user.id,
          type: "expense",
          date: { $gte: start, $lt: end },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const spent = spendAgg[0]?.total || 0;
    const amount = budget?.amount || 0;
    const remaining = Math.max(amount - spent, 0);
    const usedPct = amount > 0 ? Number(((spent / amount) * 100).toFixed(2)) : 0;

    return res.json({ month, amount, spent, remaining, usedPct });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch budget" });
  }
};

export const upsertBudget = async (req, res) => {
  try {
    const { month, amount } = req.body;

    if (!isValidMonth(month)) {
      return res.status(400).json({ message: "Month must be YYYY-MM" });
    }

    if (Number(amount) < 0) {
      return res.status(400).json({ message: "Amount cannot be negative" });
    }

    const budget = await Budget.findOneAndUpdate(
      { user_id: req.user.id, month },
      { amount: Number(amount) },
      { new: true, upsert: true }
    );

    return res.status(201).json({ budget });
  } catch (error) {
    return res.status(500).json({ message: "Failed to save budget" });
  }
};
