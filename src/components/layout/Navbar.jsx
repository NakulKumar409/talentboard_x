// src/components/layout/Navbar.jsx
import { LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, [location]);

  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false);
    window.scrollTo(0, 0);
  };

  const handleScroll = (id) => {
    navigate("/");
    setOpen(false);

    setTimeout(() => {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      {/* NAVBAR */}
      <div className="flex h-16 items-center justify-between px-6">
        {/* LOGO */}
        <div
          onClick={() => handleNavigation("/")}
          className="flex items-center gap-2 cursor-pointer">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">TX</span>
          </div>
          <span className="text-lg font-bold text-blue-600">TalentBoardX</span>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { label: "Find Jobs", action: () => handleNavigation("/jobs") },
            { label: "About", action: () => handleScroll("about") },
            { label: "Blog", action: () => handleScroll("blog") },
            { label: "Careers", action: () => handleScroll("careers") },
            { label: "Contact", action: () => handleScroll("contact") },
          ].map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              className="text-sm font-medium text-gray-700 dark:text-white hover:text-blue-600 transition">
              {item.label}
            </button>
          ))}

          {!user ? (
            <>
              <button
                onClick={() => handleNavigation("/login")}
                className="text-sm font-medium text-gray-700 dark:text-white hover:text-blue-600 transition">
                Login
              </button>

              <button
                onClick={() => handleNavigation("/signup")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Get Started
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500">
              <LogOut size={18} />
              Logout
            </button>
          )}
        </div>

        {/* MOBILE BUTTON (TOGGLE FIXED) */}
        <button
          className="md:hidden text-blue-600 transition"
          onClick={() => setOpen(!open)}>
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        }`}>
        <div className="px-3 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Find Jobs", action: () => handleNavigation("/jobs") },
              { label: "About", action: () => handleScroll("about") },
              { label: "Blog", action: () => handleScroll("blog") },
              { label: "Careers", action: () => handleScroll("careers") },
              { label: "Privacy", action: () => handleScroll("privacy") },
              { label: "Terms", action: () => handleScroll("terms") },
              { label: "Contact", action: () => handleScroll("contact") },
            ].map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                className="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/20 py-2 rounded-md text-center hover:bg-blue-600 hover:text-white transition">
                {item.label}
              </button>
            ))}

            {!user ? (
              <>
                <button
                  onClick={() => handleNavigation("/login")}
                  className="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/20 py-2 rounded-md text-center hover:bg-blue-600 hover:text-white transition">
                  Login
                </button>

                <button
                  onClick={() => handleNavigation("/signup")}
                  className="col-span-3 text-sm font-semibold bg-blue-600 text-white py-2 rounded-md mt-1 hover:bg-blue-700">
                  Get Started
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="col-span-3 text-sm font-semibold bg-red-500 text-white py-2 rounded-md mt-1">
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
