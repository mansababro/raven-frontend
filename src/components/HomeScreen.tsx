import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Send, Menu, X, ExternalLink } from 'lucide-react';
import { signOut } from '../store/slices/authSlice';
import type { AppDispatch, RootState } from '../store/store';
import ravenImage from 'figma:asset/3f1fb69e880c4e8470b4367ae3fec8808445b0a5.png';

// =============================================================================
// TYPES
// =============================================================================

type OnboardingMessage = {
  id: number;
  role: 'assistant' | 'user';
  content: string;
  type?: 'question';
  questionType?: 'music' | 'vibe' | 'artists';
};

type ChatMessage = {
  id: number;
  role: 'assistant' | 'user';
  content: string;
  type?: 'events';
};

type HomeScreenProps = {
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
  onLogout?: () => void;
};

// =============================================================================
// CONSTANTS
// =============================================================================

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

const mockEvents = [
  {
    id: 1,
    name: 'Midnight Frequencies',
    date: 'Fri, Dec 13 • 11:00 PM',
    venue: 'The Warehouse District',
    address: '245 Industrial Ave, Brooklyn, NY 11211',
    mapsLink: 'https://maps.google.com/?q=245+Industrial+Ave+Brooklyn+NY',
    genres: ['Melodic Techno', 'Progressive House'],
    artist: 'Nina Kraviz',
    image: 'https://images.unsplash.com/photo-1676969609758-b3bdfe8e0b53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm8lMjBjbHViJTIwcGFydHl8ZW58MXx8fHwxNzY1Mjg1MDY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    lineup: ['Nina Kraviz', 'Tale Of Us', 'Amelie Lens', 'Ben Klock'],
    description: 'This one\'s going to be special. Think deep, hypnotic grooves that build slowly and take you on a journey. The crowd here really gets it - you won\'t find phone zombies, just people lost in the music. The sound system is pristine, and with this lineup, expect those goosebump moments around 3 AM when the whole room moves as one. Perfect if you\'re into that transcendent warehouse experience.'
  },
  {
    id: 2,
    name: 'Underground Sessions',
    date: 'Sat, Dec 14 • 10:00 PM',
    venue: 'Basement Club',
    address: '89 Lafayette St, New York, NY 10013',
    mapsLink: 'https://maps.google.com/?q=89+Lafayette+St+New+York+NY',
    genres: ['Tech House', 'Techno', 'Industrial'],
    artist: 'Charlotte de Witte',
    image: 'https://images.unsplash.com/photo-1702848616864-26cf44a17f2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjByYXZlfGVufDF8fHx8MTc2NTI4NTA2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    lineup: ['Charlotte de Witte', 'Richie Hawtin', 'Adam Beyer', 'Enrico Sangiuliano', 'Ida Engberg', 'Amelie Lens', 'I Hate Models', 'Kobosil', 'Dax J', 'Rebekah', 'SNTS', 'Femme Fatale'],
    description: 'Raw. Unfiltered. No-nonsense techno that hits hard from start to finish. This is for the purists - the kind of night where you leave your ego at the door and surrender to relentless, driving basslines. The intimate setting means you\'ll feel every kick drum in your chest. Charlotte and this crew don\'t do commercial sets - expect the dark, industrial sound that made underground techno what it is. Come ready to sweat.'
  },
  {
    id: 3,
    name: 'Euphoria Festival',
    date: 'Sun, Dec 15 • 6:00 PM',
    venue: 'Central Park Arena',
    address: 'Central Park West & 85th St, New York, NY 10024',
    mapsLink: 'https://maps.google.com/?q=Central+Park+West+85th+St+New+York+NY',
    genres: ['House', 'Techno'],
    artist: 'Ben Böhmer',
    image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGZlc3RpdmFsJTIwY3Jvd2R8ZW58MXx8fHwxNzY1MjIzMjI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    lineup: ['Ben Böhmer', 'Stephan Bodzin', 'Massano'],
    description: 'Picture this: open air, incredible production, and a sunset that melts into night as the music evolves. This is more about the experience than just the music - though with Ben Böhmer leading the charge, expect emotional, melodic moments that make you forget where you are. Great mix of house and techno throughout the night, multiple stages to explore, and a crowd that\'s here for good vibes. Bring your friends, this one\'s a celebration.'
  }
];

