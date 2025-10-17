import { apiClient } from './client';

// i think maybe this will eventually be someting like apiClient('/api/users/profile') or something
// and let the caller decide which part of the profile to update or get
export const userApi = {
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient('/api/users/avatar', {
      method: 'POST',
      body: formData,
      headers: {}
    });
  }
};