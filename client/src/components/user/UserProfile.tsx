import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import * as api from "../../api";
import { useAuth } from "../../context/AuthContext";
import Button from "../layout/Button";
import PostCard from "../blog/PostCard";
import EditProfileForm from "./EditProfileForm";

const ProfileContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space.xl} 0;
`;

const ProfileHeader = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.xl};
  margin-bottom: ${({ theme }) => theme.space.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const ProfileImageContainer = styled.div`
  flex-shrink: 0;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const Username = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

const Bio = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.space.md};
  white-space: pre-wrap;
  line-height: ${({ theme }) => theme.lineHeights.base};
`;

const PostsContainer = styled.div`
  margin-top: ${({ theme }) => theme.space.xl};
`;

const PostsHeader = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.space.lg};
  padding-bottom: ${({ theme }) => theme.space.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.space.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.space.xl};
`;

const NoPostsMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.space.xl};
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => `${theme.colors.error}20`};
  color: ${({ theme }) => theme.colors.error};
  padding: ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const { user, isAuthenticated } = useAuth();

  // Check if viewing own profile
  const isOwnProfile = isAuthenticated && user?.username === username;

  // Fetch user profile and posts
  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        setLoading(true);

        if (!username) {
          setError("Username is required");
          return;
        }

        // Fetch user profile
        const profileResponse = await api.getUserProfile(username);
        setProfile(profileResponse.data.data);

        // Fetch user posts
        const postsResponse = await api.getUserPosts(username, 1, 6);
        setPosts(postsResponse.data.data);

        // Check if there are more posts to load
        const { pagination } = postsResponse.data;
        setHasMore(pagination.page < pagination.pages);

        setError(null);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load user profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
    setPage(1);
    setIsEditing(false);
  }, [username]);

  // Handle load more posts
  const handleLoadMore = async () => {
    try {
      const nextPage = page + 1;

      const response = await api.getUserPosts(username!, nextPage, 6);

      // Append new posts
      setPosts([...posts, ...response.data.data]);

      // Check if there are more posts to load
      const { pagination } = response.data;
      setHasMore(pagination.page < pagination.pages);

      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more posts:", error);
      alert("Failed to load more posts. Please try again later.");
    }
  };

  // Handle profile update
  const handleProfileUpdate = (updatedProfile: any) => {
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  if (loading) {
    return <LoadingContainer>Loading profile...</LoadingContainer>;
  }

  if (error || !profile) {
    return <ErrorMessage>{error || "User not found"}</ErrorMessage>;
  }

  return (
    <ProfileContainer>
      {isEditing ? (
        <EditProfileForm
          profile={profile}
          onUpdate={handleProfileUpdate}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <ProfileHeader>
            <ProfileImageContainer>
              <ProfileImage
                src={
                  profile.profilePicture || "https://via.placeholder.com/150"
                }
                alt={profile.username}
              />
            </ProfileImageContainer>

            <ProfileInfo>
              <Username>{profile.username}</Username>
              <Bio>{profile.bio || "This user hasn't added a bio yet."}</Bio>

              {isOwnProfile && (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </ProfileInfo>
          </ProfileHeader>

          <PostsContainer>
            <PostsHeader>{profile.username}'s Posts</PostsHeader>

            {posts.length === 0 ? (
              <NoPostsMessage>
                {isOwnProfile
                  ? "You haven't created any posts yet."
                  : `${profile.username} hasn't created any posts yet.`}
              </NoPostsMessage>
            ) : (
              <>
                <PostsGrid>
                  {posts.map((post) => (
                    <PostCard key={post._id} {...post} />
                  ))}
                </PostsGrid>

                {hasMore && (
                  <LoadMoreContainer>
                    <Button variant="outline" onClick={handleLoadMore}>
                      Load More
                    </Button>
                  </LoadMoreContainer>
                )}
              </>
            )}
          </PostsContainer>
        </>
      )}
    </ProfileContainer>
  );
};

export default UserProfile;
