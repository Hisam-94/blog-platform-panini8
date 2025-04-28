import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import * as api from "../../api";
import Button from "../layout/Button";
import Input from "../layout/Input";

const CreatePostContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space.xl} 0;
`;

const CreatePostForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
`;

const FormTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  margin-bottom: ${({ theme }) => theme.space.lg};
  color: ${({ theme }) => theme.colors.primary};
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

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.space.xs};
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
  min-height: 300px;
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

const TagsInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.xs};
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.background};
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  background-color: ${({ theme }) => `${theme.colors.primary}10`};
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.sm};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const TagInput = styled.input`
  border: none;
  flex: 1;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.fonts.body};

  &:focus {
    outline: none;
  }
`;

const RemoveTag = styled.span`
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.md};
  margin-top: ${({ theme }) => theme.space.lg};
`;

const CreatePost: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
  });

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [formErrors, setFormErrors] = useState({
    title: "",
    content: "",
    tags: "",
    image: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle tag input
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  // Add tag when pressing Enter
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();

      // Check if tag already exists
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }

      setTagInput("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;
    const errors = {
      title: "",
      content: "",
      tags: "",
      image: "",
    };

    // Validate title
    if (!formData.title.trim()) {
      errors.title = "Title is required";
      isValid = false;
    } else if (formData.title.length > 100) {
      errors.title = "Title cannot exceed 100 characters";
      isValid = false;
    }

    // Validate content
    if (!formData.content.trim()) {
      errors.content = "Content is required";
      isValid = false;
    } else if (formData.content.length < 10) {
      errors.content = "Content must be at least 10 characters long";
      isValid = false;
    }

    // Validate tags
    if (tags.length === 0) {
      errors.tags = "At least one tag is required";
      isValid = false;
    }

    // Validate image URL (optional)
    if (formData.image && !isValidURL(formData.image)) {
      errors.image = "Please enter a valid image URL";
      isValid = false;
    }

    setFormErrors(errors);
    console.log("errors", errors);
    console.log("isValid", isValid);
    return isValid;
  };

  // Check if URL is valid
  const isValidURL = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    console.log("formData", formData);
    e.preventDefault();
    
    console.log("tags", tags);
    console.log("image", formData.image);
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const postData = {
        title: formData.title,
        content: formData.content,
        tags,
        image: formData.image || undefined,
      };

      console.log("postData", postData);

      const response = await api.createPost(postData);

      // Navigate to the newly created post
      navigate(`/post/${response.data.data._id}`);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CreatePostContainer>
      <FormTitle>Create a New Post</FormTitle>

      <CreatePostForm onSubmit={handleSubmit}>
        <Input
          type="text"
          name="title"
          label="Title"
          placeholder="Enter a title for your post"
          value={formData.title}
          onChange={handleChange}
          error={formErrors.title}
          fullWidth
        />

        <FormGroup>
          <Label>Content</Label>
          <TextArea
            name="content"
            placeholder="Write your post content here..."
            value={formData.content}
            onChange={handleChange}
            hasError={!!formErrors.content}
          />
          {formErrors.content && (
            <ErrorMessage>{formErrors.content}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label>Tags</Label>
          <TagsInput>
            {tags.map((tag, index) => (
              <Tag key={index}>
                {tag}
                <RemoveTag onClick={() => removeTag(tag)}>×</RemoveTag>
              </Tag>
            ))}
            <TagInput
              type="text"
              placeholder="Add tags (press Enter to add)"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagInputKeyDown}
            />
          </TagsInput>
          {formErrors.tags && <ErrorMessage>{formErrors.tags}</ErrorMessage>}
        </FormGroup>

        <Input
          type="text"
          name="image"
          label="Image URL (optional)"
          placeholder="Enter an image URL for your post"
          value={formData.image}
          onChange={handleChange}
          error={formErrors.image}
          fullWidth
        />

        <ButtonsContainer>
          <Button type="submit" isLoading={isLoading}>
            Publish Post
          </Button>

          <Button type="button" variant="outline" onClick={() => navigate("/")}>
            Cancel
          </Button>
        </ButtonsContainer>
      </CreatePostForm>
    </CreatePostContainer>
  );
};

export default CreatePost;
