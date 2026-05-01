import "./Contact.css";

function Contact() {
  return (
    <section className="contact-page min-vh-100 py-5 bg-light">
      <div className="container">
        <div className="section-header">
           <h2>Contact & Support</h2>
           <div className="divider"></div>
           <p className="text-muted">We are here to help you with any inquiries.</p>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="modern-card animate-up p-5">
               <div className="text-center mb-5">
                  <div className="bg-primary bg-opacity-10 p-4 rounded-circle d-inline-block text-primary mb-3">
                     <i className="bi bi-chat-dots-fill fs-1"></i>
                  </div>
                  <h3 className="fw-bold">Get in Touch</h3>
                  <p className="text-muted small">Connect with our administration team</p>
               </div>
               
               <div className="d-grid gap-4">
                  {[
                    { l: "OFFICIAL EMAIL", v: "albayanrms@gmail.com", href: "mailto:albayanrms@gmail.com", i: "bi-envelope-at", c: "primary" },
                    { l: "PRIMARY CALL", v: "+91 97453 04342", href: "tel:+919745304342", i: "bi-phone", c: "success" },
                    { l: "OFFICE WHATSAPP", v: "Chat on WhatsApp", href: "https://wa.me/919745304342", i: "bi-whatsapp", c: "success" },
                    { l: "INSTAGRAM", v: "@bayanul_uloom_dars_", href: "https://www.instagram.com/bayanul_uloom_dars_/", i: "bi-instagram", c: "danger" }
                  ].map((item, idx) => (
                    <div key={idx} className="d-flex align-items-center gap-4 p-3 rounded-4 border border-light transition-all hover-translate-up shadow-sm">
                       <div className={`bg-${item.c} bg-opacity-10 p-3 rounded-circle text-${item.c}`}>
                          <i className={`bi ${item.i} fs-4`}></i>
                       </div>
                       <div className="flex-grow-1">
                          <span className="x-small fw-bold text-muted d-block opacity-50">{item.l}</span>
                          <a href={item.href} target="_blank" rel="noreferrer" className="text-decoration-none fw-bold text-secondary">{item.v}</a>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-5 p-4 rounded-4 bg-light text-center transition-all hover-translate-up shadow-sm">
                  <i className="bi bi-geo-alt-fill text-primary fs-3 mb-2 d-block"></i>
                  <span className="fw-bold d-block mb-1">Our Location</span>
                  <p className="small text-muted mb-3">SH 72, Oorakam, Kerala 676519</p>
                  <a href="https://www.google.com/maps/place/SH+72,+Oorakam,+Kerala+676519/@11.0554217,76.0022257,3a,75y,331.17h,96.46t/data=!3m7!1e1!3m5!1sDGn9hNTt1GTswEnKsaliFA!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-6.4588081337761025%26panoid%3DDGn9hNTt1GTswEnKsaliFA%26yaw%3D331.1665166209837!7i13312!8i6656!4m6!3m5!1s0x3ba64b79b3d9fc13:0xcf9e20707d66c0e7!8m2!3d11.0551686!4d76.0020158!16s%2Fg%2F11j5h647d0?hl=en&entry=ttu&g_ep=EgoyMDI2MDMxMS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm rounded-pill px-4 fw-bold">
                    <i className="bi bi-map me-2"></i>VIEW ON GOOGLE MAPS
                  </a>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
