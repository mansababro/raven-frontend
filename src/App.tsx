import { useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SignUpScreen } from './components/SignUpScreen';
import { HomeScreen } from './components/HomeScreen';
import { UserSettings } from './components/UserSettings';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import ProtectedRoute from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MaintenanceScreen } from './components/MaintenanceScreen';
import { getCurrentSession, handleOAuthCallback, refreshProfile } from './store/slices/authSlice';
import type { AppDispatch, RootState } from './store/store';
import { supabase } from './lib/supabase';
import { checkBackendHealth } from './lib/backendHealth';

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const [backendReachable, setBackendReachable] = useState(true);
  const [backendChecked, setBackendChecked] = useState(false);
  const didRefreshProfileRef = useRef(false);

  useEffect(() => {
    // Handle OAuth callback from URL hash first
    const handleInitialCallback = async () => {
      const hash = window.location.hash;
      console.log('[App] handleInitialCallback: hash exists:', !!hash);
      if (hash && hash.includes('access_token')) {
        console.log('[App] handleInitialCallback: access_token found in hash, handling OAuth callback');
        // Supabase v2 auto-handles hash when detectSessionInUrl=true.
        // We just sync Redux state and navigate.
        const result = await dispatch(handleOAuthCallback());
        
        // Clear the hash from URL
        window.history.replaceState(null, '', window.location.pathname);
        
        // If successful, navigate to home
        if (handleOAuthCallback.fulfilled.match(result)) {
          console.log('[App] handleInitialCallback: OAuth callback successful, navigating to /home');
          navigate('/home');
        } else {
          console.log('[App] handleInitialCallback: OAuth callback failed:', result.payload);
        }
        return;
      }
      
      // Always verify session on mount. 
      // authSlice handles not showing a loading state if we already have a cached session.
      console.log('[App] handleInitialCallback: dispatching getCurrentSession');
        dispatch(getCurrentSession());
    };

    handleInitialCallback();

    // Listen for auth state changes
    console.log('[App] setting up onAuthStateChange listener');
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[App] onAuthStateChange event:', event, 'session exists:', !!session);
      
      if (event === 'SIGNED_IN' && session) {
        // Only treat as a fresh login if we don't have a raven_session yet (boot/new login)
        // AND we are either in an OAuth flow or we explicitly want to sign in.
        const hasRavenSession = !!localStorage.getItem('raven_session');
        const isOAuthFlow = window.location.hash.includes('access_token');
        const logoutInProgress = sessionStorage.getItem('raven_logout_in_progress') === 'true';
        
        console.log('[App] SIGNED_IN details: hasRavenSession:', hasRavenSession, 'isOAuthFlow:', isOAuthFlow, 'logoutInProgress:', logoutInProgress);

        if (!logoutInProgress && (isOAuthFlow || !hasRavenSession)) {
          console.log('[App] onAuthStateChange: Processing SIGNED_IN event');
        await dispatch(handleOAuthCallback());
        navigate('/home');
        } else {
          console.log('[App] onAuthStateChange: SIGNED_IN event ignored (already have raven_session, logout in progress, or phantom session)');
          if (logoutInProgress && !hasRavenSession) {
             // If we are logging out, ensure we stay on login
             navigate('/login', { replace: true });
          }
        }
      } else if (event === 'SIGNED_OUT') {
        // Clear the logout flag when we successfully reach SIGNED_OUT state
        sessionStorage.removeItem('raven_logout_in_progress');
        console.log('[App] onAuthStateChange: SIGNED_OUT event, navigating to /login');
        navigate('/login', { replace: true });
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // Token refreshed, update session
        console.log('[App] onAuthStateChange: TOKEN_REFRESHED event, dispatching getCurrentSession');
        dispatch(getCurrentSession());
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, navigate]);

  // Backend health check gate (useful for Vercel deploys so we don't show broken UI).
  useEffect(() => {
    if (import.meta.env.VITE_DISABLE_BACKEND_HEALTHCHECK === 'true') {
      setBackendReachable(true);
      setBackendChecked(true);
      return;
    }

    const run = async () => {
      const ok = await checkBackendHealth();
      setBackendReachable(ok);
      setBackendChecked(true);
    };
    run();
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    if (loading) return;

    if (isAuthenticated) {
      // If on login page and authenticated, redirect to home
      if (location.pathname === '/' || location.pathname === '/login') {
        navigate('/home');
      }
      // If authenticated and on /home, stay on /home (don't redirect)
    } else {
      // If not authenticated and on protected route, redirect to login
      if (location.pathname === '/home') {
        navigate('/login');
      }
    }
  }, [isAuthenticated, loading, location.pathname, navigate]);

  // On refresh/deep-link into /home, ensure we attempt to fetch the latest profile/preferences.
  // This helps avoid "blank/glitchy" states when local cached prefs diverge from backend.
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) return;
    if (location.pathname !== '/home') return;
    if (didRefreshProfileRef.current) return;
    didRefreshProfileRef.current = true;
    dispatch(refreshProfile());
  }, [dispatch, isAuthenticated, loading, location.pathname]);

  const handlePrivacyClick = () => {
    navigate('/privacy');
  };

  const handleTermsClick = () => {
    navigate('/terms');
  };

  const handleLogout = () => {
    // Navigation will be handled by the SIGNED_OUT event in onAuthStateChange
    // This function is just a placeholder for the prop
  };

  const handleBackFromPolicy = () => {
    // Go back to previous page or login
    if (isAuthenticated) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  };

  // Don't block public pages like /login if backend is temporarily unreachable.
  // Gate only the protected experience (/home).
  if (backendChecked && !backendReachable && location.pathname === '/home') {
    return (
      <MaintenanceScreen
        onRecovered={() => {
          setBackendReachable(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-[100svh] w-full overflow-hidden">
      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <SignUpScreen 
                onPrivacyClick={handlePrivacyClick}
                onTermsClick={handleTermsClick}
              />
            )
          } 
        />

        {/* Alias login route */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <SignUpScreen 
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
              <ErrorBoundary>
              <HomeScreen 
                onPrivacyClick={handlePrivacyClick}
                onTermsClick={handleTermsClick}
                onLogout={handleLogout}
              />
              </ErrorBoundary>
            </ProtectedRoute>
          } 
        />
        
        {/* User Settings */}
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <UserSettings />
              </ErrorBoundary>
            </ProtectedRoute>
          } 
        />
        
        {/* Policy pages */}
        <Route path="/privacy" element={<PrivacyPolicy onBack={handleBackFromPolicy} />} />
        <Route path="/terms" element={<TermsOfService onBack={handleBackFromPolicy} />} />
        <Route path="/maintenance" element={<MaintenanceScreen />} />
        
        {/* Legacy routes - redirect to home for backwards compatibility */}
        <Route path="/onboarding" element={<Navigate to="/home" replace />} />
        <Route path="/chat" element={<Navigate to="/home" replace />} />
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}
