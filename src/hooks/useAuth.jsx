// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// Mock users for testing
const mockUsers = {
  admin: {
    id: "0",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
  },
  seeker: {
    id: "1",
    name: "John Seeker",
    email: "seeker@example.com",
    role: "seeker",
    resumeName: "john_resume.pdf",
    bio: "Experienced developer looking for new opportunities",
    skills: ["React", "Node.js", "TypeScript"],
  },
  employer: {
    id: "2",
    name: "Jane Employer",
    email: "employer@example.com",
    role: "employer",
    company: "Tech Corp",
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock login - in real app, this would call an API
    let loggedInUser = null;

    if (email.includes("admin")) {
      loggedInUser = mockUsers.admin;
    } else if (email.includes("seeker")) {
      loggedInUser = mockUsers.seeker;
    } else if (email.includes("employer")) {
      loggedInUser = mockUsers.employer;
    }

    if (loggedInUser) {
      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      return { success: true, user: loggedInUser };
    }

    return { success: false, error: "Invalid credentials" };
  };

  const signup = (userData) => {
    // Mock signup
    const newUser = {
      id: Date.now().toString(),
      ...userData,
    };

    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateProfile = (profileData) => {
    if (user) {
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

