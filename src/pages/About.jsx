import "./About.css";

function About() {
  return (
    <section className="about-page container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card glass-card p-5 border-0 shadow-lg">
            <h1 className="text-center mb-5 brand-title-text">ഞങ്ങളെക്കുറിച്ച് <br/><span className="sub-title fs-5 text-muted">ABOUT US</span></h1>
            
            <div className="row g-5 align-items-center">
              <div className="col-md-6 order-md-2">
                <div className="about-image-wrapper">
                  <img src="/dars_building.jpg" alt="About Bayanul Uloom Dars" className="img-fluid rounded-4 shadow-sm grayscale-hover" />
                </div>
              </div>
              <div className="col-md-6 order-md-1">
                <h3 className="section-title mb-3">ബായനുൽ ഉലൂം ദർസ് കുന്നത്ത്</h3>
                <p className="lead fs-5 text-dark opacity-90 mb-4">
                  ഇസ്ലാമിക പാരമ്പര്യവും ആധുനിക വിദ്യാഭ്യാസ രീതികളും കൂട്ടിയിണക്കി വിദ്യാർത്ഥികളെ ഉൽകൃഷ്ടമായ ഭാവിയിലേക്ക് നയിക്കുന്ന ഒരു ഉത്തമ വിദ്യാലയം.
                </p>
                <div className="feature-list list-group list-group-flush opacity-80 border-0">
                  <div className="list-group-item bg-transparent border-0 px-0 d-flex gap-2">
                    <span className="text-teal fs-4">✓</span>
                    <span>പരമ്പരാഗത ദർസ് പഠനരീതി</span>
                  </div>
                  <div className="list-group-item bg-transparent border-0 px-0 d-flex gap-2">
                    <span className="text-teal fs-4">✓</span>
                    <span>ഉന്നത യോഗ്യതയുള്ള ഉസ്താദുമാർ</span>
                  </div>
                  <div className="list-group-item bg-transparent border-0 px-0 d-flex gap-2">
                    <span className="text-teal fs-4">✓</span>
                    <span>മാതൃകാപരമായ അച്ചടക്കവും സംസ്കാരവും</span>
                  </div>
                  <div className="list-group-item bg-transparent border-0 px-0 d-flex gap-2">
                    <span className="text-teal fs-4">✓</span>
                    <span>വിശാലമായ ലൈബ്രറി സന്ദർശനം</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-5 text-center border-top-teal">
              <h4 className="mb-4">ഞങ്ങളുടെ ലക്ഷ്യം <br/><span className="text-muted small">OUR MISSION</span></h4>
              <p className="px-lg-5 fs-6 text-muted lh-lg">
                വിദ്യാർത്ഥികളിൽ വിജ്ഞാനത്തോടൊപ്പം ധർമ്മബോധവും മൂല്യങ്ങളും വളർത്തിയെടുക്കുക എന്നതാണ് ഞങ്ങളുടെ പരമമായ ലക്ഷ്യം. ഓരോ വിദ്യാർത്ഥിയെയും ഒരു നല്ല മനുഷ്യനും സമൂഹത്തിന് ഉപകാരപ്രദമായ വ്യക്തിയുമായി വളർത്താൻ ഞങ്ങൾ പ്രതിജ്ഞാബന്ധരാണ്.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
