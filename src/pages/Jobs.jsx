
// src/pages/Jobs.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, DollarSign, Briefcase, Clock, Search } from "lucide-react";
import { toast } from "sonner";
import api from "../utils/api";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    type: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/jobs", {
        params: {
          page: 1,
          limit: 20,
        },
      });

      console.log("Jobs API Response:", data);

      // handle pagination response
      if (data.jobs) {
        setJobs(data.jobs);
      } else {
        setJobs(data);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (jobId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to apply");
      navigate("/login");
      return;
    }

    navigate(`/apply/${jobId}`);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      !filters.location ||
      job.location?.toLowerCase().includes(filters.location.toLowerCase());

    const matchesType = !filters.type || job.type === filters.type;

    return matchesSearch && matchesLocation && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Find Your Dream Job
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Browse through {jobs.length} available positions
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e)=>setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>

            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e)=>setFilters({...filters, location:e.target.value})}
              className="px-3 py-2 border rounded-lg"
            />

            <select
              value={filters.type}
              onChange={(e)=>setFilters({...filters, type:e.target.value})}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>

          </div>
        </div>

        {/* Job List */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl">
              <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-3"/>
              <p className="text-gray-500">No jobs found</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-4">

                  <div className="flex-1">

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {job.title}
                    </h2>

                    <p className="text-gray-600 dark:text-gray-400">
                      {job.company}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">

                      <span className="flex items-center gap-1">
                        <MapPin size={16}/> {job.location}
                      </span>

                      <span className="flex items-center gap-1">
                        <DollarSign size={16}/> {job.salary}
                      </span>

                      <span className="flex items-center gap-1">
                        <Briefcase size={16}/> {job.type}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock size={16}/> {job.experienceRequired}
                      </span>

                    </div>

                    <p className="text-sm mt-3 text-gray-600">
                      {job.description}
                    </p>

                  </div>

                  <div className="flex gap-3 items-center">

                    <button
                      onClick={()=>handleApply(job._id)}
                      className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Apply Now
                    </button>

                    <button
                      onClick={()=>navigate(`/jobs/${job._id}`)}
                      className="px-5 py-2 border rounded-lg"
                    >
                      View
                    </button>

                  </div>

                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Jobs;

