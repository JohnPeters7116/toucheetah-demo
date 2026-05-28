import { useEffect, useState } from 'react';

export interface BikeStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  bikes: number;
  emptyDocks: number;
  totalDocks: number;
}

// TfL BikePoint open endpoint — same geographic bounds as the iOS app
const TFL_URL =
  'https://api.tfl.gov.uk/BikePoint?swLat=51.497035&swLon=-0.143362&neLat=51.514386&neLon=-0.074213';

interface TfLProperty {
  key: string;
  value: string;
}

interface TfLBikePoint {
  id: string;
  commonName: string;
  lat: number;
  lon: number;
  additionalProperties: TfLProperty[];
}

function readProperty(props: TfLProperty[], key: string): number {
  const found = props.find((p) => p.key === key);
  if (!found) return 0;
  const n = parseInt(found.value, 10);
  return Number.isFinite(n) ? n : 0;
}

export default function useBikeStops(active: boolean): {
  stops: BikeStop[];
  loading: boolean;
  error: string | null;
} {
  const [stops, setStops] = useState<BikeStop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(TFL_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`TfL API ${r.status}`);
        return r.json() as Promise<TfLBikePoint[]>;
      })
      .then((data) => {
        if (cancelled) return;
        const out: BikeStop[] = data.map((d) => ({
          id: d.id,
          name: d.commonName,
          lat: d.lat,
          lng: d.lon,
          bikes: readProperty(d.additionalProperties, 'NbBikes'),
          emptyDocks: readProperty(d.additionalProperties, 'NbEmptyDocks'),
          totalDocks: readProperty(d.additionalProperties, 'NbDocks'),
        }));
        setStops(out);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [active]);

  return { stops, loading, error };
}
