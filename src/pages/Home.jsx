import { useState, useEffect } from "react";
import "./Home.css";

function Home() {
  const [posters, setPosters] = useState([]);
  
  useEffect(() => {
    fetch("/api/posters")
      .then(res => res.json())
      .then(data => setPosters(data))
      .catch(err => console.error("Poster fetch error:", err));
  }, []);

  const latestPoster = posters.length > 0 ? posters[0] : null;

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section d-flex align-items-center">
        <div className="container text-center">
          <div className="hero-content glass-card p-5 animate-up mx-auto">
            <h1 className="display-3 mb-3">ബായനുൽ ഉലൂം ദർസ്</h1>
            <p className="lead mb-4 opacity-90">പരമ്പരാഗത മൂല്യങ്ങളുടെയും ആധുനിക അറിവുകളുടെയും സംഗമഭൂമി. വിദ്യാർത്ഥികളുടെ ഉന്നത വിജയത്തിനായി ഞങ്ങൾ പ്രതിജ്ഞാബദ്ധരാണ്.</p>
            <div className="d-flex justify-content-center gap-3">
              <a href="/admission" className="btn btn-premium btn-lg px-5">ADMISSION 2026</a>
              <a href="/about" className="btn btn-outline-premium btn-lg px-5">LEARN MORE</a>
            </div>
          </div>
        </div>
      </section>


      {/* About Summary */}
      <section className="py-5 mt-5">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-md-6 order-2 order-md-1">
              <div className="section-header text-start mb-4">
                <h2 className="mb-0">പഠന മികവ്, ആത്മീയ ഉന്നതി</h2>
                <div className="divider ms-0"></div>
              </div>
              <p className="text-muted mb-4 lead">
                കുന്നത്ത് മഹല്ലിന്റെ തണലിൽ പ്രവർത്തിക്കുന്ന ഈ സ്ഥാപനം ദീർഘകാലമായി മത-ഭൗതിക വിജ്ഞാന രംഗത്ത് മികച്ച സേവനം കാഴ്ചവച്ചു വരുന്നു. 
              </p>
              <div className="d-grid gap-3 mb-4">
                 {[
                   "ശരീയത്ത് നിയമങ്ങളുടെ ആഴത്തിലുള്ള പഠനം",
                   "ആധുനിക ടെക്നോളജി ഉപയോഗിച്ചുള്ള ക്ലാസ്സുകൾ",
                   "മികച്ച ലൈബ്രറി സൗകര്യം"
                 ].map((t, idx) => (
                   <div key={idx} className="d-flex align-items-center gap-3">
                      <i className="bi bi-check2-circle text-teal fs-4"></i>
                      <span className="fw-medium">{t}</span>
                   </div>
                 ))}
              </div>
              <a href="/about" className="btn btn-premium rounded-pill px-4">READ OUR HISTORY</a>
            </div>
            <div className="col-md-6 order-1 order-md-2">
              <div className="rounded-5 overflow-hidden shadow-lg border border-5 border-white">
                 <img src="/dars_building.jpg" alt="Building" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Poster */}
      <section className="py-5 bg-white">
        <div className="container text-center">
          <div className="section-header">
            <h2>അഡ്മിഷൻ അറിയിപ്പുകൾ</h2>
            <div className="divider"></div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
               <div className="modern-card p-2 overflow-hidden shadow-2xl">
                  {latestPoster ? (
                    <img src={latestPoster.url} alt={latestPoster.title} className="img-fluid rounded-4" />
                  ) : (
                    <img src="/poster.jpg" alt="Default Poster" className="img-fluid rounded-4" />
                  )}
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
