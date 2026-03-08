// src/pages/ApplyJob.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  User,
  GraduationCap,
  Briefcase,
  FileText,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Github,
  Linkedin,
  Globe,
  Save,
  AlertCircle,
  Building,
  Award,
  X,
  Plus,
  TrendingUp,
  Bookmark,
} from "lucide-react";
import { toast } from "sonner";
import api from "../utils/api";
import DashboardLayout from "../components/layout/DashboardLayout";

const ApplyJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  // State Management
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [job, setJob] = useState(null);
  const [skillInput, setSkillInput] = useState("");
  const [topSkillInput, setTopSkillInput] = useState("");
  const [errors, setErrors] = useState({});

  const totalPages = 6;

  // Navigation Items
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

  // Form Data Structure
  const [formData, setFormData] = useState({
    jobId: jobId,
    userId: "",
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    aadhaar: "",
    pan: "",
    uan: "",

    // Education - 10th
    tenthBoard: "",
    tenthPercentage: "",
    tenthYear: "",

    // Education - 12th
    twelfthBoard: "",
    twelfthPercentage: "",
    twelfthYear: "",

    // Graduation
    graduationCollege: "",
    graduationDegree: "",
    graduationPercentage: "",
    graduationYear: "",

    // Post Graduation
    postGraduationCollege: "",
    postGraduationDegree: "",
    postGraduationPercentage: "",
    postGraduationYear: "",

    // Experience
    experienceYears: "",
    companyName: "",
    companyRole: "",
    startDate: "",
    endDate: "",
    previousCompany: "",
    previousRole: "",

    // Skills
    skills: [],
    topSkills: [],

    // Social Links
    github: "",
    linkedin: "",
    portfolio: "",

    // Documents
    resume: "",
    coverLetter: "",

    // Terms
    acceptTerms: false,
    confirmInformation: false,

    // Status
    status: "Applied",
  });

  // Load user data from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setFormData((prev) => ({
          ...prev,
          userId: user._id || user.id,
          fullName: user.name || "",
          email: user.email || "",
        }));
      } catch (error) {
        console.error("Error parsing user data:", error);
        toast.error("Failed to load user data");
      }
    }
  }, []);

  // Load job details
  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
      loadDraft();
    }
  }, [jobId]);

  // Load draft if exists
  const loadDraft = () => {
    try {
      const draft = localStorage.getItem(`application_draft_${jobId}`);
      if (draft) {
        const parsedDraft = JSON.parse(draft);
        setFormData((prev) => ({ ...prev, ...parsedDraft }));
        toast.info("Draft loaded successfully");
      }
    } catch (error) {
      console.error("Error loading draft:", error);
    }
  };

  // Fetch job details
  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/jobs/${jobId}`);
      setJob(response.data);
    } catch (error) {
      console.error("Error fetching job:", error);
      toast.error("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Skill management
  const addSkill = () => {
    if (skillInput.trim()) {
      if (formData.skills.includes(skillInput.trim())) {
        toast.error("Skill already added");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const addTopSkill = () => {
    if (topSkillInput.trim()) {
      if (formData.topSkills.includes(topSkillInput.trim())) {
        toast.error("Top skill already added");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        topSkills: [...prev.topSkills, topSkillInput.trim()],
      }));
      setTopSkillInput("");
    }
  };

  const removeTopSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      topSkills: prev.topSkills.filter((skill) => skill !== skillToRemove),
    }));
  };

  // Navigation
  const nextPage = () => {
    const pageErrors = validatePage(currentPage);
    if (Object.keys(pageErrors).length === 0) {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
      window.scrollTo(0, 0);
      setErrors({});
    } else {
      setErrors(pageErrors);
      toast.error("Please fix the errors before proceeding");
    }
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
    setErrors({});
  };

  // Validation
  const validatePage = (page) => {
    const errors = {};

    switch (page) {
      case 1:
        if (!formData.fullName?.trim())
          errors.fullName = "Full name is required";
        if (!formData.email?.trim()) errors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
          errors.email = "Invalid email format";
        if (!formData.phone?.trim()) errors.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(formData.phone))
          errors.phone = "Invalid phone number (10 digits)";
        break;

      case 2:
        if (!formData.address?.trim()) errors.address = "Address is required";
        if (!formData.city?.trim()) errors.city = "City is required";
        if (!formData.pincode?.trim()) errors.pincode = "Pincode is required";
        else if (!/^\d{6}$/.test(formData.pincode))
          errors.pincode = "Invalid pincode (6 digits)";
        break;

      case 3:
        if (!formData.tenthBoard?.trim())
          errors.tenthBoard = "Board is required";
        if (!formData.tenthPercentage?.trim())
          errors.tenthPercentage = "Percentage is required";
        else if (
          isNaN(formData.tenthPercentage) ||
          Number(formData.tenthPercentage) < 0 ||
          Number(formData.tenthPercentage) > 100
        )
          errors.tenthPercentage = "Invalid percentage (0-100)";
        if (!formData.tenthYear?.trim()) errors.tenthYear = "Year is required";
        else if (!/^\d{4}$/.test(formData.tenthYear))
          errors.tenthYear = "Invalid year (4 digits)";
        break;

      case 5:
        if (formData.skills.length === 0) {
          errors.skills = "Please add at least one skill";
        }
        break;

      case 6:
        if (!formData.acceptTerms)
          errors.acceptTerms = "You must accept terms and conditions";
        if (!formData.confirmInformation)
          errors.confirmInformation = "Please confirm information is correct";
        break;
    }

    return errors;
  };

  // Save draft
  const saveDraft = () => {
    try {
      localStorage.setItem(
        `application_draft_${jobId}`,
        JSON.stringify(formData)
      );
      toast.success("Application saved as draft!");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft");
    }
  };

  // Format data for API submission
  const formatDataForAPI = () => {
    // Calculate AI score based on matching skills
    const matchedSkills = formData.skills.filter((skill) =>
      job?.skillsRequired?.some((req) =>
        req.toLowerCase().includes(skill.toLowerCase())
      )
    );
    const aiScore =
      Math.round(
        (matchedSkills.length / (job?.skillsRequired?.length || 1)) * 100
      ) || 0;

    return {
      jobId: formData.jobId,
      userId: formData.userId,
      fullName: formData.fullName?.trim() || "",
      email: formData.email?.trim() || "",
      phone: formData.phone?.trim() || "",
      dob: formData.dob || "",
      gender: formData.gender || "",
      address: formData.address?.trim() || "",
      city: formData.city?.trim() || "",
      state: formData.state?.trim() || "",
      country: formData.country?.trim() || "",
      pincode: formData.pincode?.trim() || "",
      aadhaar: formData.aadhaar?.trim() || "",
      pan: formData.pan?.trim() || "",
      uan: formData.uan?.trim() || "",

      // Education - Convert to proper types
      tenthBoard: formData.tenthBoard?.trim() || "",
      tenthPercentage: formData.tenthPercentage
        ? Number(formData.tenthPercentage)
        : 0,
      tenthYear: formData.tenthYear ? Number(formData.tenthYear) : 0,

      twelfthBoard: formData.twelfthBoard?.trim() || "",
      twelfthPercentage: formData.twelfthPercentage
        ? Number(formData.twelfthPercentage)
        : 0,
      twelfthYear: formData.twelfthYear ? Number(formData.twelfthYear) : 0,

      graduationCollege: formData.graduationCollege?.trim() || "",
      graduationDegree: formData.graduationDegree?.trim() || "",
      graduationPercentage: formData.graduationPercentage
        ? Number(formData.graduationPercentage)
        : 0,
      graduationYear: formData.graduationYear
        ? Number(formData.graduationYear)
        : 0,

      postGraduationCollege: formData.postGraduationCollege?.trim() || "",
      postGraduationDegree: formData.postGraduationDegree?.trim() || "",
      postGraduationPercentage: formData.postGraduationPercentage
        ? Number(formData.postGraduationPercentage)
        : 0,
      postGraduationYear: formData.postGraduationYear
        ? Number(formData.postGraduationYear)
        : 0,

      // Experience
      experienceYears: formData.experienceYears || "0",
      companyName: formData.companyName?.trim() || "",
      companyRole: formData.companyRole?.trim() || "",
      startDate: formData.startDate || "",
      endDate: formData.endDate || "",
      previousCompany: formData.previousCompany?.trim() || "",
      previousRole: formData.previousRole?.trim() || "",

      // Skills
      skills: formData.skills || [],
      topSkills: formData.topSkills || [],

      // Social Links
      github: formData.github?.trim() || "",
      linkedin: formData.linkedin?.trim() || "",
      portfolio: formData.portfolio?.trim() || "",

      // Documents
      resume: formData.resume || "",
      coverLetter: formData.coverLetter?.trim() || "",

      // Terms
      acceptTerms: formData.acceptTerms,
      confirmInformation: formData.confirmInformation,

      // Status and Score
      status: "Applied",
      aiScore: aiScore,
    };
  };

  // Submit application
  const handleSubmit = async () => {
    const pageErrors = validatePage(currentPage);
    if (Object.keys(pageErrors).length > 0) {
      setErrors(pageErrors);
      toast.error("Please fix the errors before submitting");
      return;
    }

    setSubmitting(true);
    try {
      // Prepare submission data with proper formatting
      const submissionData = formatDataForAPI();

      console.log("Submitting to /applications/apply:", submissionData); // For debugging

      // FIXED: Using correct endpoint /applications/apply
      const response = await api.post("/applications/apply", submissionData);

      if (response.status === 200 || response.status === 201) {
        // Clear draft after successful submission
        localStorage.removeItem(`application_draft_${jobId}`);
        toast.success("Application submitted successfully!");
        navigate("/dashboard/seeker/applications");
      }
    } catch (error) {
      console.error("Submission error:", error);
      console.error("Error response:", error.response?.data); // For debugging

      // Show specific error message from server
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to submit application";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Render form pages (keeping the same as before)
  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Personal Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.fullName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                  }`}
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.phone
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                  }`}
                  placeholder="9876543210"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Address & Government IDs
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.address
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                  }`}
                  placeholder="123 Main Street"
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.address}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.city
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                  }`}
                  placeholder="Mumbai"
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.city}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Maharashtra"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="India"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.pincode
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                  }`}
                  placeholder="400001"
                />
                {errors.pincode && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.pincode}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Aadhaar
                </label>
                <input
                  type="text"
                  name="aadhaar"
                  value={formData.aadhaar}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="1234-5678-9012"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  PAN
                </label>
                <input
                  type="text"
                  name="pan"
                  value={formData.pan}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="ABCDE1234F"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  UAN
                </label>
                <input
                  type="text"
                  name="uan"
                  value={formData.uan}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="123456789012"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Education Details
              </h2>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                10th Standard
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input
                    name="tenthBoard"
                    placeholder="Board *"
                    value={formData.tenthBoard}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.tenthBoard
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                    }`}
                  />
                  {errors.tenthBoard && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.tenthBoard}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    name="tenthPercentage"
                    placeholder="Percentage *"
                    value={formData.tenthPercentage}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.tenthPercentage
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                    }`}
                  />
                  {errors.tenthPercentage && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.tenthPercentage}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    name="tenthYear"
                    placeholder="Year *"
                    value={formData.tenthYear}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.tenthYear
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                    }`}
                  />
                  {errors.tenthYear && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.tenthYear}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                12th Standard
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  name="twelfthBoard"
                  placeholder="Board"
                  value={formData.twelfthBoard}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="twelfthPercentage"
                  placeholder="Percentage"
                  value={formData.twelfthPercentage}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="twelfthYear"
                  placeholder="Year"
                  value={formData.twelfthYear}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                Graduation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="graduationCollege"
                  placeholder="College"
                  value={formData.graduationCollege}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="graduationDegree"
                  placeholder="Degree"
                  value={formData.graduationDegree}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="graduationPercentage"
                  placeholder="Percentage"
                  value={formData.graduationPercentage}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="graduationYear"
                  placeholder="Year"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                Post Graduation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="postGraduationCollege"
                  placeholder="College"
                  value={formData.postGraduationCollege}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="postGraduationDegree"
                  placeholder="Degree"
                  value={formData.postGraduationDegree}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="postGraduationPercentage"
                  placeholder="Percentage"
                  value={formData.postGraduationPercentage}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="postGraduationYear"
                  placeholder="Year"
                  value={formData.postGraduationYear}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Work Experience
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Total Experience (Years)
                </label>
                <input
                  name="experienceYears"
                  placeholder="e.g., 2"
                  value={formData.experienceYears}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Company
                </label>
                <input
                  name="companyName"
                  placeholder="Company name"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Role
                </label>
                <input
                  name="companyRole"
                  placeholder="Your role"
                  value={formData.companyRole}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Previous Company
                </label>
                <input
                  name="previousCompany"
                  placeholder="Previous company"
                  value={formData.previousCompany}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Previous Role
                </label>
                <input
                  name="previousRole"
                  placeholder="Previous role"
                  value={formData.previousRole}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Skills & Social Links
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Skills <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                  className={`flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.skills
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                  }`}
                  placeholder="Add a skill (e.g., React)"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
              {errors.skills && (
                <p className="mb-2 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.skills}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full flex items-center gap-1 text-sm">
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {formData.skills.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No skills added yet
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Top Skills
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={topSkillInput}
                  onChange={(e) => setTopSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTopSkill()}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Add top skill"
                />
                <button
                  type="button"
                  onClick={addTopSkill}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.topSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full flex items-center gap-1 text-sm">
                    {skill}
                    <button
                      onClick={() => removeTopSkill(skill)}
                      className="ml-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Github className="h-4 w-4 inline mr-1" />
                  GitHub
                </label>
                <input
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Linkedin className="h-4 w-4 inline mr-1" />
                  LinkedIn
                </label>
                <input
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Globe className="h-4 w-4 inline mr-1" />
                  Portfolio
                </label>
                <input
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="https://portfolio.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Resume (Filename)
              </label>
              <input
                name="resume"
                value={formData.resume}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="resume_filename.pdf"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Review & Submit
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cover Letter
              </label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                rows="6"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Write your cover letter here..."
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-3">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Terms & Confirmation
              </h3>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className="mt-1"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  I accept the terms and conditions{" "}
                  <span className="text-red-500">*</span>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.acceptTerms}
                </p>
              )}

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="confirmInformation"
                  checked={formData.confirmInformation}
                  onChange={handleInputChange}
                  className="mt-1"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  I confirm that all information provided is correct{" "}
                  <span className="text-red-500">*</span>
                </span>
              </label>
              {errors.confirmInformation && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />{" "}
                  {errors.confirmInformation}
                </p>
              )}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                Application Summary
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600 dark:text-gray-400">
                  Full Name:
                </div>
                <div className="text-gray-900 dark:text-white font-medium">
                  {formData.fullName || "—"}
                </div>

                <div className="text-gray-600 dark:text-gray-400">Email:</div>
                <div className="text-gray-900 dark:text-white font-medium">
                  {formData.email || "—"}
                </div>

                <div className="text-gray-600 dark:text-gray-400">Phone:</div>
                <div className="text-gray-900 dark:text-white font-medium">
                  {formData.phone || "—"}
                </div>

                <div className="text-gray-600 dark:text-gray-400">
                  Location:
                </div>
                <div className="text-gray-900 dark:text-white font-medium">
                  {formData.city || "—"}
                </div>

                <div className="text-gray-600 dark:text-gray-400">
                  Experience:
                </div>
                <div className="text-gray-900 dark:text-white font-medium">
                  {formData.experienceYears || "0"} years
                </div>

                <div className="text-gray-600 dark:text-gray-400">Skills:</div>
                <div className="text-gray-900 dark:text-white font-medium">
                  {formData.skills.length} skills
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout title="Apply for Job" navItems={navItems}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full mb-8"></div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Apply for Job" navItems={navItems}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Apply for {job?.title || "Job Position"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {job?.company} • {job?.location}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Step {currentPage} of {totalPages}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round((currentPage / totalPages) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentPage / totalPages) * 100}%` }}
              />
            </div>
          </div>

          {/* Page Indicators */}
          <div className="flex justify-between mb-6">
            {[1, 2, 3, 4, 5, 6].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : page < currentPage
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}>
                {page < currentPage ? "✓" : page}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {renderPage()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  currentPage === 1
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="flex gap-3">
                <button
                  onClick={saveDraft}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Draft
                </button>

                {currentPage < totalPages ? (
                  <button
                    onClick={nextPage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {submitting ? "Submitting..." : "Submit Application"}
                    {!submitting && <Send className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ApplyJob;
