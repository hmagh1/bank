import api from './api';

const userService = {
  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  getClients: async () => {
    const response = await api.get('/users/clients');
    return response.data;
  },
};

export default userService;
