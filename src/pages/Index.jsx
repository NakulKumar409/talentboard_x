// src/pages/Index.jsx
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Users,
  Brain,
  TrendingUp,
  ChevronRight,
  Calendar,
  Shield,
  FileText,
  Mail,
  Phone,
  MapPin,
  Award,
  Target,
  Heart,
  BookOpen,
  Clock,
  CheckCircle,
  Lock,
  Eye,
  Database,
  Server,
  Globe,
  Send,
  MessageSquare,
  User,
  PenTool,
  Code,
  Zap,
  Rocket,
  Github,
  Twitter,
  Linkedin,
  DollarSign,
  Building,
  GraduationCap,
  Laptop,
  Coffee,
  Cpu,
  Network,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "../utils/api";

// Image URLs (professional images from Unsplash)
const images = {
  about:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
  leadership:
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
  mission:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
  blog1:
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80",
  blog2:
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
  blog3:
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
  career:
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
  team: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80",
  office:
    "https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
  privacy:
    "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80",
  terms:
    "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=1212&q=80",
  contact:
    "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1174&q=80",
};

const Index = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribeMsg, setSubscribeMsg] = useState("");
  const [recentJobs, setRecentJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const handleScroll = (id) => {
    navigate("/");

    setTimeout(() => {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // Fetch recent jobs for Careers section
  useEffect(() => {
    fetchRecentJobs();
  }, []);

  const fetchRecentJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await api.get("/jobs", {
        params: {
          limit: 6,
          sort: "-createdAt",
        },
      });

      if (res.data?.jobs && Array.isArray(res.data.jobs)) {
        setRecentJobs(res.data.jobs);
      } else if (Array.isArray(res.data)) {
        setRecentJobs(res.data);
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        setRecentJobs(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch recent jobs:", error);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribeMsg("Thanks for subscribing! Check your inbox.");
      setEmail("");
      setTimeout(() => setSubscribeMsg(""), 3000);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative py-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${images.office})`,
        }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Find Your Dream Job with
            <span className="text-blue-400"> AI-Powered</span> Matching
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto">
            JASIQ Labs connects talented professionals with innovative companies
            using advanced AI to find the perfect match.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleNavigation("/signup")}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium cursor-pointer shadow-lg hover:shadow-xl">
              Get Started
            </button>
            <button
              onClick={() => handleNavigation("/jobs")}
              className="px-8 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium cursor-pointer shadow-lg hover:shadow-xl">
              Browse Jobs
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose JASIQ Labs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* AI Matching Card */}
            <div
              onClick={() => handleScroll("about")}
              className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all cursor-pointer hover:border-blue-300 dark:hover:border-blue-700"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleScroll("about")}>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                AI Matching
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Smart algorithms match candidates with perfect roles
              </p>
            </div>

            {/* Quality Jobs Card */}
            <div
              onClick={() => handleScroll("blog")}
              className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all cursor-pointer hover:border-blue-300 dark:hover:border-blue-700"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleScroll("blog")}>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Quality Jobs
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Curated listings from top companies
              </p>
            </div>

            {/* Smart Hiring Card */}
            <div
              onClick={() => handleScroll("careers")}
              className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all cursor-pointer hover:border-blue-300 dark:hover:border-blue-700"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleScroll("careers")}>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Smart Hiring
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tools to find and manage top talent
              </p>
            </div>

            {/* Career Growth Card */}
            <div
              onClick={() => handleScroll("privacy")}
              className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all cursor-pointer hover:border-blue-300 dark:hover:border-blue-700"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleScroll("privacy")}>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Career Growth
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Resources to advance your career
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION (JASIQ Labs) ===== */}
      <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header with Image */}
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-12">
            <img
              src={images.about}
              alt="About JASIQ Labs"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  About JASIQ Labs
                </h2>
                <p className="text-xl max-w-2xl mx-auto px-4">
                  Empowering innovation through technology, training, and
                  transformative solutions.
                </p>
              </div>
            </div>
          </div>

          {/* Compliance Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-12">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Compliance & Registration Information
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We follow basic compliance practices for website policies,
                  user data safety, and transparent communication. Company
                  registration details can be added/updated via admin in later
                  phases.
                  <span className="block mt-2 font-medium">
                    We are committed to maintaining the highest standards of
                    ethical business practices, data protection, and regulatory
                    compliance across all our operations.
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Leadership */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Leadership
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto mb-10">
              We are a team of builders and mentors who care about quality,
              trust, and consistency. Our leadership team brings together
              decades of combined experience in technology, business strategy,
              and innovation to guide our company's vision and growth.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Alex Chen",
                  role: "CEO & Founder",
                  desc: "15+ years in tech leadership, ex-Google",
                },
                {
                  name: "Sarah Johnson",
                  role: "CTO",
                  desc: "AI/ML expert, previously led engineering at OpenAI",
                },
                {
                  name: "Michael Rodriguez",
                  role: "Head of Product",
                  desc: "Product strategist with 10+ years experience",
                },
              ].map((leader, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-900 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/photo-${
                        i === 0
                          ? "1507003211169-0a1dd7228f2d"
                          : i === 1
                          ? "1494790108377-be9c29b29330"
                          : "1500648767791-00dcc994a37e"
                      }?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80`}
                      alt={leader.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {leader.name}
                  </h4>
                  <p className="text-blue-600 dark:text-blue-400 mb-2">
                    {leader.role}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {leader.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Vision & Mission with Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm">
              <img
                src={images.mission}
                alt="Our Mission"
                className="w-full h-48 object-cover"
              />
              <div className="p-8">
                <Target className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Our Mission
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our mission is to build meaningful outcomes through learning,
                  engineering, and product thinking — with clarity, discipline,
                  and long-term impact.
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm">
              <img
                src={images.team}
                alt="Our Vision"
                className="w-full h-48 object-cover"
              />
              <div className="p-8">
                <Eye className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Our Vision
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  To be the leading force in technological innovation,
                  transforming ideas into impactful solutions that drive
                  progress and create sustainable value for our clients and
                  communities worldwide.
                </p>
              </div>
            </div>
          </div>

          {/* Company Story */}
          <div className="mb-16 relative h-96 rounded-2xl overflow-hidden">
            <img
              src={images.office}
              alt="Company Story"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0  flex items-center">
              <div className="max-w-2xl mx-auto text-center text-black px-4">
                <h3 className="text-3xl font-bold mb-4">Our Journey</h3>
                <p className="text-lg mb-4">
                  JASIQ Labs was built with one simple goal: create a
                  trustworthy and practical path for students, and deliver
                  reliable software for businesses. We focus on clarity,
                  process, and real results.
                </p>
                <p className="text-lg">
                  From our humble beginnings to becoming a trusted technology
                  partner, we've remained committed to delivering exceptional
                  value while fostering a culture of integrity and innovation.
                </p>
              </div>
            </div>
          </div>

          {/* What Makes Us Different */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              What Makes Us Different
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: MessageSquare,
                  color: "blue",
                  title: "Clarity-first communication",
                  desc: "We believe in transparent, honest communication at every step.",
                },
                {
                  icon: PenTool,
                  color: "purple",
                  title: "Structured mentorship",
                  desc: "Guided learning paths with experienced mentors.",
                },
                {
                  icon: Code,
                  color: "green",
                  title: "Strong engineering discipline",
                  desc: "Clean code, best practices, and scalable architecture.",
                },
                {
                  icon: Zap,
                  color: "orange",
                  title: "Long-term outcomes focus",
                  desc: "Building for sustainable success, not quick wins.",
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm hover:shadow-md transition">
                    <Icon className={`h-8 w-8 text-${item.color}-600 mb-3`} />
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Culture & Values */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Culture & Values
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Heart,
                  color: "red",
                  title: "Honesty in communication",
                  desc: "We believe in the power of collaboration and innovation.",
                },
                {
                  icon: Target,
                  color: "blue",
                  title: "Discipline in execution",
                  desc: "We believe in the power of collaboration and innovation.",
                },
                {
                  icon: Users,
                  color: "green",
                  title: "Respect for learners & clients",
                  desc: "We believe in the power of collaboration and innovation.",
                },
                {
                  icon: Rocket,
                  color: "purple",
                  title: "Focus on real outcomes",
                  desc: "We believe in the power of collaboration and innovation.",
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="text-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
                    <Icon
                      className={`h-10 w-10 text-${item.color}-500 mx-auto mb-3`}
                    />
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to start your next project?
            </h3>
            <p className="text-blue-100 mb-6">
              Get in touch with our team to discuss how we can help bring your
              ideas to life.
            </p>
            <button
              onClick={() => handleScroll("contact")}
              className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-semibold">
              Contact Us Today
            </button>
          </div>
        </div>
      </section>

      {/* ===== BLOG SECTION (JASIQ Insights) ===== */}
      <section id="blog" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              JASIQ Insights
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Tutorials, career advice, and engineering thoughts for the modern
              developer.
            </p>
          </div>

          {/* Featured Post */}
          <div className="mb-16 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="h-64 lg:h-auto">
                <img
                  src={images.blog1}
                  alt="Clean Architecture"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 lg:p-12">
                <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold mb-4">
                  TECH
                </span>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  The Hidden Cost of Bad Code: Why Clean Architecture Matters in
                  2024
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Many businesses focus solely on shipping fast, often ignoring
                  code quality. In this post, we explore why adopting Clean
                  Architecture early on saves time, reduces bugs, and makes
                  scaling your web application much easier.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                      alt="Moin Khan"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Moin Khan
                      </p>
                      <p className="text-sm text-gray-500">5 min read</p>
                    </div>
                  </div>
                  <button className="text-blue-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
                    Read Article <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="mb-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="max-w-2xl mx-auto text-center">
              <Mail className="h-10 w-10 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">
                Join our Weekly Developer Newsletter
              </h3>
              <p className="text-blue-100 mb-6">
                Get the latest tech trends, MERN stack tips, and internship
                updates directly in your inbox. No spam, ever.
              </p>
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-medium flex items-center justify-center gap-2">
                  Subscribe <Send className="h-4 w-4" />
                </button>
              </form>
              {subscribeMsg && (
                <p className="mt-3 text-sm text-green-300">{subscribeMsg}</p>
              )}
            </div>
          </div>

          {/* Latest Articles */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Latest Articles
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Article 1 */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                <img
                  src={images.blog2}
                  alt="AI Future"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                      Career Advice
                    </span>
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded-full">
                      Technology
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    The 2026 IT Fresher Reality: How Agentic AI Killed Mass
                    Hiring and Created the "AI Orchestrator"
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    The traditional "junior developer" role is shrinking, but
                    the opportunity for the "AI-literate engineer" has never
                    been bigger...
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                        alt="Admin"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium">Admin</span>
                    </div>
                    <button className="text-blue-600 text-sm font-medium flex items-center gap-1">
                      Read More <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Article 2 */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                <img
                  src={images.blog3}
                  alt="Microservices"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex gap-2 mb-3">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded-full">
                      Backend
                    </span>
                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs rounded-full">
                      Architecture
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Building Scalable Microservices with Node.js and Docker
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Learn how to design, build, and deploy microservices
                    architecture that can handle millions of requests while
                    maintaining performance.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                        alt="Sarah Chen"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium">Sarah Chen</span>
                    </div>
                    <button className="text-blue-600 text-sm font-medium flex items-center gap-1">
                      Read More <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CAREERS SECTION (with real jobs in attractive cards) ===== */}
      <section id="careers" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Join Our Team
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Help us build the future of hiring. Check out our latest openings
              below.
            </p>
          </div>

          {loadingJobs ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-gray-500 mt-4">Loading latest jobs...</p>
            </div>
          ) : recentJobs.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl">
              <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                No jobs available at the moment
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group">
                  {/* Company Header with Gradient */}
                  <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
                    <div className="absolute -bottom-8 left-6">
                      <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center border-4 border-white dark:border-gray-800">
                        {job.companyLogo ? (
                          <img
                            src={job.companyLogo}
                            alt={job.company}
                            className="w-10 h-10 object-contain"
                          />
                        ) : (
                          <Building className="h-8 w-8 text-blue-600" />
                        )}
                      </div>
                    </div>

                    {/* Job Type Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full border border-white/30">
                        {job.type || "Full-time"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-10 p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition">
                        {job.title || job.profile}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">
                        {job.company}
                      </p>
                    </div>

                    {/* Description */}
                    {job.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {job.description}
                      </p>
                    )}

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <span className="truncate">
                          {job.location || "Remote"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <DollarSign className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="truncate">
                          {job.salary || "Negotiable"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <Briefcase className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="truncate">
                          {job.type || "Full-time"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4 text-orange-500 flex-shrink-0" />
                        <span className="truncate">
                          {job.experienceRequired || "Fresher"}
                        </span>
                      </div>
                    </div>

                    {/* Skills */}
                    {job.skillsRequired && job.skillsRequired.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skillsRequired.slice(0, 4).map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                            {skill}
                          </span>
                        ))}
                        {job.skillsRequired.length > 4 && (
                          <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                            +{job.skillsRequired.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Posted Date & Apply Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {job.createdAt
                            ? new Date(job.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "Recently"}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          const token = localStorage.getItem("token");
                          if (!token) {
                            navigate("/signup");
                          } else {
                            navigate(`/apply/${job._id}`);
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-1 group-hover:shadow-md">
                        Apply Now <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <button
              onClick={() => handleNavigation("/jobs")}
              className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition font-medium inline-flex items-center gap-2">
              View All Jobs <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ===== PRIVACY POLICY SECTION ===== */}
      <section id="privacy" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative h-64 rounded-2xl overflow-hidden mb-12">
            <img
              src={images.privacy}
              alt="Privacy Policy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <Lock className="h-12 w-12 mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  Privacy Policy
                </h2>
                <p className="text-lg">Last Updated: January 7, 2025</p>
              </div>
            </div>
          </div>

          {/* Privacy at a Glance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium">
                We do not sell your personal data
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
              <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium">
                We only collect info needed to provide services
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
              <Server className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium">
                Your data is secured with industry standards
              </p>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This Privacy Policy explains how JASIQ Labs ("we," "our," or "us")
              collects, uses, discloses, and safeguards your information.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Information We Collect
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-400">
              <li>Contact info (name, email, phone)</li>
              <li>Professional info (job title, company)</li>
              <li>Communication preferences</li>
              <li>Any other info you choose to provide</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              How We Use Your Info
            </h3>
            <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-400">
              <li>Provide, operate, and maintain our services</li>
              <li>Process and respond to your inquiries</li>
              <li>Send you technical notices and updates</li>
              <li>Improve our website and services</li>
              <li>Monitor and analyze usage and trends</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Sharing & Disclosure
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We do not sell, trade, or rent your personal information. We may
              share with:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-400">
              <li>Service providers (hosting, analytics)</li>
              <li>Business partners (collaborations)</li>
              <li>Legal authorities (if required by law)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Data Security
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We implement appropriate technical and organizational measures to
              protect your personal information.
              <span className="block mt-2 text-sm italic">
                Note: No method of transmission over the Internet is 100%
                secure.
              </span>
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Your Rights
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Depending on your location, you may have certain rights regarding
              your personal information, including the right to access, correct,
              or delete your data. We may update this policy periodically and
              will notify you of any changes here.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Privacy Concerns?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              If you have any questions about this Privacy Policy, please
              contact us at:
              <br />
              <a
                href="mailto:privacy@jasiqlabs.com"
                className="text-blue-600 hover:underline">
                privacy@jasiqlabs.com
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ===== TERMS & CONDITIONS SECTION ===== */}
      <section id="terms" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative h-64 rounded-2xl overflow-hidden mb-12">
            <img
              src={images.terms}
              alt="Terms of Service"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  Terms of Service
                </h2>
                <p className="text-lg">Last Updated: January 7, 2025</p>
              </div>
            </div>
          </div>

          {/* Agreement Summary */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Agreement Summary:</strong> By accessing our website, you
              agree to these terms. If you do not agree, please discontinue use
              of our services immediately.
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              1. Acceptance of Terms
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              By accessing or using any part of the website, you agree to become
              bound by these terms and conditions. These Terms apply to all
              visitors, users, and others who access or use the Service.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              2. Intellectual Property Rights
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The content on our website, including text, graphics, images,
              logos, and software, is the property of JASIQ Labs and is
              protected by intellectual property laws.
            </p>
            <p className="text-sm bg-gray-100 dark:bg-gray-700 p-3 rounded mb-6 text-gray-600 dark:text-gray-400">
              <strong>Note:</strong> You may not reproduce, distribute, or
              create derivative works without our express written permission.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              3. User Responsibilities
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              When using our website, you explicitly agree to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-400">
              <li>Provide accurate and complete information</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>
                Not use the website for any illegal or unauthorized purpose
              </li>
              <li>Not interfere with or disrupt the website or servers</li>
              <li>Comply with all applicable local and international laws</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              4. Limitation of Liability
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              JASIQ Labs shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, including loss of
              profits, data, use, goodwill, or other intangible losses,
              resulting from:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-400">
              <li>
                Your access to or use of or inability to access or use the
                service.
              </li>
              <li>Any conduct or content of any third party on the service.</li>
              <li>
                Unauthorized access, use, or alteration of your transmissions or
                content.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Questions about Terms?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Contact us at:
              <br />
              <a
                href="mailto:legal@jasiqlabs.com"
                className="text-blue-600 hover:underline">
                legal@jasiqlabs.com
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section id="contact" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative h-64 rounded-2xl overflow-hidden mb-12">
            <img
              src={images.contact}
              alt="Contact Us"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Get in Touch
                </h2>
                <p className="text-xl max-w-2xl mx-auto px-4">
                  Have questions? We'd love to hear from you.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="John"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Doe"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    rows="5"
                    placeholder="Tell us more about your inquiry..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-medium flex items-center justify-center gap-2">
                  Send Message <Send className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
                <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
                <p className="text-blue-100 mb-6">
                  Feel free to reach out through any of these channels. We're
                  here to help!
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-200" />
                    <span>support@jasiqlabs.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-200" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-200" />
                    <span>San Francisco, CA 94105</span>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <a
                    href="#"
                    className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition">
                    <Github className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* Map */}
              <div className="rounded-2xl overflow-hidden h-64">
                <img
                  src="https://images.unsplash.com/photo-1569336415962-a4bd9f69c07b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1331&q=80"
                  alt="Office Location"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find Your Dream Job?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who've found their perfect match
            with JASIQ Labs
          </p>
          <button
            onClick={() => handleNavigation("/signup")}
            className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium shadow-lg hover:shadow-xl">
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default Index;
