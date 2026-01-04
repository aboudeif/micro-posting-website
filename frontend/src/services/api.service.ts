import type {
  User,
  Post,
  LoginResponse,
  ApiResponse,
  LoginCredentials,
  CreatePostDto,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

interface ErrorResponse {
  message?: string | string[] | { message?: string | string[] };
}

function getHeaders(): HeadersInit {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
}

async function request<T>(
  endpoint: string,
  method: string = 'GET',
  body: unknown = null,
): Promise<T> {
  const config: RequestInit = {
    method,
    headers: getHeaders(),
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data: T | ErrorResponse = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    }

    const errorData = data as ErrorResponse;
    let errorMessage: string = 'Something went wrong';

    if (errorData.message) {
      if (Array.isArray(errorData.message)) {
        errorMessage = errorData.message.join(', ');
      } else if (typeof errorData.message === 'object') {
        const nestedMessage = errorData.message as { message?: string | string[] };
        if (nestedMessage.message && Array.isArray(nestedMessage.message)) {
          errorMessage = nestedMessage.message.join(', ');
        } else if (typeof nestedMessage.message === 'string') {
          errorMessage = nestedMessage.message;
        } else {
          errorMessage = JSON.stringify(errorData.message);
        }
      } else {
        errorMessage = errorData.message;
      }
    }

    throw new ApiError(errorMessage, response.status);
  }

  return data as T;
}

export const apiService = {
  async login(
    credentials: LoginCredentials,
  ): Promise<ApiResponse<LoginResponse>> {
    const response = await request<ApiResponse<LoginResponse>>(
      '/auth/login',
      'POST',
      credentials,
    );
    if (response.data && response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  async getPosts(userId?: number): Promise<ApiResponse<Post[]>> {
    const query = userId ? `?userId=${userId}` : '';
    return request<ApiResponse<Post[]>>(`/posts${query}`, 'GET');
  },

  async createPost(data: CreatePostDto): Promise<ApiResponse<Post>> {
    return request<ApiResponse<Post>>('/posts', 'POST', data);
  },

  async deletePost(id: number): Promise<ApiResponse<void>> {
    return request<ApiResponse<void>>(`/posts/${id}`, 'DELETE');
  },

  async getUsers(): Promise<ApiResponse<User[]>> {
    return request<ApiResponse<User[]>>('/users', 'GET');
  },

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? (JSON.parse(userStr) as User) : null;
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  },

  isAuthenticated(): boolean {
    return !!apiService.getToken();
  },
};
