import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SignUpScreen } from './components/SignUpScreen';
import { HomeScreen } from './components/HomeScreen';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import ProtectedRoute from './components/ProtectedRoute';
import { getCurrentSession, handleOAuthCallback } from './store/slices/authSlice';
import type { AppDispatch, RootState } from './store/store';
import { supabase } from './lib/supabase';

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Handle OAuth callback from URL hash first
    const handleInitialCallback = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        // Supabase v2 auto-handles hash when detectSessionInUrl=true.
        // We just sync Redux state and navigate.
        const result = await dispatch(handleOAuthCallback());
        
        // Clear the hash from URL
        window.history.replaceState(null, '', window.location.pathname);
        
        // If successful, navigate to home
        if (handleOAuthCallback.fulfilled.match(result)) {
          navigate('/home');
        }
        return;
      }
      
      // No OAuth callback, check for existing session
      dispatch(getCurrentSession());
    };

    handleInitialCallback();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // User just signed in - dispatch to update state
        await dispatch(handleOAuthCallback());
        navigate('/home');
      } else if (event === 'SIGNED_OUT') {
        // User signed out - navigate to login
        navigate('/');
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // Token refreshed, update session
        dispatch(getCurrentSession());
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, navigate]);

  // Handle navigation based on auth state
  useEffect(() => {
    if (loading) return;

    if (isAuthenticated) {
      // If on login page and authenticated, redirect to home
      if (location.pathname === '/') {
        navigate('/home');
      }
    }
  }, [isAuthenticated, loading, location.pathname, navigate]);

  const handlePrivacyClick = () => {
    navigate('/privacy');
  };

  const handleTermsClick = () => {
    navigate('/terms');
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleBackFromPolicy = () => {
    // Go back to previous page or login
    if (isAuthenticated) {
      navigate('/home');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="size-full overflow-hidden">
      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <SignUpScreen 
                onSignUp={() => navigate('/home')}
                onPrivacyClick={handlePrivacyClick}
                onTermsClick={handleTermsClick}
              />
            )
          } 
        />
        
        {/* Main protected route - handles both onboarding and chat */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <HomeScreen 
                onPrivacyClick={handlePrivacyClick}
                onTermsClick={handleTermsClick}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          } 
        />
        
        {/* Policy pages */}
        <Route path="/privacy" element={<PrivacyPolicy onBack={handleBackFromPolicy} />} />
        <Route path="/terms" element={<TermsOfService onBack={handleBackFromPolicy} />} />
        
        {/* Legacy routes - redirect to home for backwards compatibility */}
        <Route path="/onboarding" element={<Navigate to="/home" replace />} />
        <Route path="/chat" element={<Navigate to="/home" replace />} />
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
