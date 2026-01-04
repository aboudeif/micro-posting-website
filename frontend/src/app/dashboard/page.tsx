'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/services/api.service';
import { UsersList } from '@/components/UsersList';
import { PostCard } from '@/components/PostCard';
import { PostForm } from '@/components/PostForm';
import { DeleteModal } from '@/components/DeleteModal';
import type { User, Post } from '@/types';

export default function DashboardPage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadPosts = useCallback(async (userId: number): Promise<void> => {
    setPostsLoading(true);
    setPostsError(null);
    try {
      const response = await apiService.getPosts(userId);
      setPosts(response.data);
    } catch (err) {
      setPostsError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setPostsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && !selectedUser) {
      setSelectedUser(user);
    }
  }, [user, selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      loadPosts(selectedUser.id);
    }
  }, [selectedUser, loadPosts]);

  const handleSelectUser = (selected: User): void => {
    setSelectedUser(selected);
  };

  const handleCreatePost = async (content: string): Promise<void> => {
    try {
      await apiService.createPost({ content });
      if (selectedUser && user && selectedUser.id === user.id) {
        loadPosts(user.id);
      } else if (user) {
        setSelectedUser(user);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create post');
    }
  };

  const handleDeleteClick = (postId: number): void => {
    setPostToDelete(postId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (postToDelete === null) return;

    try {
      setIsDeleting(true);
      await apiService.deletePost(postToDelete);
      setDeleteModalOpen(false);
      setPostToDelete(null);
      if (selectedUser) {
        loadPosts(selectedUser.id);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = (): void => {
    setDeleteModalOpen(false);
    setPostToDelete(null);
  };

  if (authLoading) {
    return (
      <div className="container dashboard-container">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isViewingOwnPosts = selectedUser?.id === user.id;
  const postsTitle = isViewingOwnPosts
    ? 'My Posts'
    : `${selectedUser?.name}'s Posts`;

  return (
    <div className="container dashboard-container">
      <nav className="nav">
        <h1 style={{ color: 'var(--primary-color)', margin: 0 }}>
          Micro-Posting
        </h1>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span style={{ fontWeight: 500 }}>{user.name}</span>
          <a href="#" onClick={logout}>
            Logout
          </a>
        </div>
      </nav>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}
      >
        {/* Users List */}
        <div className="card">
          <h2>Users</h2>
          <UsersList
            currentUserId={user.id}
            selectedUserId={selectedUser?.id ?? user.id}
            onSelectUser={handleSelectUser}
          />
        </div>

        {/* Posts Area */}
        <div>
          {/* Create Post - only show when viewing own posts */}
          {isViewingOwnPosts && (
            <div className="card" style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem' }}>Create Post</h2>
              <PostForm onSubmit={handleCreatePost} />
            </div>
          )}

          {/* Posts List */}
          <div className="card">
            <h2>{postsTitle}</h2>
            <div>
              {postsLoading && <div>Loading posts...</div>}
              {postsError && (
                <div style={{ color: '#ef4444' }}>{postsError}</div>
              )}
              {!postsLoading && !postsError && posts.length === 0 && (
                <p style={{ color: 'var(--text-secondary)' }}>No posts yet.</p>
              )}
              {!postsLoading &&
                !postsError &&
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    isOwner={post.userId === user.id}
                    onDelete={handleDeleteClick}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
