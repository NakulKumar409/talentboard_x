// src/pages/dashboard/seeker/SeekerDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  FileText,
  User,
  TrendingUp,
  Clock,
  MapPin,
  DollarSign,
  Award,
  Bookmark,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../utils/api";

// Mock user data (will be replaced with auth)
const mockUser = {
  id: "1",
  name: "John Seeker",
  email: "seeker@example.com",
  role: "seeker",
  resumeName: "john_resume.pdf",
  bio: "Experienced full-stack developer with 5+ years of experience in React, Node.js, and TypeScript. Passionate about building scalable web applications.",
  skills: ["React", "Node.js", "TypeScript", "Python", "MongoDB"],
  location: "San Francisco, CA",
  experience: "5 years",
  education: "B.S. Computer Science",
};

const SeekerDashboard = () => {
  const navigate = useNavigate();
  const [user] = useState(mockUser);
  const [loading, setLoading] = useState({
    applications: false,
    recommendations: false,
  });

  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    interviews: 0,
    avgScore: 0,
    profileViews: 24,
  });

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

  // Fetch applications
  const fetchApplications = async () => {
    setLoading((prev) => ({ ...prev, applications: true }));
    try {
      // Try to get applications for this seeker
      const response = await api.get(`/applications/seeker/${user.id}`);

      let appsData = [];
      if (response.data && response.data.applications) {
        appsData = response.data.applications;
      } else if (Array.isArray(response.data)) {
        appsData = response.data;
      }

      setApplications(appsData.slice(0, 3)); // Only show 3 recent

      // Calculate stats
      const totalApps = appsData.length;
      const interviews = appsData.filter(
        (a) => a.status === "Interview"
      ).length;
      const avgScore = totalApps
        ? Math.round(
            appsData.reduce((s, a) => s + (a.aiScore || 0), 0) / totalApps
          )
        : 0;

      setStats((prev) => ({
        ...prev,
        totalApplications: totalApps,
        interviews,
        avgScore,
      }));
    } catch (error) {
      console.error("Error fetching applications:", error);
      // Use mock data if API fails
      const mockApps = [
        {
          _id: "1",
          jobId: { title: "Senior React Developer", company: "Tech Corp" },
          aiScore: 85,
          status: "Applied",
          appliedAt: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        {
          _id: "2",
          jobId: { title: "Frontend Engineer", company: "Startup Inc" },
          aiScore: 92,
          status: "Interview",
          appliedAt: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      ];
      setApplications(mockApps);
      setStats((prev) => ({
        ...prev,
        totalApplications: mockApps.length,
        interviews: 1,
        avgScore: 88,
      }));
    } finally {
      setLoading((prev) => ({ ...prev, applications: false }));
    }
  };

  // Fetch recommended jobs
  const fetchRecommendedJobs = async () => {
    setLoading((prev) => ({ ...prev, recommendations: true }));
    try {
      const response = await api.get("/jobs/recommended", {
        params: { skills: user.skills.join(",") },
      });

      let jobsData = [];
      if (response.data && response.data.jobs) {
        jobsData = response.data.jobs;
      } else if (Array.isArray(response.data)) {
        jobsData = response.data;
      }

      setRecommendedJobs(jobsData.slice(0, 3));
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      // Mock data
      const mockJobs = [
        {
          _id: "rec1",
          title: "Full Stack Engineer",
          company: "Google",
          location: "Mountain View, CA",
          salary: "$150k - $180k",
          type: "Full-time",
          matchScore: 95,
        },
        {
          _id: "rec2",
          title: "React Developer",
          company: "Meta",
          location: "Remote",
          salary: "$140k - $170k",
          type: "Full-time",
          matchScore: 92,
        },
      ];
      setRecommendedJobs(mockJobs);
    } finally {
      setLoading((prev) => ({ ...prev, recommendations: false }));
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchRecommendedJobs();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "interview":
        return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400";
      case "applied":
        return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400";
      case "reviewed":
      case "under review":
        return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400";
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
    <DashboardLayout title="Overview" navItems={navItems}>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Applications
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading.applications ? "..." : stats.totalApplications}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Interviews
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading.applications ? "..." : stats.interviews}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Avg. Match
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading.applications ? "..." : `${stats.avgScore}%`}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Profile Views
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.profileViews}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user.name.charAt(0)}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {user.name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {user.bio}
            </p>
            <div className="flex flex-wrap gap-3 mt-3">
              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <MapPin className="h-3 w-3" /> {user.location}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Briefcase className="h-3 w-3" /> {user.experience}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {user.skills.slice(0, 5).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Applications
          </h2>
          <button
            onClick={() => navigate("/dashboard/seeker/applications")}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer">
            View All
          </button>
        </div>

        {loading.applications ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No applications yet
          </p>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app._id}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {app.jobId?.title || "Unknown Position"}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {app.jobId?.company || "Unknown Company"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Applied: {formatDate(app.appliedAt || app.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {app.aiScore || 0}% match
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                        app.status
                      )}`}>
                      {app.status || "Applied"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Jobs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recommended for You
          </h2>
          <button
            onClick={() => navigate("/dashboard/seeker/saved-jobs")}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer">
            View All
          </button>
        </div>

        {loading.recommendations ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        ) : recommendedJobs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No recommendations available
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedJobs.map((job) => (
              <div
                key={job._id}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition cursor-pointer"
                onClick={() => navigate(`/jobs/${job._id}`)}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {job.title}
                  </h3>
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                    {job.matchScore || Math.floor(Math.random() * 20 + 80)}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {job.company}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <MapPin className="h-3 w-3" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <DollarSign className="h-3 w-3" /> {job.salary}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SeekerDashboard;
