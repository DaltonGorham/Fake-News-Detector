import { useState } from 'react';
import { userApi } from '../../api/user';
import { validateUsername } from '../../util/validator';

export function useUsernameEdit(currentUsername, onSuccess) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const startEdit = () => {
    setIsEditing(true);
    setValue(currentUsername || '');
    setError('');
    setSuccess('');
    setIsLoading(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setValue('');
    setError('');
    setSuccess('');
    setIsLoading(false);
  };

  const saveUsername = async () => {
    if (!value.trim()) {
      setError('Username cannot be empty');
      return;
    }

    try {
      validateUsername(value.trim());
    } catch (err) {
      setError(err.message);
      return;
    }

    if (value.trim() === currentUsername) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error: apiError } = await userApi.updateProfile({ username: value.trim() });
      
      if (apiError) throw new Error(apiError);
      
      await onSuccess?.();
      
      setIsEditing(false);
      setValue('');
      setError('');
      setSuccess('Username updated successfully');
      setIsLoading(false);

      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      const errorMessage = err.message.toLowerCase();
      if (errorMessage.includes('duplicate') || 
          errorMessage.includes('unique') || 
          errorMessage.includes('already taken') ||
          errorMessage.includes('database error')) {
        setError('Username is already taken');
      } else {
        setError(`Failed to update username: ${err.message}`);
      }
      setIsLoading(false);
    }
  };

  return {
    isEditing,
    value,
    error,
    success,
    isLoading,
    startEdit,
    cancelEdit,
    setValue,
    saveUsername,
  };
}
