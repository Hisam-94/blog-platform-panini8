import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import * as api from "../../api";
import { useAuth } from "../../context/AuthContext";
import Button from "../layout/Button";
import Comment from "./Comment";
import CommentForm from "./CommentForm";

interface Author {
  _id: string;
  username: string;
  profilePicture?: string;
  bio?: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  author: Author;
  tags: string[];
  likes: string[];
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  _id: string;
  content: string;
  author: Author;
  post: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

const PostDetailContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space.xl} 0;
`;

const PostHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.space.xl};
`;

const PostTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes["4xl"]};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const PostImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radii.lg};
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
`;

const AuthorImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const AuthorName = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const PostInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostDate = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.xs};
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const Tag = styled(Link)`
  background-color: ${({ theme }) => `${theme.colors.primary}10`};
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.sm};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-decoration: none;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

const PostContent = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  line-height: ${({ theme }) => theme.lineHeights.base};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.space.xl};
  white-space: pre-wrap;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.sm};
  margin-bottom: ${({ theme }) => theme.space.xl};
`;

const LikeButton = styled.button<{ isLiked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.xs};
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  border: 1px solid
    ${({ theme, isLiked }) =>
      isLiked ? theme.colors.accent : theme.colors.border};
  background-color: ${({ theme, isLiked }) =>
    isLiked ? `${theme.colors.accent}10` : "transparent"};
  color: ${({ theme, isLiked }) =>
    isLiked ? theme.colors.accent : theme.colors.text.primary};

  svg {
    fill: ${({ isLiked }) => (isLiked ? "currentColor" : "none")};
  }

  &:hover {
    background-color: ${({ theme, isLiked }) =>
      isLiked ? `${theme.colors.accent}20` : theme.colors.card};
  }
`;

const CommentsSection = styled.div`
  margin-top: ${({ theme }) => theme.space.xl};
`;

const CommentsTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  margin-bottom: ${({ theme }) => theme.space.lg};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
  margin-top: ${({ theme }) => theme.space.lg};
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => `${theme.colors.error}20`};
  color: ${({ theme }) => theme.colors.error};
  padding: ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Fetch post and comments
  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setLoading(true);

        if (!id) {
          setError("Post ID is required");
          return;
        }

        // Fetch post
        const postResponse = await api.getPostById(id);
        setPost(postResponse.data.data);

        // Check if post is liked by the user
        if (user && postResponse.data.data.likes.includes(user.id)) {
          setIsLiked(true);
        }

        // Fetch comments
        const commentsResponse = await api.getCommentsByPost(id);
        setComments(commentsResponse.data.data);

        setError(null);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to load post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id, user]);

  // Handle like/unlike
  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      if (!id) return;

      // Optimistically update UI
      setIsLiked(!isLiked);

      // If currently liked, remove user from likes array
      if (isLiked && post && user) {
        setPost({
          ...post,
          likes: post.likes.filter((userId) => userId !== user.id),
        });
      }
      // If not liked, add user to likes array
      else if (post && user) {
        setPost({
          ...post,
          likes: [...post.likes, user.id],
        });
      }

      // Call API
      await api.likePost(id);
    } catch (error) {
      console.error("Error toggling like:", error);

      // Revert optimistic update on error
      setIsLiked(!isLiked);

      // Refetch post to get correct state
      if (id) {
        const response = await api.getPostById(id);
        setPost(response.data.data);

        if (user && response.data.data.likes.includes(user.id)) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      }
    }
  };

  // Handle delete post
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      if (!id) return;

      await api.deletePost(id);
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again later.");
    }
  };

  // Add new comment
  const handleAddComment = (newComment: Comment) => {
    setComments([newComment, ...comments]);
  };

  // Update comment
  const handleUpdateComment = (updatedComment: Comment) => {
    setComments(
      comments.map((comment) =>
        comment._id === updatedComment._id ? updatedComment : comment
      )
    );
  };

  // Delete comment
  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter((comment) => comment._id !== commentId));
  };

  if (loading) {
    return <LoadingContainer>Loading post...</LoadingContainer>;
  }

  if (error || !post) {
    return <ErrorMessage>{error || "Post not found"}</ErrorMessage>;
  }

  return (
    <PostDetailContainer>
      <PostHeader>
        <PostTitle>{post.title}</PostTitle>

        <PostMeta>
          <AuthorInfo>
            <AuthorImage
              src={
                post.author.profilePicture || "https://via.placeholder.com/40"
              }
              alt={post.author.username}
            />
            <PostInfo>
              <AuthorName to={`/profile/${post.author.username}`}>
                {post.author.username}
              </AuthorName>
              <PostDate>Published on {formatDate(post.createdAt)}</PostDate>
            </PostInfo>
          </AuthorInfo>
        </PostMeta>

        <TagsContainer>
          {post.tags.map((tag, index) => (
            <Tag key={index} to={`/?tag=${tag}`}>
              {tag}
            </Tag>
          ))}
        </TagsContainer>
      </PostHeader>

      {post.image && <PostImage src={post.image} alt={post.title} />}

      <PostContent>{post.content}</PostContent>

      <ActionsContainer>
        <LikeButton isLiked={isLiked} onClick={handleLike}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          {post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}
        </LikeButton>

        {user && post.author._id === user.id && (
          <>
            <Button
              variant="outline"
              onClick={() => navigate(`/edit/${post._id}`)}>
              Edit
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </>
        )}
      </ActionsContainer>

      <CommentsSection>
        <CommentsTitle>Comments ({comments.length})</CommentsTitle>

        {isAuthenticated ? (
          <CommentForm postId={post._id} onCommentAdded={handleAddComment} />
        ) : (
          <p>
            <Link to="/login">Log in</Link> to leave a comment.
          </p>
        )}

        <CommentsList>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
            />
          ))}

          {comments.length === 0 && (
            <p>No comments yet. Be the first to comment!</p>
          )}
        </CommentsList>
      </CommentsSection>
    </PostDetailContainer>
  );
};

export default PostDetail;
