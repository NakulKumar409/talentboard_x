// src/pages/Index.jsx
import { useNavigate } from "react-router-dom";
import { Briefcase, Users, Brain, TrendingUp } from "lucide-react";
import heroBg from "../assets/hero-bg.jpg"; // Image import karo

const Index = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section
        className="relative py-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${heroBg})`,
        }}>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Find Your Dream Job with
            <span className="text-blue-400"> AI-Powered</span> Matching
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto">
            TalentBoardX connects talented professionals with innovative
            companies using advanced AI to find the perfect match.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleNavigation("/signup")}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium cursor-pointer shadow-lg hover:shadow-xl">
              Get Started
            </button>
            <button
              onClick={() => handleNavigation("/jobs")}
              className="px-8 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium cursor-pointer shadow-lg hover:shadow-xl">
              Browse Jobs
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose TalentBoardX
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* AI Matching Card */}
            <div
              onClick={() => handleNavigation("/jobs")}
              className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all cursor-pointer hover:border-blue-300 dark:hover:border-blue-700"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleNavigation("/jobs")}>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                AI Matching
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Smart algorithms match candidates with perfect roles
              </p>
            </div>

            {/* Quality Jobs Card */}
            <div
              onClick={() => handleNavigation("/jobs")}
              className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all cursor-pointer hover:border-blue-300 dark:hover:border-blue-700"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleNavigation("/jobs")}>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Quality Jobs
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Curated listings from top companies
              </p>
            </div>

            {/* Smart Hiring Card */}
            <div
              onClick={() => handleNavigation("/signup")}
              className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all cursor-pointer hover:border-blue-300 dark:hover:border-blue-700"
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && handleNavigation("/signup")
              }>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Smart Hiring
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tools to find and manage top talent
              </p>
            </div>

            {/* Career Growth Card */}
            <div
              onClick={() => handleNavigation("/signup")}
              className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all cursor-pointer hover:border-blue-300 dark:hover:border-blue-700"
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && handleNavigation("/signup")
              }>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Career Growth
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Resources to advance your career
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
