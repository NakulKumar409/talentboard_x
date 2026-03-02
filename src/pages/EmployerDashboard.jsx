// src/pages/EmployerDashboard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Users,
  PlusCircle,
  Download,
  Brain,
  TrendingUp,
  Clock,
  MapPin,
  DollarSign,
  Eye,
  Star,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../components/layout/DashboardLayout";

// Mock user data
const mockUser = {
  id: "2",
  name: "Jane Employer",
  email: "employer@example.com",
  role: "employer",
  company: "Tech Corp",
  companySize: "50-100 employees",
  industry: "Technology",
  location: "San Francisco, CA",
};

// Mock db functions
const db = {
  getJobsByEmployer: (employerId) => {
    return [
      {
        id: "1",
        title: "Senior React Developer",
        company: "Tech Corp",
        location: "Remote",
        type: "Full-time",
        salary: "$120,000 - $150,000",
        description:
          "We are looking for an experienced React developer to join our team...",
        requirements: ["5+ years React experience", "TypeScript", "Node.js"],
        tags: ["React", "Node.js", "TypeScript"],
        employerId: employerId,
        postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        applicants: 12,
        views: 245,
        status: "Active",
      },
      {
        id: "2",
        title: "UX/UI Designer",
        company: "Tech Corp",
        location: "New York, NY",
        type: "Full-time",
        salary: "$90,000 - $110,000",
        description: "Join our creative team as a UX/UI designer...",
        requirements: ["3+ years UX design", "Figma", "User Research"],
        tags: ["Figma", "Adobe XD", "User Research"],
        employerId: employerId,
        postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        applicants: 8,
        views: 156,
        status: "Active",
      },
      {
        id: "3",
        title: "Product Manager",
        company: "Tech Corp",
        location: "San Francisco, CA",
        type: "Full-time",
        salary: "$130,000 - $160,000",
        description:
          "Looking for a product manager to lead our product development...",
        requirements: [
          "5+ years PM experience",
          "Agile",
          "Technical background",
        ],
        tags: ["Product Strategy", "Agile", "Roadmapping"],
        employerId: employerId,
        postedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        applicants: 5,
        views: 98,
        status: "Active",
      },
    ];
  },
  getApplicationsByEmployer: (employerId) => {
    return [
      {
        id: "app1",
        jobId: "1",
        seekerId: "seeker1",
        aiScore: 85,
        status: "Under Review",
        appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        seeker: {
          name: "John Seeker",
          email: "john@example.com",
          experience: "5 years",
          location: "San Francisco, CA",
          skills: ["React", "Node.js", "TypeScript"],
        },
        job: {
          title: "Senior React Developer",
        },
      },
      {
        id: "app2",
        jobId: "1",
        seekerId: "seeker2",
        aiScore: 92,
        status: "Shortlisted",
        appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        seeker: {
          name: "Jane Applicant",
          email: "jane@example.com",
          experience: "7 years",
          location: "Remote",
          skills: ["React", "TypeScript", "GraphQL", "Next.js"],
        },
        job: {
          title: "Senior React Developer",
        },
      },
      {
        id: "app3",
        jobId: "2",
        seekerId: "seeker3",
        aiScore: 78,
        status: "New",
        appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        seeker: {
          name: "Mike Designer",
          email: "mike@example.com",
          experience: "4 years",
          location: "New York, NY",
          skills: ["Figma", "Adobe XD", "Sketch"],
        },
        job: {
          title: "UX/UI Designer",
        },
      },
    ];
  },
  getStats: (employerId) => {
    return {
      totalJobs: 3,
      activeJobs: 3,
      totalApplicants: 25,
      newApplicants: 8,
      averageMatch: 85,
      profileViews: 458,
    };
  },
  postJob: (jobData) => {
    console.log("Job posted:", jobData);
    return { id: Date.now().toString(), ...jobData };
  },
  updateApplicationStatus: (appId, status) => {
    console.log("Application status updated:", appId, status);
    return true;
  },
};

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [user] = useState(mockUser);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Full-time");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [tags, setTags] = useState("");

  const myJobs = db.getJobsByEmployer(user.id);
  const allApplicants = db.getApplicationsByEmployer(user.id);
  const stats = db.getStats(user.id);

  const avgScore = allApplicants.length
    ? Math.round(
        allApplicants.reduce((s, a) => s + a.aiScore, 0) / allApplicants.length
      )
    : 0;

  const handlePostJob = (e) => {
    e.preventDefault();

    if (!title || !location || !salary || !description) {
      toast.error("Please fill all required fields");
      return;
    }

    db.postJob({
      title,
      company: user.company,
      location,
      type,
      salary,
      description,
      requirements: requirements.split("\n").filter((r) => r.trim()),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      employerId: user.id,
      postedAt: new Date().toISOString(),
      applicants: 0,
      views: 0,
      status: "Active",
    });

    toast.success("Job posted successfully! (Demo mode)");
    setTitle("");
    setLocation("");
    setSalary("");
    setDescription("");
    setRequirements("");
    setTags("");
    setTab("jobs");
  };

  const handleStatusChange = (appId, status) => {
    db.updateApplicationStatus(appId, status);
    toast.success(`Status updated to ${status} (Demo mode)`);
  };

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
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
    switch (status) {
      case "Shortlisted":
      case "Interview":
        return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "New":
        return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400";
      case "Hired":
        return "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  return (
    <DashboardLayout title="Employer Dashboard" navItems={navItems}>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Active Jobs
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.activeJobs}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Applicants
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalApplicants}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                New This Week
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.newApplicants}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Avg. Match Score
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {avgScore}%
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
        {[
          { key: "overview", label: "Overview" },
          { key: "jobs", label: "Job Listings" },
          { key: "applicants", label: "Applicants" },
          { key: "post", label: "Post New Job" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              tab === t.key
                ? "bg-blue-600 text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "overview" && (
        <div className="space-y-6">
          {/* Company Profile Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {user.company}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {user.industry} • {user.companySize}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {user.location}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setTab("post")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm cursor-pointer flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Post New Job
              </button>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Applicants
              </h2>
              <button
                onClick={() => setTab("applicants")}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {allApplicants.slice(0, 3).map((app) => (
                <div
                  key={app.id}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {app.seeker.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Applied for: {app.job.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {app.aiScore}% match
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                          app.status
                        )}`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Job Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Job Performance
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {myJobs.slice(0, 2).map((job) => (
                <div
                  key={job.id}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Posted {new Date(job.postedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {job.views} views
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {job.applicants} applicants
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Jobs Tab */}
      {tab === "jobs" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              My Job Listings
            </h2>
            <button
              onClick={() => setTab("post")}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              Post New Job
            </button>
          </div>

          {myJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                You haven't posted any jobs yet
              </p>
              <button
                onClick={() => setTab("post")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                <PlusCircle className="h-4 w-4 inline mr-2" />
                Post Your First Job
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {job.title.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {job.location} • {job.type} • {job.salary}
                          </p>
                          <div className="flex flex-wrap gap-3 mt-2">
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <Eye className="h-3 w-3" /> {job.views} views
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <Users className="h-3 w-3" /> {job.applicants}{" "}
                              applicants
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="h-3 w-3" /> Posted{" "}
                              {new Date(job.postedAt).toLocaleDateString()}
                            </span>
                          </div>
                          {job.tags && job.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {job.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setTab("applicants")}
                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                        View Applicants
                      </button>
                      <button className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Applicants Tab */}
      {tab === "applicants" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold">All Applicants</h2>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <option>All Jobs</option>
                <option>Senior React Developer</option>
                <option>UX/UI Designer</option>
                <option>Product Manager</option>
              </select>
            </div>
          </div>

          {allApplicants.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                No applications received yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {allApplicants.map((app) => (
                <div
                  key={app.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                            {app.seeker.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {app.seeker.name}
                            </h3>
                            <span
                              className={`px-2 py-0.5 text-xs font-medium rounded-full border w-fit ${getStatusColor(
                                app.status
                              )}`}>
                              {app.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Applied for:{" "}
                            <span className="font-medium">{app.job.title}</span>
                          </p>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <Star className="h-3 w-3" />{" "}
                              {app.seeker.experience} exp
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <MapPin className="h-3 w-3" />{" "}
                              {app.seeker.location}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="h-3 w-3" /> Applied{" "}
                              {new Date(app.appliedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {app.seeker.skills.slice(0, 3).map((skill, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                                {skill}
                              </span>
                            ))}
                            {app.seeker.skills.length > 3 && (
                              <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                                +{app.seeker.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                            {app.aiScore}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            match
                          </div>
                        </div>
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleStatusChange(app.id, e.target.value)
                          }
                          className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer">
                          <option value="New">New</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview">Interview</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Hired">Hired</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                      <button
                        className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1 cursor-pointer"
                        onClick={() =>
                          toast.info("Resume download feature coming soon")
                        }>
                        <Download className="h-4 w-4" />
                        Resume
                      </button>
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-6">Post a New Job</h2>
          <form onSubmit={handlePostJob} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. Senior React Developer"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. New York, NY"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer">
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Salary Range <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. $80,000 - $100,000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px]"
                placeholder="Describe the role, responsibilities, requirements..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Requirements (one per line)
              </label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                placeholder="5+ years React experience&#10;TypeScript proficiency&#10;Node.js experience"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="React, Node.js, TypeScript, MongoDB"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <PlusCircle className="h-4 w-4" />
                Publish Job
              </button>
              <button
                type="button"
                onClick={() => setTab("jobs")}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer">
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
