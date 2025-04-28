import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import Button from "../layout/Button";
import Input from "../layout/Input";
import Container from "../layout/Container";

const RegisterContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space.xl};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
  margin-top: ${({ theme }) => theme.space.lg};
`;

const RegisterHeader = styled.h1`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space.lg};
  color: ${({ theme }) => theme.colors.primary};
`;

const RegisterSubHeader = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => `${theme.colors.error}20`};
  color: ${({ theme }) => theme.colors.error};
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const LoginLink = styled.div`
  margin-top: ${({ theme }) => theme.space.md};
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.md};

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};

    &:hover {
      text-decoration: underline;
    }
  }
`;

const TextArea = styled.textarea<{ hasError?: boolean }>`
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  border: 1px solid
    ${({ theme, hasError }) =>
      hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: border-color ${({ theme }) => theme.transitions.fast};
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) =>
      hasError ? theme.colors.error : theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
  });

  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const errors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      bio: "",
    };

    // Validate username
    if (!formData.username.trim()) {
      errors.username = "Username is required";
      isValid = false;
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
      isValid = false;
    } else if (formData.username.length > 20) {
      errors.username = "Username cannot exceed 20 characters";
      isValid = false;
    }

    // Validate email
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    // Validate password
    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    // Validate bio (optional)
    if (formData.bio.length > 200) {
      errors.bio = "Bio cannot exceed 200 characters";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await register(
        formData.username,
        formData.email,
        formData.password,
        formData.bio
      );
      navigate("/");
    } catch (error: any) {
      setError(
        error.response?.data?.message || "An error occurred during registration"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <RegisterContainer>
        <RegisterHeader>Create Account</RegisterHeader>
        <RegisterSubHeader>
          Sign up to start creating and sharing blog posts
        </RegisterSubHeader>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <RegisterForm onSubmit={handleSubmit}>
          <Input
            type="text"
            name="username"
            label="Username"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            error={formErrors.username}
            fullWidth
          />

          <Input
            type="email"
            name="email"
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            error={formErrors.email}
            fullWidth
          />

          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            error={formErrors.password}
            fullWidth
          />

          <Input
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={formErrors.confirmPassword}
            fullWidth
          />

          <FormGroup>
            <Label>Bio (optional)</Label>
            <TextArea
              name="bio"
              placeholder="Tell us something about yourself"
              value={formData.bio}
              onChange={handleChange}
              hasError={!!formErrors.bio}
            />
            {formErrors.bio && <ErrorMessage>{formErrors.bio}</ErrorMessage>}
          </FormGroup>

          <Button type="submit" fullWidth isLoading={isLoading}>
            Create Account
          </Button>
        </RegisterForm>

        <LoginLink>
          Already have an account? <Link to="/login">Log In</Link>
        </LoginLink>
      </RegisterContainer>
    </Container>
  );
};

export default Register;


// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import styled from "styled-components";
// import { useAuth } from "../../context/AuthContext";
// import Button from "../layout/Button";
// import Input from "../layout/Input";
// import Container from "../layout/Container";

// // Styled Components
// const RegisterContainer = styled.div`
//   max-width: 428px;
//   margin: 0 auto;
//   padding: 2rem;
//   background: white;
//   border-radius: 1rem;
//   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
// `;

// const RegisterForm = styled.form`
//   display: flex;
//   flex-direction: column;
//   gap: 1.5rem;
//   margin-top: 2rem;
// `;

// const RegisterHeader = styled.h1`
//   text-align: center;
//   font-size: 1.875rem;
//   font-weight: 600;
//   color: #111827;
//   margin-bottom: 0.5rem;
// `;

// const RegisterSubHeader = styled.p`
//   text-align: center;
//   color: #6b7280;
//   margin-bottom: 2rem;
// `;

// const ErrorMessage = styled.div`
//   background-color: #fee2e2;
//   color: #dc2626;
//   padding: 0.75rem 1rem;
//   border-radius: 0.375rem;
//   margin-bottom: 1rem;
//   font-size: 0.875rem;
// `;

// const LoginLink = styled.div`
//   margin-top: 2rem;
//   text-align: center;
//   font-size: 0.875rem;
//   color: #6b7280;

//   a {
//     color: #2563eb;
//     font-weight: 500;
//     margin-left: 0.25rem;

//     &:hover {
//       text-decoration: underline;
//     }
//   }
// `;

// const TextArea = styled.textarea<{ hasError?: boolean }>`
//   padding: 0.75rem 1rem;
//   font-size: 0.875rem;
//   border: 1px solid ${({ hasError }) => (hasError ? "#dc2626" : "#d1d5db")};
//   border-radius: 0.375rem;
//   background-color: white;
//   color: #111827;
//   transition: border-color 0.2s;
//   resize: vertical;
//   min-height: 100px;
//   outline: none;

//   &:focus {
//     border-color: #2563eb;
//     box-shadow: 0 0 0 1px #2563eb;
//   }

//   &::placeholder {
//     color: #9ca3af;
//   }
// `;

// const Label = styled.label`
//   font-size: 0.875rem;
//   font-weight: 500;
//   color: #374151;
//   margin-bottom: 0.25rem;
// `;

