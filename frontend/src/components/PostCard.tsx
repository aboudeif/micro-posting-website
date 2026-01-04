'use client';

import { useState, useRef, useEffect } from 'react';
import type { Post } from '@/types';

function timeAgo(date: string): string {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000,
  );

  let interval = seconds / 31536000;
  if (interval > 1) {
    const years = Math.floor(interval);
    return years === 1 ? '1 year ago' : `${years} years ago`;
  }

  interval = seconds / 2592000;
  if (interval > 1) {
    const months = Math.floor(interval);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }

  interval = seconds / 86400;
  if (interval > 1) {
    const days = Math.floor(interval);
    return days === 1 ? '1 day ago' : `${days} days ago`;
  }

  interval = seconds / 3600;
  if (interval > 1) {
    const hours = Math.floor(interval);
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  }

  interval = seconds / 60;
  if (interval > 1) {
    const minutes = Math.floor(interval);
    return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  }

  return 'Just now';
}

interface PostCardProps {
  post: Post;
  isOwner: boolean;
  onDelete: (id: number) => void;
}

export function PostCard({ post, isOwner, onDelete }: PostCardProps) {
  const [isClamped, setIsClamped] = useState(true);
  const [showToggle, setShowToggle] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const isOverflowing =
        contentRef.current.scrollHeight > contentRef.current.clientHeight;
      setShowToggle(isOverflowing);
    }
  }, [post.content]);

  const toggleClamp = (): void => {
    setIsClamped(!isClamped);
  };

  return (
    <div className="post">
      <div className="post-header">
        <span>{timeAgo(post.createdAt)}</span>
        {isOwner && (
          <button className="delete-btn" onClick={() => onDelete(post.id)}>
            Delete
          </button>
        )}
      </div>
      <div
        ref={contentRef}
        className={`post-content ${isClamped ? 'clamped' : ''}`}
      >
        {post.content}
      </div>
      {showToggle && (
        <button className="show-more-btn" onClick={toggleClamp}>
          {isClamped ? 'Show more' : 'Show less'}
        </button>
      )}
    </div>
  );
}
