import { ChevronRight, ChevronDown } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signIn, signUp, signInWithGoogle, clearError } from '../store/slices/authSlice';
import type { AppDispatch, RootState } from '../store/store';
import svgPaths from "../imports/svg-p6w04fvk13";

interface SignUpScreenProps {
  onPrivacyClick: () => void;
  onTermsClick: () => void;
}

export function SignUpScreen({ onPrivacyClick, onTermsClick }: SignUpScreenProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const formSectionRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'signup' | 'signin'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Clear error and form when switching tabs
  const handleTabChange = (tab: 'signup' | 'signin') => {
    setActiveTab(tab);
    dispatch(clearError());
    // Don't clear form fields, just clear errors
  };

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Check if spline-viewer is already defined
    if (customElements.get('spline-viewer')) {
      return;
    }

    // Check if script is already loaded
    const existingScript = document.querySelector('script[src*="spline-viewer"]');
    if (existingScript) {
      return;
    }

    // Load Spline viewer script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.9.32/build/spline-viewer.js';
    script.async = true;
    script.onerror = () => {
      console.error('Failed to load Spline viewer script');
    };
    document.head.appendChild(script);

    return () => {
      // Don't remove script on unmount to avoid re-registration issues
    };
  }, []);

  // Navigate when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Navigate to /home - it will handle showing onboarding or chat based on hasPreferences
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleAuth = async () => {
    try {
      const result = await dispatch(signInWithGoogle());
      // OAuth will redirect immediately, so we don't need to handle the result
      // The redirect will happen automatically via Supabase
      if (signInWithGoogle.rejected.match(result)) {
        // Error is already handled in the Redux state
      }
    } catch (error) {
      // Error is handled by Redux
      console.error('Google auth error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (activeTab === 'signup') {
        const result = await dispatch(signUp({ email, password }));
        if (signUp.fulfilled.match(result)) {
          // Check if user is authenticated (session exists)
          if (result.payload.session) {
            // User is immediately authenticated
            // Navigation will happen via useEffect in App.tsx
          } else {
            // Email confirmation might be required
            // Still clear the form and show success message
            setEmail('');
            setPassword('');
            setName('');
          }
        }
      } else {
        const result = await dispatch(signIn({ email, password }));
        if (signIn.fulfilled.match(result)) {
          // User is authenticated, navigation will happen via useEffect in App.tsx
          setEmail('');
          setPassword('');
        }
      }
    } catch (error) {
      // Error is already handled in Redux state
      console.error('Auth error:', error);
    }
  };

  return (
    <div className="bg-[#121212] min-h-[100svh] w-full md:flex md:flex-row overflow-auto">
      {/* Hero Section */}
      <div className="relative w-full md:w-1/2 h-[100svh] md:h-full flex items-center justify-center px-4 md:px-8 overflow-auto mt-4">
        {/* Hero Background Card */}
        <div className="bg-[#8f7db4] overflow-auto relative rounded-[20px] w-full max-w-[676px] min-h-[calc(100svh-32px)] md:h-[calc(100%-64px)] flex items-center justify-center">
          {/* Content Container */}
          <div className="relative content-stretch flex flex-col gap-[20px] md:gap-[33px] items-center px-4 py-[32px] w-full max-w-[471.5px]">
            {/* Header Text */}
            <div className="relative w-full">
              <div className="flex flex-col items-center gap-1">
                <p className="font-['Audiowide:Regular',sans-serif] text-[5.5vw] md:text-[32px] text-center text-white uppercase whitespace-nowrap" style={{ lineHeight: '1.3' }}>Where to go out ?</p>
                <p className="font-['Audiowide:Regular',sans-serif] text-[7.5vw] md:text-[42.84px] text-center text-white uppercase whitespace-nowrap" style={{ lineHeight: '1.3' }}>Ask raven</p>
              </div>
            </div>

            {/* Raven Spline 3D */}
            <div className="h-[275px] sm:h-[332px] md:h-[335px] relative shrink-0 w-full max-w-[385px] sm:max-w-[440px] md:max-w-[459px] z-50 mx-auto" style={{ pointerEvents: 'auto' }}>
              <spline-viewer 
                url="https://prod.spline.design/sRTT2mu6OXC3vN45/scene.splinecode"
                style={{ width: '100%', height: '100%', position: 'relative', zIndex: 50, pointerEvents: 'auto' }}
              />
            </div>

            {/* Footer Text & Button */}
            <div className="flex flex-col gap-[18px] items-center pb-4">
              <p className="font-['Saira:Regular',sans-serif] leading-[17.6px] text-[14px] sm:text-[16px] text-center text-white px-4">
                YOUR PERSONAL AI NIGHTLIFE GUIDE
              </p>
              <button 
                onClick={scrollToForm}
                className="bg-[#121212] hover:bg-[#1f1e1e] md:bg-transparent md:hover:bg-transparent transition-colors flex items-center justify-center p-[12px] rounded-[8px] cursor-pointer md:cursor-default md:pointer-events-none" 
                data-name="Button on dark"
              >
                <p className="font-['Saira:Medium',sans-serif] font-medium leading-[1.1] text-[12px] text-white md:text-[#2a2a2a] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                  TRY RAVEN (BETA)
                </p>
                <ChevronRight className="hidden md:block size-4 text-white md:text-[#2a2a2a] ml-[2px]" />
                <ChevronDown className="block md:hidden size-4 text-white ml-[2px]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div ref={formSectionRef} className="relative w-full md:w-1/2 min-h-[100svh] md:h-full bg-[#121212] flex items-center justify-center px-4 md:px-8 py-[4svh] md:py-12 overflow-y-auto">
        <div className="w-full max-w-[400px] flex flex-col gap-[2svh] md:gap-5">
          {/* Logo */}
          <p className="font-['Audiowide:Regular',sans-serif] leading-[1.1] text-[24px] text-white tracking-[-1.08px] uppercase text-center mb-[0.5svh] md:mb-4">
            Raven
          </p>

          {/* Google Auth Button */}
          <button
            onClick={handleGoogleAuth}
            className="bg-[#1f1e1e] border border-[#ffaeaf] h-[48px] rounded-[8px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.08)] flex items-center justify-center gap-2 cursor-pointer hover:bg-[#2a2929] transition-colors w-full"
          >
            <div className="size-[24px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 24">
                <g>
                  <path d={svgPaths.pbd20980} fill="#FFC107" />
                  <path d={svgPaths.p145ca200} fill="#FF3D00" />
                  <path d={svgPaths.p21cf0700} fill="#4CAF50" />
                  <path d={svgPaths.p59d7180} fill="#1976D2" />
                </g>
              </svg>
            </div>
            <p className="font-['Saira:Light',sans-serif] font-light text-[16px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
              {activeTab === 'signup' 
                ? 'Register with Google' 
                : 'Login with Google'
              }
            </p>
          </button>

          {/* Error Message */}
          {error && (
            <div className="bg-[#1f1e1e] border border-[#ffaeaf] rounded-[8px] px-4 py-3">
              <p className="font-['Saira:Regular',sans-serif] text-[14px] text-[#ffaeaf]">
                {error}
              </p>
            </div>
          )}

          {/* OR Divider */}
          <div className="relative w-full flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-[#9c9aa5]"></div>
            <p className="font-['Saira:Regular',sans-serif] text-[12px] text-[#9c9aa5] uppercase">
              Or
            </p>
            <div className="flex-1 h-[1px] bg-[#9c9aa5]"></div>
          </div>

          {/* Tabs */}
          <div className="bg-[#1f1e1e] flex items-start p-[4px] rounded-[8px] w-full">
            <button
              onClick={() => handleTabChange('signup')}
              className={`basis-0 grow min-h-px min-w-px rounded-[8px] transition-colors ${
                activeTab === 'signup' ? 'bg-[#ffaeaf]' : 'bg-[#1f1e1e]'
              }`}
            >
              <div className="flex items-center justify-center px-[20px] py-[8px]">
                <p className={`font-['Saira:Regular',sans-serif] leading-[normal] text-[16px] text-center transition-colors ${
                  activeTab === 'signup' ? 'text-[#1f1e1e]' : 'text-white hover:text-[#9c9aa5]'
                }`}>
                  Sign Up
                </p>
              </div>
            </button>
            <button
              onClick={() => handleTabChange('signin')}
              className={`basis-0 grow min-h-px min-w-px rounded-[8px] transition-colors ${
                activeTab === 'signin' ? 'bg-[#ffaeaf]' : 'bg-[#1f1e1e]'
              }`}
            >
              <div className="flex items-center justify-center px-[20px] py-[8px]">
                <p className={`font-['Saira:Regular',sans-serif] leading-[normal] text-[16px] text-center transition-colors ${
                  activeTab === 'signin' ? 'text-[#1f1e1e]' : 'text-white hover:text-[#9c9aa5]'
                }`}>
                  Sign In
                </p>
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-[2svh] md:gap-5">
            {/* Name Input - Only for Sign Up */}
            {activeTab === 'signup' && (
              <div className="flex flex-col gap-[8px] w-full">
                <p className="font-['Saira:Regular',sans-serif] leading-[normal] text-[14px] text-white">
                  Name
                </p>
                <div className="bg-[#1f1e1e] h-[48px] rounded-[8px] border border-[#ffaeaf] focus-within:shadow-[0px_4px_8px_0px_rgba(255,174,175,0.2)] transition-shadow">
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-full bg-transparent px-[16px] py-[8px] font-['Saira:Regular',sans-serif] leading-[normal] text-[16px] text-white placeholder:text-[#9c9aa5] outline-none"
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="flex flex-col gap-[8px] w-full">
              <p className="font-['Saira:Regular',sans-serif] leading-[normal] text-[14px] text-white">
                Email
              </p>
              <div className="bg-[#1f1e1e] h-[48px] rounded-[8px] border border-[#ffaeaf] focus-within:shadow-[0px_4px_8px_0px_rgba(255,174,175,0.2)] transition-shadow">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-full bg-transparent px-[16px] py-[8px] font-['Saira:Regular',sans-serif] leading-[normal] text-[16px] text-white placeholder:text-[#9c9aa5] outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-['Saira:Regular',sans-serif] leading-[normal] text-[14px] text-white">
                  Password
                </p>
                {activeTab === 'signin' && (
                  <button type="button" className="text-[#9c9aa5] hover:text-[#ffaeaf] transition-colors">
                    <p className="font-['Saira:Regular',sans-serif] text-[12px]">
                      Forgot password?
                    </p>
                  </button>
                )}
              </div>
              <div className="bg-[#1f1e1e] h-[48px] rounded-[8px] border border-[#ffaeaf] focus-within:shadow-[0px_4px_8px_0px_rgba(255,174,175,0.2)] transition-shadow">
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-full bg-transparent px-[16px] py-[8px] font-['Saira:Regular',sans-serif] leading-[normal] text-[16px] text-white placeholder:text-[#9c9aa5] outline-none"
                />
              </div>
            </div>

            {/* Create Account / Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-[#ffaeaf] hover:bg-[#ff9e9f] transition-colors flex items-center justify-center h-[48px] px-[20px] py-[10px] rounded-[8px] w-full mt-[2svh] md:mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <p className="font-['Saira:Regular',sans-serif] leading-[normal] text-[16px] text-black">
                {loading 
                  ? (activeTab === 'signup' ? 'Creating Account...' : 'Signing In...')
                  : (activeTab === 'signup' ? 'Create Account' : 'Sign In')
                }
              </p>
            </button>
          </form>

          {/* Terms */}
          <p className="font-['Saira:Regular',sans-serif] leading-[normal] text-[10px] text-center w-full">
            <span className="text-[#9c9aa5]">By signing up to create an account I accept Company&apos;s </span>
            <button 
              onClick={onTermsClick} 
              className="font-['Saira:Regular',sans-serif] text-[10px] text-[#9c9aa5] hover:text-[#ffaeaf] underline cursor-pointer transition-colors"
            >
              Terms of use
            </button>
            <span className="text-[#9c9aa5]"> & </span>
            <button 
              onClick={onPrivacyClick} 
              className="font-['Saira:Regular',sans-serif] text-[10px] text-[#9c9aa5] hover:text-[#ffaeaf] underline cursor-pointer transition-colors"
            >
              Privacy Policy
            </button>
            <span className="text-[#9c9aa5]">.</span>
          </p>
        </div>
      </div>
    </div>
  );
}