// const FormGroup = styled.div`
//   display: flex;
//   flex-direction: column;
//   margin-bottom: 0.5rem;
// `;

// const Register: React.FC = () => {
//   // State Management
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     bio: "",
//   });

//   const [formErrors, setFormErrors] = useState({
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     bio: "",
//   });

//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const { register } = useAuth();
//   const navigate = useNavigate();

//   // Validation Function
//   const validateForm = () => {
//     let isValid = true;
//     const errors = {
//       username: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       bio: "",
//     };

//     if (!formData.username.trim()) {
//       errors.username = "Username is required";
//       isValid = false;
//     } else if (formData.username.length < 3) {
//       errors.username = "Username must be at least 3 characters";
//       isValid = false;
//     } else if (formData.username.length > 20) {
//       errors.username = "Username cannot exceed 20 characters";
//       isValid = false;
//     }

//     if (!formData.email.trim()) {
//       errors.email = "Email is required";
//       isValid = false;
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       errors.email = "Email is invalid";
//       isValid = false;
//     }

//     if (!formData.password) {
//       errors.password = "Password is required";
//       isValid = false;
//     } else if (formData.password.length < 6) {
//       errors.password = "Password must be at least 6 characters";
//       isValid = false;
//     }

//     if (!formData.confirmPassword) {
//       errors.confirmPassword = "Please confirm your password";
//       isValid = false;
//     } else if (formData.password !== formData.confirmPassword) {
//       errors.confirmPassword = "Passwords do not match";
//       isValid = false;
//     }

//     if (formData.bio.length > 200) {
//       errors.bio = "Bio cannot exceed 200 characters";
//       isValid = false;
//     }

//     setFormErrors(errors);
//     return isValid;
//   };

//   // Handlers
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       await register(
//         formData.username,
//         formData.email,
//         formData.password,
//         formData.bio
//       );
//       navigate("/");
//     } catch (error: any) {
//       setError(
//         error.response?.data?.message || "An error occurred during registration"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Container style={{ 
//       background: "#f9fafb", 
//       minHeight: "100vh",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center"
//     }}>
//       <RegisterContainer>
//         <RegisterHeader>Create Account</RegisterHeader>
//         <RegisterSubHeader>
//           Sign up to start creating and sharing blog posts
//         </RegisterSubHeader>

//         {error && <ErrorMessage>{error}</ErrorMessage>}

//         <RegisterForm onSubmit={handleSubmit}>
//           <Input
//             type="text"
//             name="username"
//             label="Username"
//             placeholder="Choose a username"
//             value={formData.username}
//             onChange={handleChange}
//             error={formErrors.username}
//             fullWidth
//             inputStyle={{
//               padding: "0.75rem 1rem",
//               border: "1px solid #d1d5db",
//               borderRadius: "0.375rem",
//               fontSize: "0.875rem"
//             }}
//           />

//           <Input
//             type="email"
//             name="email"
//             label="Email"
//             placeholder="Enter your email"
//             value={formData.email}
//             onChange={handleChange}
//             error={formErrors.email}
//             fullWidth
//             inputStyle={{
//               padding: "0.75rem 1rem",
//               border: "1px solid #d1d5db",
//               borderRadius: "0.375rem",
//               fontSize: "0.875rem"
//             }}
//           />

//           <Input
//             type="password"
//             name="password"
//             label="Password"
//             placeholder="Create a password"
//             value={formData.password}
//             onChange={handleChange}
//             error={formErrors.password}
//             fullWidth
//             inputStyle={{
//               padding: "0.75rem 1rem",
//               border: "1px solid #d1d5db",
//               borderRadius: "0.375rem",
//               fontSize: "0.875rem"
//             }}
//           />

//           <Input
//             type="password"
//             name="confirmPassword"
//             label="Confirm Password"
//             placeholder="Confirm your password"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             error={formErrors.confirmPassword}
//             fullWidth
//             inputStyle={{
//               padding: "0.75rem 1rem",
//               border: "1px solid #d1d5db",
//               borderRadius: "0.375rem",
//               fontSize: "0.875rem"
//             }}
//           />

//           <FormGroup>
//             <Label>Bio (optional)</Label>
//             <TextArea
//               name="bio"
//               placeholder="Tell us something about yourself"
//               value={formData.bio}
//               onChange={handleChange}
//               hasError={!!formErrors.bio}
//             />
//             {formErrors.bio && <ErrorMessage>{formErrors.bio}</ErrorMessage>}
//           </FormGroup>

//           <Button 
//             type="submit" 
//             fullWidth 
//             isLoading={isLoading}
//             style={{
//               background: "#2563eb",
//               color: "white",
//               padding: "0.75rem 1rem",
//               borderRadius: "0.375rem",
//               fontWeight: 500,
//               "&:hover": {
//                 backgroundColor: "#1d4ed8"
//               }
//             }}
//           >
//             Create Account
//           </Button>
//         </RegisterForm>

//         <LoginLink>
//           Already have an account? <Link to="/login">Log In</Link>
//         </LoginLink>
//       </RegisterContainer>
//     </Container>
//   );
// };

// export default Register;