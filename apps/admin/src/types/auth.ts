export interface User {
  id: string;
  email: string;
  role?: 'admin' | 'vendor';
  created_at?: string;
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