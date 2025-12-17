import api from './api';

const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  registerSelf: async (username, password) => {
    const response = await api.post('/auth/register-self', { username, password });
    return response.data;
  },

  changePassword: async (newPassword) => {
    const response = await api.post('/auth/change-password', { newPassword });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default authService;
