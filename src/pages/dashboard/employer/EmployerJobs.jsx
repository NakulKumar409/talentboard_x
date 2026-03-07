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
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import api from "../../../utils/api";

const EmployerJobs = () => {
  const navigate = useNavigate();
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

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

  // ---------------- GET ALL JOBS ----------------
  const fetchJobs = async () => {
    setLoading(true);
    try {
      // GET /jobs - Get all jobs
      const response = await api.get("/jobs");

      console.log("Jobs API Response:", response.data);

      let jobsData = [];

      // Handle different response structures
      if (response.data && response.data.applications) {
        // If response has applications array (like your earlier API)
        jobsData = response.data.applications;
      } else if (Array.isArray(response.data)) {
        // If response is direct array
        jobsData = response.data;
      } else if (response.data && response.data.data) {
        // If response has data property
        jobsData = response.data.data;
      } else if (response.data && response.data.success && response.data.jobs) {
        // If response has success and jobs properties
        jobsData = response.data.jobs;
      }

      console.log("Processed jobs data:", jobsData);

      // Filter for employer's jobs (based on company name)
      // You can replace "Tech Corp" with actual company from auth/context
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
      // DELETE /jobs/{id} - Delete job
      await api.delete(`/jobs/${id}`);
      toast.success("Job deleted successfully");

      // Refresh jobs list
      fetchJobs();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  // ---------------- EDIT JOB (Navigate to post page with job data) ----------------
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

  return (
    <DashboardLayout title="My Jobs" navItems={navItems}>
      <div className="space-y-4">
        {/* Header with Post Job button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            My Job Listings {myJobs.length > 0 && `(${myJobs.length})`}
          </h2>
          <button
            onClick={() => navigate("/dashboard/employer/post")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-12 text-center">
            <Briefcase className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No jobs posted yet
            </p>
            <button
              onClick={() => navigate("/dashboard/employer/post")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Post Your First Job
            </button>
          </div>
        ) : (
          myJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 hover:shadow-md transition">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {job.company || "Your Company"}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4" />{" "}
                          {job.location || "Location not specified"}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="h-4 w-4" />{" "}
                          {job.type || "Full-time"}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <DollarSign className="h-4 w-4" />{" "}
                          {job.salary || "Salary not specified"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Posted: {formatDate(job.createdAt || job.postedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Skills */}
                  {job.skillsRequired && job.skillsRequired.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 ml-15">
                      {job.skillsRequired.slice(0, 4).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                      {job.skillsRequired.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                          +{job.skillsRequired.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditJob(job)}
                    className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    disabled={deletingId === job._id}
                    className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm disabled:opacity-50">
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

              {/* Stats - Optional, you can remove if not needed */}
              <div className="flex gap-4 mt-4 pt-4 border-t dark:border-gray-700">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {job.applicants || 0} Applicants
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Status:{" "}
                    <span className="font-medium text-green-600 dark:text-green-400">
                      Active
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default EmployerJobs;
