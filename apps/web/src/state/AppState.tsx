import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

interface AppState {
  completedStops: Record<string, boolean>;
  markCompleted: (stopId: string) => void;
  showBikeStops: boolean;
  toggleBikeStops: () => void;
  nowPlayingId: string | null;
  setNowPlayingId: (id: string | null) => void;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  isAuthenticated: boolean;
}

const AppStateContext = createContext<AppState | null>(null);

const COMPLETED_KEY = 'tourcheetah:completed-stops';
const TOKEN_KEY = 'tourcheetah:access-token';

function loadCompleted(): Record<string, boolean> {
  try {
    const raw = window.localStorage.getItem(COMPLETED_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function loadToken(): string | null {
  try {
    const raw = window.localStorage.getItem(TOKEN_KEY);
    return raw || null;
  } catch {
    return null;
  }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [completedStops, setCompletedStops] = useState<Record<string, boolean>>(() => loadCompleted());
  const [showBikeStops, setShowBikeStops] = useState(false);
  const [nowPlayingId, setNowPlayingId] = useState<string | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(() => loadToken());

  const setAccessToken = useCallback((token: string | null) => {
    setAccessTokenState(token);
    try {
      if (token) window.localStorage.setItem(TOKEN_KEY, token);
      else window.localStorage.removeItem(TOKEN_KEY);
    } catch {
      // ignore
    }
  }, []);

  const markCompleted = useCallback((stopId: string) => {
    setCompletedStops((prev) => {
      const next = { ...prev, [stopId]: true };
      try { window.localStorage.setItem(COMPLETED_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const toggleBikeStops = useCallback(() => setShowBikeStops((v) => !v), []);

  const isAuthenticated = accessToken !== null;

  const value = useMemo(
    () => ({ completedStops, markCompleted, showBikeStops, toggleBikeStops, nowPlayingId, setNowPlayingId, accessToken, setAccessToken, isAuthenticated }),
    [completedStops, markCompleted, showBikeStops, toggleBikeStops, nowPlayingId, accessToken, isAuthenticated]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}
