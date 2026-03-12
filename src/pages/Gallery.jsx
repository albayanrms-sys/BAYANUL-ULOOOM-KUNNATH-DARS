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
    <section className="gallery-page py-5 container">
      <div className="text-center mb-5">
        <h1 className="gallery-title mb-2">ഗാലറി <br/><span className="sub-title fs-5 text-muted">GALLERY</span></h1>
        <p className="section-desc opacity-75">നമ്മുടെ വിദ്യാലയത്തിലെ മറക്കാനാവാത്ത നിമിഷങ്ങളും മനോഹരമായ കാഴ്ചകളും.</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-teal" role="status"></div>
        </div>
      ) : (
        <div className="row g-4 gallery-grid">
          {items.map((item) => (
            <div key={item._id} className="col-md-6 col-lg-4">
              <div className="gallery-card border-0 shadow-lg position-relative overflow-hidden rounded-4 h-100">
                <div className="card-img-wrapper" style={{ height: '300px' }}>
                  {item.type === 'video' ? (
                    <video src={item.url} controls className="h-100 w-100 object-fit-cover" />
                  ) : (
                    <img src={item.url} alt={item.title} className="card-img-top h-100 w-100 object-fit-cover transition-img" />
                  )}
                </div>
                <div className="gallery-overlay d-flex flex-column justify-content-end p-4">
                  <h4 className="card-title text-white mb-1 shadow-text">{item.title}</h4>
                  <div className="overlay-bg position-absolute top-0 start-0 w-100 h-100 opacity-40 bg-dark z-index-minus-1"></div>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-12 text-center py-5">
              <p className="text-muted">വിവരങ്ങൾ ലഭ്യമല്ല (No items found)</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default Gallery;
