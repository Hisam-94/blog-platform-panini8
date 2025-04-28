import React, { useState } from "react";
import styled from "styled-components";
import * as api from "../../api";
import Button from "../layout/Button";

interface CommentFormProps {
  postId: string;
  onCommentAdded: (comment: any) => void;
}

const FormContainer = styled.form`
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.space.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  resize: vertical;
  min-height: 100px;
  margin-bottom: ${({ theme }) => theme.space.md};
  font-family: ${({ theme }) => theme.fonts.body};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  onCommentAdded,
}) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    setIsLoading(true);

    try {
      const response = await api.createComment({
        content,
        postId,
      });

      // Clear the form
      setContent("");

      // Notify parent component
      onCommentAdded(response.data.data);
    } catch (error) {
      console.error("Error creating comment:", error);
      alert("Failed to post comment. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <TextArea
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <ButtonContainer>
        <Button type="submit" isLoading={isLoading} disabled={!content.trim()}>
          Post Comment
        </Button>
      </ButtonContainer>
    </FormContainer>
  );
};

export default CommentForm;
