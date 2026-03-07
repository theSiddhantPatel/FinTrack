import { useEffect, useState } from "react";

const initialState = {
  type: "expense",
  amount: "",
  date: "",
  category_id: "",
  note: "",
};

const TransactionModal = ({ open, onClose, onSubmit, categories, initialData }) => {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (initialData) {
      setForm({
        type: initialData.type,
        amount: initialData.amount,
        date: new Date(initialData.date).toISOString().slice(0, 10),
        category_id: initialData.category_id?._id || "",
        note: initialData.note || "",
      });
    } else {
      setForm({ ...initialState, date: new Date().toISOString().slice(0, 10) });
    }
  }, [initialData, open]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      amount: Number(form.amount),
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 dark:bg-slate-800">
        <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
          {initialData ? "Edit" : "Add"} Transaction
        </h3>
        <form onSubmit={submit} className="space-y-3">
          <select
            className="input"
            value={form.type}
            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <input
            className="input"
            type="number"
            min="0.01"
            step="0.01"
            value={form.amount}
            placeholder="Amount"
            onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
            required
          />

          <input
            className="input"
            type="date"
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            required
          />

          <select
            className="input"
            value={form.category_id}
            onChange={(e) => setForm((p) => ({ ...p, category_id: e.target.value }))}
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <textarea
            className="input"
            rows="3"
            value={form.note}
            placeholder="Note"
            onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
          />

          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
