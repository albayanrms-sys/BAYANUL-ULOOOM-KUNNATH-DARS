export const metadata = { title: 'Gallery | Al Bayan Kunnath Dars' };

export default function GalleryPage() {
  return (
    <div className="container py-5 mt-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-teal">Gallery</h1>
        <div className="divider" style={{ width: '60px', height: '4px', background: '#008080', margin: '1rem auto' }}></div>
        <p className="lead text-muted">A glimpse into life at Al Bayan Kunnath Dars</p>
      </div>
      <div className="row g-4">
        {/* Placeholder images */}
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div key={num} className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
              <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '250px' }}>
                <i className="bi bi-image text-muted" style={{ fontSize: '3rem' }}></i>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
