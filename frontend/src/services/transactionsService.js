import api from './api';

const transactionsService = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/transactions?${queryString}`);
  },

  getById: async (id) => {
    return await api.get(`/transactions/${id}`);
  },

  getDailySummary: async (date) => {
    return await api.get(`/transactions/daily-summary?date=${date}`);
  },

  create: async (transactionData) => {
    return await api.post('/transactions', transactionData);
  },

  refund: async (id) => {
    return await api.post(`/transactions/${id}/refund`);
  }
};

export default transactionsService;