import { useState } from 'react';
import { userApi } from '../../api/user';
import { validatePassword } from '../../util/validator';

export function usePasswordChange() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const startChange = () => {
    setIsChangingPassword(true);
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setIsLoading(false);
  };

  const cancelChange = () => {
    setIsChangingPassword(false);
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setIsLoading(false);
  };

  const savePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Please fill in both password fields');
      return;
    }

    try {
      validatePassword(newPassword);
    } catch (err) {
      setError(err.message);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error: apiError } = await userApi.changePassword(newPassword);
      
      if (apiError) throw new Error(apiError);
      
      setIsChangingPassword(false);
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setSuccess('Password updated successfully');
      setIsLoading(false);

      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(`Failed to update password: ${err.message}`);
      setIsLoading(false);
    }
  };

  return {
    isChangingPassword,
    newPassword,
    confirmPassword,
    error,
    success,
    isLoading,
    startChange,
    cancelChange,
    setNewPassword,
    setConfirmPassword,
    savePassword,
  };
}
