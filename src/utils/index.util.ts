export const generateUsername = (): string => {
  const usernamePrefix = 'user-';
  const randomChars = Math.random().toString(36).slice(2); 
  const username = usernamePrefix + randomChars;
  return username;
};
