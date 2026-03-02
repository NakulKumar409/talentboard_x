// src/pages/Jobs.jsx - Temporary version without auth
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

// Mock jobs data
const mockJobs = [
  {
    id: "1",
    title: "Senior React Developer",
    company: "Tech Corp",
    location: "Remote",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    description:
      "We are looking for an experienced React developer to join our team...",
    tags: ["React", "Node.js", "TypeScript", "GraphQL"],
    employerId: "2",
  },
  {
    id: "2",
    title: "UX/UI Designer",
    company: "Design Studio",
    location: "New York, NY",
    type: "Full-time",
    salary: "$90,000 - $110,000",
    description: "Join our creative team as a UX/UI designer...",
    tags: ["Figma", "Adobe XD", "User Research", "Prototyping"],
    employerId: "2",
  },
  {
    id: "3",
    title: "Product Manager",
    company: "Startup Inc",
    location: "San Francisco, CA",
    type: "Remote",
    salary: "$130,000 - $160,000",
    description:
      "Looking for a product manager to lead our product development...",
    tags: ["Product Strategy", "Agile", "Roadmapping", "Analytics"],
    employerId: "2",
  },
  {
    id: "4",
    title: "Backend Engineer",
    company: "Cloud Systems",
    location: "Austin, TX",
    type: "Part-time",
    salary: "$80,000 - $100,000",
    description: "Build scalable backend services for our cloud platform...",
    tags: ["Python", "Django", "PostgreSQL", "AWS"],
    employerId: "2",
  },
];

// Mock db functions
const db = {
  getJobs: () => mockJobs,
  applyForJob: (data) => {
    console.log("Applied for job:", data);
    return true;
  },
};

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(true);

  const jobTypes = [
    "all",
    "Full-time",
    "Part-time",
    "Contract",
    "Remote",
    "Hybrid",
  ];

  useEffect(() => {
    const allJobs = db.getJobs();
    setJobs(allJobs);
    setFilteredJobs(allJobs);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (job.tags &&
            job.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase())
            ))
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((job) => job.type === selectedType);
    }

    setFilteredJobs(filtered);
  }, [searchTerm, selectedType, jobs]);

  const handleApply = (jobId) => {
    // Mock apply - just show success message
    toast.success("Application submitted successfully! (Demo mode)");
  };

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Find Your Next Job
            </h1>
            <button
              onClick={() => handleNavigation("/")}
              className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
              Back to Home
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs by title, company, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer">
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "all" ? "All Types" : type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredJobs.length}{" "}
            {filteredJobs.length === 1 ? "job" : "jobs"}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Loading jobs...
            </p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No jobs found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || selectedType !== "all"
                ? "Try adjusting your search filters"
                : "There are no jobs available at the moment"}
            </p>
            {(searchTerm || selectedType !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("all");
                }}
                className="mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {job.company.charAt(0)}
                        </span>
                      </div>

                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                          {job.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          {job.company}
                        </p>

                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                            <Clock className="h-4 w-4" />
                            {job.type}
                          </span>
                          <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                            <DollarSign className="h-4 w-4" />
                            {job.salary}
                          </span>
                        </div>

                        {job.tags && job.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {job.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {job.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => handleApply(job.id)}
                      className="px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer bg-blue-600 text-white hover:bg-blue-700">
                      Apply Now (Demo)
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Jobs;
