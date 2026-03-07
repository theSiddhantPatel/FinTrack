import Category from "../models/Category.js";
import Transaction from "../models/Transaction.js";

const validateTransactionPayload = (payload) => {
  const { type, amount, date, category_id } = payload;
  if (!["income", "expense"].includes(type)) return "Type must be income or expense";
  if (Number(amount) <= 0) return "Amount must be greater than 0";
  if (Number.isNaN(new Date(date).getTime())) return "Valid date is required";
  if (!category_id) return "Category is required";
  return null;
};

const checkCategoryOwnership = async (userId, categoryId) => {
  return Category.findOne({ _id: categoryId, $or: [{ user_id: null }, { user_id: userId }] });
};

export const getTransactions = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;

    const query = { user_id: req.user.id };
    if (category) query.category_id = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .populate("category_id", "name")
      .sort({ date: -1, created_at: -1 });

    return res.json({ transactions });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const error = validateTransactionPayload(req.body);
    if (error) return res.status(400).json({ message: error });

    const { type, amount, date, category_id, note = "" } = req.body;
    const category = await checkCategoryOwnership(req.user.id, category_id);
    if (!category) return res.status(400).json({ message: "Invalid category" });

    const transaction = await Transaction.create({
      user_id: req.user.id,
      type,
      amount: Number(amount),
      date: new Date(date),
      category_id,
      note: note.trim(),
    });

    return res.status(201).json({ transaction });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create transaction" });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const error = validateTransactionPayload(req.body);
    if (error) return res.status(400).json({ message: error });

    const { id } = req.params;
    const { type, amount, date, category_id, note = "" } = req.body;

    const existing = await Transaction.findOne({ _id: id, user_id: req.user.id });
    if (!existing) return res.status(404).json({ message: "Transaction not found" });

    const category = await checkCategoryOwnership(req.user.id, category_id);
    if (!category) return res.status(400).json({ message: "Invalid category" });

    existing.type = type;
    existing.amount = Number(amount);
    existing.date = new Date(date);
    existing.category_id = category_id;
    existing.note = note.trim();
    await existing.save();

    return res.json({ transaction: existing });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update transaction" });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Transaction.findOneAndDelete({ _id: id, user_id: req.user.id });

    if (!deleted) return res.status(404).json({ message: "Transaction not found" });
    return res.json({ message: "Transaction deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete transaction" });
  }
};
