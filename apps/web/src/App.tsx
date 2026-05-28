import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Splash from './pages/Splash';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import MapScreen from './pages/MapScreen';
import AudioPlayer from './pages/AudioPlayer';
import HowItWorks from './pages/HowItWorks';
import Login from './pages/Login';
import Register from './pages/Register';
import { AppStateProvider, useAppState } from './state/AppState';

const ONBOARDING_KEY = 'tourcheetah:onboarding-complete';

function useScrollLock() {
  const location = useLocation();
  useEffect(() => {
    document.body.setAttribute('data-route', location.pathname);
  }, [location]);
}

export default function App() {
  useScrollLock();
  const skipSplash = import.meta.env.VITE_SKIP_SPLASH === 'true';
  const [splashDone, setSplashDone] = useState(skipSplash);
  const onboardingDone = typeof window !== 'undefined'
    ? window.localStorage.getItem(ONBOARDING_KEY) === '1'
    : false;

  useEffect(() => {
    if (skipSplash) return;
    const t = setTimeout(() => setSplashDone(true), 1400);
    return () => clearTimeout(t);
  }, [skipSplash]);

  if (!splashDone) {
    return <Splash />;
  }

  return (
    <AppStateProvider>
      <AppRoutes onboardingDone={onboardingDone} />
    </AppStateProvider>
  );
}

function AppRoutes({ onboardingDone }: { onboardingDone: boolean }) {
  const { isAuthenticated } = useAppState();

  return (
    <Routes>
      {/* Public marketing */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/map" replace /> : <Landing />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/map" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/map" replace /> : <Register />} />

      {/* Post-signup onboarding */}
      <Route path="/onboarding" element={<Onboarding onComplete={() => window.localStorage.setItem(ONBOARDING_KEY, '1')} />} />

      {/* Protected app */}
      <Route path="/map" element={isAuthenticated ? <MapScreen /> : <Navigate to="/" replace />} />
      <Route path="/player/:stopId" element={isAuthenticated ? <AudioPlayer /> : <Navigate to="/" replace />} />
      <Route path="/how-it-works" element={<HowItWorks />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to={isAuthenticated ? '/map' : '/'} replace />} />
    </Routes>
  );
}
