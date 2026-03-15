'use client';

import { motion } from 'framer-motion';

export default function Usthads() {
  const usthads = [
    { name: "Ramees Baqavi", role: "Principal", image: "/ramees.jpg", desc: "Expert in Shariya and Hadith studies." },
    { name: "Abid Al Qasimi", role: "Senior Faculty", image: "/abid.jpg", desc: "Specialist in Arabic Literature and Fiqh." },
    { name: "Sajid Al Azhari", role: "Instructor", image: "/sajid.jpg", desc: "Teaching Quranic studies and Ethics." }
  ];

  return (
    <div className="usthads-page py-5 bg-light min-vh-100">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-header text-center mb-5"
        >
           <h2 className="fw-bold display-4 text-teal">Our Faculty</h2>
           <div className="divider"></div>
           <p className="text-muted lead">Learn from the experts in religious and academic fields.</p>
        </motion.div>

        <div className="row g-4 justify-content-center">
          {usthads.map((u, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="col-md-4"
            >
              <div className="modern-card p-4 text-center shadow-sm border-0 bg-white h-100">
                 <div className="rounded-circle overflow-hidden mb-4 mx-auto border border-5 border-light shadow-sm" style={{ width: '180px', height: '180px' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u.image} alt={u.name} className="img-fluid w-100 h-100 object-fit-cover" />
                 </div>
                 <h4 className="fw-bold mb-1 text-teal">{u.name}</h4>
                 <div className="badge-role bg-teal text-white mb-3 d-inline-block">{u.role}</div>
                 <p className="text-muted small px-3">{u.desc}</p>
                 <hr className="my-4 opacity-10" />
                 <div className="d-flex justify-content-center gap-3">
                    <a href="#" className="btn btn-outline-secondary btn-sm rounded-circle"><i className="bi bi-facebook"></i></a>
                    <a href="#" className="btn btn-outline-secondary btn-sm rounded-circle"><i className="bi bi-twitter"></i></a>
                    <a href="#" className="btn btn-outline-secondary btn-sm rounded-circle"><i className="bi bi-envelope"></i></a>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
