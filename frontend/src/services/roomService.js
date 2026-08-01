import api from './authService';

export const roomService = {
  getAll: async () => {
    const response = await api.get('/rooms');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },

  create: async (room) => {
    const response = await api.post('/rooms', room);
    return response.data;
  },

  update: async (id, room) => {
    const response = await api.put(`/rooms/${id}`, room);
    return response.data;
  },

  remove: async (id) => {
    await api.delete(`/rooms/${id}`);
  },

  getCount: async () => {
    const response = await api.get('/rooms/count');
    return response.data.total;
  },
};
