import { useNavigate } from 'react-router-dom';
import { assetUrl } from '../lib/assets';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function HamburgerMenu({ open, onClose }: Props) {
  const navigate = useNavigate();

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <>
      <div
        className={'menu-backdrop' + (open ? ' open' : '')}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside className={'menu-drawer' + (open ? ' open' : '')} aria-hidden={!open}>
        <div className="menu-header">
          <img src={assetUrl('images/logo/logo.png')} alt="Tour Cheetah" className="menu-logo" />
        </div>
        <nav className="menu-nav">
          <button type="button" className="menu-link" onClick={() => go('/map')}>Map</button>
          <button type="button" className="menu-link" onClick={() => go('/how-it-works')}>How It Works</button>
        </nav>
        <div className="menu-footer">
          <span>Tour Cheetah London</span>
          <span className="menu-footer-attr">Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="menu-footer-link">OpenStreetMap</a> contributors</span>
        </div>
      </aside>
    </>
  );
}
