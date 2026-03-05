import api from './api';

const productsService = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/products?${queryString}`);
  },

  getById: async (id) => {
    return await api.get(`/products/${id}`);
  },

  getByBarcode: async (barcode) => {
    return await api.get(`/products/barcode/${barcode}`);
  },

  search: async (query) => {
    return await api.get(`/products/search?q=${query}`);
  },

  create: async (productData) => {
    return await api.post('/products', productData);
  },

  update: async (id, productData) => {
    return await api.put(`/products/${id}`, productData);
  },

  delete: async (id) => {
    return await api.delete(`/products/${id}`);
  }
};

export default productsService;