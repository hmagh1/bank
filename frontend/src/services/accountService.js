import api from './api';

const accountService = {
  deposit: async (accountNumber, amount) => {
    const response = await api.post('/accounts/deposit', { accountNumber, amount });
    return response.data;
  },

  withdraw: async (accountNumber, amount) => {
    const response = await api.post('/accounts/withdraw', { accountNumber, amount });
    return response.data;
  },

  transfer: async (fromAccount, toAccount, amount) => {
    const response = await api.post('/accounts/transfer', { fromAccount, toAccount, amount });
    return response.data;
  },

  getOperations: async (accountNumber, page = 0, size = 10) => {
    const response = await api.get(`/accounts/${accountNumber}/operations`, {
      params: { page, size },
    });
    return response.data;
  },

  blockAccount: async (accountNumber) => {
    const response = await api.patch(`/accounts/${accountNumber}/block`);
    return response.data;
  },

  unblockAccount: async (accountNumber) => {
    const response = await api.patch(`/accounts/${accountNumber}/unblock`);
    return response.data;
  },

  closeAccount: async (accountNumber) => {
    const response = await api.patch(`/accounts/${accountNumber}/close`);
    return response.data;
  },
};

export default accountService;
