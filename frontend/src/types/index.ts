export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: number;
  content: string;
  userId: number;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface CreatePostDto {
  content: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
