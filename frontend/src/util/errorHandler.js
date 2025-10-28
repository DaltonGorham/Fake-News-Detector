const ensureString = (value) => {
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    if (value.message) return ensureString(value.message);
    if (value.error) return ensureString(value.error);
    if (value.detail) return ensureString(value.detail);
    try {
      return JSON.stringify(value);
    } catch {
      return 'An error occurred';
    }
  }
  return String(value);
};

export const getErrorMessage = (statusCode, defaultMessage = 'Something went wrong') => {
  const errorMessages = {
    400: 'Invalid request. Please check your input and try again.',
    401: 'You need to be logged in to perform this action.',
    403: 'You don\'t have permission to access this resource.',
    404: 'The requested resource was not found.',
    408: 'Request timeout. Please try again.',
    409: 'Article has already been analyzed',
    422: 'The data provided is invalid or incomplete.',
    429: 'Too many requests. Please slow down and try again later.',
    500: 'Server error. Our team has been notified.',
    502: 'Unable to connect to the server. Please try again.',
    503: 'Service temporarily unavailable. Please try again in a moment.',
    504: 'Request timeout. The server took too long to respond.',
  };

  return errorMessages[statusCode] || defaultMessage;
};

export const parseApiError = async (response) => {
  try {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      
      const serverMessage = errorData.message 
        || errorData.error 
        || errorData.detail 
        || errorData.msg;
      
      if (serverMessage) {
        return ensureString(serverMessage);
      }
    }
  } catch (e) {
    console.warn('Failed to parse error response:', e);
  }
  return getErrorMessage(response.status);
};

export const handleNetworkError = (error) => {
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }
  
  if (error.message.includes('timeout')) {
    return 'Request timeout. Please try again.';
  }
  
  return 'Network error. Please check your connection and try again.';
};
