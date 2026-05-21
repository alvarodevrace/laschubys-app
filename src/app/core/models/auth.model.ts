export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: 'admin' | 'user';
}

export interface AuthMeResponse {
  user: AuthUser | null;
}
