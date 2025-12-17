import api from './api';

const agentService = {
  createClient: async (clientData) => {
    const response = await api.post('/auth/create-client', clientData);
    return response.data;
  },

  getClients: async () => {
    const response = await api.get('/users/clients');
    return response.data;
  },
};

export default agentService;
