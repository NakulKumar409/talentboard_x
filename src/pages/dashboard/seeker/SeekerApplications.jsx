import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  TrendingUp,
  User,
  Bookmark,
  MapPin,
  Clock,
  DollarSign,
  Filter,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import api from "../../../utils/api";

const SeekerApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const navItems = [
    { label: "Overview", href: "/dashboard/seeker", icon: TrendingUp },
    {
      label: "Applications",
      href: "/dashboard/seeker/applications",
      icon: Briefcase,
    },
    {
      label: "Saved Jobs",
      href: "/dashboard/seeker/saved-jobs",
      icon: Bookmark,
    },
    { label: "Profile", href: "/dashboard/seeker/profile", icon: User },
  ];

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [statusFilter, applications]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await api.get("/applications/my");

      let appsData = [];

      if (response.data && response.data.applications) {
        appsData = response.data.applications;
      }

      setApplications(appsData);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    if (statusFilter === "all") {
      setFilteredApps(applications);
    } else {
      setFilteredApps(
        applications.filter(
          (app) => app.status?.toLowerCase() === statusFilter.toLowerCase()
        )
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "interview":
        return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400";
      case "applied":
        return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400";
      case "under review":
        return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400";
      case "hired":
        return "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout title="My Applications" navItems={navItems}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              All Applications
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Total: {filteredApps.length}{" "}
              {filteredApps.length === 1 ? "application" : "applications"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm">
              <option value="all">All Status</option>
              <option value="applied">Applied</option>
              <option value="under review">Under Review</option>
              <option value="interview">Interview</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No applications found</p>
            <button
              onClick={() => navigate("/jobs")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <div
                key={app._id}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border hover:shadow-md transition cursor-pointer"
                onClick={() => navigate(`/jobs/${app.jobId?._id}`)}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-blue-600">
                        {app.jobId?.company?.charAt(0) || "J"}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {app.jobId?.title}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {app.jobId?.company}
                      </p>

                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {app.jobId?.location}
                        </span>

                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {app.jobId?.salary}
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Applied {formatDate(app.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-blue-600">
                        {app.aiScore || 0}%
                      </div>
                      <div className="text-xs text-gray-500">match</div>
                    </div>

                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                        app.status
                      )}`}>
                      {app.status}
                    </span>

                    <Eye className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SeekerApplications;
