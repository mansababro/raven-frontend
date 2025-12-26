import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Send, Menu, X, ExternalLink, Loader2 } from 'lucide-react';
import { signOut } from '../store/slices/authSlice';
import { refreshProfile } from '../store/slices/authSlice';
import type { AppDispatch, RootState } from '../store/store';
import { apiClient } from '../lib/api';
import ravenImage from 'figma:asset/3f1fb69e880c4e8470b4367ae3fec8808445b0a5.png';
import { toast } from "sonner@2.0.3";

// =============================================================================
// TYPES
// =============================================================================

type PreferenceOption = {
  id: number;
  name: string;
};

type OnboardingMessage = {
  id: number;
  role: 'assistant' | 'user';
  content: string;
  type?: 'question';
  questionType?: 'music' | 'vibe' | 'avoid' | 'factors' | 'venueSizes' | 'artists';
};

type ParsedEvent = {
  id: number;
  name: string;
  date: string;
  venue: string;
  address?: string;
  mapsLink?: string;
  genres: string[];
  artist?: string;
  image: string;
  lineup?: string[];
  description?: string;
  ticketLink?: string;
};

type ChatMessage = {
  id: number;
  role: 'assistant' | 'user';
  content: string;
  type?: 'events';
  parsedEvents?: ParsedEvent[];
};

type HomeScreenProps = {
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
  onLogout?: () => void;
};

// =============================================================================
// CONSTANTS
// =============================================================================

// Fallback options if API fails (will be replaced by API data)
const fallbackGenres = [
  'Techno', 'Melodic Techno', 'House', 'Tech House', 'Disco', 'DNB/Bass',
  'Ambient', 'Dubstep', 'Garage', 'Rave', 'Hip Hop', 'Eclectic', 'Trance'
];

const fallbackVibes = [
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
  },
  {
    id: 4,
    name: 'Neon Nights',
    date: 'Mon, Dec 16 • 9:00 PM',
    venue: 'The Rooftop',
    address: '150 W 28th St, New York, NY 10001',
    mapsLink: 'https://maps.google.com/?q=150+W+28th+St+New+York+NY',
    genres: ['Disco', 'House', 'Funk'],
    artist: 'Purple Disco Machine',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNjbyUyMGNsdWJ8ZW58MXx8fHwxNzY1Mjg1MDY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    lineup: ['Purple Disco Machine', 'Folamour', 'Myd', 'Breakbot', 'The Magician'],
    description: 'Get ready to dance under the stars. This rooftop party brings that disco revival energy with infectious grooves that keep you moving all night. The vibe is pure fun - think mirror balls, neon lights, and a crowd that knows how to let loose. The sound system pumps out those classic disco beats mixed with modern house, creating an atmosphere that\'s both nostalgic and fresh. Perfect for when you want to feel good and move your body without taking things too seriously.'
  }
];

// =============================================================================
// PARSER FUNCTIONS
// =============================================================================

const parseEventsFromReply = (reply: string): ParsedEvent[] => {
  const events: ParsedEvent[] = [];
  
  // Split by separator (-----------------------------)
  const eventBlocks = reply.split(/-----------------------------\s*/);
  
  eventBlocks.forEach((block, index) => {
    const lines = block.trim().split('\n').map(line => line.trim()).filter(line => line);
    
    if (lines.length === 0) return;
    
    let name = '';
    let venue = '';
    let date = '';
    let ticketLink = '';
    let genres: string[] = [];
    
    lines.forEach((line) => {
      // Extract event name (✨ **NAME**)
      if (line.includes('✨') && line.includes('**')) {
        const nameMatch = line.match(/\*\*(.+?)\*\*/);
        if (nameMatch) {
          name = nameMatch[1].trim();
        }
      }
      // Extract venue (📍 Venue)
      else if (line.startsWith('📍')) {
        venue = line.replace('📍', '').trim();
      }
      // Extract date (📅 Date)
      else if (line.startsWith('📅')) {
        date = line.replace('📅', '').trim();
        // Format date: convert "2025-12-13" to "Fri, Dec 13"
        const dateMatch = date.match(/(\d{4})-(\d{2})-(\d{2})/);
        if (dateMatch) {
          const [, year, month, day] = dateMatch;
          const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          date = `${days[dateObj.getDay()]}, ${months[dateObj.getMonth()]} ${parseInt(day)}`;
        }
      }
      // Extract ticket link (URL on its own line, may have leading spaces)
      else if (line.includes('http://') || line.includes('https://')) {
        const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
        if (urlMatch) {
          ticketLink = urlMatch[1].trim();
        }
      }
      // Extract genres (🎵 Genres)
      else if (line.startsWith('🎵')) {
        const genreText = line.replace('🎵', '').trim();
        genres = genreText.split(/[\/•]/).map(g => g.trim()).filter(g => g);
      }
    });
    
    if (name && venue) {
      // Generate a default image URL
      const imageUrl = `https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080`;
      
      events.push({
        id: Date.now() + index, // Unique ID
        name,
        date: date || 'Date TBA',
        venue,
        genres: genres.length > 0 ? genres : ['Music'],
        image: imageUrl,
        ticketLink: ticketLink || undefined,
        mapsLink: venue ? `https://maps.google.com/?q=${encodeURIComponent(venue + ', New York')}` : undefined,
      });
    }
  });
  
  return events;
};

