import { useState, useEffect } from "react";
import "./Admission.css";

function Admission() {
  const [formData, setFormData] = useState({
    studentName: "", fatherName: "", dob: "", address: "", phone: "", previousEdu: "",
  });
  
  const [admissionStatus, setAdmissionStatus] = useState({ active: true, message: "" });
  const [loading, setLoading] = useState(true);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        alert("Admission submitted successfully! Your tracking credentials have been generated.");
        setFormData({ studentName: "", fatherName: "", dob: "", address: "", phone: "", previousEdu: "" });
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
        <div className="col-lg-8 col-xl-6">
          {!admissionStatus.active ? (
            <div className="card glass-form p-5 text-center shadow-lg border-danger">
              <span className="display-1">🔒</span>
              <h2 className="text-danger fw-bold mt-4 mb-3">Admissions Closed</h2>
              <p className="lead">{admissionStatus.message || "We are not accepting any new applications at this time."}</p>
              <a href="/contact" className="btn btn-outline-dark mt-4 px-4 fw-bold">Contact Administration</a>
            </div>
          ) : (
            <div className="card admission-form-card glass-form p-4 shadow-lg border-0 rounded-4">
              {admissionStatus.message && (
                <div className="alert alert-warning fw-bold text-center border-0 shadow-sm mb-4">
                  📢 {admissionStatus.message}
                </div>
              )}
              
              <h2 className="text-center mb-1 fw-bold" style={{color: '#006d77'}}>ADMISSION FORM</h2>
              <p className="text-center text-muted mb-4 small">Fill up the details below to complete your registration</p>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold px-1">Student Full Name</label>
                  <input name="studentName" className="form-control p-3 bg-light" placeholder="John Doe" value={formData.studentName} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold px-1">Father's / Guardian's Name</label>
                  <input name="fatherName" className="form-control p-3 bg-light" placeholder="Guardian Name" value={formData.fatherName} onChange={handleChange} required />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold px-1">Date of Birth</label>
                    <input type="date" name="dob" className="form-control p-3 bg-light" value={formData.dob} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold px-1">Mobile Number</label>
                    <input type="tel" name="phone" className="form-control p-3 bg-light" placeholder="Your Number" value={formData.phone} onChange={handleChange} required />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold px-1">Full Address</label>
                  <textarea name="address" className="form-control p-3 bg-light" placeholder="Your residential address" rows="3" value={formData.address} onChange={handleChange} required />
                </div>
                <div className="mb-4">
                  <label className="form-label text-muted small fw-bold px-1">Previous Education Details</label>
                  <input name="previousEdu" className="form-control p-3 bg-light" placeholder="School / College / Dars Name" value={formData.previousEdu} onChange={handleChange} />
                </div>
                <button type="submit" className="btn btn-teal-primary w-100 py-3 fw-bold shadow-sm rounded">SUBMIT APPLICATION</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Admission;
