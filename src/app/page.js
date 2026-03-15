'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
export default function Home() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="glass-card p-5 mx-auto" style={{ maxWidth: '900px' }}>
            <h1 className="display-3 mb-3 fw-bold text-teal">ബായനുൽ ഉലൂം ദർസ്</h1>
            <p className="lead mb-4 opacity-75">പരമ്പരാഗത മൂല്യങ്ങളുടെയും ആധുനിക അറിവുകളുടെയും സംഗമഭൂമി. വിദ്യാർത്ഥികളുടെ ഉന്നത വിജയത്തിനായി ഞങ്ങൾ പ്രതിജ്ഞാബദ്ധരാണ്.</p>
            <div className="d-flex justify-content-center gap-3">
              <Link href="/admission" className="btn btn-premium btn-lg px-5">ADMISSION 2026</Link>
              <Link href="/about" className="btn btn-outline-dark btn-lg px-5 rounded-pill">ABOUT US</Link>
            </div>
          </motion.div>
        </div>
      </section>
      <section className="py-5">
        <div className="container text-center">
           <h2 className="fw-bold">Latest Notifications</h2>
           <div className="divider"></div>
           <div className="modern-card p-5 shadow-sm border-0">
              <p className="text-muted">Admission for 2026 academic year is now open!</p>
           </div>
        </div>
      </section>
    </div>
  );
}
