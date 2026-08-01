import api from './authService';

export const examSlotService = {
  getAll: async () => {
    const response = await api.get('/exam-slots');
    return response.data;
  },

  create: async (slot) => {
    const response = await api.post('/exam-slots', slot);
    return response.data;
  },

  update: async (id, slot) => {
    const response = await api.put(`/exam-slots/${id}`, slot);
    return response.data;
  },

  remove: async (id) => {
    await api.delete(`/exam-slots/${id}`);
  },

  getCount: async () => {
    const response = await api.get('/exam-slots/count');
    return response.data.total;
  },
};
