import { useState } from "react";
import "./StudentLogin.css";

function StudentLogin() {
  const [formData, setFormData] = useState({ studentId: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("വിദ്യാർത്ഥി ലോഗിൻ നിലവിൽ ലഭ്യമല്ല. ദയവായി ഓഫീസുമായി ബന്ധപ്പെടുക.");
  };

  return (
    <section className="student-login-page py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="container px-4">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card login-card border-0 shadow-lg position-relative overflow-hidden glass-card p-4">
              <div className="text-center mb-5">
                <div className="login-logo-wrapper mb-4 animate-bounce">
                  <img src="/logo.png" alt="Dars Logo" width="80" height="80" className="rounded-circle shadow-lg" />
                </div>
                <h2 className="login-title mb-2">വിദ്യാർത്ഥി ലോഗിൻ <br/><span className="sub-title fs-6 text-muted">STUDENT LOGIN</span></h2>
              </div>
              
              <form onSubmit={handleSubmit} className="login-form">
                <div className="mb-4 text-start">
                  <label className="form-label text-muted small opacity-75 px-1">വിദ്യാർത്ഥി ഐഡി / STUDENT ID</label>
                  <input type="text" name="studentId" className="form-control" value={formData.studentId} onChange={handleChange} placeholder="Enter your ID" required />
                </div>
                <div className="mb-4 text-start">
                  <label className="form-label text-muted small opacity-75 px-1">പാസ്‌വേഡ് / PASSWORD</label>
                  <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
                </div>
                <button type="submit" className="btn btn-teal-primary w-100 py-3 fw-bold login-submit-btn shadow-teal mt-3">ലോഗിൻ / LOGIN</button>
              </form>
              
              <div className="text-center mt-5 mb-2">
                <p className="text-muted small">പാസ്‌വേഡ് ലഭ്യമല്ലേ? <a href="/contact" className="text-teal text-decoration-none fw-bold">സഹായം വേണം</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudentLogin;
