import { useState, useEffect } from "react";
import "./Gallery.css";

function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery")
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="gallery-page min-vh-100 py-5 bg-light">
      <div className="container">
        <div className="section-header">
           <h2>നിമിഷങ്ങൾ</h2>
           <div className="divider"></div>
           <p className="text-muted">CAPTURING OUR BEAUTIFUL JOURNEY</p>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : (
          <div className="row g-4 justify-content-center">
            {items.map((item) => (
              <div key={item._id} className="col-md-6 col-lg-4">
                <div className="modern-card p-2 animate-up h-100 shadow-sm border-0">
                  <div className="gallery-media-wrapper rounded-4 overflow-hidden position-relative" style={{ height: '320px' }}>
                    {item.type === 'video' ? (
                      <video src={item.url} controls className="h-100 w-100 object-fit-cover" />
                    ) : (
                      <img src={item.url} alt={item.title} className="h-100 w-100 object-fit-cover transition-img" />
                    )}
                    <div className="media-caption position-absolute bottom-0 start-0 w-100 p-3 bg-dark bg-opacity-50 text-white backdrop-blur-sm">
                       <h6 className="fw-bold mb-0 text-truncate">{item.title}</h6>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="col-12 text-center py-5 opacity-50">
                <i className="bi bi-camera fs-1 d-block mb-3"></i>
                <h5>No media uploaded yet</h5>
                <p className="small">Please check back soon for gallery updates.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Gallery;
