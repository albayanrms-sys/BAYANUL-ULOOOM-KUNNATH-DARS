import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container h-100 d-flex align-items-center justify-content-center text-center">
          <div className="hero-content glass-card p-5">
            <h1 className="main-title mb-3 animate-slide-up">ബയാനുൾ ഉലൂം ദർസ്</h1>
            <p className="sub-description mb-4 animate-fade-in">പരമ്പരാഗത മൂല്യങ്ങളുടെയും ആധുനിക അറിവുകളുടെയും സംഗമഭൂമി. വിദ്യാർത്ഥികളുടെ ഉന്നത വിജയത്തിനായി ഞങ്ങൾ പ്രതിജ്ഞാബദ്ധരാണ്.</p>
            <div className="cta-wrapper">
              <a href="/admission" className="btn btn-premium-teal btn-lg me-3">അഡ്മിഷൻ അപേക്ഷിക്കുക</a>
              <a href="/about" className="btn btn-outline-premium btn-lg">കൂടുതൽ അറിയാൻ</a>
            </div>
          </div>
        </div>
      </section>

      {/* Building Image Section */}
      <section className="building-display py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 overflow-hidden rounded-5 shadow-2xl transition-transform hover-scale">
              <img src="/dars_building.jpg" alt="Dars Building" className="img-fluid w-100 building-img" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-3">
              <div className="stat-card p-4 glass-card">
                <h2 className="stat-number">20+</h2>
                <p className="stat-label">വർഷത്തെ പാരമ്പര്യം</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card p-4 glass-card">
                <h2 className="stat-number">500+</h2>
                <p className="stat-label">വിദ്യാർത്ഥികൾ</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card p-4 glass-card">
                <h2 className="stat-number">15+</h2>
                <p className="stat-label">ഉസ്താദുമാർ</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card p-4 glass-card">
                <h2 className="stat-number">100%</h2>
                <p className="stat-label">വിദ്യാഭ്യാസ നിലവാരം</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
