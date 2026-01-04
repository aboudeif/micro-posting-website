'use client';

import { useState, useEffect } from 'react';
import { apiService } from '@/services/api.service';
import type { User } from '@/types';

interface UsersListProps {
  currentUserId: number;
  selectedUserId: number;
  onSelectUser: (user: User) => void;
}

export function UsersList({
  currentUserId,
  selectedUserId,
  onSelectUser,
}: UsersListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await apiService.getUsers();
        setUsers(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div style={{ color: '#ef4444' }}>{error}</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {users.map((user) => (
        <div
          key={user.id}
          className={`user-item ${user.id === selectedUserId ? 'selected' : ''}`}
          onClick={() => onSelectUser(user)}
        >
          {user.name}
          {user.id === currentUserId && ' (You)'}
        </div>
      ))}
    </div>
  );
}
