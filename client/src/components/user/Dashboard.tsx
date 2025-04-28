import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { getUserPosts, deletePost } from "../../api";
import PostCard from "../blog/PostCard";
import Button from "../layout/Button";
import { Link, useNavigate } from "react-router-dom";

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space.xl};
`;

const DashboardHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.space.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const DashboardSection = styled.div`
  margin-bottom: ${({ theme }) => theme.space.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.space.lg};
  padding-bottom: ${({ theme }) => theme.space.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.space.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.md};
  margin-top: ${({ theme }) => theme.space.md};
`;

const NoPostsMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  padding: ${({ theme }) => theme.space.xl};
`;

const LoadingMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  padding: ${({ theme }) => theme.space.xl};
`;

const ErrorMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  padding: ${({ theme }) => theme.space.xl};
`;

const ProfileActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.md};
  margin-top: ${({ theme }) => theme.space.lg};
`;

interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  likes: string[];
  comments: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  console.log("user", user);
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await getUserPosts(user.id);
        setPosts(response as any);
        setError(null);
      } catch (err) {
        console.error("Error fetching user posts:", err);
        setError("Failed to load your posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user]);

  const handleDeletePost = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(postId);
        setPosts(posts.filter((post) => post._id !== postId));
      } catch (err) {
        console.error("Error deleting post:", err);
        alert("Failed to delete post. Please try again later.");
      }
    }
  };

  const navigateToProfile = () => {
    if (user) {
      navigate(`/profile/${user.username}`);
    }
  };

  if (!user) {
    return <ErrorMessage>Please log in to view your dashboard.</ErrorMessage>;
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <Title>Dashboard</Title>
        <Subtitle>Manage your blog posts and account settings</Subtitle>

        <ProfileActions>
          <Button onClick={navigateToProfile}>View Public Profile</Button>
          <Button variant="primary" as={Link} to="/create">
            Create New Post
          </Button>
        </ProfileActions>
      </DashboardHeader>

      <DashboardSection>
        <SectionTitle>Your Posts</SectionTitle>

        {loading ? (
          <LoadingMessage>Loading your posts...</LoadingMessage>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : posts.length === 0 ? (
          <NoPostsMessage>
            You haven't created any posts yet.
            <br />
            <Button
              variant="primary"
              as={Link}
              to="/create"
              style={{ marginTop: "20px" }}>
              Create Your First Post
            </Button>
          </NoPostsMessage>
        ) : (
          <PostsGrid>
            {posts.map((post) => (
              <div key={post._id}>
                <PostCard post={post} />
                <ActionButtons>
                  <Button
                    as={Link}
                    to={`/edit/${post._id}`}
                    variant="outline"
                    fullWidth>
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeletePost(post._id)}
                    variant="danger"
                    fullWidth>
                    Delete
                  </Button>
                </ActionButtons>
              </div>
            ))}
          </PostsGrid>
        )}
      </DashboardSection>
    </DashboardContainer>
  );
};

export default Dashboard;
