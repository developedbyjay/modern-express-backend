export const generateUsername = (): string => {
  const usernamePrefix = 'user-';
  const randomChars = Math.random().toString(36).slice(2);
  return usernamePrefix + randomChars;
};

export const generateSlug = (title: string): string => {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!slug) {
    return `blog-${Math.random().toString(36).slice(2)}`;
  }

  const randomChars = Math.random().toString(36).slice(2, 8);
  return `${slug}-${randomChars}`;
};

export const generateTTL = (tokenExp: number) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const secondsToExpire = tokenExp - currentTime;
  return secondsToExpire > 0 ? secondsToExpire : 0;
};

export const generateRedisKey = (userId: string) => {
  return 'user-' + userId;
};