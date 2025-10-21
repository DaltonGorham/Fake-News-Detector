import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import '../styles/VerifyEmailPage.css';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('Verifying your email...');

  useEffect(() => {
    const handleVerification = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setVerificationStatus('Email verified successfully! You can now close this tab and return to the app.');
      } else {
        setVerificationStatus('Verification failed. Please try again or contact support.');
      }
    };

    handleVerification();
  }, [navigate]);

  return (
    <div className="verify-container">
      <div className="verify-content">
        <h2>Email Verification</h2>
        <p>{verificationStatus}</p>
      </div>
    </div>
  );
}