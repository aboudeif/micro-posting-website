'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/api.service';
import type { User } from '@/types';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

export function useAuth(requireAuth: boolean = true): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = apiService.getToken();
    const storedUser = apiService.getStoredUser();

    if (requireAuth && (!token || !storedUser)) {
      router.push('/');
      return;
    }

    if (storedUser) {
      setUser(storedUser);
    }

    setIsLoading(false);
  }, [requireAuth, router]);

  const logout = (): void => {
    apiService.logout();
    router.push('/');
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}
