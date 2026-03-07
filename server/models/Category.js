import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

categorySchema.index({ user_id: 1, name: 1 }, { unique: true });

const Category = mongoose.model("Category", categorySchema);
export default Category;
