'use client';

import { motion } from 'framer-motion';

export default function About() {
  const steps = [
    { year: "1990", title: "The Foundation", desc: "Started under the shade of Kunnath Mahallu to preserve traditional values." },
    { year: "2010", title: "Modernization", desc: "Introduced digital learning tools and better infrastructure for students." },
    { year: "2026", title: "New Era", desc: "Successfully integrated religious studies with professional guidance." }
  ];

  return (
    <div className="about-page bg-white py-5 min-vh-100">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="row justify-content-center mb-5"
        >
          <div className="col-lg-8 text-center">
            <h1 className="fw-bold display-4 text-teal">About Al Bayan</h1>
            <div className="divider"></div>
            <p className="lead text-muted">A legacy of knowledge, faith, and community service.</p>
          </div>
        </motion.div>

        <div className="row g-5 align-items-center">
          <motion.div 
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             className="col-md-6"
          >
            <div className="modern-card p-4 shadow-sm border-0">
               <h3 className="fw-bold mb-4">Our Vision</h3>
               <p className="text-muted">To be a pioneer institution that balances traditional Islamic values with the demands of the modern world, creating leaders of integrity and wisdom.</p>
               <hr className="my-4 opacity-10" />
               <h3 className="fw-bold mb-4">Our Mission</h3>
               <p className="text-muted">Providing high-quality spiritual and academic guidance, fostering a learning environment of excellence, and serving the community with dedication.</p>
            </div>
          </motion.div>
          
          <div className="col-md-6">
            <div className="ps-md-5">
              <h4 className="fw-bold mb-4 text-teal">Timeline of Excellence</h4>
              <div className="timeline">
                {steps.map((s, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="d-flex gap-4 mb-4 position-relative"
                  >
                    <div className="fw-bold h2 text-teal opacity-25" style={{ minWidth: '80px' }}>{s.year}</div>
                    <div>
                      <h5 className="fw-bold mb-1">{s.title}</h5>
                      <p className="small text-muted">{s.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
