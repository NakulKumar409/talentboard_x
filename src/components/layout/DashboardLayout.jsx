// src/components/layout/DashboardLayout.jsx
import { Menu } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DashboardLayout = ({ children, title, navItems }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        {/* Logo - Clickable to Home */}
        <div
          onClick={() => handleNavigation("/")}
          className="flex items-center gap-2 h-16 px-6 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleNavigation("/")}>
          <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">TX</span>
          </div>
          <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
            TalentBoardX
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                  active
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                }`}>
                <item.icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden cursor-pointer"
          onClick={() => setSidebarOpen(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-8 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              className="lg:hidden text-gray-900 dark:text-white p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar menu">
              <Menu size={22} />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h1>
          </div>

          {/* Back to Home button */}
          <button
            onClick={() => handleNavigation("/")}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
            ← Back to Home
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
