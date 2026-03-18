// src/App.jsx
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import ApplyJob from "./pages/ApplyJob";
import EmployerDashboard from "./pages/dashboard/employer/EmployerDashboard";
import SeekerDashboard from "./pages/dashboard/seeker/SeekerDashboard";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";

import SeekerApplications from "./pages/dashboard/seeker/SeekerApplications";
import SeekerProfile from "./pages/dashboard/seeker/SeekerProfile";
import SeekerSavedJobs from "./pages/dashboard/seeker/SeekerSavedJobs";

// New Employer Dashboard Pages
import EmployerApplicants from "./pages/dashboard/employer/EmployerApplicants";
import EmployerJobs from "./pages/dashboard/employer/EmployerJobs";
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
            <Route
              path="/dashboard/seeker/applications"
              element={<SeekerApplications />}
            />
            <Route
              path="/dashboard/seeker/profile"
              element={<SeekerProfile />}
            />
            <Route
              path="/dashboard/seeker/saved-jobs"
              element={<SeekerSavedJobs />}
            />

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
