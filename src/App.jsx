// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Jobs from "./pages/Jobs";
import ApplyJob from "./pages/ApplyJob";
import SeekerDashboard from "./pages/SeekerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

// New Employer Dashboard Pages
import EmployerJobs from "./pages/dashboard/employer/EmployerJobs";
import EmployerApplicants from "./pages/dashboard/employer/EmployerApplicants";
import EmployerPostJob from "./pages/dashboard/employer/EmployerPostJob";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="flex-1 pt-16">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/apply/:jobId" element={<ApplyJob />} />

            {/* Dashboard Routes */}
            <Route path="/dashboard/seeker" element={<SeekerDashboard />} />
            <Route path="/dashboard/employer" element={<EmployerDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />

            {/* New Employer Dashboard Sub-routes */}
            <Route path="/dashboard/employer/jobs" element={<EmployerJobs />} />
            <Route
              path="/dashboard/employer/applicants"
              element={<EmployerApplicants />}
            />
            <Route
              path="/dashboard/employer/post"
              element={<EmployerPostJob />}
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
