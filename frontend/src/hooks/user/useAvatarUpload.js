import { useState } from 'react';
import { userApi } from '../../api/user';

export function useAvatarUpload(onSuccess) {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  const uploadAvatar = async (file) => {
    if (!file) return;

    setIsUploading(true);
    setMessage('');

    try {
      const { data, error } = await userApi.uploadAvatar(file);

      if (error) throw new Error(error);
      
      await onSuccess?.();
      setIsUploading(false);
      setMessage('Avatar uploaded successfully');
    } catch (err) {
      setIsUploading(false);
      setMessage(`Failed to upload avatar: ${err.message}`);
    }
  };

  return {
    isUploading,
    message,
    uploadAvatar,
  };
}
