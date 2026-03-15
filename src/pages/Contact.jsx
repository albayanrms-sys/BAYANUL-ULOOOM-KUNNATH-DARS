import "./Contact.css";

function Contact() {
  return (
    <section className="contact container py-5">
      <div className="row justify-content-center">
         <div className="col-md-7 col-lg-5">
            <div className="card glass-form p-4 border-0 shadow-lg rounded-4 overflow-hidden">
               <div className="text-center mb-4">
                  <h2 className="fw-bold text-teal">ബന്ധപ്പെടുക</h2>
                  <p className="text-muted small">CONNECT WITH US</p>
               </div>
               
               <div className="contact-list list-group list-group-flush mb-4 bg-transparent">
                 <div className="list-group-item bg-transparent d-flex align-items-center gap-3 py-3 border-light border-opacity-10">
                   <div className="bg-teal p-2 rounded-circle text-white d-flex align-items-center justify-content-center" style={{width:45, height:45}}>
                      <i className="bi bi-envelope-at fs-5"></i>
                   </div>
                   <div className="flex-grow-1">
                       <small className="text-muted d-block lh-1 mb-1 fw-bold">EMAIL ADDRESS</small>
                       <a href="mailto:albayanrms@gmail.com" className="text-decoration-none fw-bold text-dark">albayanrms@gmail.com</a>
                   </div>
                 </div>

                 <div className="list-group-item bg-transparent d-flex align-items-center gap-3 py-3 border-light border-opacity-10">
                   <div className="bg-primary p-2 rounded-circle text-white d-flex align-items-center justify-content-center" style={{width:45, height:45}}>
                      <i className="bi bi-phone-vibrate fs-5"></i>
                   </div>
                   <div className="flex-grow-1">
                       <small className="text-muted d-block lh-1 mb-1 fw-bold">PHONE SUPPORT</small>
                       <div className="d-flex flex-column">
                          <a href="tel:+919745304342" className="text-decoration-none fw-bold text-dark">+91 97453 04342</a>
                          <a href="tel:+919895404342" className="text-decoration-none fw-bold text-dark">+91 98954 04342</a>
                       </div>
                   </div>
                 </div>

                 <div className="list-group-item bg-transparent d-flex align-items-center gap-3 py-3 border-light border-opacity-10">
                   <div className="bg-info p-2 rounded-circle text-white d-flex align-items-center justify-content-center" style={{width:45, height:45}}>
                      <i className="bi bi-telegram fs-5"></i>
                   </div>
                   <div className="flex-grow-1">
                       <small className="text-muted d-block lh-1 mb-1 fw-bold">TELEGRAM</small>
                       <a href="https://t.me/ALBAYANKUNNATH" target="_blank" className="text-decoration-none fw-bold text-dark">t.me/ALBAYANKUNNATH</a>
                   </div>
                 </div>

                 <div className="list-group-item bg-transparent d-flex align-items-center gap-3 py-3 border-light border-opacity-10">
                   <div className="bg-success p-2 rounded-circle text-white d-flex align-items-center justify-content-center" style={{width:45, height:45}}>
                      <i className="bi bi-whatsapp fs-5"></i>
                   </div>
                   <div className="flex-grow-1">
                       <small className="text-muted d-block lh-1 mb-1 fw-bold">WHATSAPP CHAT</small>
                       <a href="https://wa.me/919745304342" target="_blank" className="text-decoration-none fw-bold text-dark">+91 97453 04342</a>
                   </div>
                 </div>

                 <div className="list-group-item bg-transparent d-flex align-items-center gap-3 py-3 border-light border-opacity-10">
                   <div className="p-2 rounded-circle text-white d-flex align-items-center justify-content-center" style={{width:45, height:45, background:'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)'}}>
                      <i className="bi bi-instagram fs-5"></i>
                   </div>
                   <div className="flex-grow-1">
                       <small className="text-muted d-block lh-1 mb-1 fw-bold">INSTAGRAM</small>
                       <a href="https://www.instagram.com/bayanul_uloom_dars_/" target="_blank" className="text-decoration-none fw-bold text-dark">bayanul_uloom_dars_</a>
                   </div>
                 </div>
               </div>
               
               <div className="map-placeholder d-flex align-items-center justify-content-center bg-light border rounded-4 text-muted fst-italic shadow-inner" style={{ height: '180px' }}>
                  <div className="text-center">
                    <i className="bi bi-geo-alt fs-1 opacity-25"></i>
                    <p className="small mt-1 mb-0 opacity-50">Kunnath, Alparamba, Kerala</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </section>
  );
}

export default Contact;
