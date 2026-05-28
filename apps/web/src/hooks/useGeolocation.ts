import { useEffect, useState } from 'react';

export interface GeoState {
  coords: GeolocationCoordinates | null;
  error: string | null;
  permission: 'unknown' | 'granted' | 'denied' | 'prompt';
}

export default function useGeolocation(): GeoState {
  const [state, setState] = useState<GeoState>({
    coords: null,
    error: null,
    permission: 'unknown',
  });

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setState((s) => ({ ...s, error: 'Geolocation not supported', permission: 'denied' }));
      return;
    }

    let watchId: number | null = null;

    const start = () => {
      watchId = navigator.geolocation.watchPosition(
        (pos) => setState({ coords: pos.coords, error: null, permission: 'granted' }),
        (err) => setState((s) => ({ ...s, error: err.message, permission: 'denied' })),
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
      );
    };

    if ('permissions' in navigator) {
      navigator.permissions
        .query({ name: 'geolocation' as PermissionName })
        .then((p) => {
          setState((s) => ({ ...s, permission: p.state as GeoState['permission'] }));
          start();
        })
        .catch(() => start());
    } else {
      start();
    }

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return state;
}
