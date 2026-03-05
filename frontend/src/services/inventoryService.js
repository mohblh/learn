import api from './api';

const inventoryService = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/inventory?${queryString}`);
  },

  getLowStock: async () => {
    return await api.get('/inventory/low-stock');
  },

  updateStock: async (id, quantity, type) => {
    return await api.put(`/inventory/${id}/stock`, { quantity, type });
  },

  transfer: async (transferData) => {
    return await api.post('/inventory/transfer', transferData);
  }
};

export default inventoryService;