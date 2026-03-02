// src/components/layout/Navbar.jsx - Version without auth
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    console.log("Navigating to:", path);
    navigate(path);
    setOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo - Clickable to Home */}
        <div
          onClick={() => handleNavigation("/")}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleNavigation("/")}>
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">TX</span>
          </div>
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            TalentBoardX
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => handleNavigation("/jobs")}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer font-medium">
            Find Jobs
          </button>

          <button
            onClick={() => handleNavigation("/login")}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer font-medium">
            Login
          </button>

          <button
            onClick={() => handleNavigation("/signup")}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium">
            Get Started
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-900 dark:text-white p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-4 flex flex-col gap-2">
          <button
            onClick={() => handleNavigation("/jobs")}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-left py-3 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer w-full font-medium">
            Find Jobs
          </button>

          <button
            onClick={() => handleNavigation("/login")}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-left py-3 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer w-full font-medium">
            Login
          </button>

          <button
            onClick={() => handleNavigation("/signup")}
            className="px-4 py-3 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center cursor-pointer w-full font-medium">
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
