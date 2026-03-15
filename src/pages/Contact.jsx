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

               <div className="mt-5 p-4 rounded-4 bg-light text-center">
                  <i className="bi bi-geo-alt-fill text-primary fs-3 mb-2 d-block"></i>
                  <span className="fw-bold d-block">Location</span>
                  <p className="small text-muted mb-0">Kunnath Mahallu, India</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
