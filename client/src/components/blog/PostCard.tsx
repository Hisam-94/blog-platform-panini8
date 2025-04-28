import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";

interface Author {
  _id: string;
  username: string;
  profilePicture?: string;
}

interface PostProps {
  post: {
    _id: string;
    title: string;
    content: string;
    author: Author;
    createdAt: string;
    tags?: string[];
    likes: string[];
    image?: string;
  };
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.fast};
  height: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const PostImage = styled.div<{ backgroundImage?: string }>`
  width: 100%;
  height: 200px;
  background-image: ${({ backgroundImage }) =>
    backgroundImage
      ? `url(${backgroundImage})`
      : `${({ theme }:any) => theme.colors.gradient.blue}`};
  background-size: cover;
  background-position: center;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
  }
`;

const CardContent = styled.div`
  padding: ${({ theme }) => theme.space.lg};
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const PostTitle = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.space.sm};
  display: block;
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.gradient.blue};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const PostExcerpt = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.space.md};
  line-height: ${({ theme }) => theme.lineHeights.base};
  flex-grow: 1;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.xs};
  margin-bottom: ${({ theme }) => theme.space.md};
  position: absolute;
  top: ${({ theme }) => theme.space.md};
  left: ${({ theme }) => theme.space.md};
  z-index: 1;
`;

const Tag = styled(Link)`
  background-color: rgba(255, 255, 255, 0.9);
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.sm};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-decoration: none;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.gradient.blue};
    color: white;
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.space.md};
  padding-top: ${({ theme }) => theme.space.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const AuthorInfo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => theme.colors.text.primary};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const AuthorImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.colors.background};
  box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primary};
`;

const LikesCount = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};

  svg {
    color: ${({ theme }) => theme.colors.accent};
    transition: transform ${({ theme }) => theme.transitions.fast};

    &:hover {
      transform: scale(1.2);
    }
  }
`;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Function to truncate text
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

const PostCard: React.FC<PostProps> = ({ post }) => {
  const { _id, title, content, author, createdAt, tags, likes, image } = post;

  const { user } = useAuth();
  const isLiked = user ? likes.includes(user.id) : false;

  return (
    <Card>
      <PostImage backgroundImage={image}>
        <TagsContainer>
          {tags?.map((tag, index) => (
            <Tag key={index} to={`/?tag=${tag}`}>
              {tag}
            </Tag>
          ))}
        </TagsContainer>
      </PostImage>
      <CardContent>
        <PostTitle to={`/post/${_id}`}>{title}</PostTitle>

        <PostExcerpt>{truncateText(content, 150)}</PostExcerpt>

        <PostMeta>
          <AuthorInfo to={`/profile/${author.username}`}>
            <AuthorImage
              src={author.profilePicture || "https://via.placeholder.com/32"}
              alt={author.username}
            />
            {author.username}
          </AuthorInfo>

          <div>
            <LikesCount>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {likes.length}
            </LikesCount>
          </div>

          <div>{formatDate(createdAt)}</div>
        </PostMeta>
      </CardContent>
    </Card>
  );
};

export default PostCard;
