export interface User {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  role?: 'admin' | 'vendor' | null;
  status?: 'active' | 'inactive' | 'banned' | null;
  created_at?: string | null;
  updated_at?: string | null;
  user_metadata?: {
    email?: string;
    email_verified?: boolean;
    full_name?: string;
    phone_verified?: boolean;
    role?: string;
    sub?: string;
    name?: string;
    phone?: string;
    avatar_url?: string;
  };
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface LoginResponse {
  data: {
    user: User;
    session: Session;
    role: string;
  };
  error: null | {
    message: string;
    code: string;
  };
}

export type UserRole = 'admin' | 'vendor';