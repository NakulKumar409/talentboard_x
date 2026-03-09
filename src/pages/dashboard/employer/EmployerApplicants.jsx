// src/pages/dashboard/employer/EmployerApplicants.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  TrendingUp,
  Users,
  PlusCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Download,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  Award,
  GraduationCap,
  ExternalLink,
  FileText,
  UserCircle,
  Building,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import api from "../../../utils/api";

const EmployerApplicants = () => {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [jobs, setJobs] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showApplicantModal, setShowApplicantModal] = useState(false);

  // Pagination states
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
    fetchData();
  }, []);

  useEffect(() => {
    filterApplicants();
  }, [selectedJob, selectedStatus, applicants]);

  // Update pagination when filtered applicants change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredApplicants]);

  useEffect(() => {
    // Calculate paginated items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setPaginatedItems(
      filteredApplicants.slice(indexOfFirstItem, indexOfLastItem)
    );
  }, [filteredApplicants, currentPage, itemsPerPage]);

  // Pagination functions
  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPrevPage = () => goToPage(currentPage - 1);

  // ---------------- FETCH ALL APPLICATIONS ----------------
  const fetchApplications = async () => {
    try {
      const response = await api.get("/applications");

      console.log("Applications API Response:", response.data);

      let applicationsData = [];

      if (
        response.data &&
        response.data.success &&
        response.data.applications
      ) {
        applicationsData = response.data.applications;
        console.log(`Total applications from API: ${response.data.total}`);
      } else if (response.data && response.data.applications) {
        applicationsData = response.data.applications;
      } else if (Array.isArray(response.data)) {
        applicationsData = response.data;
      }

      return applicationsData;
    } catch (error) {
      console.error("Error fetching applications:", error);
      throw error;
    }
  };

  // ---------------- FETCH EMPLOYER JOBS ----------------
  const fetchJobs = async () => {
    try {
      const response = await api.get("/jobs");

      let jobsData = [];
      if (response.data && response.data.applications) {
        jobsData = response.data.applications;
      } else if (Array.isArray(response.data)) {
        jobsData = response.data;
      }

      // Filter for employer's jobs (based on company name)
      const employerJobs = jobsData.filter(
        (job) => job.company === "Google" || job.company === "Tech Corp"
      );

      return employerJobs;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return [];
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsData, applicationsData] = await Promise.all([
        fetchJobs(),
        fetchApplications(),
      ]);

      console.log("Jobs loaded:", jobsData);
      console.log("Applications loaded:", applicationsData);

      setJobs(jobsData);
      const jobIds = jobsData.map((job) => job._id);

      const relevantApplications = applicationsData.filter((app) => {
        const jobId = app.jobId?._id || app.jobId;
        return jobIds.includes(jobId);
      });

      console.log("Relevant applications:", relevantApplications);
      setApplicants(relevantApplications);
      setFilteredApplicants(relevantApplications);

      if (relevantApplications.length === 0) {
        toast.info("No applications found for your jobs");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  const filterApplicants = () => {
    let filtered = [...applicants];

    if (selectedJob !== "all") {
      filtered = filtered.filter(
        (app) => (app.jobId?._id || app.jobId) === selectedJob
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (app) => app.status?.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    setFilteredApplicants(filtered);
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await api.patch(`/applications/${applicationId}/status`, {
        status: newStatus,
      });

      const updatedApplicants = applicants.map((app) =>
        app._id === applicationId ? { ...app, status: newStatus } : app
      );
      setApplicants(updatedApplicants);

      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Status update failed:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleDownloadResume = async (applicationId) => {
    try {
      const response = await api.get(`/applications/${applicationId}/resume`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Resume downloaded successfully");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download resume");
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = (status || "").toLowerCase();

    const statusConfig = {
      shortlisted: {
        icon: CheckCircle,
        class: "bg-emerald-50 text-emerald-700 border-emerald-200",
        label: "Shortlisted",
      },
      interview: {
        icon: Calendar,
        class: "bg-purple-50 text-purple-700 border-purple-200",
        label: "Interview",
      },
      hired: {
        icon: Award,
        class: "bg-blue-50 text-blue-700 border-blue-200",
        label: "Hired",
      },
      rejected: {
        icon: XCircle,
        class: "bg-red-50 text-red-700 border-red-200",
        label: "Rejected",
      },
      applied: {
        icon: Clock,
        class: "bg-gray-50 text-gray-700 border-gray-200",
        label: "Applied",
      },
    };

    const config = statusConfig[statusLower] || statusConfig.applied;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium border ${config.class} rounded-full`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Full Applicant Detail Modal
  const ApplicantModal = ({ applicant, onClose }) => {
    if (!applicant) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800">
          <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Applicant Profile
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="p-6 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-bold text-white">
                    {applicant.fullName?.charAt(0) ||
                      applicant.userId?.name?.charAt(0) ||
                      "A"}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {applicant.fullName || applicant.userId?.name}
                  </h3>
                  <div className="space-y-1.5">
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Mail className="h-4 w-4" /> {applicant.email}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Phone className="h-4 w-4" /> {applicant.phone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="text-right">
                  <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                    {applicant.aiScore || 0}%
                  </div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                    AI Match Score
                  </p>
                </div>
                {getStatusBadge(applicant.status)}
              </div>
            </div>

            {/* Personal Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Date of Birth
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {applicant.dob ? formatDate(applicant.dob) : "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Gender
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {applicant.gender || "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Location
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {applicant.city || "N/A"}, {applicant.country || "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Applied For
                </p>
                <p className="text-sm font-semibold text-gray-900 dark-white">
                  {applicant.jobId?.title || "N/A"}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Address
              </p>
              <p className="text-sm text-gray-900 dark:text-white">
                {applicant.address || "N/A"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {applicant.city}, {applicant.state} - {applicant.pincode}
              </p>
            </div>

            {/* ID Details */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Government IDs
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Aadhaar
                  </p>
                  <p className="text-sm font-mono font-semibold text-gray-900 dark:text-white">
                    {applicant.aadhaar || "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    PAN
                  </p>
                  <p className="text-sm font-mono font-semibold text-gray-900 dark:text-white">
                    {applicant.pan || "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    UAN
                  </p>
                  <p className="text-sm font-mono font-semibold text-gray-900 dark:text-white">
                    {applicant.uan || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Education */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                Education
              </h4>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Class 10th
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {applicant.tenthBoard || "N/A"} •{" "}
                    {applicant.tenthPercentage || "N/A"}% •{" "}
                    {applicant.tenthYear || "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Class 12th
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {applicant.twelfthBoard || "N/A"} •{" "}
                    {applicant.twelfthPercentage || "N/A"}% •{" "}
                    {applicant.twelfthYear || "N/A"}
                  </p>
                </div>
                {applicant.graduationCollege && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Graduation
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {applicant.graduationDegree} •{" "}
                      {applicant.graduationCollege}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {applicant.graduationPercentage}% •{" "}
                      {applicant.graduationYear}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Experience */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                Work Experience
              </h4>
              {applicant.companyName ? (
                <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {applicant.companyName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {applicant.companyRole}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      {applicant.experienceYears} years
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-3">
                    {formatDate(applicant.startDate)} -{" "}
                    {applicant.endDate
                      ? formatDate(applicant.endDate)
                      : "Present"}
                  </p>
                  {applicant.previousCompany && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Previous: {applicant.previousCompany}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {applicant.previousRole}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                  No experience details provided
                </p>
              )}
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {applicant.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm">
                    {skill}
                  </span>
                ))}
                {applicant.topSkills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium flex items-center gap-1">
                    <Award className="h-3 w-3" /> {skill}
                  </span>
                ))}
                {(!applicant.skills || applicant.skills.length === 0) && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No skills listed
                  </p>
                )}
              </div>
            </div>

            {/* Professional Links */}
            {(applicant.github ||
              applicant.linkedin ||
              applicant.portfolio) && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  Professional Links
                </h4>
                <div className="space-y-2">
                  {applicant.github && (
                    <a
                      href={applicant.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                      <ExternalLink className="h-4 w-4" /> GitHub
                    </a>
                  )}
                  {applicant.linkedin && (
                    <a
                      href={applicant.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 ml-4">
                      <ExternalLink className="h-4 w-4" /> LinkedIn
                    </a>
                  )}
                  {applicant.portfolio && (
                    <a
                      href={applicant.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 ml-4">
                      <ExternalLink className="h-4 w-4" /> Portfolio
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Cover Letter */}
            {applicant.coverLetter && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Cover Letter
                </h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {applicant.coverLetter}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => handleDownloadResume(applicant._id)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                disabled={!applicant.resume}>
                <Download className="h-4 w-4" />
                Download Resume
              </button>
              <select
                value={applicant.status || "Applied"}
                onChange={(e) =>
                  handleStatusChange(applicant._id, e.target.value)
                }
                className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Applied">Applied</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Pagination Component
  const Pagination = () => {
    if (filteredApplicants.length === 0) return null;

    return (
      <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-6 mt-6">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing{" "}
          <span className="font-medium">
            {(currentPage - 1) * itemsPerPage + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium">
            {Math.min(currentPage * itemsPerPage, filteredApplicants.length)}
          </span>{" "}
          of <span className="font-medium">{filteredApplicants.length}</span>{" "}
          applicants
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
    <DashboardLayout title="Applicants" navItems={navItems}>
      {/* Applicant Modal */}
      {showApplicantModal && selectedApplicant && (
        <ApplicantModal
          applicant={selectedApplicant}
          onClose={() => {
            setShowApplicantModal(false);
            setSelectedApplicant(null);
          }}
        />
      )}

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        {/* Header with Stats and Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Applicants
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage and review all job applications
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Job Filter */}
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="bg-transparent border-0 text-sm text-gray-700 dark:text-gray-300 focus:ring-0">
                <option value="all">All Jobs</option>
                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Status</option>
              <option value="applied">Applied</option>
              <option value="under review">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview">Interview</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No applications found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {applicants.length === 0
                ? "No one has applied to your jobs yet. Check back later!"
                : "Try adjusting your filters to see more results."}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedItems.map((app) => (
                <div
                  key={app._id}
                  className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => {
                    setSelectedApplicant(app);
                    setShowApplicantModal(true);
                  }}>
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      {/* Left Section - Candidate Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                            <span className="text-xl font-bold text-white">
                              {app.fullName?.charAt(0) ||
                                app.userId?.name?.charAt(0) ||
                                "A"}
                            </span>
                          </div>

                          {/* Candidate Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                {app.fullName || app.userId?.name}
                              </h3>
                              {getStatusBadge(app.status)}
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              Applied for{" "}
                              <span className="font-medium text-gray-900 dark:text-white">
                                {app.jobId?.title}
                              </span>{" "}
                              at {app.jobId?.company}
                            </p>

                            {/* Contact Info */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1.5">
                                <Mail className="h-4 w-4" />
                                {app.email}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Phone className="h-4 w-4" />
                                {app.phone || "N/A"}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                Applied {formatDate(app.createdAt)}
                              </span>
                            </div>

                            {/* Skills Preview */}
                            {app.skills && app.skills.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {app.skills.slice(0, 4).map((skill, i) => (
                                  <span
                                    key={i}
                                    className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium">
                                    {skill}
                                  </span>
                                ))}
                                {app.skills.length > 4 && (
                                  <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium">
                                    +{app.skills.length - 4}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Score & Actions */}
                      <div className="flex items-center gap-6 lg:flex-col lg:items-end">
                        <div className="text-right">
                          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                            {app.aiScore || 0}%
                          </div>
                          <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Match Score
                          </div>
                        </div>
                        <button
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApplicant(app);
                            setShowApplicantModal(true);
                          }}>
                          <Eye className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
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

export default EmployerApplicants;
