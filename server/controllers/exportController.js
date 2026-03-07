import Transaction from "../models/Transaction.js";

export const exportTransactionsCsv = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;
    const query = { user_id: req.user.id };

    if (category) query.category_id = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const rows = await Transaction.find(query)
      .populate("category_id", "name")
      .sort({ date: -1, created_at: -1 });

    const header = ["Date", "Type", "Amount", "Category", "Note"];
    const lines = [header.join(",")];

    rows.forEach((t) => {
      const safeNote = `"${(t.note || "").replaceAll("\"", "\"\"")}"`;
      lines.push([
        new Date(t.date).toISOString().slice(0, 10),
        t.type,
        t.amount,
        t.category_id?.name || "",
        safeNote,
      ].join(","));
    });

    const csv = lines.join("\n");
    const filename = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    return res.status(200).send(csv);
  } catch (error) {
    return res.status(500).json({ message: "Failed to export CSV" });
  }
};
