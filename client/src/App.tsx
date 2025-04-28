import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { AuthProvider, useAuth } from "./context/AuthContext";
import GlobalStyles from "./utils/globalStyles";
import theme from "./utils/theme";

// Layout components
import Navbar from "./components/layout/Navbar";
import Container from "./components/layout/Container";

// Auth components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// Blog components
import HomePage from "./components/blog/HomePage";
import CreatePost from "./components/blog/CreatePost";
import PostDetail from "./components/blog/PostDetail";
import EditPost from "./components/blog/EditPost";

// User components
import UserProfile from "./components/user/UserProfile";
import Dashboard from "./components/user/Dashboard";

// Protected route component
interface ProtectedRouteProps {
  element: React.ReactNode;
}

const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // You might want to create a proper loading component
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <GlobalStyles />
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Container fullWidth>
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Home route will be public to show posts */}
                  <Route path="/" element={<HomePage />} />

                  {/* Protected routes */}
                  <Route
                    path="/create"
                    element={<ProtectedRoute element={<CreatePost />} />}
                  />
                  <Route
                    path="/edit/:id"
                    element={<ProtectedRoute element={<EditPost />} />}
                  />
                  <Route path="/profile/:username" element={<UserProfile />} />
                  <Route path="/post/:id" element={<PostDetail />} />
                  <Route
                    path="/dashboard"
                    element={<ProtectedRoute element={<Dashboard />} />}
                  />

                  {/* 404 route */}
                  <Route path="*" element={<div>404 Not Found</div>} />
                </Routes>
              </Container>
            </main>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
