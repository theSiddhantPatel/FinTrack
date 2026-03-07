import { NavLink } from "react-router-dom";
import { FaChartPie, FaMoneyBillWave, FaWallet } from "react-icons/fa";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: FaChartPie },
  { to: "/transactions", label: "Transactions", icon: FaMoneyBillWave },
  { to: "/budget", label: "Budget", icon: FaWallet },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 transform border-r border-slate-200 bg-white p-4 transition dark:border-slate-700 dark:bg-slate-800 lg:static lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="mb-6 flex items-center justify-between lg:justify-start">
        <h1 className="text-xl font-bold text-emerald-600">FinTrack</h1>
        <button className="btn-secondary lg:hidden" onClick={onClose}>Close</button>
      </div>
      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                }`
              }
            >
              <Icon />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
