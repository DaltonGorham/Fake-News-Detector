import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient.js";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import Loading from "./components/common/Loading";

function AppRoutes() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const handleAuthChange = (event, session) => {
    // Check if we're on verify page or if URL has email verification tokens
    const isVerifyPage = window.location.pathname === '/verify';
    const hasVerificationTokens = window.location.hash.includes('access_token') && 
                                   (window.location.hash.includes('type=signup') || 
                                    window.location.hash.includes('type=recovery'));
    
    // Don't redirect if we're on the verify page
    if (isVerifyPage) {
      return;
    }
    
    // If URL has verification tokens, go to verify page instead of dashboard
    if (hasVerificationTokens) {
      navigate("/verify", { replace: true });
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

    // Listen for changes to auth state (login, logout, etc.)
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
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}