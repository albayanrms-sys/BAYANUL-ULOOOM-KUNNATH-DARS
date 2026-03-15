import "./About.css";

function About() {
  return (
    <section className="about-page min-vh-100 py-5 bg-light">
      <div className="container">
        <div className="section-header">
           <h2>ഞങ്ങളെക്കുറിച്ച്</h2>
           <div className="divider"></div>
           <p className="text-muted">ROOTED IN TRADITION, REACHING FOR THE FUTURE</p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="modern-card animate-up">
              <div className="row g-5 align-items-center">
                <div className="col-md-6 order-md-2">
                  <div className="position-relative">
                    <img src="/dars_building.jpg" alt="About Bayanul Uloom Dars" className="img-fluid rounded-5 shadow-lg border border-5 border-white" />
                    <div className="position-absolute bottom-0 start-0 bg-primary text-white p-4 rounded-5 m-3 shadow-sm d-none d-lg-block">
                       <h4 className="fw-bold mb-0">25+ Years</h4>
                       <p className="small mb-0">of Academic Excellence</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 order-md-1">
                  <h3 className="fw-bold mb-3 text-primary">ബായനുൽ ഉലൂം ദർസ് കുന്നത്ത്</h3>
                  <p className="lead text-dark opacity-90 mb-4 fw-medium">
                    ഇസ്ലാമിക പാരമ്പര്യവും ആധുനിക വിദ്യാഭ്യാസ രീതികളും കൂട്ടിയിണക്കി വിദ്യാർത്ഥികളെ ഉൽകൃഷ്ടമായ ഭാവിയിലേക്ക് നയിക്കുന്ന ഒരു ഉത്തമ വിദ്യാലയം.
                  </p>
                  
                  <div className="d-grid gap-3">
                     {[
                       "പരമ്പരാഗത ദർസ് പഠനരീതി",
                       "ഉന്നത യോഗ്യതയുള്ള ഉസ്താദുമാർ",
                       "മാതൃകാപരമായ അച്ചടക്കം",
                       "വിശാലമായ വിജ്ഞാന ശേഖരം"
                     ].map((f, i) => (
                       <div key={i} className="d-flex align-items-center gap-3 p-2">
                          <i className="bi bi-check-circle-fill text-primary fs-4"></i>
                          <span className="fw-bold text-secondary">{f}</span>
                       </div>
                     ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-5 text-center border-top">
                <h4 className="fw-bold mb-4">ഞങ്ങളുടെ ലക്ഷ്യം | OUR MISSION</h4>
                <div className="row justify-content-center">
                   <div className="col-lg-9">
                      <p className="text-muted lh-lg fs-5">
                        വിദ്യാർത്ഥികളിൽ വിജ്ഞാനത്തോടൊപ്പം ധർമ്മബോധവും മൂല്യങ്ങളും വളർത്തിയെടുക്കുക എന്നതാണ് ഞങ്ങളുടെ പരമമായ ലക്ഷ്യം. ഓരോ വിദ്യാർത്ഥിയെയും ഒരു നല്ല മനുഷ്യനും സമൂഹത്തിന് ഉപകാരപ്രദമായ വ്യക്തിയുമായി വളർത്താൻ ഞങ്ങൾ പ്രതിജ്ഞാബന്ധരാണ്.
                      </p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision Columns */}
        <div className="row g-4 mt-5">
           {[
             { t: "Knowledge", d: "Deep dive into Sharia and modern sciences.", i: "bi-book-half" },
             { t: "Character", d: "Building moral foundations for life.", i: "bi-heart-fill" },
             { t: "Leadership", d: "Empowering social leaders of tomorrow.", i: "bi-stars" }
           ].map((v, i) => (
             <div className="col-md-4" key={i}>
                <div className="modern-card p-4 text-center h-100 shadow-sm transition-hover">
                   <i className={`bi ${v.i} display-5 text-primary mb-3`}></i>
                   <h5 className="fw-bold">{v.t}</h5>
                   <p className="text-muted small mb-0">{v.d}</p>
                </div>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}

export default About;
