import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import api from "../services/api";
import TransactionModal from "../components/TransactionModal";
import { formatCurrency, formatDate } from "../utils/format";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [filters, setFilters] = useState({ category: "", startDate: "", endDate: "" });

  const queryParams = useMemo(() => {
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    return params;
  }, [filters]);

  const loadCategories = async () => {
    const { data } = await api.get("/categories");
    setCategories(data.categories);
  };

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/transactions", { params: queryParams });
      setTransactions(data.transactions);
    } catch (_error) {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [queryParams]);

  const handleCreate = async (payload) => {
    try {
      if (editing) {
        await api.put(`/transactions/${editing._id}`, payload);
        toast.success("Transaction updated");
      } else {
        await api.post("/transactions", payload);
        toast.success("Transaction added");
      }
      setModalOpen(false);
      setEditing(null);
      loadTransactions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save transaction");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      toast.success("Transaction deleted");
      loadTransactions();
    } catch (_error) {
      toast.error("Unable to delete transaction");
    }
  };

  const exportCsv = async () => {
    try {
      const response = await api.get("/export/csv", {
        params: queryParams,
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (_error) {
      toast.error("Unable to export CSV");
    }
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Transactions</h3>
          <button
            className="btn-primary"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            <FaPlus className="mr-2" /> Add Transaction
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <select
            className="input"
            value={filters.category}
            onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            className="input"
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value }))}
          />
          <input
            className="input"
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value }))}
          />
          <button className="btn-secondary" onClick={exportCsv}>Export CSV</button>
        </div>
      </div>

      <div className="card overflow-auto">
        {loading ? (
          <p>Loading transactions...</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left dark:border-slate-700">
                <th className="py-2">Date</th>
                <th className="py-2">Type</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Category</th>
                <th className="py-2">Note</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id} className="border-b border-slate-100 dark:border-slate-700">
                  <td className="py-2">{formatDate(tx.date)}</td>
                  <td className="py-2 capitalize">{tx.type}</td>
                  <td className={`py-2 ${tx.type === "income" ? "text-emerald-600" : "text-rose-500"}`}>
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="py-2">{tx.category_id?.name || "N/A"}</td>
                  <td className="py-2">{tx.note}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button
                        className="btn-secondary"
                        onClick={() => {
                          setEditing(tx);
                          setModalOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button className="btn-danger" onClick={() => handleDelete(tx._id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <TransactionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleCreate}
        categories={categories}
        initialData={editing}
      />
    </div>
  );
};

export default TransactionsPage;
