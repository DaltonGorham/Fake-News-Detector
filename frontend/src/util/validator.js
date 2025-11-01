export const validateUrl = (url) => {
  if (!url || !url.trim()) {
    throw new Error('URL is required');
  }
  
  if (!url.match(/^https?:\/\/.+/)) {
    throw new Error('URL must start with http:// or https://');
  }
  
  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes('.')) {
      throw new Error('Invalid domain name');
    }
    
    const isLocal = ['localhost', '127.0.0.1', '0.0.0.0'].some(local => 
      urlObj.hostname.includes(local)
    );
    if (isLocal) {
      throw new Error('Cannot analyze local URLs');
    }
    
    return true;
  } catch (err) {
    if (err.message.includes('Invalid URL')) {
      throw new Error('Please enter a valid URL');
    }
    throw err;
  }
};

export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    throw new Error('Email is required');
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Please enter a valid email address');
  }
  
  return true;
};

export const validatePassword = (password) => {
  if (!password) {
    throw new Error('Password is required');
  }
  
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    throw new Error('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    throw new Error('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    throw new Error('Password must contain at least one number');
  }
  
  return true;
};

export const validateUsername = (username) => {
  if (!username || !username.trim()) {
    throw new Error('Username is required');
  }
  
  if (username.length < 3) {
    throw new Error('Username must be at least 3 characters long');
  }
  
  if (username.length > 20) {
    throw new Error('Username must be 20 characters or less');
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    throw new Error('Username can only contain letters, numbers, hyphens, and underscores');
  }
  
  return true;
};

export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: 'No password', color: '#6b7280' };
  
  let strength = 0;
  
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  if (password.length >= 16) strength += 1;
  
  if (/[a-z]/.test(password)) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1; // Special characters
  
  // Calculate percentage
  const percentage = (strength / 7) * 100;
  
  if (percentage < 40) {
    return { strength: percentage, label: 'Weak', color: '#ef4444' };
  } else if (percentage < 70) {
    return { strength: percentage, label: 'Fair', color: '#f59e0b' };
  } else if (percentage < 90) {
    return { strength: percentage, label: 'Good', color: '#3b82f6' };
  } else {
    return { strength: percentage, label: 'Strong', color: '#10b981' };
  }
};

