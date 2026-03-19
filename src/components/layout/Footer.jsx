// src/components/layout/Footer.jsx
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const handleScroll = (id) => {
    navigate("/");
    setTimeout(() => {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row md:flex-wrap gap-8">
          {/* Company Info - Left side */}
          <div className="w-full md:w-64 lg:w-72">
            <div
              onClick={() => handleNavigation("/")}
              className="flex items-center gap-2 mb-3 cursor-pointer hover:opacity-80"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleNavigation("/")}>
              <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">TX</span>
              </div>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                TalentBoardX
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered hiring platform for modern teams.
            </p>
          </div>

          {/* Three Columns - Always together */}
          <div className="flex-1 grid grid-cols-3 gap-4 md:gap-8">
            {/* Platform Column */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                Platform
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <button
                    onClick={() => handleNavigation("/jobs")}
                    className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                    Find Jobs
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation("/signup")}
                    className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                    Post a Job
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleScroll("about")}
                    className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                    AI Matching
                  </button>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                Company
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <button
                    onClick={() => handleScroll("about")}
                    className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleScroll("blog")}
                    className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                    Blog
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleScroll("careers")}
                    className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                    Careers
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                Legal
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <button
                    onClick={() => handleScroll("privacy")}
                    className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                    Privacy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleScroll("terms")}
                    className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                    Terms
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleScroll("contact")}
                    className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                    Contact
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
          © 2026 TalentBoardX. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
