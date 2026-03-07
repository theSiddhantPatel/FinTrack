import Category from "../models/Category.js";
import DEFAULT_CATEGORIES from "../config/defaultCategories.js";

const ensureDefaults = async () => {
  for (const name of DEFAULT_CATEGORIES) {
    await Category.updateOne(
      { user_id: null, name },
      { $setOnInsert: { user_id: null, name, created_at: new Date() } },
      { upsert: true }
    );
  }
};

export const getCategories = async (req, res) => {
  try {
    await ensureDefaults();

    const categories = await Category.find({
      $or: [{ user_id: null }, { user_id: req.user.id }],
    }).sort({ name: 1 });

    return res.json({ categories });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch categories" });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name = "" } = req.body;
    const cleanName = name.trim();

    if (!cleanName) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existing = await Category.findOne({ user_id: req.user.id, name: cleanName });
    if (existing) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const category = await Category.create({ user_id: req.user.id, name: cleanName });
    return res.status(201).json({ category });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create category" });
  }
};
