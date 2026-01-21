const API_BASE_URL = process.env.REACT_APP_REMOTE_SERVER;

export const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAxiosConfig = (method, endpoint, data = null, additionalHeaders = {}) => {
  const config = {
    method,
    url: `${API_BASE_URL}${endpoint}`,
    headers: {
      ...getAuthHeaders(),
      ...additionalHeaders
    }
  };

  if (data) {
    config.data = data;
  }

  return config;
};

export const isAuthenticated = () => {
  return !!sessionStorage.getItem('token');
};

export const getToken = () => {
  return sessionStorage.getItem('token');
};

export const setToken = (token) => {
  sessionStorage.setItem('token', token);
};

export const removeToken = () => {
  sessionStorage.removeItem('token');
};
