import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { checkBackendHealth } from "../lib/backendHealth";

type Props = {
  /** If provided, called when backend becomes reachable. */
  onRecovered?: () => void;
};

export function MaintenanceScreen({ onRecovered }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const handleRetry = useCallback(async () => {
    setChecking(true);
    setLastError(null);
    try {
      const ok = await checkBackendHealth({ timeoutMs: 3500 });
      if (ok) {
        onRecovered?.();

        // If user landed here from another route, go back; otherwise go home.
        const from = (location.state as any)?.from as string | undefined;
        navigate(from || "/home", { replace: true });
        return;
      }
      setLastError("Backend is still unreachable.");
    } catch {
      setLastError("Backend is still unreachable.");
    } finally {
      setChecking(false);
    }
  }, [location.state, navigate, onRecovered]);

  return (
    <div className="min-h-[100svh] w-full bg-[#121212] flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <p className="font-['Audiowide:Regular',sans-serif] text-white text-[22px] tracking-[-0.5px] uppercase">
          Raven is down for maintenance
        </p>
        <p className="mt-3 text-[#9c9aa5] text-sm">
          Our servers aren’t responding right now. Please try again in a minute.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={handleRetry}
            disabled={checking}
            className="bg-[#ffaeaf] hover:bg-[#ff9e9f] disabled:opacity-60 disabled:cursor-not-allowed transition-colors px-5 py-2 rounded-[10px] text-[#121212] font-['Saira:Regular',sans-serif] text-[14px]"
          >
            {checking ? "Checking..." : "Retry"}
          </button>

          <button
            onClick={() => window.location.reload()}
            className="bg-[#2a2a2a] hover:bg-[#333333] transition-colors px-5 py-2 rounded-[10px] text-white font-['Saira:Regular',sans-serif] text-[14px] border border-[#3a3a3a]"
          >
            Refresh
          </button>
        </div>

        {lastError && <p className="mt-4 text-[#ffaeaf] text-sm">{lastError}</p>}

      </div>
    </div>
  );
}


