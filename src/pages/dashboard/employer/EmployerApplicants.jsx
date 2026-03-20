// src/pages/dashboard/employer/EmployerApplicants.jsx
import { useEffect, useState, useMemo, useCallback } from "react";
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
  File,
  Loader2,
  AlertCircle,
  Github,
  Linkedin,
  Globe,
  ChevronDown,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import api from "../../../utils/api";

const EmployerApplicants = () => {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showApplicantModal, setShowApplicantModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  // Filter states
  const [selectedJob, setSelectedJob] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Loading states
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Responsive detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
      
      // Adjust items per page based on screen size
      if (window.innerWidth < 640) {
        setItemsPerPage(3);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(4);
      } else {
        setItemsPerPage(5);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Filter applicants based on selected filters and search
  const filteredApplicants = useMemo(() => {
    if (!applicants.length) return [];

    let filtered = [...applicants];

    // Apply job filter
    if (selectedJob !== "all") {
      filtered = filtered.filter((app) => {
        const jobId = app.jobId?._id || app.jobId;
        return jobId === selectedJob;
      });
    }

    // Apply status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (app) => app.status?.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (app) =>
          app.fullName?.toLowerCase().includes(term) ||
          app.email?.toLowerCase().includes(term) ||
          app.phone?.includes(term) ||
          app.jobId?.title?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [applicants, selectedJob, selectedStatus, searchTerm]);

  // Pagination calculations
  const paginatedItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredApplicants.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredApplicants, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedJob, selectedStatus, searchTerm]);

  // Fetch all applications
  const fetchData = async () => {
    setLoading(true);
    const startTime = Date.now();
    setError(null);

    try {
      console.log("Fetching applications...");
      const response = await api.get("/applications");
      console.log("API Response:", response.data);

      let applicationsData = [];

      // Handle different response structures
      if (response.data?.success && response.data.applications) {
        applicationsData = response.data.applications;
      } else if (response.data?.applications) {
        applicationsData = response.data.applications;
      } else if (Array.isArray(response.data)) {
        applicationsData = response.data;
      }

      console.log("Applications data extracted:", applicationsData.length);

      if (applicationsData.length === 0) {
        setApplicants([]);
        setJobs([]);
        toast.info("No applications found");
        return;
      }

      // Extract unique jobs from applications
      const jobMap = new Map();

      applicationsData.forEach((app) => {
        if (app.jobId && app.jobId._id) {
          if (!jobMap.has(app.jobId._id)) {
            jobMap.set(app.jobId._id, {
              _id: app.jobId._id,
              title: app.jobId.title || "Unknown Position",
              company: app.jobId.company || "Unknown Company",
              location: app.jobId.location || "Unknown Location",
            });
          }
        }
      });

      const jobsList = Array.from(jobMap.values());
      console.log("Jobs extracted from applications:", jobsList);

      setJobs(jobsList);
      setApplicants(applicationsData);

      toast.success(
        `${applicationsData.length} applications loaded successfully`
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.response?.data?.message || "Failed to load applicants");
      toast.error(error.response?.data?.message || "Failed to load applicants");
    } finally {
      // Ensure minimum loading time
      const elapsedTime = Date.now() - startTime;
      const minimumLoadTime = 2000;

      if (elapsedTime < minimumLoadTime) {
        setTimeout(() => {
          setLoading(false);
        }, minimumLoadTime - elapsedTime);
      } else {
        setLoading(false);
      }
    }
  };

  // Handle status update
  const handleStatusChange = async (applicationId, newStatus) => {
    setStatusUpdating(applicationId);
    try {
      await api.patch(`/applications/${applicationId}/status`, {
        status: newStatus,
      });

      setApplicants((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      // Also update in modal if open
      if (selectedApplicant?._id === applicationId) {
        setSelectedApplicant((prev) => ({ ...prev, status: newStatus }));
      }

      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Status update failed:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setStatusUpdating(null);
    }
  };

  // Handle resume download
  const handleDownloadResume = async (applicationId) => {
    if (downloading) return;
    
    setDownloading(true);
    setDownloadingId(applicationId);

    try {
      console.log("Downloading resume for application:", applicationId);

      const response = await api.get(`/applications/${applicationId}/resume`, {
        responseType: "blob",
        timeout: 30000, // 30 second timeout
      });

      // Check if response is valid
      if (!response.data || response.data.size === 0) {
        throw new Error("Resume file is empty");
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers["content-disposition"];
      let filename = "resume.pdf";

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, "");
        }
      }

      // If no filename in header, extract from URL or use default
      if (filename === "resume.pdf") {
        const applicant = applicants.find((a) => a._id === applicationId);
        if (applicant?.resume) {
          const resumePath = applicant.resume;
          const originalName = resumePath.split(/[\\/]/).pop();
          if (originalName) {
            filename = originalName;
          }
        }
      }

      // Ensure .pdf extension if not present
      if (!filename.toLowerCase().endsWith(".pdf")) {
        filename += ".pdf";
      }

      console.log("Downloading as:", filename);

      // Create download link
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "application/pdf",
        })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      toast.success("Resume downloaded successfully");
    } catch (error) {
      console.error("Download failed:", error);

      if (error.code === "ECONNABORTED") {
        toast.error("Download timed out. Please try again.");
      } else if (error.response?.status === 404) {
        toast.error("Resume not found for this application");
      } else if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to download this resume");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to download resume"
        );
      }
    } finally {
      setDownloading(false);
      setDownloadingId(null);
    }
  };

  // Helper functions
  const hasResume = (applicant) => {
    return (
      applicant?.resume &&
      applicant.resume !== null &&
      applicant.resume !== "" &&
      !applicant.resume.includes("null") &&
      !applicant.resume.includes("undefined")
    );
  };

  const getResumeIcon = (filename) => {
    if (!filename) return <File className="h-3 w-3 sm:h-4 sm:w-4" />;

    const ext = filename.split(".").pop()?.toLowerCase();
    if (ext === "pdf") {
      return <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />;
    } else if (ext === "doc" || ext === "docx") {
      return <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />;
    }
    return <File className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />;
  };

  const getStatusBadge = (status) => {
    const statusLower = (status || "").toLowerCase();

    const statusConfig = {
      shortlisted: {
        icon: CheckCircle,
        class:
          "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
        label: "Shortlisted",
      },
      interview: {
        icon: Calendar,
        class:
          "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
        label: "Interview",
      },
      hired: {
        icon: Award,
        class:
          "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
        label: "Hired",
      },
      rejected: {
        icon: XCircle,
        class:
          "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
        label: "Rejected",
      },
      applied: {
        icon: Clock,
        class:
          "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
        label: "Applied",
      },
      "under review": {
        icon: Clock,
        class:
          "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
        label: "Under Review",
      },
    };

    const config = statusConfig[statusLower] || statusConfig.applied;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-medium border rounded-full ${config.class}`}>
        <Icon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
        <span className="hidden sm:inline">{config.label}</span>
        <span className="sm:hidden">{config.label.charAt(0)}</span>
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const formatDisplayValue = (value) => {
    if (!value || value === "" || value === "null" || value === "undefined") {
      return "N/A";
    }
    return value;
  };

  // Pagination handlers
  const goToPage = useCallback(
    (page) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [totalPages]
  );

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedJob("all");
    setSelectedStatus("all");
    setSearchTerm("");
  };

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20">
      <div className="relative">
        <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 rounded-full border-3 border-gray-200 dark:border-gray-700 border-t-blue-600 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Users className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600 animate-pulse" />
        </div>
      </div>
      <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
        Loading applicants...
      </p>
      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 mt-1 sm:mt-2">
        Please wait while we fetch the data
      </p>
    </div>
  );

  // Error Component
  const ErrorDisplay = ({ message, onRetry }) => (
    <div className="text-center py-10 sm:py-12 md:py-16">
      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
        <AlertCircle className="h-6 w-6 sm:h-7 sm:w-7 md:h-10 md:w-10 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
        Something went wrong
      </h3>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 max-w-md mx-auto px-4">
        {message ||
          "Failed to load applicants. Please check your connection and try again."}
      </p>
      <button
        onClick={onRetry}
        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium">
        Try Again
      </button>
    </div>
  );

  // Info Card Component
  const InfoCard = ({ label, value, subValue, icon }) => {
    const displayValue = formatDisplayValue(value);

    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl min-w-0">
        <p className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5 sm:mb-1">
          {label}
        </p>
        <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1 truncate">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span className="truncate">{displayValue}</span>
        </p>
        {subValue && (
          <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1 truncate">
            {formatDisplayValue(subValue)}
          </p>
        )}
      </div>
    );
  };

  // Applicant Modal Component (Full Details)
  const ApplicantModal = ({ applicant, onClose }) => {
    if (!applicant) return null;

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 flex justify-between items-center z-10">
            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <UserCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span className="truncate">Applicant Profile</span>
            </h2>
            <button
              onClick={onClose}
              className="p-1 sm:p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close modal">
              <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
            {/* Header Section with Avatar */}
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 md:gap-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  {applicant.fullName?.charAt(0) || "A"}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate">
                      {formatDisplayValue(applicant.fullName)}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1 truncate">
                      Applied for:{" "}
                      <span className="font-medium">
                        {applicant.jobId?.title || "Unknown Position"}
                      </span>
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                      Applied on: {formatDate(applicant.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 sm:gap-2">
                    {getStatusBadge(applicant.status)}
                    <div className="text-right">
                      <span className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
                        {applicant.aiScore || 0}%
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-500 ml-1">
                        Match
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              <InfoCard
                label="Email"
                value={applicant.email}
                icon={
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                }
              />
              <InfoCard
                label="Phone"
                value={applicant.phone}
                icon={
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                }
              />
            </div>

            {/* Resume Section */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-600" />
                Resume / CV
              </h4>

              {hasResume(applicant) ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 w-full sm:w-auto">
                    {getResumeIcon(applicant.resume)}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                        {applicant.resume.split(/[\\/]/).pop() || "Resume"}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        Click to download
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadResume(applicant._id)}
                    disabled={downloading && downloadingId === applicant._id}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                    {downloading && downloadingId === applicant._id ? (
                      <>
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                        <span className="hidden sm:inline">Downloading...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Download Resume</span>
                        <span className="sm:hidden">Resume</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3 text-gray-500 dark:text-gray-400">
                  <File className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                  <p className="text-xs sm:text-sm">No resume uploaded</p>
                </div>
              )}
            </div>

            {/* Personal Details */}
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                <UserCircle className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-600" />
                Personal Details
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                <InfoCard
                  label="Date of Birth"
                  value={formatDate(applicant.dob)}
                />
                <InfoCard label="Gender" value={applicant.gender} />
                <InfoCard
                  label="Location"
                  value={`${applicant.city || ""}, ${applicant.country || ""}`}
                />
              </div>
            </div>

            {/* Address */}
            {(applicant.address ||
              applicant.city ||
              applicant.state ||
              applicant.pincode) && (
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 sm:mb-2">
                  Address
                </p>
                <p className="text-xs sm:text-sm text-gray-900 dark:text-white break-words">
                  {formatDisplayValue(applicant.address)}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">
                  {[applicant.city, applicant.state, applicant.pincode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            )}

            {/* Government IDs */}
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-600" />
                Government IDs
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <InfoCard label="Aadhaar" value={applicant.aadhaar} />
                <InfoCard label="PAN" value={applicant.pan} />
                <InfoCard label="UAN" value={applicant.uan} />
              </div>
            </div>

            {/* Education */}
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-600" />
                Education
              </h4>
              <div className="space-y-2 sm:space-y-3">
                <InfoCard
                  label="Class 10th"
                  value={`${applicant.tenthBoard || ""} • ${
                    applicant.tenthPercentage || ""
                  }% • ${applicant.tenthYear || ""}`}
                />
                <InfoCard
                  label="Class 12th"
                  value={`${applicant.twelfthBoard || ""} • ${
                    applicant.twelfthPercentage || ""
                  }% • ${applicant.twelfthYear || ""}`}
                />
                {applicant.graduationCollege && (
                  <InfoCard
                    label="Graduation"
                    value={`${applicant.graduationDegree || ""} • ${
                      applicant.graduationCollege || ""
                    }`}
                    subValue={`${applicant.graduationPercentage || ""}% • ${
                      applicant.graduationYear || ""
                    }`}
                  />
                )}
              </div>
            </div>

            {/* Work Experience */}
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-600" />
                Work Experience
              </h4>
              {applicant.companyName ? (
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                        {formatDisplayValue(applicant.companyName)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">
                        {formatDisplayValue(applicant.companyRole)}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap">
                      {applicant.experienceYears || "0"} years
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-2 sm:mt-3">
                    {formatDate(applicant.startDate)} -{" "}
                    {applicant.endDate
                      ? formatDate(applicant.endDate)
                      : "Present"}
                  </p>
                  {applicant.previousCompany && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                        Previous:{" "}
                        {formatDisplayValue(applicant.previousCompany)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {formatDisplayValue(applicant.previousRole)}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  No experience details provided
                </p>
              )}
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                <Award className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-600" />
                Skills
              </h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {applicant.skills && applicant.skills.length > 0 ? (
                  applicant.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-[10px] sm:text-sm">
                      {skill.length > 20 ? skill.substring(0, 20) + "..." : skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    No skills listed
                  </p>
                )}
              </div>
            </div>

            {/* Social Links */}
            {(applicant.github ||
              applicant.linkedin ||
              applicant.portfolio) && (
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  Professional Links
                </h4>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {applicant.github && (
                    <a
                      href={applicant.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-blue-600 hover:text-blue-700">
                      <Github className="h-3 w-3 sm:h-4 sm:w-4" />
                      GitHub
                    </a>
                  )}
                  {applicant.linkedin && (
                    <a
                      href={applicant.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-blue-600 hover:text-blue-700">
                      <Linkedin className="h-3 w-3 sm:h-4 sm:w-4" />
                      LinkedIn
                    </a>
                  )}
                  {applicant.portfolio && (
                    <a
                      href={applicant.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-blue-600 hover:text-blue-700">
                      <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
                      Portfolio
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Cover Letter */}
            {applicant.coverLetter && (
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-600" />
                  Cover Letter
                </h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 sm:p-4 rounded-lg sm:rounded-xl text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line max-h-40 sm:max-h-60 overflow-y-auto break-words">
                  {applicant.coverLetter}
                </div>
              </div>
            )}

            {/* Status Update */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-3 sm:pt-4">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Update Application Status
              </label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <select
                  value={applicant.status || "Applied"}
                  onChange={(e) =>
                    handleStatusChange(applicant._id, e.target.value)
                  }
                  disabled={statusUpdating === applicant._id}
                  className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
                  <option value="Applied">Applied</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </select>

                {statusUpdating === applicant._id && (
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-blue-600">
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    Updating...
                  </div>
                )}
              </div>
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-t border-gray-200 dark:border-gray-800 pt-4 sm:pt-6 mt-4 sm:mt-6">
        <div className="text-[10px] sm:text-xs md:text-sm text-gray-700 dark:text-gray-300 order-2 sm:order-1 text-center">
          Showing{" "}
          <span className="font-medium">
            {filteredApplicants.length > 0
              ? (currentPage - 1) * itemsPerPage + 1
              : 0}
          </span>{" "}
          to{" "}
          <span className="font-medium">
            {Math.min(currentPage * itemsPerPage, filteredApplicants.length)}
          </span>{" "}
          of <span className="font-medium">{filteredApplicants.length}</span>{" "}
          applicants
        </div>

        <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
          <button
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className="p-1 sm:p-1.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="First page">
            <ChevronsLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1 sm:p-1.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Previous page">
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>

          <span className="text-[10px] sm:text-xs md:text-sm text-gray-700 dark:text-gray-300 px-1 sm:px-2">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1 sm:p-1.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Next page">
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <button
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1 sm:p-1.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Last page">
            <ChevronsRight className="h-3 w-3 sm:h-4 sm:w-4" />
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

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-3 sm:p-4 md:p-6">
        {/* Header with Stats and Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Applicants
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
              Manage and review all job applications
            </p>
            {!loading && !error && (
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                <span className="text-[10px] sm:text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                  Total: {applicants.length}
                </span>
                <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                  Filtered: {filteredApplicants.length}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder={isMobile ? "Search..." : "Search by name, email, job..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-56 md:w-64 px-2 sm:px-3 py-1.5 sm:py-2 pl-7 sm:pl-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
            </div>

            {/* Job Filter */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-50 dark:bg-gray-800/50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <Filter className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="bg-transparent border-0 text-[11px] sm:text-xs md:text-sm text-gray-700 dark:text-gray-300 focus:ring-0 w-full sm:w-auto cursor-pointer"
                disabled={loading || jobs.length === 0}>
                <option value="all">All Jobs ({applicants.length})</option>
                {jobs.map((job) => {
                  const count = applicants.filter(
                    (app) => (app.jobId?._id || app.jobId) === job._id
                  ).length;
                  return (
                    <option key={job._id} value={job._id}>
                      {isMobile ? job.title.substring(0, 15) : job.title} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[11px] sm:text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto cursor-pointer"
              disabled={loading}>
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

        {/* Content */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorDisplay message={error} onRetry={fetchData} />
        ) : filteredApplicants.length === 0 ? (
          <div className="text-center py-8 sm:py-10 md:py-12 lg:py-16">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-gray-400" />
            </div>
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
              No applications found
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto px-4">
              {applicants.length === 0
                ? "No applications have been submitted yet."
                : `No applications match the selected filters.`}
            </p>
            {(selectedJob !== "all" ||
              selectedStatus !== "all" ||
              searchTerm) && (
              <button
                onClick={clearAllFilters}
                className="mt-3 sm:mt-4 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {paginatedItems.map((app) => (
                <div
                  key={app._id}
                  className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => {
                    setSelectedApplicant(app);
                    setShowApplicantModal(true);
                  }}>
                  <div className="p-2.5 sm:p-3 md:p-4 lg:p-5">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2 sm:gap-3 md:gap-4">
                      {/* Left Section - Candidate Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                          {/* Avatar */}
                          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                            <span className="text-xs sm:text-sm md:text-base font-bold text-white">
                              {app.fullName?.charAt(0) || "A"}
                            </span>
                          </div>

                          {/* Candidate Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                              <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 dark:text-white truncate max-w-[120px] sm:max-w-[200px] md:max-w-[250px]">
                                {app.fullName || "Unknown"}
                              </h3>
                              {getStatusBadge(app.status)}
                            </div>

                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-2 truncate">
                              Applied for{" "}
                              <span className="font-medium text-gray-900 dark:text-white">
                                {app.jobId?.title || "Unknown Position"}
                              </span>
                            </p>

                            {/* Contact Info */}
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-0.5 sm:gap-1 min-w-0">
                                <Mail className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                                <span className="truncate max-w-[80px] sm:max-w-[120px] md:max-w-[150px]">
                                  {app.email}
                                </span>
                              </span>
                              {app.phone && (
                                <span className="flex items-center gap-0.5 sm:gap-1">
                                  <Phone className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                  <span className="hidden xs:inline">{app.phone}</span>
                                </span>
                              )}
                              <span className="hidden sm:flex items-center gap-0.5 sm:gap-1">
                                <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                {formatDate(app.createdAt)}
                              </span>
                            </div>

                            {/* Resume Indicator */}
                            {hasResume(app) && (
                              <div className="flex items-center gap-0.5 sm:gap-1 mt-1 sm:mt-2 text-[9px] sm:text-xs text-green-600">
                                {getResumeIcon(app.resume)}
                                <span>Resume available</span>
                              </div>
                            )}

                            {/* Skills Preview */}
                            {app.skills && app.skills.length > 0 && (
                              <div className="hidden sm:flex flex-wrap gap-1 mt-1 sm:mt-2">
                                {app.skills.slice(0, 3).map((skill, i) => (
                                  <span
                                    key={i}
                                    className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-[9px] sm:text-xs">
                                    {skill.length > 12 ? skill.substring(0, 10) + "..." : skill}
                                  </span>
                                ))}
                                {app.skills.length > 3 && (
                                  <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-[9px] sm:text-xs">
                                    +{app.skills.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Score & Actions */}
                      <div className="flex items-center justify-between lg:flex-col lg:items-end gap-1.5 sm:gap-2 mt-1 sm:mt-0">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div className="text-sm sm:text-base md:text-lg font-bold text-blue-600">
                            {app.aiScore || 0}%
                          </div>
                          <div className="text-[9px] sm:text-xs text-gray-500">Match</div>
                        </div>
                        <button
                          className="p-1 sm:p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApplicant(app);
                            setShowApplicantModal(true);
                          }}
                          aria-label="View details">
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
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