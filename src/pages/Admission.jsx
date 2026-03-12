import { useState, useEffect } from "react";
import "./Admission.css";

function Admission() {
  const [formData, setFormData] = useState({
    studentName: "", fatherName: "", motherName: "", dob: "", place: "", address: "", phone: "", previousEdu: "", email: ""
  });
  
  const [admissionStatus, setAdmissionStatus] = useState({ active: true, message: "", deadline: null });
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    fetch("/api/settings/admission")
      .then(res => res.json())
      .then(data => {
        setAdmissionStatus(data);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (admissionStatus.deadline) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const dest = new Date(admissionStatus.deadline).getTime();
        const diff = dest - now;

        if (diff <= 0) {
          clearInterval(timer);
          setTimeLeft("EXPIRED");
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${days}d ${hours}h ${mins}m ${secs}s`);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [admissionStatus.deadline]);

  const isAdmissionOpen = admissionStatus.active && (!admissionStatus.deadline || new Date(admissionStatus.deadline) > new Date());

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmissionOpen) {
      alert("Admissions are currently closed.");
      return;
    }
    try {
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        alert("Admission submitted successfully! Your tracking credentials have been generated.");
        setFormData({ studentName: "", fatherName: "", motherName: "", dob: "", place: "", address: "", phone: "", previousEdu: "", email: "" });
      } else {
        alert(data.error || "Submission failed");
      }
    } catch (err) {
      alert("Network Error");
    }
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;

  return (
    <section className="admission container py-5" style={{fontFamily: 'Inter, sans-serif'}}>
      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-7">
          {!isAdmissionOpen ? (
            <div className="card glass-form p-5 text-center shadow-lg border-danger">
              <span className="display-1">🔒</span>
              <h2 className="text-danger fw-bold mt-4 mb-3">Admissions Closed</h2>
              <p className="lead">{admissionStatus.deadline && (new Date(admissionStatus.deadline) <= new Date()) ? "The application deadline has passed." : (admissionStatus.message || "We are not accepting any new applications at this time.")}</p>
              <a href="/contact" className="btn btn-outline-dark mt-4 px-4 fw-bold">Contact Administration</a>
            </div>
          ) : (
            <div className="card admission-form-card glass-form p-4 shadow-lg border-0 rounded-4">
              {admissionStatus.deadline && timeLeft !== "EXPIRED" && (
                <div className="alert alert-danger fw-bold text-center border-0 shadow-sm mb-4">
                   ⏳ Time Left: {timeLeft}
                </div>
              )}
              {admissionStatus.message && (
                <div className="alert alert-info fw-bold border-0 shadow-sm mb-4 p-3 bg-light-teal text-teal">
                  <div className="d-flex align-items-center">
                    <span className="fs-4 me-3">📝</span>
                    <div>
                      <div className="small text-muted text-uppercase fw-bold mb-1">Important Admission Note</div>
                      <div className="fs-6">{admissionStatus.message}</div>
                    </div>
                  </div>
                </div>
              )}
              
              <h2 className="text-center mb-1 fw-bold" style={{color: '#006d77'}}>ADMISSION FORM</h2>
              <p className="text-center text-muted mb-4 small">Fill up the details below to complete your registration</p>
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-12 mb-3">
                    <label className="form-label text-muted small fw-bold px-1">Student Full Name</label>
                    <input name="studentName" className="form-control p-3 bg-light" placeholder="Student Name" value={formData.studentName} onChange={handleChange} required />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold px-1">Father's Name</label>
                    <input name="fatherName" className="form-control p-3 bg-light" placeholder="Father Name" value={formData.fatherName} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold px-1">Mother's Name</label>
                    <input name="motherName" className="form-control p-3 bg-light" placeholder="Mother Name" value={formData.motherName} onChange={handleChange} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted small fw-bold px-1">Date of Birth</label>
                    <input type="date" name="dob" className="form-control p-3 bg-light" value={formData.dob} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted small fw-bold px-1">Mobile Number</label>
                    <input type="tel" name="phone" className="form-control p-3 bg-light" placeholder="Mobile" value={formData.phone} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted small fw-bold px-1">Native Place</label>
                    <input name="place" className="form-control p-3 bg-light" placeholder="Place Name" value={formData.place} onChange={handleChange} />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold px-1">Email Address (Optional)</label>
                  <input type="email" name="email" className="form-control p-3 bg-light" placeholder="email@example.com" value={formData.email} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold px-1">Full Address</label>
                  <textarea name="address" className="form-control p-3 bg-light" placeholder="Complete address" rows="2" value={formData.address} onChange={handleChange} required />
                </div>
                <div className="mb-4">
                  <label className="form-label text-muted small fw-bold px-1">Previous Education Details</label>
                  <input name="previousEdu" className="form-control p-3 bg-light" placeholder="Last School / Madrassa attended" value={formData.previousEdu} onChange={handleChange} />
                </div>
                <button type="submit" className="btn btn-teal-primary w-100 py-3 fw-bold shadow-sm rounded-pill">SUBMIT APPLICATION</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Admission;
