import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container h-100 d-flex align-items-center justify-content-center text-center">
          <div className="hero-content glass-card p-5">
            <h1 className="main-title mb-3 animate-slide-up">ബായനുൽ ഉലൂം ദർസ്</h1>
            <p className="sub-description mb-4 animate-fade-in">പരമ്പരാഗത മൂല്യങ്ങളുടെയും ആധുനിക അറിവുകളുടെയും സംഗമഭൂമി. വിദ്യാർത്ഥികളുടെ ഉന്നത വിജയത്തിനായി ഞങ്ങൾ പ്രതിജ്ഞാബദ്ധരാണ്.</p>
            <div className="cta-wrapper">
              <a href="/admission" className="btn btn-premium-teal btn-lg me-3">അഡ്മിഷൻ അപേക്ഷിക്കുക</a>
              <a href="/about" className="btn btn-outline-premium btn-lg">കൂടുതൽ അറിയാൻ</a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section on Home */}
      <section className="about-summary py-5">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-md-6">
              <h2 className="section-title mb-4">ബായനുൽ ഉലൂം ദർസിനെക്കുറിച്ച്</h2>
              <p className="lead text-muted">
                കുന്നത്ത് മഹല്ലിന്റെ തണലിൽ പ്രവർത്തിക്കുന്ന ഈ സ്ഥാപനം ദീർഘകാലമായി മത-ഭൗതിക വിജ്ഞാന രംഗത്ത് മികച്ച സേവനം കാഴ്ചവച്ചു വരുന്നു. 
                വിദ്യാർത്ഥികളുടെ വ്യക്തിത്വ വികാസത്തിനും ആത്മീയ ഉന്നതിക്കും ഞങ്ങൾ വലിയ പ്രാധാന്യം നൽകുന്നു.
              </p>
              <ul className="list-unstyled mt-4 d-grid gap-2">
                <li className="d-flex align-items-center gap-2"><span className="text-teal fw-bold">✓</span> മികച്ച ലൈബ്രറി സൗകര്യം</li>
                <li className="d-flex align-items-center gap-2"><span className="text-teal fw-bold">✓</span> താമസിച്ചു പഠിക്കാനുള്ള സൗകര്യം (Boarding)</li>
                <li className="d-flex align-items-center gap-2"><span className="text-teal fw-bold">✓</span> അനുഗ്രഹീതരായ ഉസ്താദുമാരുടെ നേതൃത്വം</li>
              </ul>
              <a href="/about" className="btn btn-outline-teal mt-4 rounded-pill px-4">കൂടുതൽ വായിക്കുക</a>
            </div>
            <div className="col-md-6">
              <div className="about-visual rounded-5 overflow-hidden shadow-lg">
                 <img src="/dars_building.jpg" alt="Dars Building" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Building Image Section */}
      <section className="building-display py-5 bg-white">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 overflow-hidden rounded-5 shadow-2xl transition-transform hover-scale">
              <img src="/dars_building.jpg" alt="Dars Building" className="img-fluid w-100 building-img" />
            </div>
          </div>
        </div>
      </section>

      {/* Admission Poster Section - Last */}
      <section className="poster-section py-5 bg-light-teal">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="section-title mb-4">അഡ്മിഷൻ ആരംഭിച്ചിരിക്കുന്നു!</h2>
              <div className="poster-wrapper rounded-4 shadow-lg overflow-hidden transition-transform hover-scale">
                <img src="/poster.jpg" alt="Admission Poster" className="img-fluid w-100" />
              </div>
              <div className="mt-4">
                <a href="/admission" className="btn btn-premium-teal btn-lg shadow-teal">
                   ഇപ്പോൾ അപേക്ഷിക്കുക
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
