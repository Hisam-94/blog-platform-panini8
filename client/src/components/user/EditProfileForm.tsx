import React, { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import Button from "../layout/Button";
import Input from "../layout/Input";

interface EditProfileFormProps {
  profile: {
    bio?: string;
    profilePicture?: string;
  };
  onUpdate: (updatedProfile: Record<string, unknown>) => void;
  onCancel: () => void;
}

const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
`;

const FormTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TextArea = styled.textarea<{ hasError?: boolean }>`
  padding: ${({ theme }) => theme.space.md};
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
  font-family: ${({ theme }) => theme.fonts.body};

  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) =>
      hasError ? theme.colors.error : theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.space.xs};
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space.md};
  margin-top: ${({ theme }) => theme.space.lg};
`;

const ProfileImagePreview = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
  margin-top: ${({ theme }) => theme.space.sm};
`;

const PreviewImage = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
`;

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  profile,
  onUpdate,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    bio: profile.bio || "",
    profilePicture: profile.profilePicture || "",
  });

  const [formErrors, setFormErrors] = useState({
    bio: "",
    profilePicture: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const { updateProfile } = useAuth();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      bio: "",
      profilePicture: "",
    };

    // Validate bio
    if (formData.bio && formData.bio.length > 200) {
      errors.bio = "Bio cannot exceed 200 characters";
      isValid = false;
    }

    // Validate profile picture URL (optional)
    if (formData.profilePicture && !isValidURL(formData.profilePicture)) {
      errors.profilePicture = "Please enter a valid image URL";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const isValidURL = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Update profile in the auth context
      await updateProfile(formData.bio, formData.profilePicture);

      // Call the onUpdate callback
      onUpdate({
        ...profile,
        bio: formData.bio,
        profilePicture: formData.profilePicture,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle>Edit Profile</FormTitle>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Bio</Label>
          <TextArea
            name="bio"
            placeholder="Tell us about yourself"
            value={formData.bio}
            onChange={handleChange}
            hasError={!!formErrors.bio}
          />
          {formErrors.bio && <ErrorMessage>{formErrors.bio}</ErrorMessage>}
          <small>{formData.bio.length}/200 characters</small>
        </FormGroup>

        <FormGroup>
          <Input
            type="text"
            name="profilePicture"
            label="Profile Picture URL"
            placeholder="Enter image URL for your profile picture"
            value={formData.profilePicture}
            onChange={handleChange}
            error={formErrors.profilePicture}
            fullWidth
          />

          {formData.profilePicture && (
            <ProfileImagePreview>
              <PreviewImage
                src={
                  formData.profilePicture || "https://via.placeholder.com/64"
                }
                alt="Profile Preview"
              />
              <span>Preview</span>
            </ProfileImagePreview>
          )}
        </FormGroup>

        <ButtonsContainer>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Save Changes
          </Button>
        </ButtonsContainer>
      </Form>
    </FormContainer>
  );
};

export default EditProfileForm;