// =============================================================================
// COMPONENT
// =============================================================================

export function HomeScreen({ onPrivacyClick = () => {}, onTermsClick = () => {}, onLogout }: HomeScreenProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const userEmail = user?.email || 'user@example.com';

  // Screen state - determines if we show onboarding or chat
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem('raven_onboarding_complete') === 'true';
  });

  // =============================================================================
  // ONBOARDING STATE
  // =============================================================================
  const [onboardingMessages, setOnboardingMessages] = useState<OnboardingMessage[]>([
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
  const [showSpline, setShowSpline] = useState(true);

  // =============================================================================
  // CHAT STATE
  // =============================================================================
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const userGenres = JSON.parse(localStorage.getItem('raven_user_genres') || '[]');
    const userVibes = JSON.parse(localStorage.getItem('raven_user_vibes') || '[]');
    const userArtists = localStorage.getItem('raven_user_artists') || '';

    return [
      {
        id: 1,
        role: 'assistant',
        content: userGenres.length > 0 || userVibes.length > 0 || userArtists 
          ? 'Based on your taste, here are some events you might love:'
          : 'Here are some events happening soon:'
      },
      {
        id: 2,
        role: 'assistant',
        content: '',
        type: 'events'
      },
      {
        id: 3,
        role: 'assistant',
        content: 'Ask me anything about nightlife, venues, or events!'
      }
    ];
  });
  const [chatInputValue, setChatInputValue] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<typeof mockEvents[0] | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // =============================================================================
  // SHARED STATE
  // =============================================================================
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const eventsScrollRef = useRef<HTMLDivElement>(null);

  // =============================================================================
  // EFFECTS
  // =============================================================================

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [onboardingMessages, chatMessages]);

  // Handle onboarding completion
  useEffect(() => {
    if (currentQuestion === 'complete') {
      // Store onboarding data in localStorage
      localStorage.setItem('raven_onboarding_complete', 'true');
      localStorage.setItem('raven_user_genres', JSON.stringify(selectedGenres));
      localStorage.setItem('raven_user_vibes', JSON.stringify(selectedVibes));
      localStorage.setItem('raven_user_artists', artistsInput);
      
      // Transition to chat after a brief delay
      setTimeout(() => {
        // Update chat messages with new preferences
        const userGenres = selectedGenres;
        const userVibes = selectedVibes;
        const userArtists = artistsInput;

        setChatMessages([
          {
            id: 1,
            role: 'assistant',
            content: userGenres.length > 0 || userVibes.length > 0 || userArtists 
              ? 'Based on your taste, here are some events you might love:'
              : 'Here are some events happening soon:'
          },
          {
            id: 2,
            role: 'assistant',
            content: '',
            type: 'events'
          },
          {
            id: 3,
            role: 'assistant',
            content: 'Ask me anything about nightlife, venues, or events!'
          }
        ]);

        setHasCompletedOnboarding(true);
      }, 500);
    }
  }, [currentQuestion, selectedGenres, selectedVibes, artistsInput]);

  // Click outside handler for menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load Spline viewer script
  useEffect(() => {
    if (customElements.get('spline-viewer')) {
      return;
    }

    if ((window as any).__SPLINE_LOADING__) {
      return;
    }

    const existingScript = document.querySelector('script[src*="spline-viewer"]');
    if (existingScript) {
      (window as any).__SPLINE_LOADING__ = true;
      return;
    }

    (window as any).__SPLINE_LOADING__ = true;

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

  // =============================================================================
  // ONBOARDING HANDLERS
  // =============================================================================

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

    setShowSpline(false);

    const userMessage: OnboardingMessage = {
      id: onboardingMessages.length + 1,
      role: 'user',
      content: selectedGenres.join(', ')
    };

    const nextQuestion: OnboardingMessage = {
      id: onboardingMessages.length + 2,
      role: 'assistant',
      content: 'What kind of party vibe do you usually go for?',
      type: 'question',
      questionType: 'vibe'
    };

    setOnboardingMessages([...onboardingMessages, userMessage, nextQuestion]);
    setCurrentQuestion('vibe');
  };

  const handleVibeSubmit = () => {
    if (selectedVibes.length === 0) return;

    const userMessage: OnboardingMessage = {
      id: onboardingMessages.length + 1,
      role: 'user',
      content: selectedVibes.join(', ')
    };

    const nextQuestion: OnboardingMessage = {
      id: onboardingMessages.length + 2,
      role: 'assistant',
      content: 'Are there any artists/DJs you love or follow?',
      type: 'question',
      questionType: 'artists'
    };

    setOnboardingMessages([...onboardingMessages, userMessage, nextQuestion]);
    setCurrentQuestion('artists');
  };

  const handleArtistsSubmit = () => {
    if (!artistsInput.trim()) return;

    const userMessage: OnboardingMessage = {
      id: onboardingMessages.length + 1,
      role: 'user',
      content: artistsInput
    };

    const completeMessage: OnboardingMessage = {
      id: onboardingMessages.length + 2,
      role: 'assistant',
      content: 'Perfect! Taking you to discover some events...'
    };

    setOnboardingMessages([...onboardingMessages, userMessage, completeMessage]);
    setCurrentQuestion('complete');
  };

  const handleSkipMusic = () => {
    setShowSpline(false);

    const skipMessage: OnboardingMessage = {
      id: onboardingMessages.length + 1,
      role: 'user',
      content: '(Skipped)'
    };

    const nextQuestion: OnboardingMessage = {
      id: onboardingMessages.length + 2,
      role: 'assistant',
      content: 'What kind of party vibe do you usually go for?',
      type: 'question',
      questionType: 'vibe'
    };

    setOnboardingMessages([...onboardingMessages, skipMessage, nextQuestion]);
    setCurrentQuestion('vibe');
  };

  const handleSkipVibe = () => {
    const skipMessage: OnboardingMessage = {
      id: onboardingMessages.length + 1,
      role: 'user',
      content: '(Skipped)'
    };

    const nextQuestion: OnboardingMessage = {
      id: onboardingMessages.length + 2,
      role: 'assistant',
      content: 'Are there any artists/DJs you love or follow?',
      type: 'question',
      questionType: 'artists'
    };

    setOnboardingMessages([...onboardingMessages, skipMessage, nextQuestion]);
    setCurrentQuestion('artists');
  };

  const handleSkipArtists = () => {
    const skipMessage: OnboardingMessage = {
      id: onboardingMessages.length + 1,
      role: 'user',
      content: '(Skipped)'
    };

    const completeMessage: OnboardingMessage = {
      id: onboardingMessages.length + 2,
      role: 'assistant',
      content: 'No worries! Taking you to discover some events...'
    };

    setOnboardingMessages([...onboardingMessages, skipMessage, completeMessage]);
    setCurrentQuestion('complete');
  };

  const handleOnboardingKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentQuestion === 'artists') {
        handleArtistsSubmit();
      }
    }
  };

  // =============================================================================
  // CHAT HANDLERS
  // =============================================================================

  const handleChatSend = () => {
    if (!chatInputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: chatMessages.length + 1,
      role: 'user',
      content: chatInputValue
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatInputValue('');

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: chatMessages.length + 2,
        role: 'assistant',
        content: 'Great question! Based on your preferences, let me suggest some spots...'
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleChatKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSend();
    }
  };

  const handleScrollToNext = () => {
    if (eventsScrollRef.current) {
      const cardWidth = 320;
      const gap = 16;
      const scrollAmount = cardWidth + gap;
      
      eventsScrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleScrollToPrevious = () => {
    if (eventsScrollRef.current) {
      const cardWidth = 320;
      const gap = 16;
      const scrollAmount = cardWidth + gap;
      
      eventsScrollRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (eventsScrollRef.current) {
      const currentScrollLeft = eventsScrollRef.current.scrollLeft;

      if (currentScrollLeft > 0) {
        setShowLeftArrow(true);
      } else {
        setShowLeftArrow(false);
      }

      if (currentScrollLeft < eventsScrollRef.current.scrollWidth - eventsScrollRef.current.clientWidth) {
        setShowRightArrow(true);
      } else {
        setShowRightArrow(false);
      }
    }
  };

  // =============================================================================
  // SHARED HANDLERS
  // =============================================================================

  const handleLogout = async () => {
    await dispatch(signOut());
    localStorage.removeItem('raven_onboarding_complete');
    localStorage.removeItem('raven_user_genres');
    localStorage.removeItem('raven_user_vibes');
    localStorage.removeItem('raven_user_artists');
    onLogout?.();
  };

  const handleDeleteAccount = async () => {
    console.log('Delete account clicked');
    await handleLogout();
  };

  // =============================================================================
  // RENDER HELPERS
  // =============================================================================

  const renderHeader = () => (
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
            <div className="px-4 py-3 border-b border-[#3a3a3a]">
              <p className="font-['Saira:Regular',sans-serif] text-[12px] text-[#9c9aa5]">
                {userEmail}
              </p>
            </div>

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
  );

  const renderContactModal = () => (
    isContactModalOpen && (
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
    )
  );

  const renderFeedbackModal = () => (
    isFeedbackModalOpen && (
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
    )
  );

  const renderEventDetailsModal = () => (
    selectedEvent && (
      <div 
        className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-[10000] pointer-events-auto px-4 py-8"
        style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        onClick={() => setSelectedEvent(null)}
      >
        <div 
          className="bg-[#1f1e1e] border border-[#3a3a3a] rounded-[16px] p-6 md:p-8 w-full max-w-[600px] max-h-full overflow-y-auto shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="sticky top-0 left-full ml-auto mb-6 text-[#9c9aa5] hover:text-[#ffaeaf] transition-colors shrink-0 z-10 bg-[#1f1e1e] p-1 rounded-[8px]" 
            onClick={() => setSelectedEvent(null)}
          >
            <X className="size-6" />
          </button>

          <div className="flex items-start justify-between -mt-12 mb-6">
            <div className="flex-1 pr-4">
              <p className="font-['Audiowide:Regular',sans-serif] text-[22px] md:text-[28px] text-white tracking-[-0.9px] uppercase mb-3">
                {selectedEvent.name}
              </p>
              <p className="font-['Saira:Regular',sans-serif] text-[14px] text-[#ffaeaf] mb-1">
                {selectedEvent.date}
              </p>
              <p className="font-['Saira:Regular',sans-serif] text-[14px] text-[#e0e0e0] mb-1">
                {selectedEvent.venue}
              </p>
              <p className="font-['Saira:Regular',sans-serif] text-[12px] text-[#9c9aa5]">
                {selectedEvent.address} •{' '}
                <a 
                  href={selectedEvent.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#ffaeaf] transition-colors underline whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  Show on map
                </a>
              </p>
            </div>
          </div>

          <div 
            className="w-full h-[200px] rounded-[12px] bg-cover bg-center mb-6"
            style={{ backgroundImage: `url(${selectedEvent.image})` }}
          />

          <div className="mb-6 flex flex-wrap gap-2">
            {selectedEvent.genres.map((genre, index) => (
              <div key={index} className="inline-block bg-[linear-gradient(90deg,rgba(143,125,180,0.15)_0%,rgba(143,125,180,0.15)_100%),linear-gradient(90deg,rgb(31,30,30)_0%,rgb(31,30,30)_100%)] py-[6px] px-[18px] rounded-[8px]">
                <p className="font-['Saira:Regular',sans-serif] text-[13px] text-white uppercase tracking-wider">
                  {genre}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-6 flex gap-3 items-start">
            <div className="w-[30px] h-[30px] shrink-0 animate-hover">
              <img 
                src={ravenImage}
                alt="Raven"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] text-[#e0e0e0] leading-[1.6] flex-1">
              {selectedEvent.description}
            </p>
          </div>

          <div className="mb-6">
            <p className="font-['Saira:Regular',sans-serif] text-[16px] text-white mb-3 uppercase tracking-wide">
              Lineup
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedEvent.lineup.map((artist, index) => (
                <p 
                  key={index}
                  className="font-['Saira:Regular',sans-serif] text-[13px] text-white uppercase tracking-wider"
                >
                  {artist}{index < selectedEvent.lineup.length - 1 ? ',' : ''}
                </p>
              ))}
            </div>
          </div>

          <button
            className="w-full bg-[#ffaeaf] hover:bg-[#ff9e9f] transition-colors px-6 py-3 rounded-[8px] flex items-center justify-center gap-2"
          >
            <p className="font-['Saira:Regular',sans-serif] text-[16px] text-[#121212]">
              To the event page / tickets
            </p>
            <ExternalLink className="size-4 text-[#121212]" />
          </button>
        </div>
      </div>
    )
  );

  // =============================================================================
  // ONBOARDING RENDER
  // =============================================================================

  const renderOnboarding = () => (
    <>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-8 flex flex-col relative">
        <div className="max-w-[800px] mx-auto w-full">
          <div className="hidden md:block h-[20vh]"></div>
          
          <div className="space-y-6 relative z-20 pointer-events-none">
          {onboardingMessages.map((message, index) => {
            const lastAssistantMessageIndex = onboardingMessages.map((m, i) => ({ role: m.role, index: i })).reverse().find(m => m.role === 'assistant')?.index;
            const isLastAssistantMessage = message.role === 'assistant' && index === lastAssistantMessageIndex;
            const shouldShowRavenImage = isLastAssistantMessage && message.id !== 1 && message.id !== 2;

            return (
              <div key={message.id}>
                {message.id === 1 ? (
                  <div className="flex flex-col items-center mb-6 md:mb-16 gap-4">
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
                        onKeyPress={handleOnboardingKeyPress}
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
    </>
  );

  // =============================================================================
  // CHAT RENDER
  // =============================================================================

  const renderChat = () => (
    <>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-8 flex flex-col relative">
        <div className="max-w-[800px] mx-auto w-full">
          <div className="hidden md:block h-[10vh]"></div>
          
          <div className="space-y-6 relative z-20 pointer-events-none">
          {chatMessages.map((message, index) => {
            const lastAssistantMessageIndex = chatMessages.map((m, i) => ({ role: m.role, index: i })).reverse().find(m => m.role === 'assistant')?.index;
            const isLastAssistantMessage = message.role === 'assistant' && index === lastAssistantMessageIndex;

            return (
              <div key={message.id}>
                <div
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && isLastAssistantMessage && message.type !== 'events' && (
                    <div className="w-[30px] h-[30px] shrink-0 mr-3 animate-hover">
                      <img 
                        src={ravenImage}
                        alt="Raven"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  )}
                  {message.type !== 'events' && (
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
                  )}
                </div>

                {/* Event Cards */}
                {message.type === 'events' && (
                  <div className="mt-4 -mx-4 md:-mx-6 pointer-events-auto relative">
                    <div 
                      className="overflow-x-auto pb-2 scroll-smooth" 
                      ref={eventsScrollRef} 
                      onScroll={handleScroll}
                      style={{ 
                        WebkitOverflowScrolling: 'touch',
                        scrollSnapType: 'x mandatory',
                        scrollBehavior: 'smooth'
                      }}
                    >
                      <div className="flex gap-4 min-w-max" style={{ paddingLeft: 'calc(50vw - 140px)', paddingRight: 'calc(50vw - 140px)' }}>
                        {mockEvents.map((event) => (
                          <div
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className="relative w-[280px] md:w-[320px] h-[180px] rounded-[12px] overflow-hidden border border-[#3a3a3a] hover:border-[#ffaeaf] transition-colors cursor-pointer shrink-0"
                            style={{ scrollSnapAlign: 'center', scrollSnapStop: 'always' }}
                          >
                            <div
                              className="absolute inset-0 bg-cover bg-center"
                              style={{
                                backgroundImage: `url(${event.image})`,
                                filter: 'blur(8px)',
                                transform: 'scale(1.1)'
                              }}
                            />
                            
                            <div className="absolute inset-0 bg-black/75" />
                            
                            <div className="relative h-full p-5 flex flex-col justify-between">
                              <div>
                                <p className="font-['Audiowide:Regular',sans-serif] text-[18px] text-white mb-2 drop-shadow-lg">
                                  {event.name}
                                </p>
                                <p className="font-['Saira:Regular',sans-serif] text-[13px] text-[#ffaeaf] mb-1 drop-shadow-lg">
                                  {event.date}
                                </p>
                                <p className="font-['Saira:Regular',sans-serif] text-[13px] text-[#e0e0e0] drop-shadow-lg">
                                  {event.venue}
                                </p>
                              </div>
                              
                              <div className="w-full">
                                <p className="font-['Saira:Regular',sans-serif] text-[11px] text-[#b0b0b0] uppercase tracking-wider drop-shadow-lg mb-2">
                                  {event.genres.join(' • ')}
                                </p>
                                <button className="bg-[#ffaeaf] hover:bg-[#ff9e9f] transition-colors px-4 py-2 rounded-[8px] w-full">
                                  <p className="font-['Saira:Regular',sans-serif] text-[12px] text-[#121212]">
                                    Details and lineup
                                  </p>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {showRightArrow && (
                      <button
                        onClick={handleScrollToNext}
                        className="absolute right-0 top-0 h-[184px] w-24 flex items-center justify-end pr-6 pointer-events-auto group"
                        style={{
                          background: 'linear-gradient(270deg, rgba(18, 18, 18, 0.95) 0%, rgba(18, 18, 18, 0.7) 50%, rgba(18, 18, 18, 0) 100%)'
                        }}
                      >
                        <div className="bg-[#ffaeaf] hover:bg-[#ff9e9f] rounded-full p-2 shadow-lg transition-colors">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 18L15 12L9 6" stroke="#121212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </button>
                    )}
                    
                    {showLeftArrow && (
                      <button
                        onClick={handleScrollToPrevious}
                        className="absolute left-0 top-0 h-[184px] w-24 flex items-center justify-start pl-6 pointer-events-auto group"
                        style={{
                          background: 'linear-gradient(90deg, rgba(18, 18, 18, 0.95) 0%, rgba(18, 18, 18, 0.7) 50%, rgba(18, 18, 18, 0) 100%)'
                        }}
                      >
                        <div className="bg-[#ffaeaf] hover:bg-[#ff9e9f] rounded-full p-2 shadow-lg transition-colors">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="#121212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
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

      {/* Input */}
      <div className="bg-[#1f1e1e] border-t border-[#3a3a3a] px-6 py-4 shrink-0 relative z-10 pointer-events-auto">
        <div className="max-w-[800px] mx-auto">
          <div className="bg-[#2a2a2a] border border-[#ffaeaf] rounded-[12px] flex items-center gap-2 px-4 py-2">
            <input
              type="text"
              value={chatInputValue}
              onChange={(e) => setChatInputValue(e.target.value)}
              onKeyPress={handleChatKeyPress}
              placeholder="Ask about nightlife, venues, events..."
              className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-[#9c9aa5] font-['Saira:Regular',sans-serif] text-[16px]"
            />
            <button
              onClick={handleChatSend}
              className="bg-[#ffaeaf] hover:bg-[#ff9e9f] transition-colors p-2 rounded-[8px]"
            >
              <Send className="size-5 text-[#121212]" />
            </button>
          </div>
          <p className="font-['Saira:Regular',sans-serif] text-[11px] text-[#9c9aa5] text-center mt-2">
            Raven is in beta. Responses may not always be accurate.
          </p>
        </div>
      </div>
    </>
  );

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div className="bg-[#121212] relative size-full flex flex-col overflow-hidden max-w-full">
      {renderHeader()}
      
      {hasCompletedOnboarding ? renderChat() : renderOnboarding()}

      {renderContactModal()}
      {renderFeedbackModal()}
      {renderEventDetailsModal()}
    </div>
  );
}

