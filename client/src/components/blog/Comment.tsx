import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import * as api from "../../api";
import { useAuth } from "../../context/AuthContext";
import Button from "../layout/Button";

interface Author {
  _id: string;
  username: string;
  profilePicture?: string;
}

interface CommentData {
  _id: string;
  content: string;
  author: Author;
  post: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

interface CommentProps {
  comment: CommentData;
  onUpdate: (updatedComment: CommentData) => void;
  onDelete: (commentId: string) => void;
}

const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  background-color: ${({ theme }) => theme.colors.card};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
`;

const AuthorImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const AuthorName = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const CommentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const CommentContent = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.space.sm};
  white-space: pre-wrap;
`;

const CommentActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.sm};
  margin-top: ${({ theme }) => theme.space.sm};
`;

const LikeButton = styled.button<{ isLiked: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme, isLiked }) =>
    isLiked ? theme.colors.accent : theme.colors.text.secondary};
  cursor: pointer;

  svg {
    fill: ${({ isLiked }) => (isLiked ? "currentColor" : "none")};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.space.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  resize: vertical;
  min-height: 80px;
  margin: ${({ theme }) => theme.space.sm} 0;
  font-family: ${({ theme }) => theme.fonts.body};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const EditButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space.sm};
  margin-top: ${({ theme }) => theme.space.sm};
`;

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  // Check if it's today
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  if (isToday) {
    // Show relative time for today
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `Today at ${hours}:${paddedMinutes}`;
  } else {
    // Show date
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
};

const Comment: React.FC<CommentProps> = ({ comment, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isLiked, setIsLiked] = useState(false);

  const { user, isAuthenticated } = useAuth();

  // Check if comment is liked by the user
  React.useEffect(() => {
    if (user && comment.likes.includes(user.id)) {
      setIsLiked(true);
    }
  }, [user, comment.likes]);

  // Handle like/unlike
  const handleLike = async () => {
    if (!isAuthenticated) return;

    try {
      // Optimistically update UI
      setIsLiked(!isLiked);

      // If currently liked, remove user from likes array
      if (isLiked && user) {
        comment.likes = comment.likes.filter((userId) => userId !== user.id);
      }
      // If not liked, add user to likes array
      else if (user) {
        comment.likes = [...comment.likes, user.id];
      }

      // Update in parent component
      onUpdate(comment);

      // Call API
      await api.likeComment(comment._id);
    } catch (error) {
      console.error("Error toggling comment like:", error);

      // Revert optimistic update on error
      setIsLiked(!isLiked);

      // Refetch comment data
      const response = await api.getCommentsByPost(comment.post);
      const updatedComment = response.data.data.find(
        (c: CommentData) => c._id === comment._id
      );

      if (updatedComment) {
        onUpdate(updatedComment);

        if (user && updatedComment.likes.includes(user.id)) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      }
    }
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;

    try {
      const response = await api.updateComment(comment._id, editContent);
      onUpdate(response.data.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("Failed to update comment. Please try again later.");
    }
  };

  // Handle delete
  const handleDeleteComment = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await api.deleteComment(comment._id);
      onDelete(comment._id);
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment. Please try again later.");
    }
  };

  return (
    <CommentContainer>
      <CommentHeader>
        <AuthorInfo>
          <AuthorImage
            src={
              comment.author.profilePicture || "https://via.placeholder.com/32"
            }
            alt={comment.author.username}
          />
          <AuthorName to={`/profile/${comment.author.username}`}>
            {comment.author.username}
          </AuthorName>
        </AuthorInfo>
        <CommentMeta>{formatDate(comment.createdAt)}</CommentMeta>
      </CommentHeader>

      {isEditing ? (
        <>
          <TextArea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <EditButtons>
            <Button
              size="small"
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setEditContent(comment.content);
              }}>
              Cancel
            </Button>
            <Button size="small" onClick={handleSaveEdit}>
              Save
            </Button>
          </EditButtons>
        </>
      ) : (
        <>
          <CommentContent>{comment.content}</CommentContent>

          <CommentActions>
            <LikeButton isLiked={isLiked} onClick={handleLike}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {comment.likes.length > 0 && comment.likes.length}
            </LikeButton>

            {user && comment.author._id === user.id && (
              <>
                <Button
                  size="small"
                  variant="text"
                  onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="text"
                  onClick={handleDeleteComment}>
                  Delete
                </Button>
              </>
            )}
          </CommentActions>
        </>
      )}
    </CommentContainer>
  );
};

export default Comment;
