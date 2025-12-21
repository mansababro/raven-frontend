import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Send, Menu, X } from 'lucide-react';
import { signOut } from '../store/slices/authSlice';
import type { AppDispatch, RootState } from '../store/store';
import ravenImage from 'figma:asset/3f1fb69e880c4e8470b4367ae3fec8808445b0a5.png';

type Message = {
  id: number;
  role: 'assistant' | 'user';
  content: string;
  type?: 'question';
  questionType?: 'music' | 'vibe' | 'artists';
};

const musicGenres = [
  'Techno', 'Melodic Techno', 'House', 'Tech House', 'Disco', 'DNB/Bass',
  'Ambient', 'Dubstep', 'Garage', 'Rave', 'Hip Hop', 'Eclectic', 'Trance'
];

const partyVibes = [
  'Underground / Warehouse',
  'Club / Mainstream',
  'Intimate / Small-Crowd',
  'Large-Scale / Festival Energy',
  'Dark & Industrial',
  'Uplifting & Melodic',
  'High-Energy / Fast BPM',
  'Chill & Groovy',
  'Queer / Inclusive / Alternative'
];

type OnboardingScreenProps = {
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
};

export function OnboardingScreen({ onPrivacyClick = () => {}, onTermsClick = () => {} }: OnboardingScreenProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const userEmail = user?.email || 'user@example.com';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'Hey! I\'m Raven, your AI nightlife guide. Let\'s get to know each other!'
    },
    {
      id: 2,
      role: 'assistant',
      content: 'Which music genres do you vibe with the most?',
      type: 'question',
      questionType: 'music'
    }
  ]);
  
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<'music' | 'vibe' | 'artists' | 'complete'>('music');
  const [artistsInput, setArtistsInput] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [showSpline, setShowSpline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Navigate to chat when onboarding is complete
  useEffect(() => {
    if (currentQuestion === 'complete') {
      // Store onboarding data in localStorage
      localStorage.setItem('raven_onboarding_complete', 'true');
      localStorage.setItem('raven_user_genres', JSON.stringify(selectedGenres));
      localStorage.setItem('raven_user_vibes', JSON.stringify(selectedVibes));
      localStorage.setItem('raven_user_artists', artistsInput);
      
      // Navigate to chat after a brief delay
      setTimeout(() => {
        navigate('/chat');
      }, 500);
    }
  }, [currentQuestion, navigate, selectedGenres, selectedVibes, artistsInput]);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleVibeToggle = (vibe: string) => {
    setSelectedVibes(prev =>
      prev.includes(vibe)
        ? prev.filter(v => v !== vibe)
        : [...prev, vibe]
    );
  };

  const handleMusicSubmit = () => {
    if (selectedGenres.length === 0) return;

    // Hide Spline when moving to second question
    setShowSpline(false);

    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: selectedGenres.join(', ')
    };

    const nextQuestion: Message = {
      id: messages.length + 2,
      role: 'assistant',
      content: 'What kind of party vibe do you usually go for?',
      type: 'question',
      questionType: 'vibe'
    };

    setMessages([...messages, userMessage, nextQuestion]);
    setCurrentQuestion('vibe');
  };

  const handleVibeSubmit = () => {
    if (selectedVibes.length === 0) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: selectedVibes.join(', ')
    };

    const nextQuestion: Message = {
      id: messages.length + 2,
      role: 'assistant',
      content: 'Are there any artists/DJs you love or follow?',
      type: 'question',
      questionType: 'artists'
    };

    setMessages([...messages, userMessage, nextQuestion]);
    setCurrentQuestion('artists');
  };

  const handleArtistsSubmit = () => {
    if (!artistsInput.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: artistsInput
    };

    const completeMessage: Message = {
      id: messages.length + 2,
      role: 'assistant',
      content: 'Perfect! Taking you to discover some events...'
    };

    setMessages([...messages, userMessage, completeMessage]);
    setCurrentQuestion('complete');
  };

  const handleSkipMusic = () => {
    // Hide Spline when moving to second question
    setShowSpline(false);

    const skipMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: '(Skipped)'
    };

    const nextQuestion: Message = {
      id: messages.length + 2,
      role: 'assistant',
      content: 'What kind of party vibe do you usually go for?',
      type: 'question',
      questionType: 'vibe'
    };

    setMessages([...messages, skipMessage, nextQuestion]);
    setCurrentQuestion('vibe');
  };

  const handleSkipVibe = () => {
    const skipMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: '(Skipped)'
    };

    const nextQuestion: Message = {
      id: messages.length + 2,
      role: 'assistant',
      content: 'Are there any artists/DJs you love or follow?',
      type: 'question',
      questionType: 'artists'
    };

    setMessages([...messages, skipMessage, nextQuestion]);
    setCurrentQuestion('artists');
  };

  const handleSkipArtists = () => {
    const skipMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: '(Skipped)'
    };

    const completeMessage: Message = {
      id: messages.length + 2,
      role: 'assistant',
      content: 'No worries! Taking you to discover some events...'
    };

    setMessages([...messages, skipMessage, completeMessage]);
    setCurrentQuestion('complete');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentQuestion === 'artists') {
        handleArtistsSubmit();
      }
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Check if spline-viewer is already defined
    if (customElements.get('spline-viewer')) {
      return;
    }

    // Use a global flag to prevent multiple loads
    if ((window as any).__SPLINE_LOADING__) {
      return;
    }

    // Check if script already exists in the DOM
    const existingScript = document.querySelector('script[src*="spline-viewer"]');
    if (existingScript) {
      (window as any).__SPLINE_LOADING__ = true;
      return;
    }

    // Mark as loading before creating script
    (window as any).__SPLINE_LOADING__ = true;

    // Load Spline viewer script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.9.48/build/spline-viewer.js';
    script.crossOrigin = 'anonymous';
    script.onerror = () => {
      console.error('Failed to load Spline viewer script');
      (window as any).__SPLINE_LOADING__ = false;
    };
    document.head.appendChild(script);
  }, []);

  const handleLogout = async () => {
    await dispatch(signOut());
    navigate('/login', { replace: true });
  };

  const handleDeleteAccount = async () => {
    // TODO: Implement delete account functionality
    console.log('Delete account clicked');
    await handleLogout();
  };

  return (
    <div className="bg-[#121212] relative size-full flex flex-col overflow-hidden max-w-full">
      {/* Header */}
      <div className="bg-[#1f1e1e] border-b border-[#3a3a3a] px-4 md:px-6 py-4 flex items-center justify-between shrink-0 relative z-[9999] pointer-events-auto max-w-full">
        <div className="flex items-center gap-3 relative">
          <button className="text-[#9c9aa5] hover:text-[#ffaeaf] transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="size-5" />
          </button>
          <p className="font-['Audiowide:Regular',sans-serif] text-[18px] md:text-[20px] text-white tracking-[-0.9px] uppercase">
            Raven
          </p>

          {/* Floating Menu */}
          {isMenuOpen && (
            <div ref={menuRef} className="absolute top-full left-0 mt-2 bg-[#1f1e1e] border border-[#3a3a3a] rounded-[12px] shadow-lg min-w-[240px] py-2 z-[100]">
              {/* Email */}
              <div className="px-4 py-3 border-b border-[#3a3a3a]">
                <p className="font-['Saira:Regular',sans-serif] text-[12px] text-[#9c9aa5]">
                  {userEmail}
                </p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button className="w-full px-4 py-2 text-left hover:bg-[#2a2a2a] transition-colors" onClick={handleLogout}>
                  <p className="font-['Saira:Regular',sans-serif] text-[14px] text-white">
                    Log out
                  </p>
                </button>
                
                <button className="w-full px-4 py-2 text-left hover:bg-[#2a2a2a] transition-colors" onClick={handleDeleteAccount}>
                  <p className="font-['Saira:Regular',sans-serif] text-[14px] text-white">
                    Delete account
                  </p>
                </button>
                
                <button className="w-full px-4 py-2 text-left hover:bg-[#2a2a2a] transition-colors" onClick={() => setIsContactModalOpen(true)}>
                  <p className="font-['Saira:Regular',sans-serif] text-[14px] text-white">
                    Contact
                  </p>
                </button>
                
                <button className="w-full px-4 py-2 text-left hover:bg-[#2a2a2a] transition-colors" onClick={() => { setIsMenuOpen(false); onPrivacyClick(); }}>
                  <p className="font-['Saira:Regular',sans-serif] text-[10px] text-[#9c9aa5] hover:text-white transition-colors">
                    Privacy Policy
                  </p>
                </button>
                
                <button className="w-full px-4 py-2 text-left hover:bg-[#2a2a2a] transition-colors" onClick={() => { setIsMenuOpen(false); onTermsClick(); }}>
                  <p className="font-['Saira:Regular',sans-serif] text-[10px] text-[#9c9aa5] hover:text-white transition-colors">
                    Terms of Service
                  </p>
                </button>
              </div>

              {/* Leave a Feedback - Tag Style */}
              <div className="px-4 pt-3 pb-1 border-t border-[#3a3a3a] mt-1">
                <button 
                  className="bg-[linear-gradient(90deg,rgba(143,125,180,0.15)_0%,rgba(143,125,180,0.15)_100%),linear-gradient(90deg,rgb(31,30,30)_0%,rgb(31,30,30)_100%)] text-white hover:bg-[linear-gradient(90deg,rgba(143,125,180,0.25)_0%,rgba(143,125,180,0.25)_100%),linear-gradient(90deg,rgb(31,30,30)_0%,rgb(31,30,30)_100%)] py-[6px] px-[18px] rounded-[8px] transition-all w-full"
                  onClick={() => setIsFeedbackModalOpen(true)}
                >
                  <p className="font-['Saira:Regular',sans-serif] text-[13px] leading-[19.5px]">
                    Leave a feedback
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="relative rounded-[8px] h-[20px]">
          <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
          <div className="size-full">
            <div className="content-stretch flex flex-col items-center justify-center px-[12px] relative size-full">
              <div className="h-[15px] relative shrink-0">
                <p className="font-['Saira:Regular',sans-serif] leading-[15px] not-italic text-[10px] text-nowrap text-white tracking-[0.5px] uppercase whitespace-pre">Beta</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-8 flex flex-col relative">
        <div className="max-w-[800px] mx-auto w-full">
          {/* Spacer to push content down - removed on mobile */}
          <div className="hidden md:block h-[20vh]"></div>
          
          <div className="space-y-6 relative z-20 pointer-events-none">
          {messages.map((message, index) => {
            // Find the last assistant message
            const lastAssistantMessageIndex = messages.map((m, i) => ({ role: m.role, index: i })).reverse().find(m => m.role === 'assistant')?.index;
            const isLastAssistantMessage = message.role === 'assistant' && index === lastAssistantMessageIndex;
            const shouldShowRavenImage = isLastAssistantMessage && message.id !== 1 && message.id !== 2;

            return (
              <div key={message.id}>
                {/* First message - centered with Spline */}
                {message.id === 1 ? (
                  <div className="flex flex-col items-center mb-6 md:mb-16 gap-4">
                    {/* Spline 3D Raven with fade transition */}
                    <div 
                      className={`w-[200px] bg-transparent transition-all duration-700 ease-in-out ${showSpline ? 'h-[200px] opacity-100' : 'h-0 opacity-0 pointer-events-none'}`}
                      style={{ overflow: 'hidden' }}
                    >
                      <spline-viewer 
                        url="https://prod.spline.design/J9xZAY12OGsPDqHa/scene.splinecode"
                        style={{ width: '100%', height: '200px' }}
                        className="pointer-events-auto"
                      />
                    </div>
                    
                    <div 
                      className={`relative w-full md:w-auto max-w-[90vw] px-4 md:px-0 flex flex-col bg-transparent transition-all duration-700 ease-in-out ${showSpline ? '-mt-[45px]' : 'mt-0'}`}
                    >
                      <p className="font-['Doppio_One:Regular',sans-serif] leading-[1.3] not-italic text-[#ffaeaf] text-[3.8vw] md:text-[16.8px] text-center whitespace-nowrap">Hey! I&apos;m Raven, your AI nightlife guide.</p>
                      <p className="font-['Doppio_One:Regular',sans-serif] leading-[1.3] not-italic text-[#ffaeaf] text-[3.8vw] md:text-[16.8px] text-center whitespace-nowrap">Let&apos;s get to know each other!</p>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Hovering Raven Image - Only on last assistant message, starting from message id 2 */}
                    {message.role === 'assistant' && shouldShowRavenImage && (
                      <div className="w-[30px] h-[30px] shrink-0 mr-3 animate-hover">
                        <img 
                          src={ravenImage}
                          alt="Raven"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] ${
                        message.role === 'user'
                          ? 'bg-[#ffaeaf] text-[#121212] rounded-[12px] px-4 py-3'
                          : 'text-white'
                      }`}
                    >
                      <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-[1.5]">
                        {message.content}
                      </p>
                    </div>
                  </div>
                )}

                {/* Music Genre Selection */}
                {message.questionType === 'music' && currentQuestion === 'music' && (
                  <div className="mt-4 space-y-3 pointer-events-auto">
                    <div className="flex flex-wrap gap-2">
                      {musicGenres.map((genre) => (
                        <button
                          key={genre}
                          onClick={() => handleGenreToggle(genre)}
                          className={`py-[6px] px-[18px] rounded-[8px] transition-all flex items-center justify-center ${
                            selectedGenres.includes(genre)
                              ? 'bg-[#8f7db4] text-[#121212]'
                              : 'bg-[#1f1e1e] text-white hover:bg-[linear-gradient(90deg,rgba(143,125,180,0.15)_0%,rgba(143,125,180,0.15)_100%),linear-gradient(90deg,rgb(31,30,30)_0%,rgb(31,30,30)_100%)]'
                          }`}
                        >
                          <p className="font-['Saira:Regular',sans-serif] text-[13px] leading-[19.5px]">
                            {genre}
                          </p>
                        </button>
                      ))}
                    </div>
                    {selectedGenres.length > 0 ? (
                      <button
                        onClick={handleMusicSubmit}
                        className="bg-[#ffaeaf] hover:bg-[#ff9e9f] transition-colors px-6 py-2 rounded-[8px]"
                      >
                        <p className="font-['Saira:Regular',sans-serif] text-[14px] text-[#121212]">
                          Continue
                        </p>
                      </button>
                    ) : (
                      <button
                        onClick={handleSkipMusic}
                        className="rounded-[8px] px-[14.5px] py-[8px]"
                      >
                        <p className="font-['Saira:Regular',sans-serif] leading-[21px] text-[14px] text-[#9c9aa5]">
                          Skip
                        </p>
                      </button>
                    )}
                  </div>
                )}

                {/* Party Vibe Selection */}
                {message.questionType === 'vibe' && currentQuestion === 'vibe' && (
                  <div className="mt-4 space-y-3 pointer-events-auto">
                    <div className="flex flex-wrap gap-2">
                      {partyVibes.map((vibe) => (
                        <button
                          key={vibe}
                          onClick={() => handleVibeToggle(vibe)}
                          className={`py-[6px] px-[18px] rounded-[8px] transition-all flex items-center justify-center ${
                            selectedVibes.includes(vibe)
                              ? 'bg-[#8f7db4] text-[#121212]'
                              : 'bg-[#1f1e1e] text-white hover:bg-[linear-gradient(90deg,rgba(143,125,180,0.15)_0%,rgba(143,125,180,0.15)_100%),linear-gradient(90deg,rgb(31,30,30)_0%,rgb(31,30,30)_100%)]'
                          }`}
                        >
                          <p className="font-['Saira:Regular',sans-serif] text-[13px] leading-[19.5px]">
                            {vibe}
                          </p>
                        </button>
                      ))}
                    </div>
                    {selectedVibes.length > 0 ? (
                      <button
                        onClick={handleVibeSubmit}
                        className="bg-[#ffaeaf] hover:bg-[#ff9e9f] transition-colors px-6 py-2 rounded-[8px]"
                      >
                        <p className="font-['Saira:Regular',sans-serif] text-[14px] text-[#121212]">
                          Continue
                        </p>
                      </button>
                    ) : (
                      <button
                        onClick={handleSkipVibe}
                        className="rounded-[8px] px-[14.5px] py-[8px]"
                      >
                        <p className="font-['Saira:Regular',sans-serif] leading-[21px] text-[14px] text-[#9c9aa5]">
                          Skip
                        </p>
                      </button>
                    )}
                  </div>
                )}

                {/* Artists Input */}
                {message.questionType === 'artists' && currentQuestion === 'artists' && (
                  <div className="mt-4 space-y-3 pointer-events-auto">
                    <div className="bg-[#1f1e1e] border-2 border-[#ffaeaf] rounded-[12px] flex items-center gap-2 px-4 py-2">
                      <input
                        type="text"
                        value={artistsInput}
                        onChange={(e) => setArtistsInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="e.g., Nina Kraviz, Ben Böhmer, Charlotte de Witte..."
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-[#9c9aa5] font-['Saira:Regular',sans-serif] text-[16px]"
                      />
                      {artistsInput.trim() && (
                        <button
                          onClick={handleArtistsSubmit}
                          className="bg-[#ffaeaf] hover:bg-[#ff9e9f] transition-colors p-2 rounded-[8px]"
                        >
                          <Send className="size-4 text-[#121212]" />
                        </button>
                      )}
                    </div>
                    {!artistsInput.trim() && (
                      <button
                        onClick={handleSkipArtists}
                        className="rounded-[8px] px-[14.5px] py-[8px]"
                      >
                        <p className="font-['Saira:Regular',sans-serif] leading-[21px] text-[14px] text-[#9c9aa5]">
                          Skip
                        </p>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {isContactModalOpen && (
        <div 
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-[10000] pointer-events-auto"
          style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          onClick={() => setIsContactModalOpen(false)}
        >
          <div 
            className="bg-[#1f1e1e] border border-[#3a3a3a] rounded-[16px] p-6 md:p-8 w-[90vw] max-w-[500px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <p className="font-['Audiowide:Regular',sans-serif] text-[20px] md:text-[24px] text-white tracking-[-0.9px] uppercase">
                Contact Us
              </p>
              <button 
                className="text-[#9c9aa5] hover:text-[#ffaeaf] transition-colors" 
                onClick={() => setIsContactModalOpen(false)}
              >
                <X className="size-6" />
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="font-['Saira:Regular',sans-serif] text-[13px] text-[#9c9aa5] mb-2 block">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] focus:border-[#ffaeaf] focus:shadow-[0_0_10px_rgba(255,174,175,0.3)] rounded-[8px] px-4 py-2 text-white placeholder:text-[#9c9aa5] font-['Saira:Regular',sans-serif] text-[16px] outline-none transition-all"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label className="font-['Saira:Regular',sans-serif] text-[13px] text-[#9c9aa5] mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] focus:border-[#ffaeaf] focus:shadow-[0_0_10px_rgba(255,174,175,0.3)] rounded-[8px] px-4 py-2 text-white placeholder:text-[#9c9aa5] font-['Saira:Regular',sans-serif] text-[16px] outline-none transition-all"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="font-['Saira:Regular',sans-serif] text-[13px] text-[#9c9aa5] mb-2 block">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] focus:border-[#ffaeaf] focus:shadow-[0_0_10px_rgba(255,174,175,0.3)] rounded-[8px] px-4 py-2 text-white placeholder:text-[#9c9aa5] font-['Saira:Regular',sans-serif] text-[16px] outline-none transition-all resize-none"
                  placeholder="How can we help you?"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-[#ffaeaf] hover:bg-[#ff9e9f] transition-colors px-6 py-3 rounded-[8px] mt-6"
                onClick={(e) => {
                  e.preventDefault();
                  setIsContactModalOpen(false);
                }}
              >
                <p className="font-['Saira:Regular',sans-serif] text-[14px] text-[#121212]">
                  Send Message
                </p>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {isFeedbackModalOpen && (
        <div 
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-[10000] pointer-events-auto"
          style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          onClick={() => setIsFeedbackModalOpen(false)}
        >
          <div 
            className="bg-[#1f1e1e] border border-[#3a3a3a] rounded-[16px] p-6 md:p-8 w-[90vw] max-w-[500px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <p className="font-['Audiowide:Regular',sans-serif] text-[20px] md:text-[24px] text-white tracking-[-0.9px] uppercase">
                Leave Feedback
              </p>
              <button 
                className="text-[#9c9aa5] hover:text-[#ffaeaf] transition-colors" 
                onClick={() => setIsFeedbackModalOpen(false)}
              >
                <X className="size-6" />
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <textarea
                  rows={6}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] focus:border-[#ffaeaf] focus:shadow-[0_0_10px_rgba(255,174,175,0.3)] rounded-[8px] px-4 py-2 text-white placeholder:text-[#9c9aa5] font-['Saira:Regular',sans-serif] text-[16px] outline-none transition-all resize-none"
                  placeholder="Share your thoughts about Raven..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-[#ffaeaf] hover:bg-[#ff9e9f] transition-colors px-6 py-3 rounded-[8px] mt-6"
                onClick={(e) => {
                  e.preventDefault();
                  setIsFeedbackModalOpen(false);
                }}
              >
                <p className="font-['Saira:Regular',sans-serif] text-[14px] text-[#121212]">
                  Submit Feedback
                </p>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

