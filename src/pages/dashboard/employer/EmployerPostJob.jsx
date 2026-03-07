// src/pages/dashboard/employer/EmployerPostJob.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Briefcase, TrendingUp, Users, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import api from "../../../utils/api";

const EmployerPostJob = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editJob = location.state?.job;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: editJob?.title || "",
    location: editJob?.location || "",
    type: editJob?.type || "Full-time",
    salary: editJob?.salary || "",
    description: editJob?.description || "",
    tags: editJob?.skillsRequired?.join(", ") || "",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.location ||
      !formData.salary ||
      !formData.description
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const skillsArray = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const payload = {
        title: formData.title,
        profile: formData.title,
        company: "Tech Corp",
        location: formData.location,
        salary: formData.salary,
        type: formData.type,
        skillsRequired:
          skillsArray.length > 0 ? skillsArray : ["React", "JavaScript"],
        experienceRequired: "2 years",
        description: formData.description,
      };

      if (editJob) {
        await api.put(`/jobs/${editJob._id}`, payload);
        toast.success("Job updated successfully");
      } else {
        await api.post("/jobs/create", payload);
        toast.success("Job posted successfully");
      }
      navigate("/dashboard/employer/jobs");
    } catch (error) {
      console.error("Job action failed:", error);
      toast.error(error.response?.data?.message || "Failed to save job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title={editJob ? "Edit Job" : "Post New Job"}
      navItems={navItems}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
          {editJob ? "Edit Job" : "Post New Job"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Senior React Developer"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border dark:border-gray-600 p-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full border dark:border-gray-600 p-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Job Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full border dark:border-gray-600 p-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
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
              value={formData.salary}
              onChange={(e) =>
                setFormData({ ...formData, salary: e.target.value })
              }
              className="w-full border dark:border-gray-600 p-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Describe the role, responsibilities..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border dark:border-gray-600 p-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              className="w-full border dark:border-gray-600 p-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Saving..." : editJob ? "Update Job" : "Publish Job"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/employer/jobs")}
              className="px-6 py-2 border dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EmployerPostJob;
    