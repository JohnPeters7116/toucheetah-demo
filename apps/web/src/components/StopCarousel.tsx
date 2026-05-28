import type { CarouselItem, AudioStop } from '../data/audioStops';
import { carouselItems, isLoopMarker } from '../data/audioStops';
import { useAppState } from '../state/AppState';
import { assetUrl } from '../lib/assets';

interface Props {
  userLocation: GeolocationCoordinates | null;
  onStopSelected: (stop: AudioStop) => void;
}

function distanceMiles(
  user: GeolocationCoordinates | null,
  coord: [number, number]
): number | null {
  if (!user) return null;
  const [lng, lat] = coord;
  const R = 3958.8; // miles
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat - user.latitude);
  const dLng = toRad(lng - user.longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(user.latitude)) * Math.cos(toRad(lat)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function StopCarousel({ userLocation, onStopSelected }: Props) {
  const { completedStops } = useAppState();

  return (
    <div className="stop-carousel" role="list">
      {carouselItems.map((item: CarouselItem) => {
        if (isLoopMarker(item)) {
          return (
            <div key={item.id} className="stop-card stop-card-loop" role="listitem">
              <div className="stop-card-loop-text">{item.displayTitle}</div>
            </div>
          );
        }
        const stop = item;
        const dist = distanceMiles(userLocation, stop.coordinate);
        const completed = !!completedStops[stop.id];
        return (
          <button
            key={stop.id}
            type="button"
            className="stop-card"
            onClick={() => onStopSelected(stop)}
            role="listitem"
          >
            <div className="stop-card-photo-wrap">
              <img src={stop.photoSrc} alt={stop.displayTitle} className="stop-card-photo" />
              {completed && (
                <img src={assetUrl('images/ui/check.png')} alt="" className="stop-card-check" />
              )}
            </div>
            <div className="stop-card-label">
              <span className="stop-card-title">{stop.title}</span>
              <span className="stop-card-distance">
                {dist === null ? '—' : `${dist.toFixed(1)} MILES`}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
