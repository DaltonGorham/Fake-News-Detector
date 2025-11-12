import { useState } from 'react';
import { userApi } from '../../api/user';

export function useAccountDeletion() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const requestDeletion = () => {
    setShowConfirm(true);
  };

  const cancelDeletion = () => {
    setShowConfirm(false);
  };

  const confirmDeletion = async () => {
    setShowConfirm(false);
    setIsDeleting(true);
    
    try {
      await userApi.deleteAccount();
      // User will be signed out and redirected by the auth state change
    } catch (err) {
      alert(`Failed to delete account: ${err.message}`);
      setIsDeleting(false);
    }
  };

  return {
    showConfirm,
    isDeleting,
    requestDeletion,
    cancelDeletion,
    confirmDeletion,
  };
}
