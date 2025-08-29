export const generateUsername = (): string => {
  const usernamePrefix = 'user-';
  const randomChars = Math.random().toString(36).slice(2);
  return usernamePrefix + randomChars;
};
