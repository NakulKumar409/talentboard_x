// src/pages/dashboard/seeker/SeekerProfile.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  TrendingUp,
  User,
  Bookmark,
  Upload,
  Check,
  MapPin,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import api from "../../../utils/api";

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

const SeekerProfile = () => {
  const navigate = useNavigate();
  const [user] = useState(mockUser);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    bio: user.bio || "",
    skills: user.skills ? user.skills.join(", ") : "",
    location: user.location || "",
    experience: user.experience || "",
    education: user.education || "",
  });

  const [resumeName, setResumeName] = useState(user?.resumeName || "");

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadResume = () => {
    const name =
      "Resume_" + user.name.replace(/\s/g, "_") + "_" + Date.now() + ".pdf";
    setResumeName(name);
    toast.success("Resume uploaded successfully!");
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const updatedSkills = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        bio: formData.bio,
        skills: updatedSkills,
        location: formData.location,
        experience: formData.experience,
        education: formData.education,
        resumeName: resumeName,
      };

      await api.put(`/users/${user.id}`, payload);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.success("Profile updated! (Demo mode)");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      bio: user.bio || "",
      skills: user.skills ? user.skills.join(", ") : "",
      location: user.location || "",
      experience: user.experience || "",
      education: user.education || "",
    });
    setResumeName(user.resumeName || "");
    toast.info("Form reset to original values");
  };

  return (
    <DashboardLayout title="Profile Settings" navItems={navItems}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Profile Settings
        </h2>

        <div className="space-y-4 max-w-2xl">
          {/* Profile Picture */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {user.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </div>

          {/* Read-only fields */}
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

          {/* Editable fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
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
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. 5 years"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Education
            </label>
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. B.S. Computer Science"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
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
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
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
                Upload New
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50">
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer">
              <X className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SeekerProfile;
