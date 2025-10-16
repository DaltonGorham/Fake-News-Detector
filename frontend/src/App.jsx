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
    // dont redirect anywhere if we're on the verify page
    // this is meant to be a static page to be closed after verification
    if (window.location.pathname === '/verify') {
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

  /*
    TODO - make sure after verification we wait
    for user to switch back to original tab
    before trying to redirect them to dashboard
    for a smoother experience
  */
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