// =============================================================================
// COMPONENT
// =============================================================================

export function HomeScreen({ onPrivacyClick = () => {}, onTermsClick = () => {} }: HomeScreenProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, hasPreferences, loading: authLoading } = useSelector((state: RootState) => state.auth);
  const userEmail = user?.email || 'user@example.com';

  const safeJsonParse = <T,>(value: string | null, fallback: T): T => {
    if (value == null) return fallback;
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  };

  // Screen state - determines if we show onboarding or chat
  // Use API hasPreferences instead of localStorage
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return hasPreferences;
  });

  // Update hasCompletedOnboarding when hasPreferences changes from API
  useEffect(() => {
    setHasCompletedOnboarding(hasPreferences);
  }, [hasPreferences]);

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
  
  // Preference options from API
  const [preferenceOptions, setPreferenceOptions] = useState<{
    genres: PreferenceOption[];
    vibes: PreferenceOption[];
    avoid: PreferenceOption[];
    factors: PreferenceOption[];
    venueSizes: PreferenceOption[];
  }>({
    genres: [],
    vibes: [],
    avoid: [],
    factors: [],
    venueSizes: []
  });
  
  // Selected preferences (stored as IDs)
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<number[]>([]);
  const [selectedAvoid, setSelectedAvoid] = useState<number[]>([]);
  const [selectedFactors, setSelectedFactors] = useState<number[]>([]);
  const [selectedVenueSizes, setSelectedVenueSizes] = useState<number[]>([]);
  
  const [currentQuestion, setCurrentQuestion] = useState<'music' | 'vibe' | 'avoid' | 'factors' | 'venueSizes' | 'artists' | 'complete'>('music');
  const [artistsInput, setArtistsInput] = useState('');
  const [showSpline, setShowSpline] = useState(true);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  // =============================================================================
  // CHAT STATE
  // =============================================================================
  const getChatHistoryKey = (userId?: string) => {
    const id = userId || user?.id || 'anonymous';
    return `raven_chat_history_${id}`;
  };

  const getDefaultChatMessages = (): ChatMessage[] => {
    const userGenres = safeJsonParse<unknown[]>(localStorage.getItem('raven_user_genres'), []);
    const userVibes = safeJsonParse<unknown[]>(localStorage.getItem('raven_user_vibes'), []);
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
  };

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    // Try to load from localStorage using user ID if available
    const userId = user?.id;
    const historyKey = getChatHistoryKey(userId);
    const savedHistory = localStorage.getItem(historyKey);
    
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (error) {
        console.error('Failed to parse chat history from localStorage:', error);
      }
    }
    // Return default messages if no saved history
    return getDefaultChatMessages();
  });
  const [chatInputValue, setChatInputValue] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<(typeof mockEvents[0] | ParsedEvent) | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // =============================================================================
  // SHARED STATE
  // =============================================================================
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // =============================================================================
  // EFFECTS
  // =============================================================================

  // Fetch preference options from API on mount
  useEffect(() => {
    const fetchPreferenceOptions = async () => {
      setIsLoadingOptions(true);
      try {
        const [genres, vibes, avoid, factors, venueSizes] = await Promise.all([
          apiClient('/preferences/genres').catch(() => fallbackGenres.map((name, idx) => ({ id: idx + 1, name }))),
          apiClient('/preferences/vibes').catch(() => fallbackVibes.map((name, idx) => ({ id: idx + 1, name }))),
          apiClient('/preferences/avoid').catch(() => []),
          apiClient('/preferences/factors').catch(() => []),
          apiClient('/preferences/venue-sizes').catch(() => [])
        ]);

        setPreferenceOptions({
          genres: Array.isArray(genres) ? genres : [],
          vibes: Array.isArray(vibes) ? vibes : [],
          avoid: Array.isArray(avoid) ? avoid : [],
          factors: Array.isArray(factors) ? factors : [],
          venueSizes: Array.isArray(venueSizes) ? venueSizes : []
        });
      } catch (error) {
        console.error('Failed to fetch preference options:', error);
        // Use fallback options
        setPreferenceOptions({
          genres: fallbackGenres.map((name, idx) => ({ id: idx + 1, name })),
          vibes: fallbackVibes.map((name, idx) => ({ id: idx + 1, name })),
          avoid: [],
          factors: [],
          venueSizes: []
        });
      } finally {
        setIsLoadingOptions(false);
      }
    };

    if (!hasCompletedOnboarding) {
      fetchPreferenceOptions();
    }
  }, [hasCompletedOnboarding]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [onboardingMessages, chatMessages]);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (hasCompletedOnboarding && user?.id && chatMessages.length > 0) {
      try {
        const historyKey = getChatHistoryKey(user.id);
        localStorage.setItem(historyKey, JSON.stringify(chatMessages));
      } catch (error) {
        console.error('Failed to save chat history to localStorage:', error);
      }
    }
  }, [chatMessages, hasCompletedOnboarding, user?.id]);

  // Load chat history when user changes (login/logout)
  useEffect(() => {
    if (hasCompletedOnboarding && user?.id) {
      const historyKey = getChatHistoryKey(user.id);
      const savedHistory = localStorage.getItem(historyKey);
      
      if (savedHistory) {
        try {
          const parsed = JSON.parse(savedHistory) as ChatMessage[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            setChatMessages(parsed);
            return;
          }
        } catch (error) {
          console.error('Failed to parse chat history from localStorage:', error);
        }
      }
    } else if (!user?.id) {
      // User logged out, reset to default messages
      setChatMessages(getDefaultChatMessages());
    }
  }, [user?.id, hasCompletedOnboarding]);

  // Handle onboarding completion
  useEffect(() => {
    if (currentQuestion === 'complete') {
      // Store onboarding data in localStorage (as fallback/cache)
      localStorage.setItem('raven_onboarding_complete', 'true');
      localStorage.setItem('raven_user_genres', JSON.stringify(selectedGenres));
      localStorage.setItem('raven_user_vibes', JSON.stringify(selectedVibes));
      localStorage.setItem('raven_user_avoid', JSON.stringify(selectedAvoid));
      localStorage.setItem('raven_user_factors', JSON.stringify(selectedFactors));
      localStorage.setItem('raven_user_venue_sizes', JSON.stringify(selectedVenueSizes));
      localStorage.setItem('raven_user_artists', artistsInput);

      // Until backend PATCH/PUT is wired, treat onboarding completion as "has preferences"
      // so refresh lands in chat instead of restarting onboarding.
      const hasPrefs =
        selectedGenres.length > 0 ||
        selectedVibes.length > 0 ||
        selectedAvoid.length > 0 ||
        selectedFactors.length > 0 ||
        selectedVenueSizes.length > 0 ||
        !!artistsInput.trim();
      localStorage.setItem('raven_has_preferences', hasPrefs ? 'true' : 'false');
      
      // Transition to chat after a brief delay
      setTimeout(() => {
        // Update chat messages with new preferences
        const hasPrefs =
          selectedGenres.length > 0 ||
          selectedVibes.length > 0 ||
          selectedAvoid.length > 0 ||
          selectedFactors.length > 0 ||
          selectedVenueSizes.length > 0 ||
          !!artistsInput.trim();

        setChatMessages([
          {
            id: 1,
            role: 'assistant',
            content: hasPrefs
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

        // Mark onboarding as complete - the API submission already happened
        setHasCompletedOnboarding(true);
      }, 1000);
    }
  }, [currentQuestion, selectedGenres, selectedVibes, selectedAvoid, selectedFactors, selectedVenueSizes, artistsInput]);

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
      existingScript.addEventListener(
        'load',
        () => {
          (window as any).__SPLINE_LOADING__ = false;
        },
        { once: true }
      );
      existingScript.addEventListener(
        'error',
        () => {
          (window as any).__SPLINE_LOADING__ = false;
        },
        { once: true }
      );
      return;
    }

    (window as any).__SPLINE_LOADING__ = true;

    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.9.48/build/spline-viewer.js';
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      (window as any).__SPLINE_LOADING__ = false;
    };
    script.onerror = () => {
      console.error('Failed to load Spline viewer script');
      (window as any).__SPLINE_LOADING__ = false;
    };
    document.head.appendChild(script);
  }, []);

  // =============================================================================
  // ONBOARDING HANDLERS
  // =============================================================================

  const handlePreferenceToggle = (
    category: 'genres' | 'vibes' | 'avoid' | 'factors' | 'venueSizes',
    id: number
  ) => {
    const setters = {
      genres: setSelectedGenres,
      vibes: setSelectedVibes,
      avoid: setSelectedAvoid,
      factors: setSelectedFactors,
      venueSizes: setSelectedVenueSizes
  };

    const setter = setters[category];
    const isMultiSelect = category !== 'venueSizes'; // venueSizes can be single or multi, defaulting to multi

    if (isMultiSelect) {
      setter(prev =>
        prev.includes(id)
          ? prev.filter(itemId => itemId !== id)
          : [...prev, id]
      );
    } else {
      // For single select (if needed)
      setter(prev => prev.includes(id) ? [] : [id]);
    }
  };

  const handleMusicSubmit = () => {
    if (selectedGenres.length === 0) return;

    setShowSpline(false);

    const selectedNames = selectedGenres
      .map(id => preferenceOptions.genres.find(g => g.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const userMessage: OnboardingMessage = {
      id: onboardingMessages.length + 1,
      role: 'user',
      content: selectedNames
    };

    const nextQuestion: OnboardingMessage = {
      id: onboardingMessages.length + 2,
      role: 'assistant',
      content: 'What kind of party vibe are you looking for?',
      type: 'question',
      questionType: 'vibe'
    };

    setOnboardingMessages([...onboardingMessages, userMessage, nextQuestion]);
    setCurrentQuestion('vibe');
  };

  const handleVibeSubmit = () => {
    if (selectedVibes.length === 0) return;

    const selectedNames = selectedVibes
      .map(id => preferenceOptions.vibes.find(v => v.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const userMessage: OnboardingMessage = {
      id: onboardingMessages.length + 1,
      role: 'user',
      content: selectedNames
    };

    const nextQuestion: OnboardingMessage = {
      id: onboardingMessages.length + 2,
      role: 'assistant',
      content: 'What would you like to avoid?',
      type: 'question',
      questionType: 'avoid'
    };

    setOnboardingMessages([...onboardingMessages, userMessage, nextQuestion]);
    setCurrentQuestion('avoid');
  };

  const handleAvoidSubmit = () => {
    const selectedNames = selectedAvoid
      .map(id => preferenceOptions.avoid.find(a => a.id === id)?.name)
      .filter(Boolean)
      .join(', ') || 'Nothing specific';

    const userMessage: OnboardingMessage = {
      id: onboardingMessages.length + 1,
      role: 'user',
      content: selectedNames
    };

    const nextQuestion: OnboardingMessage = {
      id: onboardingMessages.length + 2,
      role: 'assistant',
      content: 'What matters most to you when choosing an event?',
      type: 'question',
      questionType: 'factors'
    };

    setOnboardingMessages([...onboardingMessages, userMessage, nextQuestion]);
    setCurrentQuestion('factors');
  };

  const handleFactorsSubmit = () => {
    if (selectedFactors.length === 0) return;

    const selectedNames = selectedFactors
      .map(id => preferenceOptions.factors.find(f => f.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const userMessage: OnboardingMessage = {
      id: onboardingMessages.length + 1,
      role: 'user',
      content: selectedNames
    };

    const nextQuestion: OnboardingMessage = {
      id: onboardingMessages.length + 2,
      role: 'assistant',
      content: 'What size venues do you prefer?',
      type: 'question',
      questionType: 'venueSizes'
    };

    setOnboardingMessages([...onboardingMessages, userMessage, nextQuestion]);
    setCurrentQuestion('venueSizes');
  };

  const handleVenueSizesSubmit = () => {
    if (selectedVenueSizes.length === 0) return;

    const selectedNames = selectedVenueSizes
      .map(id => preferenceOptions.venueSizes.find(vs => vs.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const userMessage: OnboardingMessage = {
      id: onboardingMessages.length + 1,
      role: 'user',
      content: selectedNames
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

  const handleArtistsSubmit = async () => {
    const artistsText = artistsInput.trim() || 'None';

    const userMessage: OnboardingMessage = {
      id: onboardingMessages.length + 1,
      role: 'user',
      content: artistsText
    };

    const completeMessage: OnboardingMessage = {
      id: onboardingMessages.length + 2,
      role: 'assistant',
      content: 'Perfect! Saving your preferences and taking you to discover some events...'
    };

    setOnboardingMessages([...onboardingMessages, userMessage, completeMessage]);
    setCurrentQuestion('complete');

    // Submit user profile + preferences to backend
    try {
      setIsLoadingPreferences(true);
      const userId = user?.id;
      if (!userId) throw new Error('No user id');

      await apiClient(`/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          // Required by backend (can be null)
          venue_size_id: selectedVenueSizes[0] ?? null,
          // Free text field; we use the artists question as "additional context"
          additional_context: artistsText !== 'None' ? artistsText : '',
          genres: selectedGenres,
          vibes: selectedVibes,
          avoid: selectedAvoid,
          factors: selectedFactors,
        }),
      });

      // Pull latest preferences/profile back into Redux so /home instantly flips to chat reliably
      await dispatch(refreshProfile());

      toast.success("Preferences saved", {
        description: "You're all set.",
        style: { backgroundColor: "#1f1e1e", border: "1px solid #ffaeaf", color: "#fff" },
      });
    } catch (error) {
      console.error('Failed to save preferences:', error);
      toast.error("Couldn't save preferences", {
        description: "Please try again.",
        style: { backgroundColor: "#1f1e1e", border: "1px solid #ffaeaf", color: "#fff" },
      });
      // Continue even if save fails - preferences are stored in localStorage as fallback
    } finally {
      setIsLoadingPreferences(false);
    }
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
      content: 'What kind of party vibe are you looking for?',
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
      content: 'What would you like to avoid?',
      type: 'question',
      questionType: 'avoid'
    };

    setOnboardingMessages([...onboardingMessages, skipMessage, nextQuestion]);
    setCurrentQuestion('avoid');
  };

  const handleSkipAvoid = () => {
    const skipMessage: OnboardingMessage = {
      id: onboardingMessages.length + 1,
      role: 'user',
      content: '(Skipped)'
    };

    const nextQuestion: OnboardingMessage = {
      id: onboardingMessages.length + 2,
      role: 'assistant',
      content: 'What matters most to you when choosing an event?',
      type: 'question',
      questionType: 'factors'
    };

    setOnboardingMessages([...onboardingMessages, skipMessage, nextQuestion]);
    setCurrentQuestion('factors');
  };

  const handleSkipFactors = () => {
    const skipMessage: OnboardingMessage = {
      id: onboardingMessages.length + 1,
      role: 'user',
      content: '(Skipped)'
    };

    const nextQuestion: OnboardingMessage = {
      id: onboardingMessages.length + 2,
      role: 'assistant',
      content: 'What size venues do you prefer?',
      type: 'question',
      questionType: 'venueSizes'
    };

    setOnboardingMessages([...onboardingMessages, skipMessage, nextQuestion]);
    setCurrentQuestion('venueSizes');
  };

  const handleSkipVenueSizes = () => {
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

  const handleSkipArtists = async () => {
    const skipMessage: OnboardingMessage = {
      id: onboardingMessages.length + 1,
      role: 'user',
      content: '(Skipped)'
    };

    const completeMessage: OnboardingMessage = {
      id: onboardingMessages.length + 2,
      role: 'assistant',
      content: 'No worries! Saving your preferences and taking you to discover some events...'
    };

    setOnboardingMessages([...onboardingMessages, skipMessage, completeMessage]);
    setCurrentQuestion('complete');

    // Submit user profile + preferences to backend
    try {
      setIsLoadingPreferences(true);
      const userId = user?.id;
      if (!userId) throw new Error('No user id');

      await apiClient(`/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          venue_size_id: selectedVenueSizes[0] ?? null,
          additional_context: '',
          genres: selectedGenres,
          vibes: selectedVibes,
          avoid: selectedAvoid,
          factors: selectedFactors,
        }),
      });

      await dispatch(refreshProfile());

      toast.success("Preferences saved", {
        description: "You're all set.",
        style: { backgroundColor: "#1f1e1e", border: "1px solid #ffaeaf", color: "#fff" },
      });
    } catch (error) {
      console.error('Failed to save preferences:', error);
      toast.error("Couldn't save preferences", {
        description: "Please try again.",
        style: { backgroundColor: "#1f1e1e", border: "1px solid #ffaeaf", color: "#fff" },
      });
    } finally {
      setIsLoadingPreferences(false);
    }
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

  const handleChatSend = async () => {
    if (!chatInputValue.trim() || isChatLoading) return;

    const userMessage = chatInputValue.trim();
    const userId = user?.id;

    if (!userId) {
      toast.error("Unable to send message", {
        description: "Please log in again.",
        style: { backgroundColor: "#1f1e1e", border: "1px solid #ffaeaf", color: "#fff" },
      });
      return;
    }

    const newMessage: ChatMessage = {
      id: chatMessages.length + 1,
      role: 'user',
      content: userMessage
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatInputValue('');
    setIsChatLoading(true);

    try {
      const response = await apiClient('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          userId: userId,
          message: userMessage
        }),
      });

      const reply = response.reply || 'I apologize, but I couldn\'t generate a response. Please try again.';
      
      // Parse events from the reply
      const parsedEvents = parseEventsFromReply(reply);
      
      // Use simple message when events are detected, otherwise use the full reply
      const messageContent = parsedEvents.length > 0 
        ? 'Here are some listed events:'
        : reply;
      
      const aiResponse: ChatMessage = {
        id: chatMessages.length + 2,
        role: 'assistant',
        content: messageContent,
        ...(parsedEvents.length > 0 && { 
          type: 'events',
          parsedEvents 
        })
      };
      setChatMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Failed to send chat message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Request failed';
      
      const errorResponse: ChatMessage = {
        id: chatMessages.length + 2,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.'
      };
      setChatMessages(prev => [...prev, errorResponse]);

      toast.error("Failed to send message", {
        description: errorMessage,
        style: { backgroundColor: "#1f1e1e", border: "1px solid #ffaeaf", color: "#fff" },
      });
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleChatKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSend();
    }
  };

  // (events carousel removed; cards are rendered as a grid)

  // =============================================================================
  // SHARED HANDLERS
  // =============================================================================

  const handleLogout = () => {
    // Don't await: on refresh, there may be in-flight auth/profile calls. Navigating immediately
    // ensures the user leaves /home even if Supabase/network is slow.
    dispatch(signOut());
    navigate('/login', { replace: true });
  };

  const handleDeleteAccount = async () => {
    console.log('Delete account clicked');
    handleLogout();
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
              <button className="w-full px-4 py-2 text-left hover:bg-[#2a2a2a] transition-colors" onClick={() => { setIsMenuOpen(false); navigate('/settings'); }}>
                <p className="font-['Saira:Regular',sans-serif] text-[14px] text-white">
                  User Settings
                </p>
              </button>
              
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
        <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]"/>
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
        className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-[10000] pointer-events-auto px-4 py-8 animate-modal-backdrop"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        onClick={() => setSelectedEvent(null)}
      >
        <div 
          className="bg-[#1f1e1e] border border-[#3a3a3a] rounded-[16px] p-6 md:p-8 w-full max-w-[600px] max-h-full overflow-y-auto overflow-x-hidden shadow-2xl relative no-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gradient Light Overlay */}
          <div className="modal-gradient-light" />

          <button 
            className="sticky top-0 left-full ml-auto mb-6 text-[#9c9aa5] hover:text-[#ffaeaf] transition-colors shrink-0 z-10 bg-[#1f1e1e] p-1 rounded-[8px]" 
            onClick={() => setSelectedEvent(null)}
          >
            <X className="size-6" />
          </button>

          <div className="flex items-start justify-between -mt-12 mb-6 animate-modal-content" style={{ animationDelay: '0.1s' }}>
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
              {selectedEvent.address && (
                <p className="font-['Saira:Regular',sans-serif] text-[12px] text-[#9c9aa5]">
                  {selectedEvent.address} •{' '}
                  {selectedEvent.mapsLink && (
                    <a 
                      href={selectedEvent.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#ffaeaf] transition-colors underline whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Show on map
                    </a>
                  )}
                </p>
              )}
              {!selectedEvent.address && selectedEvent.mapsLink && (
                <p className="font-['Saira:Regular',sans-serif] text-[12px] text-[#9c9aa5]">
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
              )}
            </div>
          </div>

          <div 
            className="w-full h-[200px] rounded-[12px] bg-cover bg-center mb-6 animate-modal-content"
            style={{ backgroundImage: `url(${selectedEvent.image})`, animationDelay: '0.2s' }}
          />

          <div className="mb-6 flex flex-wrap gap-2 animate-modal-content" style={{ animationDelay: '0.3s' }}>
            {selectedEvent.genres.map((genre, index) => (
              <div key={index} className="inline-block bg-[linear-gradient(90deg,rgba(143,125,180,0.15)_0%,rgba(143,125,180,0.15)_100%),linear-gradient(90deg,rgb(31,30,30)_0%,rgb(31,30,30)_100%)] py-[6px] px-[18px] rounded-[8px]">
                <p className="font-['Saira:Regular',sans-serif] text-[13px] text-white uppercase tracking-wider">
                  {genre}
                </p>
              </div>
            ))}
          </div>

          {selectedEvent.description && (
            <div className="mb-6 flex gap-3 items-start animate-modal-content" style={{ animationDelay: '0.4s' }}>
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
          )}

          {selectedEvent.lineup && selectedEvent.lineup.length > 0 && (
            <div className="mb-6 animate-modal-content" style={{ animationDelay: '0.5s' }}>
              <p className="font-['Saira:Regular',sans-serif] text-[16px] text-white mb-3 uppercase tracking-wide">
                Lineup
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedEvent.lineup.map((artist, index) => {
                  const lineupLength = selectedEvent.lineup?.length || 0;
                  return (
                    <p 
                      key={index}
                      className="font-['Saira:Regular',sans-serif] text-[13px] text-white uppercase tracking-wider"
                    >
                      {artist}{index < lineupLength - 1 ? ',' : ''}
                    </p>
                  );
                })}
              </div>
            </div>
          )}

          {'ticketLink' in selectedEvent && selectedEvent.ticketLink && (
            <a
              href={selectedEvent.ticketLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#ffaeaf] hover:bg-[#ff9e9f] transition-colors px-6 py-3 rounded-[8px] flex items-center justify-center gap-2 animate-modal-content block text-center"
              style={{ animationDelay: '0.6s' }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="font-['Saira:Regular',sans-serif] text-[16px] text-[#121212]">
                Get Tickets
              </p>
              <ExternalLink className="size-4 text-[#121212]" />
            </a>
          )}
          {(!('ticketLink' in selectedEvent) || !selectedEvent.ticketLink) && (
            <button
              className="w-full bg-[#ffaeaf] hover:bg-[#ff9e9f] transition-colors px-6 py-3 rounded-[8px] flex items-center justify-center gap-2 animate-modal-content"
              style={{ animationDelay: '0.6s' }}
            >
              <p className="font-['Saira:Regular',sans-serif] text-[16px] text-[#121212]">
                To the event page / tickets
              </p>
              <ExternalLink className="size-4 text-[#121212]" />
            </button>
          )}
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
                    {isLoadingOptions ? (
                      <div className="text-[#9c9aa5] font-['Saira:Regular',sans-serif] text-[14px]">
                        Loading genres...
                      </div>
                    ) : (
                      <>
                    <div className="flex flex-wrap gap-2">
                          {preferenceOptions.genres.map((genre) => (
                        <button
                              key={genre.id}
                              onClick={() => handlePreferenceToggle('genres', genre.id)}
                          className={`py-[6px] px-[18px] rounded-[8px] transition-all flex items-center justify-center ${
                                selectedGenres.includes(genre.id)
                              ? 'bg-[#8f7db4] text-[#121212]'
                              : 'bg-[#1f1e1e] text-white hover:bg-[linear-gradient(90deg,rgba(143,125,180,0.15)_0%,rgba(143,125,180,0.15)_100%),linear-gradient(90deg,rgb(31,30,30)_0%,rgb(31,30,30)_100%)]'
                          }`}
                        >
                          <p className="font-['Saira:Regular',sans-serif] text-[13px] leading-[19.5px]">
                                {genre.name}
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
                      </>
                    )}
                  </div>
                )}

                {/* Party Vibe Selection */}
                {message.questionType === 'vibe' && currentQuestion === 'vibe' && (
                  <div className="mt-4 space-y-3 pointer-events-auto">
                    {isLoadingOptions ? (
                      <div className="text-[#9c9aa5] font-['Saira:Regular',sans-serif] text-[14px]">
                        Loading vibes...
                      </div>
                    ) : (
                      <>
                    <div className="flex flex-wrap gap-2">
                          {preferenceOptions.vibes.map((vibe) => (
                        <button
                              key={vibe.id}
                              onClick={() => handlePreferenceToggle('vibes', vibe.id)}
                          className={`py-[6px] px-[18px] rounded-[8px] transition-all flex items-center justify-center ${
                                selectedVibes.includes(vibe.id)
                              ? 'bg-[#8f7db4] text-[#121212]'
                              : 'bg-[#1f1e1e] text-white hover:bg-[linear-gradient(90deg,rgba(143,125,180,0.15)_0%,rgba(143,125,180,0.15)_100%),linear-gradient(90deg,rgb(31,30,30)_0%,rgb(31,30,30)_100%)]'
                          }`}
                        >
                          <p className="font-['Saira:Regular',sans-serif] text-[13px] leading-[19.5px]">
                                {vibe.name}
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
                      </>
                    )}
                  </div>
                )}

                {/* Avoid Items Selection */}
                {message.questionType === 'avoid' && currentQuestion === 'avoid' && (
                  <div className="mt-4 space-y-3 pointer-events-auto">
                    {isLoadingOptions ? (
                      <div className="text-[#9c9aa5] font-['Saira:Regular',sans-serif] text-[14px]">
                        Loading options...
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap gap-2">
                          {preferenceOptions.avoid.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handlePreferenceToggle('avoid', item.id)}
                              className={`py-[6px] px-[18px] rounded-[8px] transition-all flex items-center justify-center ${
                                selectedAvoid.includes(item.id)
                                  ? 'bg-[#8f7db4] text-[#121212]'
                                  : 'bg-[#1f1e1e] text-white hover:bg-[linear-gradient(90deg,rgba(143,125,180,0.15)_0%,rgba(143,125,180,0.15)_100%),linear-gradient(90deg,rgb(31,30,30)_0%,rgb(31,30,30)_100%)]'
                              }`}
                            >
                              <p className="font-['Saira:Regular',sans-serif] text-[13px] leading-[19.5px]">
                                {item.name}
                              </p>
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={handleAvoidSubmit}
                          className="bg-[#ffaeaf] hover:bg-[#ff9e9f] transition-colors px-6 py-2 rounded-[8px]"
                        >
                          <p className="font-['Saira:Regular',sans-serif] text-[14px] text-[#121212]">
                            Continue
                          </p>
                        </button>
                        <button
                          onClick={handleSkipAvoid}
                          className="rounded-[8px] px-[14.5px] py-[8px] ml-2"
                        >
                          <p className="font-['Saira:Regular',sans-serif] leading-[21px] text-[14px] text-[#9c9aa5]">
                            Skip
                          </p>
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Party Factors Selection */}
                {message.questionType === 'factors' && currentQuestion === 'factors' && (
                  <div className="mt-4 space-y-3 pointer-events-auto">
                    {isLoadingOptions ? (
                      <div className="text-[#9c9aa5] font-['Saira:Regular',sans-serif] text-[14px]">
                        Loading factors...
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap gap-2">
                          {preferenceOptions.factors.map((factor) => (
                            <button
                              key={factor.id}
                              onClick={() => handlePreferenceToggle('factors', factor.id)}
                              className={`py-[6px] px-[18px] rounded-[8px] transition-all flex items-center justify-center ${
                                selectedFactors.includes(factor.id)
                                  ? 'bg-[#8f7db4] text-[#121212]'
                                  : 'bg-[#1f1e1e] text-white hover:bg-[linear-gradient(90deg,rgba(143,125,180,0.15)_0%,rgba(143,125,180,0.15)_100%),linear-gradient(90deg,rgb(31,30,30)_0%,rgb(31,30,30)_100%)]'
                              }`}
                            >
                              <p className="font-['Saira:Regular',sans-serif] text-[13px] leading-[19.5px]">
                                {factor.name}
                              </p>
                            </button>
                          ))}
                        </div>
                        {selectedFactors.length > 0 ? (
                          <button
                            onClick={handleFactorsSubmit}
                            className="bg-[#ffaeaf] hover:bg-[#ff9e9f] transition-colors px-6 py-2 rounded-[8px]"
                          >
                            <p className="font-['Saira:Regular',sans-serif] text-[14px] text-[#121212]">
                              Continue
                            </p>
                          </button>
                        ) : (
                          <button
                            onClick={handleSkipFactors}
                            className="rounded-[8px] px-[14.5px] py-[8px]"
                          >
                            <p className="font-['Saira:Regular',sans-serif] leading-[21px] text-[14px] text-[#9c9aa5]">
                              Skip
                            </p>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Venue Sizes Selection */}
                {message.questionType === 'venueSizes' && currentQuestion === 'venueSizes' && (
                  <div className="mt-4 space-y-3 pointer-events-auto">
                    {isLoadingOptions ? (
                      <div className="text-[#9c9aa5] font-['Saira:Regular',sans-serif] text-[14px]">
                        Loading venue sizes...
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap gap-2">
                          {preferenceOptions.venueSizes.map((size) => (
                            <button
                              key={size.id}
                              onClick={() => handlePreferenceToggle('venueSizes', size.id)}
                              className={`py-[6px] px-[18px] rounded-[8px] transition-all flex items-center justify-center ${
                                selectedVenueSizes.includes(size.id)
                                  ? 'bg-[#8f7db4] text-[#121212]'
                                  : 'bg-[#1f1e1e] text-white hover:bg-[linear-gradient(90deg,rgba(143,125,180,0.15)_0%,rgba(143,125,180,0.15)_100%),linear-gradient(90deg,rgb(31,30,30)_0%,rgb(31,30,30)_100%)]'
                              }`}
                            >
                              <p className="font-['Saira:Regular',sans-serif] text-[13px] leading-[19.5px]">
                                {size.name}
                              </p>
                            </button>
                          ))}
                        </div>
                        {selectedVenueSizes.length > 0 ? (
                          <button
                            onClick={handleVenueSizesSubmit}
                            className="bg-[#ffaeaf] hover:bg-[#ff9e9f] transition-colors px-6 py-2 rounded-[8px]"
                          >
                            <p className="font-['Saira:Regular',sans-serif] text-[14px] text-[#121212]">
                              Continue
                            </p>
                          </button>
                        ) : (
                          <button
                            onClick={handleSkipVenueSizes}
                            className="rounded-[8px] px-[14.5px] py-[8px]"
                          >
                            <p className="font-['Saira:Regular',sans-serif] leading-[21px] text-[14px] text-[#9c9aa5]">
                              Skip
                            </p>
                          </button>
                        )}
                      </>
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
                      <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-[1.5] whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  )}
                </div>

                {/* Event Cards */}
                {message.type === 'events' && (
                  <div className="mt-4 pointer-events-auto">
                    <div className="flex gap-4 flex-wrap lg:flex-nowrap">
                      {(message.parsedEvents && message.parsedEvents.length > 0 ? message.parsedEvents : mockEvents).map((event) => (
                        <div
                          key={event.id}
                          onClick={() => setSelectedEvent(event as typeof mockEvents[0] | ParsedEvent)}
                          className="relative w-full md:w-[320px] lg:w-[320px] lg:flex-shrink-0 h-[180px] rounded-[12px] overflow-hidden border border-[#3a3a3a] hover:border-[#ffaeaf] transition-all cursor-pointer hover-party-frenzy"
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
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Loading indicator */}
          {isChatLoading && (
            <div className="flex justify-start pointer-events-auto">
              <div className="w-[30px] h-[30px] shrink-0 mr-3">
                <img 
                  src={ravenImage}
                  alt="Raven"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="text-white max-w-[85%]">
                <div className="flex items-center gap-2 px-4 py-3">
                  <Loader2 className="size-4 animate-spin text-[#9c9aa5]" />
                  <p className="font-['Saira:Regular',sans-serif] text-[14px] text-[#9c9aa5]">
                    Raven is thinking...
                  </p>
                </div>
              </div>
            </div>
          )}
          
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
              disabled={isChatLoading}
              className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-[#9c9aa5] font-['Saira:Regular',sans-serif] text-[16px] disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleChatSend}
              disabled={isChatLoading || !chatInputValue.trim()}
              className="bg-[#ffaeaf] hover:bg-[#ff9e9f] transition-colors p-2 rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChatLoading ? (
                <Loader2 className="size-5 text-[#121212] animate-spin" />
              ) : (
                <Send className="size-5 text-[#121212]" />
              )}
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
  // LOADING OVERLAY
  // =============================================================================

  const renderLoadingOverlay = () => {
    // Show loading overlay when auth is loading OR when loading preferences from API
    if (!authLoading && !isLoadingPreferences) return null;
    
    return (
      <div className="fixed inset-0 z-[99999] bg-[#121212] flex items-center justify-center pointer-events-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#3a3a3a] border-t-[#ffaeaf] mx-auto mb-6"></div>
          <p className="font-['Saira:Regular',sans-serif] text-[16px] text-white">Loading...</p>
        </div>
      </div>
    );
  };

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div className="bg-[#121212] relative w-full min-h-[100svh] raven-home-viewport flex flex-col overflow-hidden max-w-full">
      {renderLoadingOverlay()}
      
      {renderHeader()}
      
      {hasCompletedOnboarding ? renderChat() : renderOnboarding()}

      {renderContactModal()}
      {renderFeedbackModal()}
      {renderEventDetailsModal()}
    </div>
  );
}


