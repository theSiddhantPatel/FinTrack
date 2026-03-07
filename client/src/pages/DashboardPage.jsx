import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import api from "../services/api";
import StatCard from "../components/StatCard";
import { formatCurrency, formatDate, currentMonth } from "../utils/format";

const COLORS = ["#10b981", "#0ea5e9", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"];

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/dashboard/summary", { params: { month: currentMonth() } });
        setData(data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div className="card">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Income" value={formatCurrency(data?.totalIncome)} accent="text-emerald-600" />
        <StatCard title="Total Expense" value={formatCurrency(data?.totalExpense)} accent="text-rose-600" />
        <StatCard title="Net Balance" value={formatCurrency(data?.netBalance)} accent="text-sky-600" />
        <StatCard title="Budget Remaining" value={formatCurrency(data?.budgetRemaining)} accent="text-amber-600" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card h-[320px]">
          <h3 className="mb-3 text-lg font-semibold">Expense by Category</h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie data={data?.expenseByCategory || []} dataKey="value" nameKey="name" outerRadius={105}>
                {(data?.expenseByCategory || []).map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="mb-3 text-lg font-semibold">Recent Transactions</h3>
          <div className="space-y-2">
            {(data?.recentTransactions || []).map((tx) => (
              <div key={tx._id} className="flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2 dark:bg-slate-700">
                <div>
                  <p className="text-sm font-medium">{tx.category_id?.name || "N/A"}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-300">{formatDate(tx.date)}</p>
                </div>
                <p className={tx.type === "income" ? "text-emerald-600" : "text-rose-500"}>
                  {tx.type === "income" ? "+" : "-"}
                  {formatCurrency(tx.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
