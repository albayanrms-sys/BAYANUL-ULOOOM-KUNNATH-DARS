'use client';
import { useState } from "react";
import { motion } from 'framer-motion';

export default function Admission() {
  const [formData, setFormData] = useState({ studentName: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) { alert("Success!"); setFormData({ studentName: "", phone: "", address: "" }); }
    } catch { alert("Network Error"); }
    setLoading(false);
  };

  return (
    <div className="container py-5 min-vh-100">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="modern-card p-5 mx-auto" style={{ maxWidth: '600px' }}>
        <h2 className="fw-bold mb-4 text-teal text-center">Admission 2026</h2>
        <div className="divider"></div>
        <form onSubmit={handleSubmit} className="row g-4">
          <div className="col-12">
             <label className="fw-bold small text-muted mb-2">FULL NAME</label>
             <input name="studentName" className="form-control rounded-pill px-4 py-2 border-light bg-light" placeholder="Student name" value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} />
          </div>
          <div className="col-12">
             <label className="fw-bold small text-muted mb-2">MOBILE</label>
             <input name="phone" className="form-control rounded-pill px-4 py-2 border-light bg-light" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="col-12">
             <label className="fw-bold small text-muted mb-2">ADDRESS</label>
             <textarea className="form-control rounded-4 px-4 py-2 border-light bg-light" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>
          <div className="col-12">
             <button type="submit" disabled={loading} className="btn btn-premium w-100 py-3 shadow">SUBMIT APPLICATION</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
