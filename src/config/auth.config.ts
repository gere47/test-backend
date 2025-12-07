export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-key-minimum-32-characters-long',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
});