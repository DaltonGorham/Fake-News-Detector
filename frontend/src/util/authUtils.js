export const getRedirectURL = () => {
  let url =
    import.meta.env.VITE_SITE_URL ??
    import.meta.env.VITE_VERCEL_URL ??
    'http://localhost:5173/'
  
  url = url.startsWith('http') ? url : `https://${url}`
  url = url.endsWith('/') ? url : `${url}/`
  return url
}

export const formatAuthError = (error) => {
  return error?.message || 'An unexpected error occurred'
}