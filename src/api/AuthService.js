import api from "./settings";

export function useAuthService() {
  const login = async (username, password) => {
    try {
      const response = await api.post('/login', { name: username, password });
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
  };

  const getCurrentUser = () => {
    const userString = localStorage.getItem('user');
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  };

  const isAuthenticated = () => {
    const user = getCurrentUser();
    return user && user.token;
  };

  return {
    login,
    logout,
    getCurrentUser,
    isAuthenticated
  };
}
