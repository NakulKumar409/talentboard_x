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
  X,
  Mail,
  Phone,
  Calendar,
  Download,
  Award,
  GraduationCap,
  FileText,
  UserCircle,
  Building,
  Loader2,
  Github,
  Linkedin,
  Globe,
  File,
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
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

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
      case "shortlisted":
        return "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
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

  const hasResume = (application) => {
    return (
      application?.resume &&
      application.resume !== null &&
      application.resume !== "" &&
      !application.resume.includes("null") &&
      !application.resume.includes("undefined")
    );
  };

  const generatePDF = (application) => {
    setGeneratingPDF(true);

    try {
      // Create HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Application Details - ${
            application.jobId?.title || "Application"
          }</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
            }
            .header {
              text-align: center;
              padding: 20px;
              border-bottom: 2px solid #2563eb;
              margin-bottom: 20px;
            }
            .header h1 {
              color: #2563eb;
              margin: 0;
              font-size: 24px;
            }
            .header p {
              color: #666;
              margin: 5px 0 0;
            }
            .section {
              margin-bottom: 20px;
              page-break-inside: avoid;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              color: #2563eb;
              border-left: 4px solid #2563eb;
              padding-left: 10px;
              margin-bottom: 10px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10px;
              margin-bottom: 15px;
            }
            .info-item {
              background: #f9fafb;
              padding: 8px 12px;
              border-radius: 5px;
            }
            .info-label {
              font-size: 11px;
              font-weight: 600;
              color: #6b7280;
              text-transform: uppercase;
              margin-bottom: 2px;
            }
            .info-value {
              font-size: 14px;
              font-weight: 500;
              color: #111827;
            }
            .full-width {
              grid-column: span 2;
            }
            .skills {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              margin-top: 8px;
            }
            .skill-tag {
              background: #e5e7eb;
              padding: 4px 10px;
              border-radius: 15px;
              font-size: 12px;
              color: #374151;
            }
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              margin-top: 5px;
            }
            .status-applied { background: #dbeafe; color: #1e40af; }
            .status-interview { background: #d1fae5; color: #065f46; }
            .status-shortlisted { background: #d9f99d; color: #3f6212; }
            .status-hired { background: #c7d2fe; color: #3730a3; }
            .status-rejected { background: #fee2e2; color: #991b1b; }
            .status-under-review { background: #fef3c7; color: #92400e; }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 10px;
              color: #9ca3af;
            }
            @media print {
              body { margin: 0; padding: 0; }
              .container { max-width: 100%; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Details</h1>
              <p>Generated on ${new Date().toLocaleString()}</p>
            </div>

            <!-- Job Information -->
            <div class="section">
              <div class="section-title">Job Information</div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Position</div>
                  <div class="info-value">${formatDisplayValue(
                    application.jobId?.title
                  )}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Company</div>
                  <div class="info-value">${formatDisplayValue(
                    application.jobId?.company
                  )}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Location</div>
                  <div class="info-value">${formatDisplayValue(
                    application.jobId?.location
                  )}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Job Type</div>
                  <div class="info-value">${formatDisplayValue(
                    application.jobId?.jobType
                  )}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Salary</div>
                  <div class="info-value">${formatDisplayValue(
                    application.jobId?.salary
                  )}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Match Score</div>
                  <div class="info-value">${application.aiScore || 0}%</div>
                </div>
              </div>
            </div>

            <!-- Application Status -->
            <div class="section">
              <div class="section-title">Application Status</div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Status</div>
                  <div class="info-value">
                    <span class="status-badge status-${(
                      application.status || "applied"
                    )
                      .toLowerCase()
                      .replace(/ /g, "-")}">
                      ${application.status || "Applied"}
                    </span>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-label">Applied On</div>
                  <div class="info-value">${formatDateTime(
                    application.createdAt
                  )}</div>
                </div>
                <div class="info-item full-width">
                  <div class="info-label">Last Updated</div>
                  <div class="info-value">${formatDateTime(
                    application.updatedAt
                  )}</div>
                </div>
              </div>
            </div>

            <!-- Personal Information -->
            <div class="section">
              <div class="section-title">Personal Information</div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Full Name</div>
                  <div class="info-value">${formatDisplayValue(
                    application.fullName
                  )}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Email</div>
                  <div class="info-value">${formatDisplayValue(
                    application.email
                  )}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Phone</div>
                  <div class="info-value">${formatDisplayValue(
                    application.phone
                  )}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Date of Birth</div>
                  <div class="info-value">${formatDate(application.dob)}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Gender</div>
                  <div class="info-value">${formatDisplayValue(
                    application.gender
                  )}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Location</div>
                  <div class="info-value">${formatDisplayValue(
                    application.city
                  )}${
        application.city && application.country ? ", " : ""
      }${formatDisplayValue(application.country)}</div>
                </div>
              </div>
            </div>

            <!-- Address -->
            ${
              application.address ||
              application.city ||
              application.state ||
              application.pincode
                ? `
            <div class="section">
              <div class="section-title">Address</div>
              <div class="info-item full-width">
                <div class="info-value">${formatDisplayValue(
                  application.address
                )}</div>
                <div style="margin-top: 5px; font-size: 12px; color: #6b7280;">
                  ${[application.city, application.state, application.pincode]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              </div>
            </div>
            `
                : ""
            }

            <!-- Resume Information -->
            <div class="section">
              <div class="section-title">Resume / CV</div>
              <div class="info-item full-width">
                <div class="info-value">
                  ${
                    hasResume(application)
                      ? `
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span>📄</span>
                      <span>${
                        application.resume.split(/[\\/]/).pop() || "Resume"
                      }</span>
                    </div>
                  `
                      : "No resume uploaded"
                  }
                </div>
              </div>
            </div>

            <!-- Education -->
            <div class="section">
              <div class="section-title">Education</div>
              <div class="info-grid">
                <div class="info-item full-width">
                  <div class="info-label">Class 10th</div>
                  <div class="info-value">${formatDisplayValue(
                    application.tenthBoard
                  )} - ${application.tenthPercentage || "N/A"}% (${
        application.tenthYear || "N/A"
      })</div>
                </div>
                <div class="info-item full-width">
                  <div class="info-label">Class 12th</div>
                  <div class="info-value">${formatDisplayValue(
                    application.twelfthBoard
                  )} - ${application.twelfthPercentage || "N/A"}% (${
        application.twelfthYear || "N/A"
      })</div>
                </div>
                ${
                  application.graduationCollege
                    ? `
                <div class="info-item full-width">
                  <div class="info-label">Graduation</div>
                  <div class="info-value">${formatDisplayValue(
                    application.graduationDegree
                  )} from ${formatDisplayValue(
                        application.graduationCollege
                      )}</div>
                  <div style="margin-top: 5px; font-size: 12px;">${
                    application.graduationPercentage || "N/A"
                  }% • ${application.graduationYear || "N/A"}</div>
                </div>
                `
                    : ""
                }
              </div>
            </div>

            <!-- Work Experience -->
            <div class="section">
              <div class="section-title">Work Experience</div>
              ${
                application.companyName
                  ? `
              <div class="info-item full-width">
                <div class="info-label">Current Employment</div>
                <div class="info-value"><strong>${formatDisplayValue(
                  application.companyName
                )}</strong></div>
                <div style="margin-top: 5px;">${formatDisplayValue(
                  application.companyRole
                )}</div>
                <div style="margin-top: 5px; font-size: 12px;">${formatDate(
                  application.startDate
                )} - ${
                      application.endDate
                        ? formatDate(application.endDate)
                        : "Present"
                    }</div>
                <div style="margin-top: 5px;"><span class="skill-tag">${
                  application.experienceYears || "0"
                } years experience</span></div>
                ${
                  application.previousCompany
                    ? `
                <div style="margin-top: 15px;">
                  <div class="info-label">Previous Employment</div>
                  <div class="info-value"><strong>${formatDisplayValue(
                    application.previousCompany
                  )}</strong></div>
                  <div>${formatDisplayValue(application.previousRole)}</div>
                </div>
                `
                    : ""
                }
              </div>
              `
                  : '<div class="info-item full-width">No experience details provided</div>'
              }
            </div>

            <!-- Skills -->
            <div class="section">
              <div class="section-title">Skills</div>
              <div class="info-item full-width">
                <div class="skills">
                  ${
                    application.skills && application.skills.length > 0
                      ? application.skills
                          .map(
                            (skill) => `<span class="skill-tag">${skill}</span>`
                          )
                          .join("")
                      : "No skills listed"
                  }
                </div>
              </div>
            </div>

            <!-- Government IDs -->
            <div class="section">
              <div class="section-title">Government IDs</div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Aadhaar</div>
                  <div class="info-value">${formatDisplayValue(
                    application.aadhaar
                  )}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">PAN</div>
                  <div class="info-value">${formatDisplayValue(
                    application.pan
                  )}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">UAN</div>
                  <div class="info-value">${formatDisplayValue(
                    application.uan
                  )}</div>
                </div>
              </div>
            </div>

            <!-- Professional Links -->
            ${
              application.github ||
              application.linkedin ||
              application.portfolio
                ? `
            <div class="section">
              <div class="section-title">Professional Links</div>
              <div class="info-grid">
                ${
                  application.github
                    ? `
                <div class="info-item">
                  <div class="info-label">GitHub</div>
                  <div class="info-value">${application.github}</div>
                </div>
                `
                    : ""
                }
                ${
                  application.linkedin
                    ? `
                <div class="info-item">
                  <div class="info-label">LinkedIn</div>
                  <div class="info-value">${application.linkedin}</div>
                </div>
                `
                    : ""
                }
                ${
                  application.portfolio
                    ? `
                <div class="info-item">
                  <div class="info-label">Portfolio</div>
                  <div class="info-value">${application.portfolio}</div>
                </div>
                `
                    : ""
                }
              </div>
            </div>
            `
                : ""
            }

            <!-- Cover Letter -->
            ${
              application.coverLetter
                ? `
            <div class="section">
              <div class="section-title">Cover Letter</div>
              <div class="info-item full-width">
                <div class="info-value" style="white-space: pre-line;">${application.coverLetter}</div>
              </div>
            </div>
            `
                : ""
            }

            <div class="footer">
              This is a system-generated document. For any queries, please contact support.
            </div>
          </div>
        </body>
        </html>
      `;

      // Create a new window for printing
      const printWindow = window.open("", "_blank");
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load then print
      printWindow.onload = () => {
        printWindow.print();
        setGeneratingPDF(false);
      };

      toast.success("PDF generated successfully. Opening print dialog...");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast.error("Failed to generate PDF");
      setGeneratingPDF(false);
    }
  };

  // Function to open application details
  const openApplicationDetails = (application, e) => {
    if (e) e.stopPropagation();
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  // Info Card Component for Modal
  const InfoCard = ({ label, value, subValue, icon }) => {
    const displayValue = formatDisplayValue(value);

    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 p-2 sm:p-3 rounded-lg">
        <p className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
          {label}
        </p>
        <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1 truncate">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span className="truncate">{displayValue}</span>
        </p>
        {subValue && (
          <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mt-0.5 truncate">
            {formatDisplayValue(subValue)}
          </p>
        )}
      </div>
    );
  };

  // Application Details Modal
  const ApplicationDetailsModal = ({ application, onClose }) => {
    if (!application) return null;

    // Helper function to get resume icon
    const getResumeIconDisplay = () => {
      if (!hasResume(application)) return null;

      const filename = application.resume;
      const ext = filename?.split(".").pop()?.toLowerCase();

      if (ext === "pdf") {
        return <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />;
      } else if (ext === "doc" || ext === "docx") {
        return <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />;
      }
      return <File className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />;
    };

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                Application Details
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => generatePDF(application)}
                disabled={generatingPDF}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
                title="Download PDF">
                {generatingPDF ? (
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
            {/* Job Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                    {application.jobId?.title || "Position"}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mt-0.5">
                    {application.jobId?.company}
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {application.jobId?.location || "N/A"}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {application.jobId?.salary || "N/A"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {application.jobId?.jobType || "Full-time"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-1 sm:gap-2">
                  <span
                    className={`px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium rounded-full border ${getStatusColor(
                      application.status
                    )}`}>
                    {application.status || "Applied"}
                  </span>
                  <div className="text-right">
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
                      {application.aiScore || 0}%
                    </span>
                    <span className="text-xs text-gray-500 ml-1">Match</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-2 sm:p-3 rounded-lg">
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-0.5">
                  Applied On
                </p>
                <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1 sm:gap-2">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                  {formatDateTime(application.createdAt)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-2 sm:p-3 rounded-lg">
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-0.5">
                  Last Updated
                </p>
                <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1 sm:gap-2">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                  {formatDateTime(application.updatedAt)}
                </p>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                <UserCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                Personal Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <InfoCard
                  label="Full Name"
                  value={application.fullName}
                  icon={
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  }
                />
                <InfoCard
                  label="Email"
                  value={application.email}
                  icon={
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  }
                />
                <InfoCard
                  label="Phone"
                  value={application.phone}
                  icon={
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  }
                />
                <InfoCard
                  label="Date of Birth"
                  value={formatDate(application.dob)}
                />
                <InfoCard label="Gender" value={application.gender} />
                <InfoCard
                  label="Location"
                  value={`${application.city || ""}, ${
                    application.country || ""
                  }`}
                />
              </div>
            </div>

            {/* Address */}
            {(application.address ||
              application.city ||
              application.state ||
              application.pincode) && (
              <div className="bg-gray-50 dark:bg-gray-800/50 p-2 sm:p-3 rounded-lg">
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-0.5">
                  Address
                </p>
                <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                  {formatDisplayValue(application.address)}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  {[application.city, application.state, application.pincode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            )}

            {/* Resume Section - Fixed - No [object Object] */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 sm:p-4 rounded-lg">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                Resume / CV
              </h4>
              {hasResume(application) ? (
                <div className="flex items-center gap-2">
                  {getResumeIconDisplay()}
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    {application.resume?.split(/[\\/]/).pop() || "Resume"}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <File className="h-5 w-5 sm:h-6 sm:w-6" />
                  <p className="text-xs sm:text-sm">No resume uploaded</p>
                </div>
              )}
            </div>

            {/* Education */}
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                Education
              </h4>
              <div className="space-y-2">
                <InfoCard
                  label="Class 10th"
                  value={`${application.tenthBoard || ""} • ${
                    application.tenthPercentage || ""
                  }% • ${application.tenthYear || ""}`}
                />
                <InfoCard
                  label="Class 12th"
                  value={`${application.twelfthBoard || ""} • ${
                    application.twelfthPercentage || ""
                  }% • ${application.twelfthYear || ""}`}
                />
                {application.graduationCollege && (
                  <InfoCard
                    label="Graduation"
                    value={`${application.graduationDegree || ""} • ${
                      application.graduationCollege || ""
                    }`}
                    subValue={`${application.graduationPercentage || ""}% • ${
                      application.graduationYear || ""
                    }`}
                  />
                )}
              </div>
            </div>

            {/* Work Experience */}
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                Work Experience
              </h4>
              {application.companyName ? (
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatDisplayValue(application.companyName)}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    {formatDisplayValue(application.companyRole)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(application.startDate)} -{" "}
                    {application.endDate
                      ? formatDate(application.endDate)
                      : "Present"}
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">
                    {application.experienceYears || "0"} years
                  </span>
                  {application.previousCompany && (
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Previous:{" "}
                        {formatDisplayValue(application.previousCompany)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {formatDisplayValue(application.previousRole)}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-gray-500 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                  No experience details provided
                </p>
              )}
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Award className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {application.skills && application.skills.length > 0 ? (
                  application.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">No skills listed</p>
                )}
              </div>
            </div>

            {/* Social Links */}
            {(application.github ||
              application.linkedin ||
              application.portfolio) && (
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Professional Links
                </h4>
                <div className="flex flex-wrap gap-3">
                  {application.github && (
                    <a
                      href={application.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                      <Github className="h-3 w-3" />
                      GitHub
                    </a>
                  )}
                  {application.linkedin && (
                    <a
                      href={application.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                      <Linkedin className="h-3 w-3" />
                      LinkedIn
                    </a>
                  )}
                  {application.portfolio && (
                    <a
                      href={application.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                      <Globe className="h-3 w-3" />
                      Portfolio
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Cover Letter */}
            {application.coverLetter && (
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  Cover Letter
                </h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line max-h-40 overflow-y-auto">
                  {application.coverLetter}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout title="My Applications" navItems={navItems}>
      {/* Application Details Modal */}
      {showDetailsModal && selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedApplication(null);
          }}
        />
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              All Applications
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Total: {filteredApps.length}{" "}
              {filteredApps.length === 1 ? "application" : "applications"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2 sm:px-3 py-1.5 sm:py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
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
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse h-20 sm:h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-8 sm:py-10 md:py-12">
            <Briefcase className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-300 mb-2 sm:mb-3" />
            <p className="text-sm sm:text-base text-gray-500">
              No applications found
            </p>
            <button
              onClick={() => navigate("/jobs")}
              className="mt-3 sm:mt-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm">
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            {filteredApps.map((app) => (
              <div
                key={app._id}
                className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border hover:shadow-md transition cursor-pointer"
                onClick={(e) => openApplicationDetails(app, e)}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 sm:gap-3 md:gap-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-blue-600 text-xs sm:text-sm">
                        {app.jobId?.company?.charAt(0) || "J"}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                        {app.jobId?.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                        {app.jobId?.company}
                      </p>

                      <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 mt-1 sm:mt-2 text-[10px] sm:text-xs text-gray-500">
                        <span className="flex items-center gap-0.5">
                          <MapPin className="h-2.5 w-2.5" />
                          {app.jobId?.location}
                        </span>

                        <span className="flex items-center gap-0.5">
                          <DollarSign className="h-2.5 w-2.5" />
                          {app.jobId?.salary}
                        </span>

                        <span className="flex items-center gap-0.5">
                          <Clock className="h-2.5 w-2.5" />
                          Applied {formatDate(app.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-0">
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-semibold text-blue-600">
                        {app.aiScore || 0}%
                      </div>
                      <div className="text-[9px] sm:text-xs text-gray-500">
                        match
                      </div>
                    </div>

                    <span
                      className={`px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 text-[9px] sm:text-xs font-medium rounded-full border whitespace-nowrap ${getStatusColor(
                        app.status
                      )}`}>
                      {app.status}
                    </span>

                    <button
                      onClick={(e) => openApplicationDetails(app, e)}
                      className="p-1 sm:p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
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

export default SeekerApplications;
