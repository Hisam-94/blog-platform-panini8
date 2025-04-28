import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.space.md} ${({ theme }) => theme.space.xl};
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: sticky;
  top: 0;
  z-index: 1000;
  margin-bottom: 20rem;
`;

const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  background: ${({ theme }) => theme.colors.gradient.blue};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
  display: flex;
  align-items: center;
`;

const LogoIcon = styled.span`
  font-size: 1.5em;
  margin-right: ${({ theme }) => theme.space.xs};
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-decoration: none;
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radii.full};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.card};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const AuthButton = styled.button`
  background: ${({ theme }) => theme.colors.gradient.blue};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.full};
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.lg};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }
`;

const SignUpButton = styled(AuthButton)`
  background: ${({ theme }) => theme.colors.gradient.orange};
`;

const ProfileLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-decoration: none;
  padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.sm};
  border-radius: ${({ theme }) => theme.radii.full};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.card};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const ProfileImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.colors.primary};
`;

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <NavbarContainer>
      <Logo to="/">
        <LogoIcon>∑</LogoIcon>
        Blog Platform
      </Logo>
      <NavLinks>
        <NavLink to="/">Home</NavLink>
        {isAuthenticated ? (
          <>
            <NavLink to="/create">Create Post</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <ProfileLink to={`/profile/${user?.username}`}>
              <ProfileImage
                src={user?.profilePicture || "https://via.placeholder.com/32"}
                alt={user?.username}
              />
              {user?.username}
            </ProfileLink>
            <AuthButton onClick={handleLogout}>Logout</AuthButton>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <SignUpButton onClick={() => navigate("/register")}>
              Sign Up
            </SignUpButton>
          </>
        )}
      </NavLinks>
    </NavbarContainer>
  );
};

export default Navbar;
