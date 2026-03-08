// src/pages/dashboard/seeker/Jobs.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  Search,
  TrendingUp,
  Bookmark,
  User,
} from "lucide-react";

import { toast } from "sonner";
import api from "../../../utils/api";
import DashboardLayout from "../../../components/layout/DashboardLayout";

const Jobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    location: "",
    type: "",
  });

  /* ---------------- NAV ITEMS ---------------- */

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

  /* ---------------- FETCH JOBS ---------------- */

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs");

      let jobsData = [];

      if (Array.isArray(res.data)) {
        jobsData = res.data;
      } else if (res.data?.jobs) {
        jobsData = res.data.jobs;
      }

      setJobs(jobsData);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- APPLY JOB ---------------- */

  const handleApply = (jobId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to apply");
      navigate("/login");
      return;
    }

    navigate(`/apply/${jobId}`);
  };

  /* ---------------- FILTER ---------------- */

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      !filters.location ||
      job.location?.toLowerCase().includes(filters.location.toLowerCase());

    const matchesType = !filters.type || job.type === filters.type;

    return matchesSearch && matchesLocation && matchesType;
  });

  return (
    <DashboardLayout title="Browse Jobs" navItems={navItems}>
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Find Your Dream Job
          </h1>

          <p className="text-gray-600 dark:text-gray-400">
            Browse through {jobs.length} available positions
          </p>
        </div>

        {/* SEARCH */}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

              <input
                type="text"
                placeholder="Search jobs, companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              />
            </div>

            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
              className="w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />

            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>

        {/* JOB LIST */}

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-3" />

            <p className="text-gray-500">No jobs found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-blue-600">
                        {job.company?.charAt(0)}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {job.title}
                      </h2>

                      <p className="text-gray-600 dark:text-gray-400">
                        {job.company}
                      </p>

                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />

                          {job.location}
                        </span>

                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />

                          {job.salary}
                        </span>

                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />

                          {job.type}
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />

                          {job.experienceRequired}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.skillsRequired?.slice(0, 5).map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApply(job._id)}
                      className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Apply Now
                    </button>

                    <button
                      onClick={() => navigate(`/jobs/${job._id}`)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
                      View Details
                    </button>
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

export default Jobs;
