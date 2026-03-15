'use client';

import { motion } from 'framer-motion';

export default function Contact() {
  const contactInfo = [
    { icon: "bi-geo-alt-fill", label: "OUR LOCATION", desc: "SH 72, Oorakam, Kerala 676519", link: "https://www.google.com/maps/place/SH+72,+Oorakam,+Kerala+676519/@11.0554217,76.0022257,3a,75y,331.17h,96.46t/data=!3m7!1e1!3m5!1sDGn9hNTt1GTswEnKsaliFA!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-6.4588081337761025%26panoid%3DDGn9hNTt1GTswEnKsaliFA%26yaw%3D331.1665166209837!7i13312!8i6656!4m6!3m5!1s0x3ba64b79b3d9fc13:0xcf9e20707d66c0e7!8m2!3d11.0551686!4d76.0020158!16s%2Fg%2F11j5h647d0?hl=en&entry=ttu&g_ep=EgoyMDI2MDMxMS4wIKXMDSoASAFQAw%3D%3D" },
    { icon: "bi-telephone-fill", label: "CALL US", desc: "+91 94463 61571", link: "tel:+919446361571" },
    { icon: "bi-envelope-fill", label: "EMAIL SUPPORT", desc: "albayanrms@gmail.com", link: "mailto:albayanrms@gmail.com" },
    { icon: "bi-whatsapp", label: "WHATSAPP", desc: "For Quick Inquiries", link: "https://wa.me/919446361571" }
  ];

  return (
    <div className="contact-page py-5 bg-light min-vh-100">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-header text-center mb-5"
        >
           <h2 className="fw-bold display-4 text-teal">Get in Touch</h2>
           <div className="divider"></div>
           <p className="text-muted lead">Feel free to contact us for any inquiries or support.</p>
        </motion.div>

        <div className="row g-4">
          <div className="col-lg-6">
            <div className="row g-4">
               {contactInfo.map((info, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="col-md-6"
                 >
                   <a 
                      href={info.link} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-decoration-none"
                    >
                      <div className="modern-card p-4 h-100 text-center shadow-sm bg-white border-0 transition-hover">
                         <div className="bg-teal p-3 d-inline-block rounded-circle mb-3">
                            <i className={`bi ${info.icon} text-white fs-3`}></i>
                         </div>
                         <h6 className="fw-bold text-teal mb-2">{info.label}</h6>
                         <p className="text-muted small mb-0">{info.desc}</p>
                      </div>
                   </a>
                 </motion.div>
               ))}
            </div>
          </div>
          <div className="col-lg-6">
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               className="modern-card p-5 h-100 shadow-sm border-0 bg-white"
             >
                <h4 className="fw-bold mb-4">Send a Message</h4>
                <form className="row g-3">
                   <div className="col-md-6">
                      <label className="fw-bold small text-muted mb-1">YOUR NAME</label>
                      <input className="form-control rounded-pill px-3 py-2 border-light bg-light" placeholder="Full name" />
                   </div>
                   <div className="col-md-6">
                      <label className="fw-bold small text-muted mb-1">EMAIL ADDRESS</label>
                      <input className="form-control rounded-pill px-3 py-2 border-light bg-light" placeholder="Email" />
                   </div>
                   <div className="col-12">
                      <label className="fw-bold small text-muted mb-1">MESSAGE</label>
                      <textarea className="form-control rounded-4 px-3 py-2 border-light bg-light" rows="4" placeholder="Your message here..."></textarea>
                   </div>
                   <div className="col-12">
                      <button className="btn btn-premium w-100 py-3 shadow-sm">SEND MESSAGE</button>
                   </div>
                </form>
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
