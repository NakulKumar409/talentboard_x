// src/pages/dashboard/seeker/Jobs.jsx

import { useState, useEffect, useMemo } from "react";
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
  X,
  Calendar,
  Building2,
  GraduationCap,
  Award,
  CheckCircle,
  ExternalLink,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  Code,
  Sparkles,
  Heart,
  Eye,
  AlertCircle,
  Loader2,
  ListChecks,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import api from "../../../utils/api";
import DashboardLayout from "../../../components/layout/DashboardLayout";

const Jobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobDetailsLoading, setJobDetailsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage, setJobsPerPage] = useState(6);
  const [totalJobs, setTotalJobs] = useState(0);

  const [filters, setFilters] = useState({
    location: "",
    type: "",
    experience: "",
    salary: "",
    skills: "",
  });

  // Responsive jobs per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setJobsPerPage(4);
      } else if (window.innerWidth < 1024) {
        setJobsPerPage(6);
      } else {
        setJobsPerPage(6);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    fetchJobs();
  }, [currentPage, jobsPerPage]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/jobs", {
        params: {
          page: currentPage,
          limit: jobsPerPage,
        },
      });

      if (res.data?.jobs && Array.isArray(res.data.jobs)) {
        setJobs(res.data.jobs);
        setTotalJobs(res.data.totalJobs || res.data.jobs.length);
      } else if (Array.isArray(res.data)) {
        setJobs(res.data);
        setTotalJobs(res.data.length);
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        setJobs(res.data.data);
        setTotalJobs(res.data.total || res.data.data.length);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobDetails = async (jobId) => {
    setJobDetailsLoading(true);
    try {
      const res = await api.get(`/jobs/${jobId}`);
      setSelectedJob(res.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load job details");
    } finally {
      setJobDetailsLoading(false);
    }
  };

  const handleApply = (jobId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to apply");
      navigate("/login");
      return;
    }
    navigate(`/apply/${jobId}`);
  };

  const handleViewDetails = (job) => {
    fetchJobDetails(job._id);
  };

  const handleSaveJob = (jobId, e) => {
    e.stopPropagation();
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter((id) => id !== jobId));
      toast.success("Job removed from saved");
    } else {
      setSavedJobs([...savedJobs, jobId]);
      toast.success("Job saved successfully");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.profile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation =
        !filters.location ||
        job.location?.toLowerCase().includes(filters.location.toLowerCase());

      const matchesType =
        !filters.type ||
        job.type?.toLowerCase().includes(filters.type.toLowerCase());

      const matchesExperience =
        !filters.experience ||
        (job.experienceRequired &&
          job.experienceRequired
            .toLowerCase()
            .includes(filters.experience.toLowerCase()));

      const matchesSalary =
        !filters.salary ||
        (job.salary &&
          job.salary.toLowerCase().includes(filters.salary.toLowerCase()));

      const matchesSkills =
        !filters.skills ||
        (job.skillsRequired &&
          job.skillsRequired.some((skill) =>
            skill.toLowerCase().includes(filters.skills.toLowerCase())
          ));

      return (
        matchesSearch &&
        matchesLocation &&
        matchesType &&
        matchesExperience &&
        matchesSalary &&
        matchesSkills
      );
    });
  }, [jobs, searchTerm, filters]);

  // Pagination calculations
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalFilteredPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalFilteredPages);
  const goToNextPage = () =>
    currentPage < totalFilteredPages && setCurrentPage(currentPage + 1);
  const goToPreviousPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);

  const handlePerPageChange = (e) => {
    setJobsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getJobTypeColor = (type) => {
    const types = {
      "Full Time":
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      "Part Time":
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      Contract:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      Remote:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      Internship:
        "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    };
    return (
      types[type] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
    );
  };

  const getExperienceLevel = (exp) => {
    if (!exp || exp.toLowerCase() === "fresher")
      return {
        level: "Fresher",
        color:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      };
    const years = parseInt(exp);
    if (years <= 1)
      return {
        level: "Entry Level",
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      };
    if (years <= 3)
      return {
        level: "Junior",
        color:
          "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
      };
    if (years <= 5)
      return {
        level: "Mid Level",
        color:
          "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
      };
    return {
      level: "Senior",
      color:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    };
  };

  // Format responsibilities and requirements for display
  const formatListItems = (text) => {
    if (!text) return [];
    // Split by new lines, bullet points, or numbers
    const items = text
      .split(/\n|•|\d+\./)
      .filter((item) => item.trim().length > 0);
    return items.map((item) => item.trim());
  };

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-5 animate-pulse rounded-md">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
          <div className="mt-4 flex gap-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <DashboardLayout title="Browse Jobs" navItems={navItems}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-md mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Find Your Dream Career</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Explore Exciting Opportunities
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Discover your next career move with hand-picked job listings from
            top companies
          </p>
        </div>

        {/* Search and Filters Section */}
        <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8 rounded-md">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs, companies, or keywords..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 dark:text-white placeholder-gray-500"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition font-medium">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="City, country..."
                  value={filters.location}
                  onChange={(e) => {
                    setFilters({ ...filters, location: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => {
                    setFilters({ ...filters, type: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 text-sm">
                  <option value="">All Types</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Experience
                </label>
                <select
                  value={filters.experience}
                  onChange={(e) => {
                    setFilters({ ...filters, experience: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 text-sm">
                  <option value="">Any Experience</option>
                  <option value="Fresher">Fresher</option>
                  <option value="1">1 year</option>
                  <option value="2">2 years</option>
                  <option value="3">3 years</option>
                  <option value="4">4 years</option>
                  <option value="5">5+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Salary Range
                </label>
                <select
                  value={filters.salary}
                  onChange={(e) => {
                    setFilters({ ...filters, salary: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 text-sm">
                  <option value="">Any Salary</option>
                  <option value="0-3">0-3 LPA</option>
                  <option value="3-6">3-6 LPA</option>
                  <option value="6-10">6-10 LPA</option>
                  <option value="10-15">10-15 LPA</option>
                  <option value="15+">15+ LPA</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Skills
                </label>
                <input
                  type="text"
                  placeholder="React, Python, etc..."
                  value={filters.skills}
                  onChange={(e) => {
                    setFilters({ ...filters, skills: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        {!loading && filteredJobs.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded px-3 py-1">
                <span className="text-blue-700 dark:text-blue-300 font-semibold">
                  {filteredJobs.length}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {filteredJobs.length === 1 ? "job found" : "jobs found"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600 dark:text-gray-400">
                Show:
              </label>
              <select
                value={jobsPerPage}
                onChange={handlePerPageChange}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500">
                <option value={4}>4 per page</option>
                <option value={6}>6 per page</option>
                <option value={8}>8 per page</option>
                <option value={10}>10 per page</option>
              </select>
            </div>
          </div>
        )}

        {/* Job Cards Grid */}
        {loading ? (
          <LoadingSkeleton />
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-md">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-md mb-4">
              <AlertCircle className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No jobs found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              We couldn't find any jobs matching your criteria. Try adjusting
              your filters or search terms.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilters({
                  location: "",
                  type: "",
                  experience: "",
                  salary: "",
                  skills: "",
                });
              }}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium">
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentJobs.map((job) => {
                const experienceLevel = getExperienceLevel(
                  job.experienceRequired
                );
                return (
                  <div
                    key={job._id}
                    className="group bg-white dark:bg-gray-800 shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer rounded-md"
                    onClick={() => handleViewDetails(job)}>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center shadow-sm">
                            <span className="text-lg font-bold text-white">
                              {job.company?.charAt(0) || "J"}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white text-base line-clamp-1">
                              {job.title || job.profile}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {job.company}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleSaveJob(job._id, e)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition">
                          <Heart
                            className={`h-4 w-4 transition ${
                              savedJobs.includes(job._id)
                                ? "fill-red-500 text-red-500"
                                : "text-gray-400 hover:text-red-500"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="truncate">
                            {job.location || "Location not specified"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <DollarSign className="h-3.5 w-3.5 flex-shrink-0 text-green-500" />
                          <span className="font-medium">
                            {job.salary || "Salary not specified"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <Clock className="h-3.5 w-3.5 flex-shrink-0 text-orange-500" />
                          <span>Posted {formatDate(job.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded ${getJobTypeColor(
                            job.type
                          )}`}>
                          {job.type || "Full Time"}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded ${experienceLevel.color}`}>
                          {experienceLevel.level}
                        </span>
                        {job.experienceRequired &&
                          job.experienceRequired !== "Fresher" && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                              {job.experienceRequired}+ years
                            </span>
                          )}
                      </div>

                      {job.skillsRequired?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {job.skillsRequired.slice(0, 3).map((skill, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                              {skill}
                            </span>
                          ))}
                          {job.skillsRequired.length > 3 && (
                            <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                              +{job.skillsRequired.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApply(job._id);
                          }}
                          className="flex-1 px-3 py-1.5 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-all duration-300 text-sm">
                          Apply Now
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(job);
                          }}
                          className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 text-sm">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalFilteredPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-200 dark:border-gray-700 rounded-md">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing{" "}
                  <span className="font-semibold">{indexOfFirstJob + 1}</span>{" "}
                  to{" "}
                  <span className="font-semibold">
                    {Math.min(indexOfLastJob, filteredJobs.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold">{filteredJobs.length}</span>{" "}
                  jobs
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    title="First Page">
                    <ChevronsLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    title="Previous Page">
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: Math.min(5, totalFilteredPages) },
                      (_, i) => {
                        let pageNum;
                        if (totalFilteredPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalFilteredPages - 2) {
                          pageNum = totalFilteredPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`min-w-[36px] h-9 rounded font-medium transition ${
                              currentPage === pageNum
                                ? "bg-blue-600 text-white"
                                : "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}>
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                  </div>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalFilteredPages}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    title="Next Page">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={goToLastPage}
                    disabled={currentPage === totalFilteredPages}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    title="Last Page">
                    <ChevronsRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Job Details Modal - Enhanced with Responsibilities and Requirements */}
        {isModalOpen && selectedJob && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity"
                onClick={closeModal}></div>

              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-md text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                {jobDetailsLoading ? (
                  <div className="p-20 text-center">
                    <Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading job details...</p>
                  </div>
                ) : (
                  <>
                    <div className="absolute top-0 right-0 pt-4 pr-4">
                      <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none">
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="px-6 pt-6 pb-4 max-h-[80vh] overflow-y-auto">
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-6 sticky top-0 bg-white dark:bg-gray-800 pt-2 pb-4 z-10 border-b border-gray-200 dark:border-gray-700">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center shadow-sm flex-shrink-0">
                          <span className="text-2xl font-bold text-white">
                            {selectedJob.company?.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            {selectedJob.title || selectedJob.profile}
                          </h2>
                          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                            {selectedJob.company}
                          </p>
                          <div className="flex flex-wrap gap-4">
                            <span className="flex items-center gap-1 text-sm text-gray-500">
                              <MapPin className="h-4 w-4" />
                              {selectedJob.location || "Not specified"}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-gray-500">
                              <Calendar className="h-4 w-4" />
                              Posted: {formatDate(selectedJob.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Job Description */}
                      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          Job Description
                        </h3>
                        <div className="prose prose-lg max-w-none dark:prose-invert">
                          {selectedJob.description ? (
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-base">
                              {selectedJob.description}
                            </p>
                          ) : (
                            <p className="text-gray-500 italic">
                              No description provided for this position.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Responsibilities Section */}
                      {selectedJob.responsibilities && (
                        <div className="mb-6 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <ListChecks className="h-5 w-5 text-blue-600" />
                            Key Responsibilities
                          </h3>
                          <div className="space-y-3">
                            {typeof selectedJob.responsibilities ===
                            "string" ? (
                              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                                {selectedJob.responsibilities
                                  .split("\n")
                                  .filter((item) => item.trim())
                                  .map((item, idx) => (
                                    <li
                                      key={idx}
                                      className="text-sm leading-relaxed">
                                      {item.trim()}
                                    </li>
                                  ))}
                              </ul>
                            ) : Array.isArray(selectedJob.responsibilities) ? (
                              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                                {selectedJob.responsibilities.map(
                                  (item, idx) => (
                                    <li
                                      key={idx}
                                      className="text-sm leading-relaxed">
                                      {item}
                                    </li>
                                  )
                                )}
                              </ul>
                            ) : (
                              <p className="text-gray-500 italic">
                                No responsibilities listed
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Requirements Section */}
                      {selectedJob.requirements && (
                        <div className="mb-6 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Target className="h-5 w-5 text-purple-600" />
                            Requirements
                          </h3>
                          <div className="space-y-3">
                            {typeof selectedJob.requirements === "string" ? (
                              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                                {selectedJob.requirements
                                  .split("\n")
                                  .filter((item) => item.trim())
                                  .map((item, idx) => (
                                    <li
                                      key={idx}
                                      className="text-sm leading-relaxed">
                                      {item.trim()}
                                    </li>
                                  ))}
                              </ul>
                            ) : Array.isArray(selectedJob.requirements) ? (
                              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                                {selectedJob.requirements.map((item, idx) => (
                                  <li
                                    key={idx}
                                    className="text-sm leading-relaxed">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-500 italic">
                                No requirements listed
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-5">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-blue-500" />
                            Job Details
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                              <span className="text-gray-600 dark:text-gray-400">
                                Job Type:
                              </span>
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded ${getJobTypeColor(
                                  selectedJob.type
                                )}`}>
                                {selectedJob.type || "Not specified"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                              <span className="text-gray-600 dark:text-gray-400">
                                Experience:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {selectedJob.experienceRequired || "Fresher"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <span className="text-gray-600 dark:text-gray-400">
                                Salary:
                              </span>
                              <span className="font-medium text-green-600 dark:text-green-400">
                                {selectedJob.salary || "Not specified"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-5">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-purple-500" />
                            Company Details
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                              <span className="text-gray-600 dark:text-gray-400">
                                Company Name:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {selectedJob.company}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <span className="text-gray-600 dark:text-gray-400">
                                Location:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {selectedJob.location || "Not specified"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-5">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Code className="h-5 w-5 text-green-500" />
                            Skills Required
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedJob.skillsRequired?.length > 0 ? (
                              selectedJob.skillsRequired.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-sm font-medium">
                                  {skill}
                                </span>
                              ))
                            ) : (
                              <p className="text-gray-500">
                                No skills specified
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-5">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Award className="h-5 w-5 text-yellow-500" />
                            Additional Info
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                              <span className="text-gray-600 dark:text-gray-400">
                                Job ID:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white font-mono text-sm">
                                {selectedJob._id?.slice(-8)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <span className="text-gray-600 dark:text-gray-400">
                                Last Updated:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {formatDate(selectedJob.updatedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Perks & Benefits Section (if available) */}
                      {selectedJob.benefits && (
                        <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-md p-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Zap className="h-5 w-5 text-green-600" />
                            Perks & Benefits
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {typeof selectedJob.benefits === "string"
                              ? selectedJob.benefits
                                  .split(",")
                                  .map((benefit, idx) => (
                                    <span
                                      key={idx}
                                      className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md text-sm">
                                      {benefit.trim()}
                                    </span>
                                  ))
                              : Array.isArray(selectedJob.benefits)
                              ? selectedJob.benefits.map((benefit, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md text-sm">
                                    {benefit}
                                  </span>
                                ))
                              : null}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex justify-end gap-3 sticky bottom-0 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={closeModal}
                        className="px-6 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                        Close
                      </button>
                      <button
                        onClick={() => {
                          closeModal();
                          handleApply(selectedJob._id);
                        }}
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition shadow-sm">
                        Apply Now
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Jobs;
