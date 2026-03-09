// src/pages/dashboard/employer/EmployerJobs.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  TrendingUp,
  Users,
  PlusCircle,
  MapPin,
  DollarSign,
  Clock,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import api from "../../../utils/api";

const EmployerJobs = () => {
  const navigate = useNavigate();
  const [myJobs, setMyJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Pagination states - 3 items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [paginatedItems, setPaginatedItems] = useState([]);

  const navItems = [
    { label: "Overview", href: "/dashboard/employer", icon: TrendingUp },
    { label: "My Jobs", href: "/dashboard/employer/jobs", icon: Briefcase },
    {
      label: "Applicants",
      href: "/dashboard/employer/applicants",
      icon: Users,
    },
    { label: "Post Job", href: "/dashboard/employer/post", icon: PlusCircle },
  ];

  useEffect(() => {
    fetchJobs();
  }, []);

  // Update pagination when jobs change
  useEffect(() => {
    setFilteredJobs(myJobs);
    setCurrentPage(1);
  }, [myJobs]);

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setPaginatedItems(filteredJobs.slice(indexOfFirstItem, indexOfLastItem));
  }, [filteredJobs, currentPage, itemsPerPage]);

  // Pagination functions
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPrevPage = () => goToPage(currentPage - 1);

  // ---------------- GET ALL JOBS ----------------
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/jobs");

      console.log("Jobs API Response:", response.data);

      let jobsData = [];

      if (response.data && response.data.applications) {
        jobsData = response.data.applications;
      } else if (Array.isArray(response.data)) {
        jobsData = response.data;
      } else if (response.data && response.data.data) {
        jobsData = response.data.data;
      } else if (response.data && response.data.success && response.data.jobs) {
        jobsData = response.data.jobs;
      }

      console.log("Processed jobs data:", jobsData);

      const employerJobs = jobsData.filter(
        (job) => job.company === "Tech Corp" || job.company === "Google"
      );

      setMyJobs(employerJobs);

      if (employerJobs.length === 0) {
        toast.info("No jobs found for your company");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DELETE JOB ----------------
  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    setDeletingId(id);
    try {
      await api.delete(`/jobs/${id}`);
      toast.success("Job deleted successfully");
      fetchJobs();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  // ---------------- EDIT JOB ----------------
  const handleEditJob = (job) => {
    navigate("/dashboard/employer/post", {
      state: {
        job: {
          _id: job._id,
          title: job.title,
          location: job.location,
          type: job.type,
          salary: job.salary,
          description: job.description,
          skillsRequired: job.skillsRequired || [],
          company: job.company,
        },
      },
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Pagination Component
  const Pagination = () => {
    if (filteredJobs.length === 0) return null;

    return (
      <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-6 mt-6">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing{" "}
          <span className="font-medium">
            {(currentPage - 1) * itemsPerPage + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium">
            {Math.min(currentPage * itemsPerPage, filteredJobs.length)}
          </span>{" "}
          of <span className="font-medium">{filteredJobs.length}</span> jobs
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToFirstPage}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="First page">
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Previous page">
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}>
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Next page">
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Last page">
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout title="My Jobs" navItems={navItems}>
      <div className="space-y-4">
        {/* Header with Post Job button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Job Listings
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"}{" "}
              posted
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/employer/post")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            <PlusCircle className="h-4 w-4" />
            Post New Job
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        ) : myJobs.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No jobs posted yet
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Start your hiring journey by posting your first job opportunity.
            </p>
            <button
              onClick={() => navigate("/dashboard/employer/post")}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              <PlusCircle className="h-4 w-4" />
              Post Your First Job
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedItems.map((job) => (
                <div
                  key={job._id}
                  className="group bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                          <Briefcase className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                              {job.title}
                            </h3>
                            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
                              Active
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {job.company || "Your Company"}
                          </p>

                          <div className="flex flex-wrap gap-4 mb-4">
                            <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              {job.location || "Location not specified"}
                            </span>
                            <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                              <Clock className="h-4 w-4 text-gray-500" />
                              {job.type || "Full-time"}
                            </span>
                            <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                              <DollarSign className="h-4 w-4 text-gray-500" />
                              {job.salary || "Salary not specified"}
                            </span>
                          </div>

                          {/* Skills */}
                          {job.skillsRequired &&
                            job.skillsRequired.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {job.skillsRequired
                                  .slice(0, 4)
                                  .map((skill, i) => (
                                    <span
                                      key={i}
                                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium">
                                      {skill}
                                    </span>
                                  ))}
                                {job.skillsRequired.length > 4 && (
                                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium">
                                    +{job.skillsRequired.length - 4}
                                  </span>
                                )}
                              </div>
                            )}

                          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-1.5">
                              <Users className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {job.applicants || 0} Applicants
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Posted:{" "}
                                {formatDate(job.createdAt || job.postedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 lg:flex-col">
                      <button
                        onClick={() => handleEditJob(job)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        disabled={deletingId === job._id}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50">
                        {deletingId === job._id ? (
                          "Deleting..."
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EmployerJobs;
    