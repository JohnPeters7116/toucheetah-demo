import { useNavigate } from 'react-router-dom';
import { assetUrl } from '../lib/assets';

export default function HowItWorks() {
  const navigate = useNavigate();
  return (
    <div className="info-screen">
      <header className="info-header">
        <button type="button" className="info-back" onClick={() => navigate(-1)} aria-label="Back">
          ‹
        </button>
        <h1>How It Works</h1>
      </header>
      <div className="info-body">
        <img src={assetUrl('images/ui/how-it-works.png')} alt="How it works" className="info-image" />
        <p>
          Tour Cheetah is a self-guided audio tour designed to be experienced with London's Santander Cycles.
          Pick up a bike at any docking station, ride between stops, and let the audio do the rest.
        </p>
        <p>
          Tap the <strong>map pins</strong> to jump to a stop, or scroll the cards at the bottom of the map and
          tap one to centre the map and open the player.
        </p>
        <p>
          Blue lines on the map are <strong>walking</strong> sections. Red lines are <strong>biking</strong> sections.
          Toggle the bike-stop button on the map to show live Santander Cycles availability.
        </p>
        <p>
          The "<strong>NOW PLAYING</strong>" button at the top of the map jumps back into whatever audio you have queued.
          Each stop is marked complete once you've listened to it.
        </p>
        <p>
          You can use the app fully offline once you've loaded it once — install it to your home screen for the best experience.
        </p>
      </div>
    </div>
  );
}
