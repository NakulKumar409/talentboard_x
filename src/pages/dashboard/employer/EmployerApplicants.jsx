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
  ChevronDown,
  X,
  Award,
  GraduationCap,
  ExternalLink,
  FileText,
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

  // ---------------- FETCH ALL APPLICATIONS ----------------
  const fetchApplications = async () => {
    try {
      const response = await api.get("/applications");

      console.log("Applications API Response:", response.data);

      let applicationsData = [];

      // Handle the specific response structure from your API
      if (
        response.data &&
        response.data.success &&
        response.data.applications
      ) {
        // Your API returns { success, count, total, page, pages, applications }
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
        (job) => job.company === "Google" || job.company === "Tech Corp" // Replace with actual company from auth
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
      // Fetch jobs and applications in parallel
      const [jobsData, applicationsData] = await Promise.all([
        fetchJobs(),
        fetchApplications(),
      ]);

      console.log("Jobs loaded:", jobsData);
      console.log("Applications loaded:", applicationsData);

      setJobs(jobsData);
      const jobIds = jobsData.map((job) => job._id);

      // Filter applications for employer's jobs
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

      // Update local state
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

  const getStatusColor = (status) => {
    const statusLower = (status || "").toLowerCase();
    switch (statusLower) {
      case "shortlisted":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "interview":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "under review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "applied":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "hired":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Applicant Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Header with AI Score */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {applicant.fullName?.charAt(0) ||
                      applicant.userId?.name?.charAt(0) ||
                      "A"}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {applicant.fullName || applicant.userId?.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                    <Mail className="h-4 w-4" /> {applicant.email}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Phone className="h-4 w-4" /> {applicant.phone}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {applicant.aiScore || 0}%
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  AI Match Score
                </p>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    applicant.status
                  )}`}>
                  {applicant.status || "Applied"}
                </span>
              </div>
            </div>

            {/* Personal Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Date of Birth
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  {applicant.dob ? formatDate(applicant.dob) : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Gender
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {applicant.gender || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Location
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  {applicant.city || "N/A"}, {applicant.country || "N/A"}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Address
              </p>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {applicant.address || "N/A"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {applicant.city}, {applicant.state} - {applicant.pincode}
              </p>
            </div>

            {/* ID Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Aadhaar
                </p>
                <p className="font-mono text-sm text-gray-800 dark:text-gray-200">
                  {applicant.aadhaar || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">PAN</p>
                <p className="font-mono text-sm text-gray-800 dark:text-gray-200">
                  {applicant.pan || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">UAN</p>
                <p className="font-mono text-sm text-gray-800 dark:text-gray-200">
                  {applicant.uan || "N/A"}
                </p>
              </div>
            </div>

            {/* Education */}
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Education
              </h4>
              <div className="space-y-3">
                {/* 10th */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Class 10th
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {applicant.tenthBoard} • {applicant.tenthPercentage}% •{" "}
                    {applicant.tenthYear}
                  </p>
                </div>
                {/* 12th */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Class 12th
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {applicant.twelfthBoard} • {applicant.twelfthPercentage}% •{" "}
                    {applicant.twelfthYear}
                  </p>
                </div>
                {/* Graduation */}
                {applicant.graduationCollege && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Graduation
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {applicant.graduationDegree} •{" "}
                      {applicant.graduationCollege}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {applicant.graduationPercentage}% •{" "}
                      {applicant.graduationYear}
                    </p>
                  </div>
                )}
                {/* Post Graduation */}
                {applicant.postGraduationCollege && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Post Graduation
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {applicant.postGraduationDegree} •{" "}
                      {applicant.postGraduationCollege}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {applicant.postGraduationPercentage}% •{" "}
                      {applicant.postGraduationYear}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Experience */}
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Work Experience
              </h4>
              {applicant.companyName ? (
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {applicant.companyName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {applicant.companyRole}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {applicant.experienceYears} years
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    {formatDate(applicant.startDate)} -{" "}
                    {applicant.endDate
                      ? formatDate(applicant.endDate)
                      : "Present"}
                  </p>
                  {applicant.previousCompany && (
                    <div className="mt-3 pt-3 border-t dark:border-gray-600">
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
                <p className="text-gray-500 dark:text-gray-400">
                  No experience details
                </p>
              )}
            </div>

            {/* Skills */}
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {applicant.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
                {applicant.topSkills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                    ⭐ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Professional Links
              </h4>
              <div className="space-y-2">
                {applicant.github && (
                  <a
                    href={applicant.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline">
                    <ExternalLink className="h-4 w-4" /> GitHub
                  </a>
                )}
                {applicant.linkedin && (
                  <a
                    href={applicant.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline">
                    <ExternalLink className="h-4 w-4" /> LinkedIn
                  </a>
                )}
                {applicant.portfolio && (
                  <a
                    href={applicant.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline">
                    <ExternalLink className="h-4 w-4" /> Portfolio
                  </a>
                )}
              </div>
            </div>

            {/* Cover Letter */}
            {applicant.coverLetter && (
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Cover Letter
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg whitespace-pre-line text-gray-700 dark:text-gray-300">
                  {applicant.coverLetter}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t dark:border-gray-700">
              <button
                onClick={() => handleDownloadResume(applicant._id)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                disabled={!applicant.resume}>
                <Download className="h-4 w-4" />
                Download Resume
              </button>
              <select
                value={applicant.status || "Applied"}
                onChange={(e) =>
                  handleStatusChange(applicant._id, e.target.value)
                }
                className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600">
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

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
        {/* Header with Stats and Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              All Applicants
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Total: {filteredApplicants.length}{" "}
              {filteredApplicants.length === 1 ? "applicant" : "applicants"}
              {applicants.length > 0 &&
                filteredApplicants.length !== applicants.length &&
                ` (filtered from ${applicants.length})`}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Job Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm">
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
              className="px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm">
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
                className="animate-pulse h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No applications found
            </p>
            {applicants.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                No one has applied to your jobs yet
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplicants.map((app) => (
              <div
                key={app._id}
                className="p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition"
                onClick={() => {
                  setSelectedApplicant(app);
                  setShowApplicantModal(true);
                }}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg font-bold">
                        {app.fullName?.charAt(0) ||
                          app.userId?.name?.charAt(0) ||
                          "A"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          {app.fullName || app.userId?.name}
                        </h3>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full w-fit ${getStatusColor(
                            app.status
                          )}`}>
                          {app.status || "Applied"}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Applied for:{" "}
                        <span className="font-medium">{app.jobId?.title}</span>{" "}
                        at {app.jobId?.company}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {app.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {app.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />{" "}
                          {formatDate(app.createdAt)}
                        </span>
                      </div>

                      {app.skills && app.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {app.skills.slice(0, 3).map((skill, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                          {app.skills.length > 3 && (
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                              +{app.skills.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {app.aiScore || 0}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        match
                      </div>
                    </div>
                    <button
                      className="text-blue-600 hover:text-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedApplicant(app);
                        setShowApplicantModal(true);
                      }}>
                      <Eye className="h-4 w-4" />
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

export default EmployerApplicants;
