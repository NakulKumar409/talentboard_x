// src/pages/dashboard/seeker/Jobs.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { toast } from "sonner";
import api from "../utils/api";

const Jobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage, setJobsPerPage] = useState(6);
  const [totalJobs, setTotalJobs] = useState(0);

  const [filters, setFilters] = useState({
    location: "",
    type: "",
    experience: "",
    salary: "",
  });

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

  /* ---------------- APPLY JOB ---------------- */

  const handleApply = (jobId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to apply");
      navigate("/signup");
      return;
    }

    navigate(`/apply/${jobId}`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Simple Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            JobFinder
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Find Your Dream Job
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Browse through {filteredJobs.length} available positions
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
                <option value={6}>6</option>
                <option value={9}>9</option>
                <option value={12}>12</option>
                <option value={15}>15</option>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentJobs.map((job) => (
                <div
                  key={job._id}
                  className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-blue-200 dark:hover:border-blue-800 flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-xl font-bold text-white">
                        {job.company?.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                        {job.title || job.profile}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {job.company}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span className="truncate">
                        {job.location || "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <DollarSign className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="truncate">
                        {job.salary || "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Briefcase className="h-4 w-4 text-purple-500 flex-shrink-0" />
                      <span className="truncate">
                        {job.type || "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4 text-orange-500 flex-shrink-0" />
                      <span className="truncate">
                        {job.experienceRequired || "Fresher"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skillsRequired?.slice(0, 3).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full truncate max-w-[100px]">
                        {skill}
                      </span>
                    ))}
                    {job.skillsRequired?.length > 3 && (
                      <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                        +{job.skillsRequired.length - 3}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleApply(job._id)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-sm">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>

            {/* PAGINATION CONTROLS */}
            {filteredJobs.length > jobsPerPage && (
              <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Page <span className="font-semibold">{currentPage}</span> of{" "}
                  <span className="font-semibold">{totalFilteredPages}</span>
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

                  <span className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg font-medium">
                    {currentPage}
                  </span>

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
      </main>
    </div>
  );
};

export default Jobs;
