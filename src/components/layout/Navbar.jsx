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
    } catch (error) {
      console.error("Invalid user data in localStorage");
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
        section.scrollIntoView({ behavior: "smooth", block: "start" });
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="w-full flex h-16 items-center justify-between px-6">
        {/* LEFT LOGO */}
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
          <button
            onClick={() => handleNavigation("/jobs")}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            Find Jobs
          </button>

          <button
            onClick={() => handleScroll("about")}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            About
          </button>

          <button
            onClick={() => handleScroll("blog")}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            Blog
          </button>

          <button
            onClick={() => handleScroll("careers")}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            Careers
          </button>

          <button
            onClick={() => handleScroll("contact")}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            Contact
          </button>

          {!user ? (
            <>
              <button
                onClick={() => handleNavigation("/login")}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Login
              </button>

              <button
                onClick={() => handleNavigation("/signup")}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Get Started
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500 hover:text-red-600">
              <LogOut size={18} />
              Logout
            </button>
          )}
        </div>

        {/* MOBILE MENU BUTTON - UPDATED WITH BLUE COLOR */}
        <button
          className="md:hidden text-blue-600 hover:text-blue-700 transition-colors duration-200"
          onClick={() => setOpen(!open)}>
          {open ? (
            <X size={24} className="text-blue-600" />
          ) : (
            <Menu size={24} className="text-blue-600" />
          )}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {open && (
        <div className="md:hidden px-6 pb-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => handleNavigation("/jobs")}
            className="block w-full text-left py-2 text-gray-600 dark:text-gray-300">
            Find Jobs
          </button>

          <button
            onClick={() => handleScroll("about")}
            className="block w-full text-left py-2 text-gray-600 dark:text-gray-300">
            About
          </button>

          <button
            onClick={() => handleScroll("blog")}
            className="block w-full text-left py-2 text-gray-600 dark:text-gray-300">
            Blog
          </button>

          <button
            onClick={() => handleScroll("careers")}
            className="block w-full text-left py-2 text-gray-600 dark:text-gray-300">
            Careers
          </button>

          <button
            onClick={() => handleScroll("privacy")}
            className="block w-full text-left py-2 text-gray-600 dark:text-gray-300">
            Privacy
          </button>

          <button
            onClick={() => handleScroll("terms")}
            className="block w-full text-left py-2 text-gray-600 dark:text-gray-300">
            Terms
          </button>

          <button
            onClick={() => handleScroll("contact")}
            className="block w-full text-left py-2 text-gray-600 dark:text-gray-300">
            Contact
          </button>

          {!user ? (
            <>
              <button
                onClick={() => handleNavigation("/login")}
                className="block w-full text-left py-2 text-gray-600 dark:text-gray-300">
                Login
              </button>

              <button
                onClick={() => handleNavigation("/signup")}
                className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Get Started
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500 py-2">
              <LogOut size={18} />
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
