import { assetUrl } from '../lib/assets';

export default function Splash() {
  return (
    <div className="splash-screen">
      <img src={assetUrl('images/logo/logo.png')} alt="Tour Cheetah" className="splash-logo" />
    </div>
  );
}
