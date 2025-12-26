import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, X } from 'lucide-react';
import { refreshProfile } from '../store/slices/authSlice';
import type { AppDispatch, RootState } from '../store/store';
import { apiClient } from '../lib/api';
import { toast } from "sonner@2.0.3";

type PreferenceOption = {
  id: number;
  name: string;
};

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

export function UserSettings() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const userEmail = user?.email || 'user@example.com';

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

  const [settingsPreferences, setSettingsPreferences] = useState<{
    genres: number[];
    vibes: number[];
    avoid: number[];
    factors: number[];
    venueSizes: number[];
    additionalContext: string;
  }>({
    genres: [],
    vibes: [],
    avoid: [],
    factors: [],
    venueSizes: [],
    additionalContext: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch user profile and preference options
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        // Fetch preference options
        const [genres, vibes, avoid, factors, venueSizes] = await Promise.all([
          apiClient('/preferences/genres').catch(() => fallbackGenres.map((name, idx) => ({ id: idx + 1, name }))),
          apiClient('/preferences/vibes').catch(() => fallbackVibes.map((name, idx) => ({ id: idx + 1, name }))),
          apiClient('/preferences/avoid').catch(() => []),
          apiClient('/preferences/factors').catch(() => []),
          apiClient('/preferences/venue-sizes').catch(() => [])
        ]);

        const options = {
          genres: Array.isArray(genres) ? genres : [],
          vibes: Array.isArray(vibes) ? vibes : [],
          avoid: Array.isArray(avoid) ? avoid : [],
          factors: Array.isArray(factors) ? factors : [],
          venueSizes: Array.isArray(venueSizes) ? venueSizes : []
        };

        setPreferenceOptions(options);

        // Fetch user profile
        const profileData = await apiClient(`/users/${user.id}/full-profile`);
        
        // Helper function to map preference names/IDs to option IDs
        const mapPreferenceToIds = (prefArray: any[], optionArray: PreferenceOption[]): number[] => {
          if (!Array.isArray(prefArray)) return [];
          
          return prefArray
            .map((pref: any) => {
              // If it's already an ID (number)
              if (typeof pref === 'number') return pref;
              
              // If it's an object with an ID
              if (typeof pref === 'object' && pref?.id) return pref.id;
              
              // If it's a string name, find matching option
              if (typeof pref === 'string') {
                const found = optionArray.find(opt => opt.name === pref || opt.name.toLowerCase() === pref.toLowerCase());
                return found?.id || null;
              }
              
              return null;
            })
            .filter((id: any) => id !== null) as number[];
        };
        
        // Map preferences to IDs by matching names to options
        const prefs = profileData.preferences || {};
        setSettingsPreferences({
          genres: mapPreferenceToIds(prefs.genres || [], options.genres),
          vibes: mapPreferenceToIds(prefs.vibes || [], options.vibes),
          avoid: mapPreferenceToIds(prefs.avoid || [], options.avoid),
          factors: mapPreferenceToIds(prefs.factors || [], options.factors),
          venueSizes: mapPreferenceToIds(prefs.venue_sizes || [], options.venueSizes),
          additionalContext: profileData.profile?.additional_context || ''
        });
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        toast.error("Failed to load settings", {
          description: "Please try again.",
          style: { backgroundColor: "#1f1e1e", border: "1px solid #ffaeaf", color: "#fff" },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const handlePreferenceToggle = (
    category: 'genres' | 'vibes' | 'avoid' | 'factors' | 'venueSizes',
    id: number
  ) => {
    setSettingsPreferences(prev => {
      const current = prev[category];
      const isSelected = current.includes(id);
      return {
        ...prev,
        [category]: isSelected
          ? current.filter(itemId => itemId !== id)
          : [...current, id]
      };
    });
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setIsSaving(true);
    try {
      await apiClient(`/users/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          venue_size_id: settingsPreferences.venueSizes[0] ?? null,
          additional_context: '',
          genres: settingsPreferences.genres,
          vibes: settingsPreferences.vibes,
          avoid: settingsPreferences.avoid,
          factors: settingsPreferences.factors,
        }),
      });

      await dispatch(refreshProfile());

      toast.success("Settings saved", {
        description: "Your preferences have been updated.",
        style: { backgroundColor: "#1f1e1e", border: "1px solid #ffaeaf", color: "#fff" },
      });

      navigate('/home');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error("Couldn't save settings", {
        description: "Please try again.",
        style: { backgroundColor: "#1f1e1e", border: "1px solid #ffaeaf", color: "#fff" },
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderPreferenceSection = (
    title: string,
    category: 'genres' | 'vibes' | 'avoid' | 'factors' | 'venueSizes',
    options: PreferenceOption[]
  ) => {
    const selected = settingsPreferences[category];
    const selectedOptions = options.filter(opt => selected.includes(opt.id));
    const unselectedOptions = options.filter(opt => !selected.includes(opt.id));

    return (
      <div className="mb-8">
        <p className="font-['Saira:Regular',sans-serif] text-[16px] text-white mb-4 uppercase tracking-wide">
          {title}
        </p>
        
        {/* Selected Options */}
        {selectedOptions.length > 0 && (
          <div className="mb-4">
            <p className="font-['Saira:Regular',sans-serif] text-[12px] text-[#9c9aa5] mb-2">Selected</p>
            <div className="flex flex-wrap gap-2">
              {selectedOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handlePreferenceToggle(category, option.id)}
                  className="py-[6px] px-[18px] rounded-[8px] transition-all flex items-center justify-center bg-[#8f7db4] text-[#121212] hover:bg-[#9d8bc4]"
                >
                  <p className="font-['Saira:Regular',sans-serif] text-[13px] leading-[19.5px]">
                    {option.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Unselected Options */}
        {unselectedOptions.length > 0 && (
          <div>
            <p className="font-['Saira:Regular',sans-serif] text-[12px] text-[#9c9aa5] mb-2">Available</p>
            <div className="flex flex-wrap gap-2">
              {unselectedOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handlePreferenceToggle(category, option.id)}
                  className="py-[6px] px-[18px] rounded-[8px] transition-all flex items-center justify-center bg-[#1f1e1e] text-white hover:bg-[linear-gradient(90deg,rgba(143,125,180,0.15)_0%,rgba(143,125,180,0.15)_100%),linear-gradient(90deg,rgb(31,30,30)_0%,rgb(31,30,30)_100%)]"
                >
                  <p className="font-['Saira:Regular',sans-serif] text-[13px] leading-[19.5px]">
                    {option.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedOptions.length === 0 && unselectedOptions.length === 0 && (
          <p className="font-['Saira:Regular',sans-serif] text-[14px] text-[#9c9aa5]">No options available</p>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-[#121212] min-h-[100svh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#3a3a3a] border-t-[#ffaeaf] mx-auto mb-6"></div>
          <p className="font-['Saira:Regular',sans-serif] text-[16px] text-white">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] min-h-[100svh]">
      {/* Header */}
      <div className="bg-[#1f1e1e] border-b border-[#3a3a3a] px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/home')}
            className="text-[#9c9aa5] hover:text-[#ffaeaf] transition-colors"
          >
            <ArrowLeft className="size-5" />
          </button>
          <p className="font-['Audiowide:Regular',sans-serif] text-[18px] md:text-[20px] text-white tracking-[-0.9px] uppercase">
            User Settings
          </p>
        </div>
        <p className="font-['Saira:Regular',sans-serif] text-[12px] text-[#9c9aa5]">
          {userEmail}
        </p>
      </div>

      {/* Content */}
      <div className="max-w-[800px] mx-auto px-4 md:px-6 py-8">
        {renderPreferenceSection('Music Genres', 'genres', preferenceOptions.genres)}
        {renderPreferenceSection('Party Vibes', 'vibes', preferenceOptions.vibes)}
        {renderPreferenceSection('What to Avoid', 'avoid', preferenceOptions.avoid)}
        {renderPreferenceSection('What Matters Most', 'factors', preferenceOptions.factors)}
        {renderPreferenceSection('Venue Sizes', 'venueSizes', preferenceOptions.venueSizes)}

        {/* Save Button */}
        <div className="flex gap-3 pt-4 border-t border-[#3a3a3a]">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-[#ffaeaf] hover:bg-[#ff9e9f] transition-colors px-6 py-3 rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <p className="font-['Saira:Regular',sans-serif] text-[14px] text-[#121212]">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </p>
          </button>
          <button
            onClick={() => navigate('/home')}
            className="px-6 py-3 rounded-[8px] border border-[#3a3a3a] hover:border-[#ffaeaf] transition-colors"
          >
            <p className="font-['Saira:Regular',sans-serif] text-[14px] text-white">
              Cancel
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

