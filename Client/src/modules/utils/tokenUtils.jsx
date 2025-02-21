// utils/tokenUtils.js

export const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expiryTime;
    } catch (error) {
      return true;
    }
  };
  
  export const handleApiResponse = (response, navigate) => {
    if (response.status === 401) {
      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Redirect to login
      navigate('/');
      throw new Error('Session expired. Please login again.');
    }
    return response;
  };
  
  export const apiRequest = async (url, options = {}, navigate) => {
    const token = localStorage.getItem('authToken');
    
    if (isTokenExpired(token)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      navigate('/');
      throw new Error('Session expired. Please login again.');
    }
  
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  
    return handleApiResponse(response, navigate);
  };