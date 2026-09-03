/** Role code format: uppercase letters, digits, underscores. */
export const ROLE_CODE_PATTERN = /^[A-Z0-9_]+$/;

export function isValidRoleCodeFormat(code: string): boolean {
  return ROLE_CODE_PATTERN.test(code);
}
