export const validateEmail = (email) => {
  if (!email) throw new Error('Email is required');
  return true;
};

export const validatePassword = (password) => {
  if (!password) throw new Error('Password is required');
  return true;
};

export const validateUsername = (username) => {
  if (!username) throw new Error('Username is required');
  return true;
};
