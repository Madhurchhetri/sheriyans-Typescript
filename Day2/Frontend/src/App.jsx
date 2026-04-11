import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Home } from "./pages/Home";
import { toggleTheme } from "./store/themeSlice";
import { Moon, Sun, Menu } from "lucide-react";

const App = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-surface transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-xl border-b border-surface-dim px-4 sm:px-8 py-5 flex justify-between items-center">
        {/* 🔥 LEFT SIDE */}
        <div className="flex items-center gap-3">
          {/* 🔥 Mobile Menu Button */}
          <button
            onClick={() => window.dispatchEvent(new Event("toggleSidebar"))}
            className="lg:hidden p-2 rounded-md hover:bg-surface-dim"
          >
            <Menu size={22} />
          </button>

          <h1 className="hidden lg:block text-xl font-extrabold text-primary">
            Verdict AI
          </h1>
        </div>
        <h1 className="lg:hidden sm:block text-xl font-extrabold text-primary flex items-center gap-2">
          <span>Verdict AI</span>
        </h1>
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-full bg-surface-dim text-text-sub hover:text-primary transition-colors duration-200 cursor-pointer border border-transparent hover:border-text-sub/10"
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <Home />
    </div>
  );
};

export default App;
