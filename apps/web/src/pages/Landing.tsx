import { Link } from 'react-router-dom';

const loops = [
  {
    name: 'Royal London',
    colour: '#4A90E2',
    description: 'Follow the ceremonial heart of the capital — palaces, parliament, and the sweep of the Thames.',
    stops: [
      { name: 'Buckingham Palace', img: 'images/stops/buckingham.jpg' },
      { name: 'Westminster', img: 'images/stops/westminster.jpg' },
    ],
  },
  {
    name: 'Entertainment District',
    colour: '#E25C4A',
    description: 'Theatres, piazzas, and iconic squares — the buzzing cultural centre of London.',
    stops: [
      { name: 'Southbank', img: 'images/stops/southbank.jpg' },
      { name: 'Covent Garden', img: 'images/stops/covent-garden.jpg' },
      { name: 'Leicester Square', img: 'images/stops/leicester-square.jpg' },
      { name: 'Piccadilly Circus', img: 'images/stops/piccadilly-circus.jpg' },
      { name: 'Trafalgar Square', img: 'images/stops/trafalgar.jpg' },
    ],
  },
  {
    name: 'Old London',
    colour: '#7B6FD4',
    description: 'Cathedral domes, ancient bridges, and the medieval city that built the modern world.',
    stops: [
      { name: "St Paul's", img: 'images/stops/st-pauls.jpg' },
      { name: 'Southwark', img: 'images/stops/southwark.jpg' },
      { name: 'Tower Bridge', img: 'images/stops/tower-bridge.jpg' },
    ],
  },
];

const features = [
  { icon: '🎧', title: 'Professional Audio', desc: 'Rich narration at every stop — history, stories, and insider tips.' },
  { icon: '📶', title: 'Fully Offline', desc: 'Download once. Works underground, abroad, anywhere.' },
  { icon: '🚲', title: 'Live Bike Map', desc: 'Real-time Santander Cycles availability so you never get stuck.' },
  { icon: '🗺️', title: 'Guided Route', desc: 'Turn-by-turn directions link each stop across three loops.' },
  { icon: '⏸️', title: 'Self-Paced', desc: 'Start, stop, and resume anytime. Your tour, your schedule.' },
  { icon: '📱', title: 'Installable PWA', desc: 'Add to your home screen — works like a native app on iOS and Android.' },
];

