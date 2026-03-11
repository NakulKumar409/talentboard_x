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
  Upload,
  File,
  Sparkles,
  Loader,
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
  const [parsingResume, setParsingResume] = useState(false);
  const [job, setJob] = useState(null);
  const [skillInput, setSkillInput] = useState("");
  const [topSkillInput, setTopSkillInput] = useState("");
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsedData, setParsedData] = useState(null);

  const totalPages = 6;

  // Navigation Items with proper spacing
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

  // Form Data Structure - Extended for all pages
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

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!validTypes.includes(file.type)) {
        toast.error("Please upload PDF or DOC file only");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setFormData((prev) => ({ ...prev, resume: file.name }));
    }
  };

  // Parse resume and auto-fill all fields
  const handleParseResume = async () => {
    if (!selectedFile) {
      toast.error("Please select a resume file first");
      return;
    }

    setParsingResume(true);
    setUploadProgress(0);

    const formDataObj = new FormData();
    formDataObj.append("resume", selectedFile);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const token = localStorage.getItem("token");
      const response = await api.post(
        "/applications/parse-resume",
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.data.success) {
        const data = response.data.parsedData;
        setParsedData(data);

        // Comprehensive auto-fill for all pages
        setFormData((prev) => ({
          ...prev,
          // Page 1: Personal Info
          fullName: data.fullName || prev.fullName,
          email: data.email || prev.email,
          phone: data.phone || prev.phone,
          dob: data.dob || prev.dob,
          gender: data.gender || prev.gender,

          // Page 2: Address
          address: data.address || prev.address,
          city: data.city || prev.city,
          state: data.state || prev.state,
          country: data.country || prev.country,
          pincode: data.pincode || prev.pincode,

          // Government IDs
          aadhaar: data.aadhaar || prev.aadhaar,
          pan: data.pan || prev.pan,
          uan: data.uan || prev.uan,

          // Page 3: Education - 10th
          tenthBoard: data.tenthBoard || prev.tenthBoard,
          tenthPercentage: data.tenthPercentage || prev.tenthPercentage,
          tenthYear: data.tenthYear || prev.tenthYear,

          // 12th
          twelfthBoard: data.twelfthBoard || prev.twelfthBoard,
          twelfthPercentage: data.twelfthPercentage || prev.twelfthPercentage,
          twelfthYear: data.twelfthYear || prev.twelfthYear,

          // Graduation
          graduationCollege: data.graduationCollege || prev.graduationCollege,
          graduationDegree: data.graduationDegree || prev.graduationDegree,
          graduationPercentage:
            data.graduationPercentage || prev.graduationPercentage,
          graduationYear: data.graduationYear || prev.graduationYear,

          // Post Graduation
          postGraduationCollege:
            data.postGraduationCollege || prev.postGraduationCollege,
          postGraduationDegree:
            data.postGraduationDegree || prev.postGraduationDegree,
          postGraduationPercentage:
            data.postGraduationPercentage || prev.postGraduationPercentage,
          postGraduationYear:
            data.postGraduationYear || prev.postGraduationYear,

          // Page 4: Experience
          experienceYears: data.experienceYears || prev.experienceYears,
          companyName: data.companyName || prev.companyName,
          companyRole: data.companyRole || prev.companyRole,
          startDate: data.startDate || prev.startDate,
          endDate: data.endDate || prev.endDate,
          previousCompany: data.previousCompany || prev.previousCompany,
          previousRole: data.previousRole || prev.previousRole,

          // Page 5: Skills
          skills:
            data.skills?.length > 0
              ? [...new Set([...prev.skills, ...data.skills])]
              : prev.skills,
          topSkills:
            data.topSkills?.length > 0
              ? [...new Set([...prev.topSkills, ...data.topSkills])]
              : prev.topSkills,

          // Social Links
          github: data.github || prev.github,
          linkedin: data.linkedin || prev.linkedin,
          portfolio: data.portfolio || prev.portfolio,
        }));

        toast.success(
          "Resume parsed successfully! All fields auto-filled across all pages."
        );
      }
    } catch (error) {
      console.error("Resume parsing error:", error);
      toast.error(error.response?.data?.message || "Failed to parse resume");
    } finally {
      setParsingResume(false);
      setTimeout(() => setUploadProgress(0), 1000);
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
      window.scrollTo({ top: 0, behavior: "smooth" });
      setErrors({});
    } else {
      setErrors(pageErrors);
      toast.error("Please fix the errors before proceeding");
    }
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  // Calculate AI score
  const calculateAIScore = () => {
    const matchedSkills = formData.skills.filter((skill) =>
      job?.skillsRequired?.some((req) =>
        req.toLowerCase().includes(skill.toLowerCase())
      )
    );
    return (
      Math.round(
        (matchedSkills.length / (job?.skillsRequired?.length || 1)) * 100
      ) || 0
    );
  };

  // Prepare FormData for submission
  const prepareFormData = () => {
    const formDataObj = new FormData();

    // Add resume file if selected
    if (selectedFile) {
      formDataObj.append("resume", selectedFile);
    }

    // Add all form fields
    Object.keys(formData).forEach((key) => {
      if (key === "skills" || key === "topSkills") {
        if (formData[key]?.length > 0) {
          formDataObj.append(key, JSON.stringify(formData[key]));
        }
      } else if (key !== "resume") {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataObj.append(key, formData[key].toString());
        }
      }
    });

    // Add calculated fields
    formDataObj.append("aiScore", calculateAIScore().toString());
    formDataObj.append("status", "Applied");

    return formDataObj;
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
      const formDataObj = prepareFormData();
      const token = localStorage.getItem("token");

      const response = await api.post("/applications/apply", formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        localStorage.removeItem(`application_draft_${jobId}`);

        if (selectedFile) {
          toast.success("Application submitted with resume!");
        } else {
          toast.success("Application submitted successfully!");
        }

        navigate("/dashboard/seeker/applications");
      }
    } catch (error) {
      console.error("Submission error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to submit application";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Render Page 1 with Resume Upload
  const renderPage1 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
          <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Upload Resume & Personal Info
        </h2>
      </div>

      {/* Resume Upload Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 sm:p-6 rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700">
        <div className="text-center mb-4">
          <File className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-blue-500 mb-2" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
            Upload Your Resume
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            PDF or DOC (Max 5MB) - Click "Parse" to auto-fill ALL pages
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            id="resume-upload"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label
            htmlFor="resume-upload"
            className="cursor-pointer w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-white dark:bg-gray-700 border-2 border-blue-500 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base">
            <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
            Choose Resume File
          </label>

          {selectedFile && (
            <div className="w-full max-w-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-gray-700 p-3 rounded-lg gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <File className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate max-w-[150px] sm:max-w-[200px]">
                    {selectedFile.name}
                  </span>
                </div>
                <button
                  onClick={handleParseResume}
                  disabled={parsingResume}
                  className="w-full sm:w-auto px-3 py-1.5 bg-green-600 text-white text-xs sm:text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1">
                  {parsingResume ? (
                    <>
                      <Loader className="h-3 w-3 animate-spin" />
                      Parsing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3" />
                      Parse Resume
                    </>
                  )}
                </button>
              </div>

              {uploadProgress > 0 && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <span>Parsing...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {parsedData && (
                <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-xs text-green-700 dark:text-green-400 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Resume parsed! All fields auto-filled across all pages.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Basic Info Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
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
            className={`w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
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

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
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
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 sm:p-4 rounded-lg">
        <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-400 flex items-center gap-2">
          <Sparkles className="h-4 w-4 flex-shrink-0" />
          <span>
            Upload resume and click "Parse Resume" to auto-fill your details
            across ALL pages!
          </span>
        </p>
      </div>
    </div>
  );

  // Render Page 2 (Address)
  const renderPage2 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
          <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Address & Government IDs
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            State
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Maharashtra"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Country
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="India"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pincode <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
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

        <div className="md:col-span-2 border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Government IDs (Optional)
          </h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Aadhaar Number
          </label>
          <input
            type="text"
            name="aadhaar"
            value={formData.aadhaar}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="1234 5678 9012"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            PAN Card
          </label>
          <input
            type="text"
            name="pan"
            value={formData.pan}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="ABCDE1234F"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            UAN Number
          </label>
          <input
            type="text"
            name="uan"
            value={formData.uan}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="123456789012"
          />
        </div>
      </div>
    </div>
  );

  // Render Page 3 (Education)
  const renderPage3 = () => (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
          <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Education Details
        </h2>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
          10th Standard <span className="text-red-500">*</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Board
            </label>
            <input
              name="tenthBoard"
              placeholder="e.g., CBSE, ICSE, State Board"
              value={formData.tenthBoard}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.tenthBoard
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
              }`}
            />
            {errors.tenthBoard && (
              <p className="mt-1 text-xs text-red-500">{errors.tenthBoard}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Percentage (%)
            </label>
            <input
              name="tenthPercentage"
              placeholder="e.g., 85.5"
              value={formData.tenthPercentage}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Year of Passing
            </label>
            <input
              name="tenthYear"
              placeholder="e.g., 2015"
              value={formData.tenthYear}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.tenthYear
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
              }`}
            />
            {errors.tenthYear && (
              <p className="mt-1 text-xs text-red-500">{errors.tenthYear}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
          12th Standard
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Board
            </label>
            <input
              name="twelfthBoard"
              placeholder="e.g., CBSE, ICSE, State Board"
              value={formData.twelfthBoard}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Percentage (%)
            </label>
            <input
              name="twelfthPercentage"
              placeholder="e.g., 80.0"
              value={formData.twelfthPercentage}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Year of Passing
            </label>
            <input
              name="twelfthYear"
              placeholder="e.g., 2017"
              value={formData.twelfthYear}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
          Graduation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              College Name
            </label>
            <input
              name="graduationCollege"
              placeholder="College name"
              value={formData.graduationCollege}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Degree
            </label>
            <input
              name="graduationDegree"
              placeholder="e.g., B.Tech, B.Sc"
              value={formData.graduationDegree}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Percentage / CGPA
            </label>
            <input
              name="graduationPercentage"
              placeholder="e.g., 75% or 8.5 CGPA"
              value={formData.graduationPercentage}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Year of Passing
            </label>
            <input
              name="graduationYear"
              placeholder="e.g., 2021"
              value={formData.graduationYear}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
          Post Graduation (if applicable)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              College Name
            </label>
            <input
              name="postGraduationCollege"
              placeholder="College name"
              value={formData.postGraduationCollege}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Degree
            </label>
            <input
              name="postGraduationDegree"
              placeholder="e.g., M.Tech, MBA"
              value={formData.postGraduationDegree}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Percentage / CGPA
            </label>
            <input
              name="postGraduationPercentage"
              placeholder="e.g., 80%"
              value={formData.postGraduationPercentage}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Year of Passing
            </label>
            <input
              name="postGraduationYear"
              placeholder="e.g., 2023"
              value={formData.postGraduationYear}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Render Page 4 (Experience)
  const renderPage4 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
          <Briefcase className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Work Experience
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Total Experience (Years)
          </label>
          <input
            name="experienceYears"
            placeholder="e.g., 2.5"
            value={formData.experienceYears}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2 border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Current / Most Recent Employment
          </h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Company Name
          </label>
          <input
            name="companyName"
            placeholder="Current company"
            value={formData.companyName}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Job Role / Title
          </label>
          <input
            name="companyRole"
            placeholder="e.g., Software Engineer"
            value={formData.companyRole}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            End Date (or Present)
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2 border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Previous Employment
          </h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Previous Company
          </label>
          <input
            name="previousCompany"
            placeholder="Previous company"
            value={formData.previousCompany}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Previous Role
          </label>
          <input
            name="previousRole"
            placeholder="Previous role"
            value={formData.previousRole}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  // Render Page 5 (Skills & Social)
  const renderPage5 = () => (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
          <FileText className="h-5 w-5 text-pink-600 dark:text-pink-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Skills & Social Links
        </h2>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
        <label className="block text-lg font-medium text-gray-900 dark:text-white mb-4">
          Skills <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addSkill()}
            className={`flex-1 px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
              errors.skills
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
            }`}
            placeholder="Add a skill (e.g., React, Python, Project Management)"
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap">
            <Plus className="h-4 w-4" />
            Add Skill
          </button>
        </div>
        {errors.skills && (
          <p className="mb-4 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> {errors.skills}
          </p>
        )}
        <div className="flex flex-wrap gap-2 min-h-[60px] p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {formData.skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full flex items-center gap-1 text-sm">
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {formData.skills.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 w-full text-center py-2">
              No skills added yet. Add your technical and soft skills above.
            </p>
          )}
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
        <label className="block text-lg font-medium text-gray-900 dark:text-white mb-4">
          Top Skills (Optional)
        </label>
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={topSkillInput}
            onChange={(e) => setTopSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTopSkill()}
            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Add your strongest skills"
          />
          <button
            type="button"
            onClick={addTopSkill}
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 whitespace-nowrap">
            <Plus className="h-4 w-4" />
            Add Top Skill
          </button>
        </div>
        <div className="flex flex-wrap gap-2 min-h-[60px] p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {formData.topSkills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full flex items-center gap-1 text-sm">
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

      <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Social & Professional Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Github className="h-4 w-4 inline mr-2" />
              GitHub Profile
            </label>
            <input
              name="github"
              value={formData.github}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="https://github.com/username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Linkedin className="h-4 w-4 inline mr-2" />
              LinkedIn Profile
            </label>
            <input
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Globe className="h-4 w-4 inline mr-2" />
              Personal Portfolio / Website
            </label>
            <input
              name="portfolio"
              value={formData.portfolio}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="https://yourportfolio.com"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Render Page 6 (Review & Submit)
  const renderPage6 = () => (
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
        <label className="block text-lg font-medium text-gray-900 dark:text-white mb-3">
          Cover Letter
        </label>
        <textarea
          name="coverLetter"
          value={formData.coverLetter}
          onChange={handleInputChange}
          rows="6"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-y"
          placeholder="Write a brief cover letter explaining why you're the perfect fit for this role..."
        />
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
          Terms & Confirmation
        </h3>
        <label className="flex items-start gap-3 cursor-pointer p-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleInputChange}
            className="mt-1 w-4 h-4"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            I confirm that I have read and agree to the Terms and Conditions,
            and I understand that providing false information may result in
            disqualification from the application process.{" "}
            <span className="text-red-500 font-medium">*</span>
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="text-xs text-red-500 flex items-center gap-1 px-3">
            <AlertCircle className="h-3 w-3" /> {errors.acceptTerms}
          </p>
        )}

        <label className="flex items-start gap-3 cursor-pointer p-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors">
          <input
            type="checkbox"
            name="confirmInformation"
            checked={formData.confirmInformation}
            onChange={handleInputChange}
            className="mt-1 w-4 h-4"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            I hereby declare that all the information provided in this
            application is true, complete, and correct to the best of my
            knowledge. <span className="text-red-500 font-medium">*</span>
          </span>
        </label>
        {errors.confirmInformation && (
          <p className="text-xs text-red-500 flex items-center gap-1 px-3">
            <AlertCircle className="h-3 w-3" /> {errors.confirmInformation}
          </p>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Application Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between border-b border-blue-100 dark:border-blue-800 pb-1">
              <span className="text-gray-600 dark:text-gray-400">
                Full Name:
              </span>
              <span className="text-gray-900 dark:text-white font-medium">
                {formData.fullName || "—"}
              </span>
            </div>
            <div className="flex justify-between border-b border-blue-100 dark:border-blue-800 pb-1">
              <span className="text-gray-600 dark:text-gray-400">Email:</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {formData.email || "—"}
              </span>
            </div>
            <div className="flex justify-between border-b border-blue-100 dark:border-blue-800 pb-1">
              <span className="text-gray-600 dark:text-gray-400">Phone:</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {formData.phone || "—"}
              </span>
            </div>
            <div className="flex justify-between border-b border-blue-100 dark:border-blue-800 pb-1">
              <span className="text-gray-600 dark:text-gray-400">
                Location:
              </span>
              <span className="text-gray-900 dark:text-white font-medium">
                {formData.city || "—"}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between border-b border-blue-100 dark:border-blue-800 pb-1">
              <span className="text-gray-600 dark:text-gray-400">
                Experience:
              </span>
              <span className="text-gray-900 dark:text-white font-medium">
                {formData.experienceYears || "0"} years
              </span>
            </div>
            <div className="flex justify-between border-b border-blue-100 dark:border-blue-800 pb-1">
              <span className="text-gray-600 dark:text-gray-400">Skills:</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {formData.skills.length} skills added
              </span>
            </div>
            {selectedFile && (
              <div className="flex justify-between border-b border-blue-100 dark:border-blue-800 pb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  Resume:
                </span>
                <span className="text-gray-900 dark:text-white font-medium flex items-center gap-1">
                  <File className="h-3 w-3" />
                  <span className="truncate max-w-[150px]">
                    {selectedFile.name}
                  </span>
                </span>
              </div>
            )}
            <div className="flex justify-between border-b border-blue-100 dark:border-blue-800 pb-1">
              <span className="text-gray-600 dark:text-gray-400">
                Education:
              </span>
              <span className="text-gray-900 dark:text-white font-medium">
                {formData.graduationDegree || formData.tenthBoard
                  ? "Provided"
                  : "Not provided"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render form pages with proper spacing
  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return renderPage1();
      case 2:
        return renderPage2();
      case 3:
        return renderPage3();
      case 4:
        return renderPage4();
      case 5:
        return renderPage5();
      case 6:
        return renderPage6();
      default:
        return null;
    }
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout title="Apply for Job" navItems={navItems}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full mb-8"></div>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
                <div className="space-y-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-14 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with proper spacing */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Apply for {job?.title || "Job Position"}
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 mt-2">
              {job?.company} • {job?.location}
            </p>
            {job?.salary && (
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Salary: {job.salary}
              </p>
            )}
          </div>

          {/* Progress Bar with better spacing */}
          <div className="mb-8">
            <div className="flex justify-between mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Step {currentPage} of {totalPages}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round((currentPage / totalPages) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(currentPage / totalPages) * 100}%` }}
              />
            </div>
          </div>

          {/* Page Indicators - Better spacing and responsive */}
          <div className="flex justify-between mb-8 overflow-x-auto pb-2 gap-1 sm:gap-2">
            {[1, 2, 3, 4, 5, 6].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-medium transition-colors flex-shrink-0 ${
                  currentPage === page
                    ? "bg-blue-600 text-white shadow-lg scale-110"
                    : page < currentPage
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
                title={`Go to step ${page}`}>
                {page < currentPage ? "✓" : page}
              </button>
            ))}
          </div>

          {/* Form Card with better padding */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
            {renderPage()}

            {/* Navigation Buttons - Better spacing and responsive */}
            <div className="flex flex-col-reverse sm:flex-row justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 gap-4">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`w-full sm:w-auto px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-base font-medium ${
                  currentPage === 1
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}>
                <ChevronLeft className="h-5 w-5" />
                Previous Step
              </button>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={saveDraft}
                  className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-base font-medium">
                  <Save className="h-5 w-5" />
                  Save as Draft
                </button>

                {currentPage < totalPages ? (
                  <button
                    onClick={nextPage}
                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-base font-medium shadow-md hover:shadow-lg">
                    Next Step
                    <ChevronRight className="h-5 w-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-base font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    {submitting ? (
                      <>
                        <Loader className="h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <Send className="h-5 w-5" />
                      </>
                    )}
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
