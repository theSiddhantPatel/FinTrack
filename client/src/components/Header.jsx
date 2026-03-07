import { FaMoon, FaSun, FaBars } from "react-icons/fa";
import useAuth from "../hooks/useAuth";

const Header = ({ onMenuClick, darkMode, setDarkMode }) => {
  const { user, logout } = useAuth();

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    const html = document.documentElement;
    if (next) html.classList.add("dark");
    else html.classList.remove("dark");
    localStorage.setItem("fintrack_theme", next ? "dark" : "light");
  };

  return (
    <header className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button className="btn-secondary lg:hidden" onClick={onMenuClick}>
          <FaBars />
        </button>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Welcome, {user?.email}</h2>
      </div>
      <div className="flex items-center gap-2">
        <button className="btn-secondary" onClick={toggleTheme}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        <button className="btn-danger" onClick={logout}>Logout</button>
      </div>
    </header>
  );
};

export default Header;