export default function Landing() {
  return (
    <div className="landing">

      {/* ── Nav ── */}
      <nav className="landing-nav">
        <img src="images/logo/logo.png" alt="Tour Cheetah" className="landing-nav-logo" />
        <div className="landing-nav-links">
          <Link to="/login" className="landing-nav-link">Sign in</Link>
          <Link to="/register" className="landing-nav-cta">Get Started</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-hero-badge">🇬🇧 London Audio Tour</div>
          <h1 className="landing-hero-h1">
            Discover London's Icons<br />
            <span className="landing-hero-accent">on Two Wheels</span>
          </h1>
          <p className="landing-hero-sub">
            A self-guided audio tour of 10 iconic landmarks — ride a Santander Cycles
            bike at your own pace while expert narration brings the city to life.
          </p>
          <div className="landing-hero-actions">
            <Link to="/register" className="landing-btn-primary">
              Start Your Tour — $19.99
            </Link>
            <a href="#how-it-works" className="landing-btn-ghost">See how it works ↓</a>
          </div>
          <div className="landing-hero-stats">
            <div className="landing-stat"><span className="landing-stat-num">10</span><span className="landing-stat-label">iconic stops</span></div>
            <div className="landing-stat-divider" />
            <div className="landing-stat"><span className="landing-stat-num">3</span><span className="landing-stat-label">themed loops</span></div>
            <div className="landing-stat-divider" />
            <div className="landing-stat"><span className="landing-stat-num">100%</span><span className="landing-stat-label">offline ready</span></div>
            <div className="landing-stat-divider" />
            <div className="landing-stat"><span className="landing-stat-num">1×</span><span className="landing-stat-label">lifetime access</span></div>
          </div>
        </div>
        <div className="landing-hero-visual">
          <div className="landing-phone-mockup">
            <img src="images/stops/tower-bridge.jpg" alt="Tower Bridge stop" className="landing-phone-img" />
          </div>
        </div>
      </section>

      {/* ── The Tour ── */}
      <section className="landing-section landing-loops" id="the-tour">
        <div className="landing-section-inner">
          <p className="landing-eyebrow">The Tour</p>
          <h2 className="landing-h2">Three loops. One unforgettable city.</h2>
          <p className="landing-body-text">
            Each loop is designed as a complete ride — pick one for an afternoon, or do all three over a weekend.
          </p>
          <div className="landing-loops-grid">
            {loops.map((loop) => (
              <div className="landing-loop-card" key={loop.name} style={{ '--loop-colour': loop.colour } as React.CSSProperties}>
                <div className="landing-loop-header">
                  <span className="landing-loop-dot" />
                  <h3 className="landing-loop-name">{loop.name}</h3>
                  <span className="landing-loop-count">{loop.stops.length} stops</span>
                </div>
                <p className="landing-loop-desc">{loop.description}</p>
                <div className="landing-loop-stops">
                  {loop.stops.map((stop) => (
                    <div className="landing-loop-stop" key={stop.name}>
                      <img src={stop.img} alt={stop.name} className="landing-loop-stop-img" />
                      <span className="landing-loop-stop-name">{stop.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="landing-section landing-hiw" id="how-it-works">
        <div className="landing-section-inner">
          <p className="landing-eyebrow">How It Works</p>
          <h2 className="landing-h2">Ready in three steps</h2>
          <div className="landing-steps">
            <div className="landing-step">
              <div className="landing-step-num">1</div>
              <h3 className="landing-step-title">Sign up &amp; unlock</h3>
              <p className="landing-step-desc">Create your account and get lifetime access for a single one-time payment of $19.99.</p>
            </div>
            <div className="landing-step-arrow">→</div>
            <div className="landing-step">
              <div className="landing-step-num">2</div>
              <h3 className="landing-step-title">Grab a Santander bike</h3>
              <p className="landing-step-desc">Open the live bike map and find the nearest available docking station — real-time availability, always up to date.</p>
            </div>
            <div className="landing-step-arrow">→</div>
            <div className="landing-step">
              <div className="landing-step-num">3</div>
              <h3 className="landing-step-title">Start your audio tour</h3>
              <p className="landing-step-desc">Tap a stop on the map, hit play, and let the narration guide you through one of the world's greatest cities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Video ── */}
      <section className="landing-section landing-video-section">
        <div className="landing-section-inner">
          <p className="landing-eyebrow">See It in Action</p>
          <h2 className="landing-h2">Experience the tour before you buy</h2>
          <div className="landing-video-wrap">
            {/* Replace src with your YouTube/Vimeo embed URL when ready */}
            {/* <iframe
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
              title="Tour Cheetah London walkthrough"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="landing-video-iframe"
            /> */}
            <div className="landing-video-placeholder">
              <img src="images/stops/tower-bridge.jpg" alt="Tour preview" className="landing-video-bg" />
              <div className="landing-video-overlay">
                <div className="landing-video-play-btn">▶</div>
                <p className="landing-video-coming">Video coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="landing-section landing-features">
        <div className="landing-section-inner">
          <p className="landing-eyebrow">Features</p>
          <h2 className="landing-h2">Everything you need, nothing you don't</h2>
          <div className="landing-features-grid">
            {features.map((f) => (
              <div className="landing-feature-card" key={f.title}>
                <span className="landing-feature-icon">{f.icon}</span>
                <h3 className="landing-feature-title">{f.title}</h3>
                <p className="landing-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="landing-section landing-pricing" id="pricing">
        <div className="landing-section-inner landing-pricing-inner">
          <p className="landing-eyebrow">Pricing</p>
          <h2 className="landing-h2">One price. Lifetime access.</h2>
          <p className="landing-body-text">No subscriptions, no renewals. Pay once and tour London forever.</p>
          <div className="landing-plan">
            <div className="landing-plan-badge">Most Popular</div>
            <div className="landing-plan-price">
              <span className="landing-plan-amount">$19.99</span>
              <span className="landing-plan-period">one-time</span>
            </div>
            <ul className="landing-plan-features">
              <li>✓ All 10 audio stops</li>
              <li>✓ All 3 themed loops</li>
              <li>✓ Offline playback</li>
              <li>✓ Live Santander Cycles map</li>
              <li>✓ iOS, Android &amp; web access</li>
              <li>✓ All future updates included</li>
            </ul>
            <Link to="/register" className="landing-btn-primary landing-btn-full">
              Get Lifetime Access
            </Link>
            <p className="landing-plan-note">Secure checkout · Instant access</p>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="landing-section landing-cta-section">
        <div className="landing-section-inner landing-cta-inner">
          <h2 className="landing-cta-h2">London is waiting.</h2>
          <p className="landing-cta-sub">Join hundreds of cyclists exploring the city's greatest stories.</p>
          <Link to="/register" className="landing-btn-primary landing-btn-lg">
            Start Your Tour Today
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <img src="images/logo/logo.png" alt="Tour Cheetah" className="landing-footer-logo" />
          <p className="landing-footer-copy">© {new Date().getFullYear()} RiskyandWise Ltd. All rights reserved.</p>
          <div className="landing-footer-links">
            <Link to="/login" className="landing-footer-link">Sign in</Link>
            <Link to="/register" className="landing-footer-link">Sign up</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
