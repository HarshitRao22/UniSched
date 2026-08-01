import api from './authService';

export const facultyService = {
  getAll: async () => {
    const response = await api.get('/faculties');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/faculties/${id}`);
    return response.data;
  },

  create: async (faculty) => {
    const response = await api.post('/faculties', faculty);
    return response.data;
  },

  update: async (id, faculty) => {
    const response = await api.put(`/faculties/${id}`, faculty);
    return response.data;
  },

  remove: async (id) => {
    await api.delete(`/faculties/${id}`);
  },

  getCount: async () => {
    const response = await api.get('/faculties/count');
    return response.data.total;
  },
};
