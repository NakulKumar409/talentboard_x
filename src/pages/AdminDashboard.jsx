// src/pages/AdminDashboard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Briefcase, Building, TrendingUp } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import DashboardLayout from "../components/layout/DashboardLayout";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const stats = {
    totalUsers: 156,
    totalJobs: 89,
    totalApplications: 345,
    companies: 45,
  };

  const recentActivities = [
    {
      id: 1,
      user: "John Doe",
      action: "Applied for Senior Developer",
      time: "5 mins ago",
    },
    {
      id: 2,
      user: "Jane Smith",
      action: "Posted new job: UI Designer",
      time: "15 mins ago",
    },
    {
      id: 3,
      user: "Mike Johnson",
      action: "Updated company profile",
      time: "1 hour ago",
    },
  ];

  if (!user || user.role !== "admin") {
    navigate("/login");
    return null;
  }

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const navItems = [
    { label: "Overview", href: "/dashboard/admin", icon: TrendingUp },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Jobs", href: "/dashboard/admin/jobs", icon: Briefcase },
    { label: "Companies", href: "/dashboard/admin/companies", icon: Building },
  ];

  return (
    <DashboardLayout title="Admin Dashboard" navItems={navItems}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Users
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.totalUsers}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Jobs
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.totalJobs}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Applications
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.totalApplications}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Companies
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.companies}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Building className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-4">
            {["overview", "users", "jobs", "settings"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {activity.user}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.action}
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            User Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            User management features coming soon...
          </p>
        </div>
      )}

      {activeTab === "jobs" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Job Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Job management features coming soon...
          </p>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            System Settings
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Settings features coming soon...
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
