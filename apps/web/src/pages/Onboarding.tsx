import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assetUrl } from '../lib/assets';

interface Props {
  onComplete: () => void;
}

const TOUR_IMAGES = [
  assetUrl('images/onboarding/tour1.png'),
  assetUrl('images/onboarding/tour2.png'),
  assetUrl('images/onboarding/tour3.png'),
  assetUrl('images/onboarding/tour4.png'),
  assetUrl('images/onboarding/tour5.png'),
];

export default function Onboarding({ onComplete }: Props) {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const finish = () => {
    onComplete();
    navigate('/map', { replace: true });
  };

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const w = el.clientWidth;
    const i = Math.round(el.scrollLeft / w);
    if (i !== page) setPage(i);
  };

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className="onboarding">
      <button className="onboarding-skip" onClick={finish} type="button">Skip</button>

      <div className="onboarding-scroll" ref={scrollerRef} onScroll={handleScroll}>
        {TOUR_IMAGES.map((src, i) => (
          <div className="onboarding-page" key={src}>
            <img src={src} alt={`Tour step ${i + 1}`} className="onboarding-image" draggable={false} />
          </div>
        ))}
      </div>

      <div className="onboarding-dots">
        {TOUR_IMAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            className={'onboarding-dot' + (i === page ? ' active' : '')}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {page === TOUR_IMAGES.length - 1 && (
        <button className="onboarding-start" onClick={finish} type="button">
          Let's Start
        </button>
      )}
    </div>
  );
}
