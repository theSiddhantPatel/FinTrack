import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import { currentMonth, formatCurrency } from "../utils/format";

const BudgetPage = () => {
  const [month, setMonth] = useState(currentMonth());
  const [amount, setAmount] = useState("");
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadBudget = async (targetMonth) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/budget/${targetMonth}`);
      setBudgetData(data);
      setAmount(data.amount || "");
    } catch (_error) {
      toast.error("Failed to fetch budget");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudget(month);
  }, [month]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/budget", { month, amount: Number(amount || 0) });
      toast.success("Budget saved");
      loadBudget(month);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save budget");
    }
  };

  const used = useMemo(() => budgetData?.usedPct || 0, [budgetData]);

  return (
    <div className="space-y-4">
      <div className="card">
        <h3 className="mb-3 text-lg font-semibold">Monthly Budget</h3>
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-3">
          <input className="input" type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
          <input
            className="input"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            placeholder="Budget amount"
            onChange={(e) => setAmount(e.target.value)}
          />
          <button className="btn-primary">Save Budget</button>
        </form>
      </div>

      <div className="card">
        {loading ? (
          <p>Loading budget...</p>
        ) : (
          <>
            <div className="mb-3 flex flex-wrap justify-between gap-2 text-sm">
              <p>Budget: <strong>{formatCurrency(budgetData?.amount)}</strong></p>
              <p>Spent: <strong>{formatCurrency(budgetData?.spent)}</strong></p>
              <p>Remaining: <strong>{formatCurrency(budgetData?.remaining)}</strong></p>
            </div>

            <div className="h-4 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div className="h-full bg-emerald-500" style={{ width: `${Math.min(used, 100)}%` }} />
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{used}% used</p>
          </>
        )}
      </div>
    </div>
  );
};

export default BudgetPage;
