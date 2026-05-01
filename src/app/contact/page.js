export const metadata = { title: 'Contact Us | Al Bayan Kunnath Dars' };

export default function ContactPage() {
  return (
    <div className="container py-5 mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-teal">Contact Us</h1>
            <div className="divider" style={{ width: '60px', height: '4px', background: '#008080', margin: '1rem auto' }}></div>
            <p className="lead text-muted">Get in touch with us for admissions and inquiries.</p>
          </div>
          <div className="card shadow border-0 rounded-4 p-4 p-md-5">
            <div className="row g-4">
              <div className="col-md-6 text-center text-md-start">
                <h5 className="fw-bold mb-3"><i className="bi bi-geo-alt-fill text-teal me-2"></i> Our Location</h5>
                <p className="text-muted">SH 72, Oorakam, Kerala 676519</p>
                <div className="mt-4">
                  <h5 className="fw-bold mb-3"><i className="bi bi-telephone-fill text-teal me-2"></i> Phone</h5>
                  <p className="text-muted mb-1">+91 94463 61571</p>
                  <p className="text-muted">+91 98954 04342</p>
                </div>
              </div>
              <div className="col-md-6 text-center text-md-start">
                <h5 className="fw-bold mb-3"><i className="bi bi-envelope-fill text-teal me-2"></i> Email</h5>
                <p className="text-muted">info@albayan.example.com</p>
                <div className="mt-4">
                  <h5 className="fw-bold mb-3"><i className="bi bi-clock-fill text-teal me-2"></i> Office Hours</h5>
                  <p className="text-muted">Mon - Sat: 9:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
