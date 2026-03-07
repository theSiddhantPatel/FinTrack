const StatCard = ({ title, value, accent = "text-emerald-600" }) => (
  <div className="card">
    <p className="text-sm text-slate-500 dark:text-slate-300">{title}</p>
    <p className={`mt-2 text-2xl font-semibold ${accent}`}>{value}</p>
  </div>
);

export default StatCard;
