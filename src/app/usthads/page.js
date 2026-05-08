export const metadata = { title: 'Usthads | Al Bayan Kunnath Dars' };

export default function UsthadsPage() {
  return (
    <div className="container py-5 mt-5 min-vh-100">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-teal">Our Usthad</h1>
        <div className="divider" style={{ width: '60px', height: '4px', background: '#008080', margin: '1rem auto' }}></div>
        <p className="lead text-muted">The guiding light of our institution.</p>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow-lg rounded-4 text-center p-5 h-100 modern-card glass-card">
            <div className="mx-auto mb-4 overflow-hidden rounded-circle border border-4 border-white shadow" style={{ width: '180px', height: '180px', background: '#f8f9fa' }}>
              <i className="bi bi-person-fill text-teal" style={{ fontSize: '7rem', lineHeight: '180px' }}></i>
            </div>
            <h3 className="fw-bold text-teal mb-1">Muhammed Musliyar</h3>
            <p className="text-muted fw-bold mb-4">Sadr Muallim (Head Teacher)</p>
            <p className="text-muted mb-0">
              With years of dedicated service in Islamic education, our Usthad leads the Al Bayan Kunnath Dars with profound knowledge, deep spirituality, and an unwavering commitment to nurturing the next generation of scholars.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
