export const metadata = { title: 'Usthads | Al Bayan Kunnath Dars' };

export default function UsthadsPage() {
  return (
    <div className="container py-5 mt-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-teal">Our Usthads</h1>
        <div className="divider" style={{ width: '60px', height: '4px', background: '#008080', margin: '1rem auto' }}></div>
        <p className="lead text-muted">Meet our esteemed faculty members dedicated to your education.</p>
      </div>
      <div className="row g-4 justify-content-center">
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-4 text-center p-4 h-100">
              <div className="bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '120px', height: '120px' }}>
                <i className="bi bi-person-fill text-muted" style={{ fontSize: '4rem' }}></i>
              </div>
              <h5 className="fw-bold">Usthad Name</h5>
              <p className="text-muted small mb-0">Department / Role</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
