import api from './authService';

export const studentService = {
  getAll: async () => {
    const response = await api.get('/students');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  search: async (query) => {
    const response = await api.get('/students/search', { params: { query } });
    return response.data;
  },

  create: async (student) => {
    const response = await api.post('/students', student);
    return response.data;
  },

  update: async (id, student) => {
    const response = await api.put(`/students/${id}`, student);
    return response.data;
  },

  remove: async (id) => {
    await api.delete(`/students/${id}`);
  },

  getCount: async () => {
    const response = await api.get('/students/count');
    return response.data.total;
  },
};
