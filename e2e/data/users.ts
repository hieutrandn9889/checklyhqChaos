export const users = {
  valid: {
    username: process.env.USERNAME || '',
    password: process.env.PASSWORD || '',
  },
  invalid: {
    username: 'invalid_user',
    password: 'invalid_pass',
  },
};
