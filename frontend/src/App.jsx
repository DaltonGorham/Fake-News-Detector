import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { supabase } from "./lib/supabaseClient.js";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Loading from "./components/common/Loading";

function AppRoutes() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

    const handleAuthChange = (event, session) => {

    const currentPath = window.location.pathname;
    const isVerifyPage = currentPath === '/verify';
    const isResetPasswordPage = currentPath === '/reset-password';
    const isLoginPage = currentPath === '/';
    
    // Check for different token types in URL hash
    const hasAccessToken = window.location.hash.includes('access_token');
    const isSignupVerification = hasAccessToken && window.location.hash.includes('type=signup');
    const isPasswordRecovery = hasAccessToken && window.location.hash.includes('type=recovery');
    
    // Don't redirect if we're on the verify page
    if (isVerifyPage) {
      return;
    }
    
    // Don't redirect if we're on reset password page
    if (isResetPasswordPage) {
      return;
    }
    
    // If URL has signup verification tokens, go to verify page
    if (isSignupVerification) {
      navigate("/verify", { replace: true });
      return;
    }
    
    // If URL has password recovery tokens, go to reset password page
    if (isPasswordRecovery) {
      navigate("/reset-password", { replace: true });
      return;
    }
    
    // If we get a SIGNED_IN event on login page check if it's from password recovery
    if (event === 'SIGNED_IN' && isLoginPage && session && !isPasswordRecovery) {
      return;
    }
    
    if (event === 'SIGNED_IN' && session) {
      navigate("/dashboard");
    } else if (event === 'SIGNED_OUT' || !session) {
      navigate("/");
    }
  };

  useEffect(() => {
    // Get the current session on first load 
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleAuthChange('SIGNED_IN', session);
      } else {
        handleAuthChange('SIGNED_OUT', null);
      }
      setLoading(false);
    });

    // Listen for changes to auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      handleAuthChange(event, session);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<MainPage />} />
      <Route path="/verify" element={<VerifyEmail />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  );
}