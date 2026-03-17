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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage, setJobsPerPage] = useState(2);
  const [totalJobs, setTotalJobs] = useState(0);

  const [filters, setFilters] = useState({
    location: "",
    type: "",
    experience: "",
    salary: "",
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

  /* ---------------- FETCH JOBS WITH PAGINATION ---------------- */

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

  /* ---------------- FETCH SINGLE JOB DETAILS ---------------- */

  const fetchJobDetails = async (jobId) => {
    setJobDetailsLoading(true);
    try {
      const res = await api.get(`/jobs/${jobId}`);
      console.log("Job Details API Response:", res.data);
      setSelectedJob(res.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load job details");
    } finally {
      setJobDetailsLoading(false);
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

  /* ---------------- VIEW DETAILS ---------------- */

  const handleViewDetails = (job) => {
    fetchJobDetails(job._id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  /* ---------------- FILTER ---------------- */

  const filteredJobs = jobs.filter((job) => {
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

    return (
      matchesSearch &&
      matchesLocation &&
      matchesType &&
      matchesExperience &&
      matchesSalary
    );
  });

  // Calculate pagination based on filtered jobs
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalFilteredPages = Math.ceil(filteredJobs.length / jobsPerPage);

  /* ---------------- PAGINATION HANDLERS ---------------- */

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

  /* ---------------- FORMAT DATE ---------------- */

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout title="Browse Jobs" navItems={navItems}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Find Your Dream Job
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Browse through {filteredJobs.length} available positions and take
            the next step in your career
          </p>
        </div>

        {/* SEARCH AND FILTERS */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition">
              <Filter className="h-5 w-5" />
              Filters
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* EXPANDED FILTERS */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Any location"
                  value={filters.location}
                  onChange={(e) => {
                    setFilters({ ...filters, location: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500">
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
                  Experience Level
                </label>
                <select
                  value={filters.experience}
                  onChange={(e) => {
                    setFilters({ ...filters, experience: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500">
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500">
                  <option value="">Any Salary</option>
                  <option value="0-3">0-3 LPA</option>
                  <option value="3-6">3-6 LPA</option>
                  <option value="6-10">6-10 LPA</option>
                  <option value="10-15">10-15 LPA</option>
                  <option value="15+">15+ LPA</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* JOBS COUNT AND PER PAGE SELECTOR */}
        {!loading && filteredJobs.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <p className="text-gray-600 dark:text-gray-400 mb-2 sm:mb-0">
              Showing{" "}
              <span className="font-semibold">{indexOfFirstJob + 1}</span> to{" "}
              <span className="font-semibold">
                {Math.min(indexOfLastJob, filteredJobs.length)}
              </span>{" "}
              of <span className="font-semibold">{filteredJobs.length}</span>{" "}
              jobs
            </p>
            <div className="flex items-center gap-2">
              <label
                htmlFor="perPage"
                className="text-sm text-gray-600 dark:text-gray-400">
                Jobs per page:
              </label>
              <select
                id="perPage"
                value={jobsPerPage}
                onChange={handlePerPageChange}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500">
                <option value={2}>2 (Default)</option>
                <option value={4}>4</option>
                <option value={6}>6</option>
                <option value={8}>8</option>
                <option value={10}>10</option>
              </select>
            </div>
          </div>
        )}

        {/* JOB LIST */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-500 mt-4">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <Briefcase className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No jobs found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters to find more opportunities
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {currentJobs.map((job, index) => (
                <div
                  key={job._id}
                  className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-blue-200 dark:hover:border-blue-800">
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition">
                        <span className="text-2xl font-bold text-white">
                          {job.company?.charAt(0)}
                        </span>
                      </div>

                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                          {job.title || job.profile}
                        </h2>

                        <p className="text-gray-600 dark:text-gray-400 font-medium mb-3">
                          {job.company}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            {job.location || "Not specified"}
                          </span>
                          <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            {job.salary || "Not specified"}
                          </span>
                          <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Briefcase className="h-4 w-4 text-purple-500" />
                            {job.type || "Not specified"}
                          </span>
                          <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="h-4 w-4 text-orange-500" />
                            {job.experienceRequired || "Fresher"}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {job.skillsRequired?.slice(0, 5).map((skill, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition cursor-default">
                              {skill}
                            </span>
                          ))}
                          {job.skillsRequired?.length > 5 && (
                            <span className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                              +{job.skillsRequired.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 lg:flex-col items-stretch">
                      <button
                        onClick={() => handleApply(job._id)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl">
                        Apply Now
                      </button>
                      <button
                        onClick={() => handleViewDetails(job)}
                        className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 flex items-center justify-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION CONTROLS */}
            {filteredJobs.length > jobsPerPage && (
              <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Page <span className="font-semibold">{currentPage}</span> of{" "}
                  <span className="font-semibold">{totalFilteredPages}</span>
                  <span className="ml-2 text-xs">
                    ({jobsPerPage} jobs per page)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    title="First Page">
                    <ChevronsLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    title="Previous Page">
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {/* Page Numbers */}
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
                            className={`w-10 h-10 rounded-lg font-medium transition ${
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
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    title="Next Page">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={goToLastPage}
                    disabled={currentPage === totalFilteredPages}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    title="Last Page">
                    <ChevronsRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* JOB DETAILS MODAL - Now inside DashboardLayout */}
        {isModalOpen && selectedJob && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity"
                onClick={closeModal}></div>

              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                {jobDetailsLoading ? (
                  <div className="p-20 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                    <p className="text-gray-500 mt-4">Loading job details...</p>
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
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <span className="text-3xl font-bold text-white">
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

                      {/* Job Description - Highlighted Section */}
                      <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
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

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-blue-500" />
                            Job Details
                          </h3>
                          <div className="space-y-2">
                            <p className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                Type:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {selectedJob.type || "Not specified"}
                              </span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                Experience:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {selectedJob.experienceRequired || "Fresher"}
                              </span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                Salary:
                              </span>
                              <span className="font-medium text-green-600 dark:text-green-400">
                                {selectedJob.salary || "Not specified"}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-purple-500" />
                            Company Details
                          </h3>
                          <div className="space-y-2">
                            <p className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                Company:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {selectedJob.company}
                              </span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                Location:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {selectedJob.location || "Not specified"}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Code className="h-5 w-5 text-green-500" />
                            Skills Required
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedJob.skillsRequired?.length > 0 ? (
                              selectedJob.skillsRequired.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
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

                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Award className="h-5 w-5 text-yellow-500" />
                            Additional Info
                          </h3>
                          <div className="space-y-2">
                            <p className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                Job ID:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white font-mono text-sm">
                                {selectedJob._id}
                              </span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                Last Updated:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {formatDate(selectedJob.updatedAt)}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex justify-end gap-3 sticky bottom-0 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={closeModal}
                        className="px-6 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                        Close
                      </button>
                      <button
                        onClick={() => {
                          closeModal();
                          handleApply(selectedJob._id);
                        }}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-md">
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
