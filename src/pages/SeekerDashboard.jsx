// src/pages/SeekerDashboard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  FileText,
  User,
  Upload,
  Check,
  TrendingUp,
  Clock,
  MapPin,
  DollarSign,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../components/layout/DashboardLayout";

// Mock user data
const mockUser = {
  id: "1",
  name: "John Seeker",
  email: "seeker@example.com",
  role: "seeker",
  resumeName: "john_resume.pdf",
  bio: "Experienced full-stack developer with 5+ years of experience in React, Node.js, and TypeScript. Passionate about building scalable web applications.",
  skills: ["React", "Node.js", "TypeScript", "Python", "MongoDB"],
  location: "San Francisco, CA",
  experience: "5 years",
  education: "B.S. Computer Science",
};

// Mock db functions
const db = {
  getApplicationsBySeeker: (userId) => {
    return [
      {
        id: "1",
        jobId: "job1",
        seekerId: userId,
        aiScore: 85,
        status: "Applied",
        appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        job: {
          title: "Senior React Developer",
          company: "Tech Corp",
          location: "Remote",
          salary: "$120k - $150k",
          type: "Full-time",
        },
      },
      {
        id: "2",
        jobId: "job2",
        seekerId: userId,
        aiScore: 92,
        status: "Interview",
        appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        job: {
          title: "Frontend Engineer",
          company: "Startup Inc",
          location: "New York, NY",
          salary: "$100k - $130k",
          type: "Full-time",
        },
      },
      {
        id: "3",
        jobId: "job3",
        seekerId: userId,
        aiScore: 78,
        status: "Reviewed",
        appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        job: {
          title: "UI Developer",
          company: "Design Studio",
          location: "Remote",
          salary: "$90k - $110k",
          type: "Contract",
        },
      },
    ];
  },
  getRecommendedJobs: () => {
    return [
      {
        id: "rec1",
        title: "Full Stack Engineer",
        company: "Google",
        location: "Mountain View, CA",
        salary: "$150k - $180k",
        type: "Full-time",
        matchScore: 95,
        skills: ["React", "Node.js", "TypeScript", "Python"],
      },
      {
        id: "rec2",
        title: "React Developer",
        company: "Meta",
        location: "Remote",
        salary: "$140k - $170k",
        type: "Full-time",
        matchScore: 92,
        skills: ["React", "TypeScript", "GraphQL"],
      },
      {
        id: "rec3",
        title: "Frontend Lead",
        company: "Amazon",
        location: "Seattle, WA",
        salary: "$160k - $200k",
        type: "Full-time",
        matchScore: 88,
        skills: ["React", "Node.js", "Team Leadership"],
      },
    ];
  },
  updateProfile: (data) => {
    console.log("Profile updated:", data);
    return true;
  },
};

const SeekerDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [user] = useState(mockUser);

  const [resumeName, setResumeName] = useState(user?.resumeName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [skills, setSkills] = useState(
    user?.skills ? user.skills.join(", ") : ""
  );
  const [location, setLocation] = useState(user?.location || "");
  const [experience, setExperience] = useState(user?.experience || "");

  const applications = db.getApplicationsBySeeker(user.id);
  const recommendedJobs = db.getRecommendedJobs();

  const stats = {
    totalApplications: applications.length,
    interviews: applications.filter((a) => a.status === "Interview").length,
    avgScore: applications.length
      ? Math.round(
          applications.reduce((s, a) => s + a.aiScore, 0) / applications.length
        )
      : 0,
    offers: applications.filter((a) => a.status === "Hired").length,
  };

  const handleUploadResume = () => {
    const name = "Resume_" + user.name.replace(/\s/g, "_") + ".pdf";
    setResumeName(name);
    toast.success("Resume uploaded successfully! (Demo mode)");
  };

  const handleSaveProfile = () => {
    const updatedSkills = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    toast.success("Profile updated! (Demo mode)");
  };

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const navItems = [
    { label: "Overview", href: "/dashboard/seeker", icon: TrendingUp },
    {
      label: "Applications",
      href: "/dashboard/seeker/applications",
      icon: Briefcase,
    },
    { label: "Resume", href: "/dashboard/seeker/resume", icon: FileText },
    { label: "Profile", href: "/dashboard/seeker/profile", icon: User },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Interview":
        return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400";
      case "Applied":
        return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400";
      case "Reviewed":
        return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  return (
    <DashboardLayout title="Job Seeker Dashboard" navItems={navItems}>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Applications
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalApplications}
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
                Interviews
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.interviews}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Avg. Match
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.avgScore}%
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
                Profile Views
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                24
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
        {[
          { key: "overview", label: "Overview" },
          { key: "applications", label: "My Applications" },
          { key: "recommended", label: "Recommended Jobs" },
          { key: "profile", label: "Profile Settings" },
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
          {/* Profile Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {user.name.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {user.bio}
                </p>
                <div className="flex flex-wrap gap-3 mt-3">
                  <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <MapPin className="h-3 w-3" /> {user.location}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Briefcase className="h-3 w-3" /> {user.experience}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {user.skills.slice(0, 5).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Applications
              </h2>
              <button
                onClick={() => setTab("applications")}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {applications.slice(0, 3).map((app) => (
                <div
                  key={app.id}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {app.job.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {app.job.company}
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

          {/* Recommended Jobs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recommended for You
              </h2>
              <button
                onClick={() => setTab("recommended")}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer">
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedJobs.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {job.title}
                    </h3>
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                      {job.matchScore}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {job.company}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <MapPin className="h-3 w-3" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <DollarSign className="h-3 w-3" /> {job.salary}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Applications Tab */}
      {tab === "applications" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4">All Applications</h2>
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {app.job.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {app.job.company}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin className="h-3 w-3" /> {app.job.location}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3" /> Applied{" "}
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {app.aiScore}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        match
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
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
      )}

      {/* Recommended Jobs Tab */}
      {tab === "recommended" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4">
            Recommended Jobs Based on Your Profile
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {recommendedJobs.map((job) => (
              <div
                key={job.id}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {job.company.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {job.company}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-2">
                          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <MapPin className="h-3 w-3" /> {job.location}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <DollarSign className="h-3 w-3" /> {job.salary}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <Briefcase className="h-3 w-3" /> {job.type}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {job.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600 dark:text-green-400">
                        {job.matchScore}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        match
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        toast.success("Applied to job! (Demo mode)");
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm cursor-pointer">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {tab === "profile" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-6">Profile Settings</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={user.name}
                disabled
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Years of Experience
              </label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. 5 years"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Skills (comma separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="React, Node.js, TypeScript, Python"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Separate skills with commas
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Resume
              </label>
              <div className="flex items-center gap-3">
                {resumeName ? (
                  <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                    <Check className="h-4 w-4" /> {resumeName}
                  </span>
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    No resume uploaded
                  </span>
                )}
                <button
                  onClick={handleUploadResume}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                  <Upload className="h-4 w-4 inline mr-1" />
                  Upload
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                Save Changes
              </button>
              <button
                onClick={() => {
                  setBio(user?.bio || "");
                  setSkills(user?.skills ? user.skills.join(", ") : "");
                  setLocation(user?.location || "");
                  setExperience(user?.experience || "");
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SeekerDashboard;
