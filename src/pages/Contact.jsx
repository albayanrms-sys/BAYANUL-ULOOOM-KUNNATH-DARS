import "./Contact.css";

function Contact() {
  return (
    <section className="contact container py-5 text-center">
      <div className="card glass-card p-4 mx-auto" style={{ maxWidth: '600px' }}>
        <h2 className="mb-4">ബന്ധപ്പെടുക</h2>
        <div className="contact-list list-group list-group-flush mb-4 text-start">
          <div className="list-group-item bg-transparent d-flex align-items-center gap-3 py-3 border-light opacity-80">
            <span className="fs-3">📧</span>
            <div className="flex-grow-1 overflow-hidden">
                <small className="text-muted d-block lh-1 mb-1">ഇമെയിൽ</small>
                <a href="mailto:albayanrms@gmail.com" className="text-decoration-none fw-bold link-primary">albayanrms@gmail.com</a>
            </div>
          </div>
          <div className="list-group-item bg-transparent d-flex align-items-center gap-3 py-3 border-light opacity-80">
            <span className="fs-3">📞</span>
            <div className="flex-grow-1 overflow-hidden">
                <small className="text-muted d-block lh-1 mb-1">ഫോൺ</small>
                <a href="tel:+919745304342" className="text-decoration-none fw-bold link-primary">+91 97453 04342</a>
            </div>
          </div>
          <div className="list-group-item bg-transparent d-flex align-items-center gap-3 py-3 border-light opacity-80">
            <span className="fs-3">✈</span>
            <div className="flex-grow-1 overflow-hidden">
                <small className="text-muted d-block lh-1 mb-1">ടെലിഗ്രാം</small>
                <a href="https://t.me/ALBAYANKUNNATH" target="_blank" rel="noopener" className="text-decoration-none fw-bold link-primary text-truncate d-block">t.me/ALBAYANKUNNATH</a>
            </div>
          </div>
          <div className="list-group-item bg-transparent d-flex align-items-center gap-3 py-3 border-light opacity-80">
            <span className="fs-3">💬</span>
            <div className="flex-grow-1 overflow-hidden">
                <small className="text-muted d-block lh-1 mb-1">വാട്ട്സ്ആപ്പ്</small>
                <a href="https://wa.me/9745304342" target="_blank" rel="noopener" className="text-decoration-none fw-bold link-primary text-truncate d-block">wa.me/9745304342</a>
            </div>
          </div>
          <div className="list-group-item bg-transparent d-flex align-items-center gap-3 py-3 border-light opacity-80">
            <span className="fs-3">📸</span>
            <div className="flex-grow-1 overflow-hidden">
                <small className="text-muted d-block lh-1 mb-1">ഇൻസ്റ്റാഗ്രാം</small>
                <a href="https://www.instagram.com/bayanul_uloom_dars_/" target="_blank" rel="noopener" className="text-decoration-none fw-bold link-primary text-truncate d-block">bayanul_uloom_dars_</a>
            </div>
          </div>
        </div>
        <div className="map-placeholder d-flex align-items-center justify-content-center bg-light border-light rounded-3 bg-opacity-50 text-muted fst-italic shadow-inner" style={{ height: '200px' }}>
          [Google Map Placeholder]
        </div>
      </div>
    </section>
  );
}

export default Contact;
