// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Mock login - create user data based on email
    let userData = null;

    if (email.includes("admin")) {
      userData = {
        id: "0",
        name: "Admin User",
        email: email,
        role: "admin",
      };
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/dashboard/admin");
    } else if (email.includes("employer")) {
      userData = {
        id: Date.now().toString(),
        name: email.split("@")[0],
        email: email,
        role: "employer",
        company: email.split("@")[0] + "'s Company",
        companySize: "50-100 employees",
        industry: "Technology",
        location: "San Francisco, CA",
      };
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/dashboard/employer");
    } else {
      userData = {
        id: Date.now().toString(),
        name: email.split("@")[0],
        email: email,
        role: "seeker",
        resumeName: "",
        bio: "",
        skills: [],
        location: "San Francisco, CA",
        experience: "5 years",
      };
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/dashboard/seeker");
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div
            onClick={() => handleNavigation("/")}
            className="flex justify-center cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleNavigation("/")}>
            <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">TX</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{" "}
            <button
              onClick={() => handleNavigation("/signup")}
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 cursor-pointer">
              create a new account
            </button>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@example.com / seeker@example.com / employer@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
              </span>
              Sign in
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Demo credentials (any password works):
              <br />
              Admin: admin@example.com
              <br />
              Seeker: seeker@example.com
              <br />
              Employer: employer@example.com
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
