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

  // Fixed useEffect with proper error handling
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");

      // Check if savedUser exists and is valid JSON
      if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
      // Clear corrupted data
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email, password) => {
    try {
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
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Login failed" };
    }
  };

  const signup = (userData) => {
    try {
      const newUser = {
        id: Date.now().toString(),
        ...userData,
      };

      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      return { success: true, user: newUser };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: "Signup failed" };
    }
  };

  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem("user"); // This completely removes the item
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateProfile = (profileData) => {
    try {
      if (user) {
        const updatedUser = { ...user, ...profileData };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Update profile error:", error);
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
