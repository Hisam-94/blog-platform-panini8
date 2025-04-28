import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import * as api from "../../api";
import PostCard from "./PostCard";
import Button from "../layout/Button";
import Container from "../layout/Container";

const HomePageContainer = styled.div`
  padding: ${({ theme }) => theme.space.xl} 0;
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.space.xl};
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes["4xl"]};
  background: ${({ theme }) => theme.colors.gradient.blue};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: ${({ theme }) => theme.space.md};
  position: relative;
  display: inline-block;

  &::after {
    content: "";
    position: absolute;
    width: 60px;
    height: 4px;
    background: ${({ theme }) => theme.colors.gradient.blue};
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: ${({ theme }) => theme.radii.full};
  }
`;

const PageDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 800px;
  margin: 0 auto;
  margin-top: ${({ theme }) => theme.space.lg};
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.sm};
  margin-bottom: ${({ theme }) => theme.space.xl};
  padding: ${({ theme }) => theme.space.lg};
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii.lg};
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const FilterButton = styled(Button)<{ isActive?: boolean }>`
  background: ${({ theme, isActive }) =>
    isActive ? theme.colors.gradient.blue : "transparent"};
  color: ${({ theme, isActive }) =>
    isActive ? "white" : theme.colors.text.primary};
  border: 1px solid
    ${({ theme, isActive }) => (isActive ? "transparent" : theme.colors.border)};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
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
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

// Popular tags - in a real app, this might come from an API
const popularTags = [
  "Technology",
  "Design",
  "Programming",
  "Travel",
  "Food",
  "Lifestyle",
];

const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Get the current tag from the URL, if any
  const currentTag = searchParams.get("tag") || "";

  // Fetch posts
  const fetchPosts = async (pageNum: number = 1, tag: string = "") => {
    try {
      setLoading(true);
      const response = await api.getPosts(pageNum, 6, tag);

      const { data, pagination } = response.data;

      if (pageNum === 1) {
        // If it's the first page, replace all posts
        setPosts(data);
      } else {
        // Otherwise, append new posts
        setPosts((prevPosts) => [...prevPosts, ...data]);
      }

      // Check if there are more posts to load
      setHasMore(pagination.page < pagination.pages);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Load posts when component mounts or when tag changes
  useEffect(() => {
    setPage(1);
    fetchPosts(1, currentTag);
  }, [currentTag]);

  // Handle tag filter click
  const handleTagFilter = (tag: string) => {
    if (tag === currentTag) {
      // If clicking the current tag, remove the filter
      searchParams.delete("tag");
    } else {
      // Otherwise, set the tag filter
      searchParams.set("tag", tag);
    }

    setSearchParams(searchParams);
  };

  // Handle load more click
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, currentTag);
  };

  return (
    <HomePageContainer>
      <Container maxWidth="1200px">
        <PageHeader>
          <PageTitle>Discover Stories and Ideas</PageTitle>
          <PageDescription>
            Explore articles and stories on various topics from our community of
            writers.
          </PageDescription>
        </PageHeader>

        <FilterContainer>
          <FilterButton
            variant="outline"
            size="small"
            isActive={!currentTag}
            onClick={() => handleTagFilter("")}>
            All
          </FilterButton>

          {popularTags.map((tag) => (
            <FilterButton
              key={tag}
              variant="outline"
              size="small"
              isActive={currentTag === tag}
              onClick={() => handleTagFilter(tag)}>
              {tag}
            </FilterButton>
          ))}
        </FilterContainer>

        {error && <NoPostsMessage>{error}</NoPostsMessage>}

        {!loading && posts.length === 0 && !error && (
          <NoPostsMessage>
            No posts found{currentTag ? ` with tag "${currentTag}"` : ""}.
          </NoPostsMessage>
        )}

        <PostsGrid>
          {posts.map((post) => (
            <PostCard key={post._id} {...post} />
          ))}
        </PostsGrid>

        {hasMore && (
          <LoadMoreContainer>
            <Button
              variant="gradient-orange"
              onClick={handleLoadMore}
              isLoading={loading}>
              Load More
            </Button>
          </LoadMoreContainer>
        )}
      </Container>
    </HomePageContainer>
  );
};

export default HomePage;
