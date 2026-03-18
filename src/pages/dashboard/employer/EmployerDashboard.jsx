// src/pages/EmployerDashboard.jsx

import {
  Award,
  Briefcase,
  Building,
  Calendar,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  PlusCircle,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import api from "../../../utils/api";

// Mock user data
const mockUser = {
  id: "2",
  name: "Jane Employer",
  email: "employer@example.com",
  role: "employer",
  company: "Jasiq Labs Pvt Ltd",
  companySize: "50-100 employees",
  industry: "Technology",
  location: "Bhopal, Madhya Pradesh",
};

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [user] = useState(mockUser);
  const [loading, setLoading] = useState({
    jobs: false,
    applications: false,
    action: false,
  });
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showApplicantModal, setShowApplicantModal] = useState(false);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Full-time");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [tags, setTags] = useState("");

  const [editingJobId, setEditingJobId] = useState(null);

  const [myJobs, setMyJobs] = useState([]);
  const [allApplicants, setAllApplicants] = useState([]);

  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplicants: 0,
    newApplicants: 0,
  });

  // ---------------- FETCH ALL JOBS ----------------
  const fetchJobs = async () => {
    setLoading((prev) => ({ ...prev, jobs: true }));
    try {
      const response = await api.get("/jobs");

      let jobsData = [];
      if (response.data && response.data.applications) {
        jobsData = response.data.applications;
      } else if (Array.isArray(response.data)) {
        jobsData = response.data;
      }

      const employerJobs = jobsData.filter(
        (job) =>
          job.company &&
          job.company.toLowerCase() === user.company.toLowerCase()
      );

      setMyJobs(employerJobs);

      setStats((prev) => ({
        ...prev,
        totalJobs: employerJobs.length,
        activeJobs: employerJobs.filter((job) => job.status !== "closed")
          .length,
      }));
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading((prev) => ({ ...prev, jobs: false }));
    }
  };

  // ---------------- FETCH ALL APPLICATIONS ----------------
  const fetchApplications = async () => {
    setLoading((prev) => ({ ...prev, applications: true }));
    try {
      const response = await api.get("/applications");

      let applicationsData = [];
      if (response.data && response.data.applications) {
        applicationsData = response.data.applications;
      } else if (Array.isArray(response.data)) {
        applicationsData = response.data;
      }

      setAllApplicants(applicationsData);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const newApplicants = applicationsData.filter(
        (app) => new Date(app.createdAt || app.appliedAt) > sevenDaysAgo
      ).length;

      setStats((prev) => ({
        ...prev,
        totalApplicants: applicationsData.length,
        newApplicants: newApplicants,
      }));
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading((prev) => ({ ...prev, applications: false }));
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const avgScore = allApplicants.length
    ? Math.round(
        allApplicants.reduce((s, a) => s + (a.aiScore || 0), 0) /
          allApplicants.length
      )
    : 0;

  // ---------------- POST / UPDATE JOB ----------------
  const handlePostJob = async (e) => {
    e.preventDefault();

    if (!title || !location || !salary || !description) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading((prev) => ({ ...prev, action: true }));

    try {
      const skillsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title,
        profile: title,
        company: user.company,
        location,
        salary,
        type,
        skillsRequired:
          skillsArray.length > 0 ? skillsArray : ["React", "JavaScript"],
        experienceRequired: "2 years",
        description,
      };

      if (editingJobId) {
        await api.put(`/jobs/${editingJobId}`, payload);
        toast.success("Job updated successfully");
        setEditingJobId(null);
      } else {
        await api.post("/jobs/create", payload);
        toast.success("Job posted successfully");
      }

      setTitle("");
      setLocation("");
      setSalary("");
      setDescription("");
      setRequirements("");
      setTags("");

      await fetchJobs();
      setTab("jobs");
    } catch (error) {
      console.error("Job action failed:", error);
      toast.error(error.response?.data?.message || "Job action failed");
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  // ---------------- DELETE JOB ----------------
  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    try {
      await api.delete(`/jobs/${id}`);
      toast.success("Job deleted successfully");
      await fetchJobs();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  // ---------------- EDIT JOB ----------------
  const handleEditJob = (job) => {
    setTitle(job.title || "");
    setLocation(job.location || "");
    setSalary(job.salary || "");
    setDescription(job.description || "");

    if (job.skillsRequired) {
      setTags(job.skillsRequired.join(", "));
    }

    setType(job.type || "Full-time");
    setEditingJobId(job._id);
    setTab("post");
  };

  // ---------------- UPDATE APPLICATION STATUS ----------------
  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const updatedApplicants = allApplicants.map((app) =>
        app._id === applicationId ? { ...app, status: newStatus } : app
      );
      setAllApplicants(updatedApplicants);
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Status update failed:", error);
      toast.error("Failed to update status");
    }
  };

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

  const getStatusColor = (status) => {
    const statusLower = (status || "").toLowerCase();
    switch (statusLower) {
      case "shortlisted":
        return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      case "interview":
        return "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800";
      case "under review":
        return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
      case "applied":
        return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
      case "hired":
        return "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Applicant Detail Modal
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
                    {applicant.fullName?.charAt(0) || "A"}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {applicant.fullName}
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
                onClick={() =>
                  window.open(`/resume/${applicant.resume}`, "_blank")
                }
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
    <DashboardLayout title="Employer Dashboard" navItems={navItems}>
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Active Jobs
          </p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {loading.jobs ? "..." : stats.activeJobs}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Applicants
          </p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {loading.applications ? "..." : stats.totalApplicants}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            New This Week
          </p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {loading.applications ? "..." : stats.newApplicants}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Avg Match Score
          </p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {loading.applications ? "..." : `${avgScore}%`}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-4 mb-6 border-b dark:border-gray-700 pb-2">
        <button
          onClick={() => setTab("overview")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            tab === "overview"
              ? "bg-blue-600 text-white"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}>
          Overview
        </button>
        <button
          onClick={() => setTab("jobs")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            tab === "jobs"
              ? "bg-blue-600 text-white"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}>
          My Jobs
        </button>
        <button
          onClick={() => setTab("applicants")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            tab === "applicants"
              ? "bg-blue-600 text-white"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}>
          Applicants
        </button>
        <button
          onClick={() => {
            setEditingJobId(null);
            setTitle("");
            setLocation("");
            setSalary("");
            setDescription("");
            setRequirements("");
            setTags("");
            setTab("post");
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            tab === "post"
              ? "bg-blue-600 text-white"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}>
          Post Job
        </button>
      </div>

      {/* Overview Tab */}
      {tab === "overview" && (
        <div className="space-y-6">
          {/* Company Profile */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Building className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {user.company}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {user.industry} • {user.companySize}
                </p>
                <p className="text-gray-500 dark:text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="h-4 w-4" /> {user.location}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Recent Applications
              </h3>
              <button
                onClick={() => setTab("applicants")}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium">
                View All →
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
            ) : allApplicants.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  No applications yet
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {allApplicants.slice(0, 3).map((app) => (
                  <div
                    key={app._id}
                    className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition"
                    onClick={() => {
                      setSelectedApplicant(app);
                      setShowApplicantModal(true);
                    }}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {app.fullName?.charAt(0) || "A"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {app.fullName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Applied for: {app.jobId?.title || "Unknown"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {app.aiScore || 0}% match
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
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
        </div>
      )}

      {/* Jobs Tab */}
      {tab === "jobs" && (
        <div className="space-y-4">
          {loading.jobs ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          ) : myJobs.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-12 text-center">
              <Briefcase className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No jobs posted yet
              </p>
              <button
                onClick={() => {
                  setEditingJobId(null);
                  setTitle("");
                  setLocation("");
                  setSalary("");
                  setDescription("");
                  setRequirements("");
                  setTags("");
                  setTab("post");
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Post Your First Job
              </button>
            </div>
          ) : (
            myJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {job.location} • {job.type} • {job.salary}
                    </p>
                    {job.skillsRequired && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.skillsRequired.slice(0, 3).map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditJob(job)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Applicants Tab */}
      {tab === "applicants" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            All Applicants
          </h2>

          {loading.applications ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="animate-pulse h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          ) : allApplicants.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                No applications received
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {allApplicants.map((app) => (
                <div
                  key={app._id}
                  className="p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition"
                  onClick={() => {
                    setSelectedApplicant(app);
                    setShowApplicantModal(true);
                  }}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg font-bold">
                          {app.fullName?.charAt(0) || "A"}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          {app.fullName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                          <Mail className="h-3 w-3" /> {app.email}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {app.phone}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                          Applied for:{" "}
                          <span className="font-medium">
                            {app.jobId?.title}
                          </span>
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                          {formatDate(app.createdAt || app.appliedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          {app.aiScore || 0}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          match
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
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
      )}

      {/* Post Job Tab */}
      {tab === "post" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
            {editingJobId ? "Edit Job" : "Post New Job"}
          </h2>

          <form onSubmit={handlePostJob} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Senior React Developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Remote, New York"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Salary Range <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 12 LPA"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full border dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Describe the role, responsibilities..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows="4"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Skills Required
              </label>
              <input
                type="text"
                placeholder="React, JavaScript, Node.js (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full border dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading.action}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {loading.action
                  ? "Processing..."
                  : editingJobId
                  ? "Update Job"
                  : "Publish Job"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingJobId(null);
                  setTitle("");
                  setLocation("");
                  setSalary("");
                  setDescription("");
                  setRequirements("");
                  setTags("");
                  setTab("jobs");
                }}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EmployerDashboard;
