export type UserRole = 'buyer' | 'seller' | 'broker' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  favoritePropertyIds: string[];
  createdAt: string;
}
