import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  audioStops,
  carouselItems,
  isLoopMarker,
  findStopById,
} from '../data/audioStops';
import type { AudioStop } from '../data/audioStops';
import { walkingPolylines, bikingPolylines } from '../data/tourRoute';
import {
  walkingArrowsUp,
  walkingArrowsDown,
  walkingArrowsLeft,
  walkingArrowsRight,
  bikingArrowsUp,
  bikingArrowsDown,
  bikingArrowsLeft,
  bikingArrowsRight,
} from '../data/directions';
import StopCarousel from '../components/StopCarousel';
import NowPlayingBar from '../components/NowPlayingBar';
import HamburgerMenu from '../components/HamburgerMenu';
import useGeolocation from '../hooks/useGeolocation';
import useBikeStops from '../hooks/useBikeStops';
import { useAppState } from '../state/AppState';
import { assetUrl } from '../lib/assets';

const TOUR_CENTER: [number, number] = [-0.108, 51.508];
const FREE_STYLE = 'https://tiles.openfreemap.org/styles/positron';

function arrowToFeature(coord: [number, number], iconKey: string) {
  return {
    type: 'Feature' as const,
    properties: { icon: iconKey },
    geometry: { type: 'Point' as const, coordinates: coord },
  };
}

export default function MapScreen() {
  const navigate = useNavigate();
  const mapRef = useRef<maplibregl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const userMarker = useRef<maplibregl.Marker | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const { showBikeStops, toggleBikeStops } = useAppState();
  const { coords } = useGeolocation();
  const { stops: bikeStops } = useBikeStops(showBikeStops);

  // Initialise map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: FREE_STYLE,
      center: TOUR_CENTER,
      zoom: 13.4,
      attributionControl: { compact: true },
    });

    mapRef.current = map;
    map.on('load', () => {
      // Load icon images for arrows + pins
      const icons: Record<string, string> = {
        'audio-stop': assetUrl('images/pins/audio-stop.png'),
        'bike-stop': assetUrl('images/pins/bike-stop.png'),
        'blue-up': assetUrl('images/pins/blue-up.png'),
        'blue-down': assetUrl('images/pins/blue-down.png'),
        'blue-left': assetUrl('images/pins/blue-left.png'),
        'blue-right': assetUrl('images/pins/blue-right.png'),
        'red-up': assetUrl('images/pins/red-up.png'),
        'red-down': assetUrl('images/pins/red-down.png'),
        'red-left': assetUrl('images/pins/red-left.png'),
        'red-right': assetUrl('images/pins/red-right.png'),
      };

      Promise.all(
        Object.entries(icons).map(([key, src]) =>
          map.loadImage(src).then((res) => {
            if (!map.hasImage(key)) map.addImage(key, res.data);
          })
        )
      ).then(() => addLayers(map)).then(() => setMapReady(true));
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update bike stops layer
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const features = showBikeStops
      ? bikeStops.map((s) => ({
          type: 'Feature' as const,
          properties: {
            name: s.name,
            bikes: s.bikes,
            emptyDocks: s.emptyDocks,
          },
          geometry: { type: 'Point' as const, coordinates: [s.lng, s.lat] as [number, number] },
        }))
      : [];

    const src = map.getSource('bike-stops') as maplibregl.GeoJSONSource | undefined;
    if (src) {
      src.setData({ type: 'FeatureCollection', features });
    }
  }, [bikeStops, showBikeStops, mapReady]);

  // Update user-location marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !coords) return;
    const lngLat: [number, number] = [coords.longitude, coords.latitude];
    if (!userMarker.current) {
      const el = document.createElement('div');
      el.className = 'user-location-marker';
      const img = document.createElement('img');
      img.src = assetUrl('images/pins/user-location.png');
      img.alt = '';
      el.appendChild(img);
      userMarker.current = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(lngLat)
        .addTo(map);
    } else {
      userMarker.current.setLngLat(lngLat);
    }
  }, [coords, mapReady]);

  function addLayers(map: maplibregl.Map) {
    // Walking polylines (blue)
    map.addSource('walking-routes', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: walkingPolylines.map((coords) => ({
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: coords },
        })),
      },
    });
    map.addLayer({
      id: 'walking-routes-layer',
      type: 'line',
      source: 'walking-routes',
      paint: {
        'line-color': '#4A90E2',
        'line-width': 4,
        'line-opacity': 0.65,
      },
    });

    // Biking polylines (red)
    map.addSource('biking-routes', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: bikingPolylines.map((coords) => ({
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: coords },
        })),
      },
    });
    map.addLayer({
      id: 'biking-routes-layer',
      type: 'line',
      source: 'biking-routes',
      paint: {
        'line-color': '#E25C4A',
        'line-width': 4,
        'line-opacity': 0.65,
      },
    });

    // Direction arrow points
    const arrowFeatures = [
      ...walkingArrowsUp.map((c) => arrowToFeature(c, 'blue-up')),
      ...walkingArrowsDown.map((c) => arrowToFeature(c, 'blue-down')),
      ...walkingArrowsLeft.map((c) => arrowToFeature(c, 'blue-left')),
      ...walkingArrowsRight.map((c) => arrowToFeature(c, 'blue-right')),
      ...bikingArrowsUp.map((c) => arrowToFeature(c, 'red-up')),
      ...bikingArrowsDown.map((c) => arrowToFeature(c, 'red-down')),
      ...bikingArrowsLeft.map((c) => arrowToFeature(c, 'red-left')),
      ...bikingArrowsRight.map((c) => arrowToFeature(c, 'red-right')),
    ];
    map.addSource('arrows', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: arrowFeatures },
    });
    map.addLayer({
      id: 'arrows-layer',
      type: 'symbol',
      source: 'arrows',
      layout: {
        'icon-image': ['get', 'icon'],
        'icon-size': 0.18,
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
      },
    });

    // Audio stops
    map.addSource('audio-stops', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: audioStops.map((s) => ({
          type: 'Feature',
          properties: { id: s.id, title: s.displayTitle },
          geometry: { type: 'Point', coordinates: s.coordinate },
        })),
      },
    });
    map.addLayer({
      id: 'audio-stops-layer',
      type: 'symbol',
      source: 'audio-stops',
      layout: {
        'icon-image': 'audio-stop',
        'icon-size': 0.22,
        'icon-anchor': 'bottom',
        'icon-allow-overlap': true,
        'text-field': ['get', 'title'],
        'text-font': ['Noto Sans Regular'],
        'text-size': 11,
        'text-offset': [0, 0.6],
        'text-anchor': 'top',
        'text-optional': true,
      },
      paint: {
        'text-color': '#1f2d3d',
        'text-halo-color': '#ffffff',
        'text-halo-width': 1.4,
      },
    });

    // Bike stops (updated via setData)
    map.addSource('bike-stops', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
    });
    map.addLayer({
      id: 'bike-stops-layer',
      type: 'symbol',
      source: 'bike-stops',
      layout: {
        'icon-image': 'bike-stop',
        'icon-size': 0.18,
        'icon-anchor': 'bottom',
        'icon-allow-overlap': true,
      },
    });

    // Click handlers
    map.on('click', 'audio-stops-layer', (e) => {
      const f = e.features?.[0];
      if (!f) return;
      const id = f.properties?.id as string;
      const stop = findStopById(id);
      if (stop) flyToStop(stop, true);
    });
    map.on('click', 'bike-stops-layer', (e) => {
      const f = e.features?.[0];
      if (!f) return;
      const props = f.properties as { name?: string; bikes?: number; emptyDocks?: number };
      const geom = f.geometry as { type: string; coordinates: [number, number] };
      const coord: [number, number] = [geom.coordinates[0], geom.coordinates[1]];
      new maplibregl.Popup({ closeButton: true })
        .setLngLat(coord)
        .setHTML(
          `<strong>${props.name ?? 'Bike Stop'}</strong><br/>` +
            `${props.bikes ?? 0} bikes available · ${props.emptyDocks ?? 0} spaces`
        )
        .addTo(map);
    });

    map.on('mouseenter', 'audio-stops-layer', () => (map.getCanvas().style.cursor = 'pointer'));
    map.on('mouseleave', 'audio-stops-layer', () => (map.getCanvas().style.cursor = ''));
    map.on('mouseenter', 'bike-stops-layer', () => (map.getCanvas().style.cursor = 'pointer'));
    map.on('mouseleave', 'bike-stops-layer', () => (map.getCanvas().style.cursor = ''));
  }

  function flyToStop(stop: AudioStop, openPlayer: boolean) {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({ center: stop.coordinate, zoom: 16, speed: 1.2 });
    if (openPlayer) {
      setTimeout(() => navigate(`/player/${stop.id}`), 600);
    }
  }

  function centerOnUser() {
    const map = mapRef.current;
    if (!map || !coords) return;
    map.flyTo({ center: [coords.longitude, coords.latitude], zoom: 15, speed: 1.2 });
  }

  function handleStopSelected(stop: AudioStop) {
    flyToStop(stop, true);
  }

  // Pre-warm: log carousel item count for debugging in dev
  useEffect(() => {
    if (carouselItems.length === 0) return;
  }, []);

  return (
    <div className="map-screen">
      <NowPlayingBar onMenuToggle={() => setMenuOpen((o) => !o)} />
      <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="map-container" ref={containerRef} />

      <button
        type="button"
        className="map-fab map-fab-bikes"
        onClick={toggleBikeStops}
        aria-label="Toggle bike stops"
        aria-pressed={showBikeStops}
      >
        <img
          src={showBikeStops ? assetUrl('images/ui/bikes-off.png') : assetUrl('images/ui/bikes-on.png')}
          alt=""
        />
      </button>

      <button
        type="button"
        className="map-fab map-fab-locate"
        onClick={centerOnUser}
        aria-label="Centre on my location"
        disabled={!coords}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <circle cx="12" cy="12" r="3" fill="#2c3e50" />
          <circle cx="12" cy="12" r="8" fill="none" stroke="#2c3e50" strokeWidth="2" />
          <line x1="12" y1="1" x2="12" y2="4" stroke="#2c3e50" strokeWidth="2" />
          <line x1="12" y1="20" x2="12" y2="23" stroke="#2c3e50" strokeWidth="2" />
          <line x1="1" y1="12" x2="4" y2="12" stroke="#2c3e50" strokeWidth="2" />
          <line x1="20" y1="12" x2="23" y2="12" stroke="#2c3e50" strokeWidth="2" />
        </svg>
      </button>

      <div className="stop-carousel-wrap">
        <StopCarousel userLocation={coords} onStopSelected={handleStopSelected} />
      </div>
    </div>
  );
}
