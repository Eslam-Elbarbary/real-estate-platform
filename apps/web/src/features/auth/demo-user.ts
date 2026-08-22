import type { AuthUser } from './types';

/** Fictional demo account only — never use real personal data from references. */
export const DEMO_USER: AuthUser = {
  id: 'demo-user-1',
  name: 'مستخدم تجريبي',
  email: 'demo@example.test',
  phone: '01000000000',
  memberSinceLabel: 'عضو منذ يناير 2024',
  phoneVerified: true,
  displayRoleLabel: 'مالك عقار',
};
