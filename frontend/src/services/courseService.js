import api from './authService';

export const courseService = {
  getAll: async () => {
    const response = await api.get('/courses');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  create: async (course) => {
    const response = await api.post('/courses', course);
    return response.data;
  },

  update: async (id, course) => {
    const response = await api.put(`/courses/${id}`, course);
    return response.data;
  },

  remove: async (id) => {
    await api.delete(`/courses/${id}`);
  },

  getCount: async () => {
    const response = await api.get('/courses/count');
    return response.data.total;
  },
};
