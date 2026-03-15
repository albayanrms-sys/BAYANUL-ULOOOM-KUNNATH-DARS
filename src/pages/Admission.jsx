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
        alert("Admission submitted successfully! You will be contacted soon.");
        setFormData({ studentName: "", fatherName: "", motherName: "", dob: "", place: "", address: "", phone: "", previousEdu: "", email: "" });
      } else {
        alert(data.error || "Submission failed");
      }
    } catch (err) {
      alert("Network Error");
    }
  };

  if (loading) return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  return (
    <section className="admission-page min-vh-100 py-5 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="section-header">
               <h2>Admission Portal 2026</h2>
               <div className="divider"></div>
               <p className="text-muted">Start your journey towards excellence today.</p>
            </div>

            {!isAdmissionOpen ? (
              <div className="modern-card text-center py-5 animate-up border border-danger">
                <i className="bi bi-lock-fill display-1 text-danger mb-4"></i>
                <h2 className="fw-bold text-danger">Registration Closed</h2>
                <p className="lead px-lg-5">{admissionStatus.message || "We are currently not accepting new applications. Please contact the office for more details."}</p>
                <a href="/contact" className="btn btn-premium mt-4">CONTACT OFFICE</a>
              </div>
            ) : (
              <div className="modern-card animate-up border-0 shadow-lg p-md-5">
                {admissionStatus.deadline && timeLeft !== "EXPIRED" && (
                  <div className="alert alert-warning border-0 rounded-4 d-flex align-items-center mb-4">
                     <i className="bi bi-clock-history fs-3 me-3"></i>
                     <div>
                        <span className="small fw-bold text-uppercase d-block mb-1">Closing Soon</span>
                        <span className="h5 fw-bold mb-0">{timeLeft}</span>
                     </div>
                  </div>
                )}
                
                {admissionStatus.message && (
                  <div className="bg-primary bg-opacity-10 p-4 rounded-4 mb-5 border-start border-primary border-5">
                     <h6 className="fw-bold text-primary mb-2">OFFICE NOTE</h6>
                     <p className="mb-0 small text-dark opacity-75">{admissionStatus.message}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="row g-4">
                  <div className="col-12">
                     <label className="fw-bold small text-muted mb-2">STUDENT FULL NAME</label>
                     <input name="studentName" className="form-control" placeholder="Enter complete name" value={formData.studentName} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                     <label className="fw-bold small text-muted mb-2">FATHER'S NAME</label>
                     <input name="fatherName" className="form-control" value={formData.fatherName} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                     <label className="fw-bold small text-muted mb-2">MOTHER'S NAME</label>
                     <input name="motherName" className="form-control" value={formData.motherName} onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                     <label className="fw-bold small text-muted mb-2">DATE OF BIRTH</label>
                     <input type="date" name="dob" className="form-control" value={formData.dob} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                     <label className="fw-bold small text-muted mb-2">MOBILE NUMBER</label>
                     <input type="tel" name="phone" className="form-control" placeholder="+91 XXXX" value={formData.phone} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                     <label className="fw-bold small text-muted mb-2">NATIVE PLACE</label>
                     <input name="place" className="form-control" value={formData.place} onChange={handleChange} />
                  </div>
                  <div className="col-12">
                     <label className="fw-bold small text-muted mb-2">PERMANENT ADDRESS</label>
                     <textarea name="address" className="form-control" rows="3" value={formData.address} onChange={handleChange} required />
                  </div>
                  <div className="col-12">
                     <label className="fw-bold small text-muted mb-2">PREVIOUS EDUCATION</label>
                     <input name="previousEdu" className="form-control" placeholder="Last school/madrassa name" value={formData.previousEdu} onChange={handleChange} />
                  </div>
                  <div className="col-12 pt-3">
                     <button type="submit" className="btn btn-premium w-100 py-3 fs-5 shadow">SUBMIT FORM</button>
                     <p className="text-center x-small text-muted mt-3">By submitting, you agree to the terms and standards of Al Bayan Kunnath Dars.</p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Admission;
