import api from './authService';

export const schedulingService = {
  generate: async () => {
    const response = await api.post('/schedule/generate');
    return response.data;
  },

  getSchedule: async () => {
    const response = await api.get('/schedule');
    return response.data;
  },

  clear: async () => {
    await api.delete('/schedule');
  },

  getCount: async () => {
    const response = await api.get('/schedule/count');
    return response.data.total;
  },

  downloadPdf: async () => {
    const response = await api.get('/schedule/export/pdf', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'exam-timetable.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  updateScheduledExam: async (id, roomId, examSlotId) => {
    const response = await api.put(`/schedule/${id}`, { roomId, examSlotId });
    return response.data;
  },
};
