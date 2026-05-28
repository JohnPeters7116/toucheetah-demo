import { useNavigate } from 'react-router-dom';
import { findStopById } from '../data/audioStops';
import { useAppState } from '../state/AppState';
import { assetUrl } from '../lib/assets';

interface Props {
  onMenuToggle: () => void;
}

export default function NowPlayingBar({ onMenuToggle }: Props) {
  const navigate = useNavigate();
  const { nowPlayingId } = useAppState();
  const stop = nowPlayingId ? findStopById(nowPlayingId) : null;

  return (
    <header className="now-playing">
      <button type="button" className="now-playing-menu" onClick={onMenuToggle} aria-label="Menu">
        <img src={assetUrl('images/ui/hamburger.png')} alt="" />
      </button>
      <button
        type="button"
        className="now-playing-title"
        onClick={() => stop && navigate(`/player/${stop.id}`)}
        disabled={!stop}
      >
        {stop ? `NOW PLAYING ›` : 'Tour Cheetah London'}
      </button>
      <span className="now-playing-spacer" />
    </header>
  );
}
