import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface NavbarProps {
  dark: boolean;
  setDark: (v: boolean) => void;
}

export default function Navbar({ dark, setDark }: NavbarProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials =
    user?.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-6 h-13 flex items-center justify-between sticky top-0 z-10 transition-colors duration-200">
      <Link
        to="/projects"
        className="text-base font-medium text-gray-900 dark:text-white"
      >
        Task<span className="text-emerald-600">Flow</span>
      </Link>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setDark(!dark)}
          className="text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
          title="Toggle dark mode"
        >
          {dark ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
        <span className="text-sm text-gray-500 dark:text-slate-400">
          {user?.name}
        </span>
        <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900 flex items-center justify-center text-xs font-medium text-emerald-700 dark:text-emerald-300">
          {initials}
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
