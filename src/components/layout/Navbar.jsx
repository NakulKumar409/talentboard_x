import { LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // CHECK USER WHEN PAGE OR ROUTE CHANGES
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, [location]);

  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
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
          <button
            onClick={() => handleNavigation("/jobs")}
            className="text-sm text-gray-600">
            Find Jobs
          </button>

          {!user ? (
            <>
              <button
                onClick={() => handleNavigation("/login")}
                className="text-sm text-gray-600">
                Login
              </button>

              <button
                onClick={() => handleNavigation("/signup")}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg">
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

        {/* MOBILE MENU BUTTON */}

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
