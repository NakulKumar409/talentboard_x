// src/pages/dashboard/seeker/SeekerSavedJobs.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  TrendingUp,
  User,
  Bookmark,
  MapPin,
  DollarSign,
  Clock,
  Heart,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import api from "../../../utils/api";

const SeekerSavedJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);

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
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/jobs/recommended");

      let jobsData = [];
      if (response.data && response.data.jobs) {
        jobsData = response.data.jobs;
      } else if (Array.isArray(response.data)) {
        jobsData = response.data;
      }

      setJobs(jobsData);

      // Mock saved jobs IDs
      setSavedJobs(["rec1", "rec3"]);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      // Mock data
      const mockJobs = [
        {
          _id: "rec1",
          title: "Full Stack Engineer",
          company: "Google",
          location: "Mountain View, CA",
          salary: "$150k - $180k",
          type: "Full-time",
          matchScore: 95,
          skills: ["React", "Node.js", "TypeScript", "Python"],
          postedAt: new Date(
            Date.now() - 3 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        {
          _id: "rec2",
          title: "React Developer",
          company: "Meta",
          location: "Remote",
          salary: "$140k - $170k",
          type: "Full-time",
          matchScore: 92,
          skills: ["React", "TypeScript", "GraphQL"],
          postedAt: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        {
          _id: "rec3",
          title: "Frontend Lead",
          company: "Amazon",
          location: "Seattle, WA",
          salary: "$160k - $200k",
          type: "Full-time",
          matchScore: 88,
          skills: ["React", "Node.js", "Team Leadership"],
          postedAt: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      ];
      setJobs(mockJobs);
      setSavedJobs(["rec1", "rec3"]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveJob = (jobId) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter((id) => id !== jobId));
      toast.success("Job removed from saved");
    } else {
      setSavedJobs([...savedJobs, jobId]);
      toast.success("Job saved successfully");
    }
  };

  const applyToJob = (jobId) => {
    navigate(`/apply/${jobId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout title="Saved Jobs" navItems={navItems}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recommended Jobs Based on Your Profile
        </h2>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No jobs found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const isSaved = savedJobs.includes(job._id);

              return (
                <div
                  key={job._id}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {job.company.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {job.title}
                            </h3>
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs">
                              {job.matchScore ||
                                Math.floor(Math.random() * 20 + 80)}
                              % Match
                            </span>
                          </div>
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
                              <Clock className="h-3 w-3" /> Posted{" "}
                              {formatDate(job.postedAt)}
                            </span>
                          </div>
                          {job.skills && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {job.skills.slice(0, 4).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                      <button
                        onClick={() => toggleSaveJob(job._id)}
                        className={`p-2 rounded-lg transition ${
                          isSaved
                            ? "text-red-600 hover:text-red-700"
                            : "text-gray-400 hover:text-red-600"
                        }`}>
                        <Heart
                          className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`}
                        />
                      </button>
                      <button
                        onClick={() => applyToJob(job._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm whitespace-nowrap">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SeekerSavedJobs;
