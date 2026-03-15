'use client';

import { useState, useEffect } from "react";
import { motion } from 'framer-motion';

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery")
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="gallery-page py-5 bg-white min-vh-100">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-header text-center mb-5"
        >
           <h2 className="fw-bold display-4 text-teal">Our Gallery</h2>
           <div className="divider"></div>
           <p className="text-muted lead">Capturing moments of learning, faith, and community.</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-5">
             <div className="spinner-border text-teal" role="status"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-5">
             <i className="bi bi-images display-1 text-teal opacity-25 mb-4 d-block"></i>
             <p className="text-muted">No images found in the gallery yet.</p>
          </div>
        ) : (
          <div className="row g-4 grid-gallery">
            {items.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="col-md-6 col-lg-4"
              >
                <div className="modern-card p-2 overflow-hidden shadow-sm border-0 h-100">
                  <div className="rounded-4 overflow-hidden position-relative group">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img src={item.url} alt={item.title} className="img-fluid w-100 object-fit-cover transition-all" style={{ height: '300px' }} />
                     <div className="overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-end p-4">
                        <div className="bg-white bg-opacity-95 p-3 rounded-4 w-100 shadow-lg translate-y-20 transition-all opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
                           <h6 className="fw-bold mb-1">{item.title}</h6>
                           <p className="small text-muted mb-0">{new Date(item.uploadedAt).toLocaleDateString()}</p>
                        </div>
                     </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
