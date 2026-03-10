import { useState } from "react";
import "./Admission.css";

function Admission() {
  const [formData, setFormData] = useState({
    studentName: "",
    fatherName: "",
    dob: "",
    address: "",
    phone: "",
    previousEdu: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted admission:", formData);
    alert("അപേക്ഷ സമർപ്പിച്ചു! ഉടൻ തന്നെ ഞങ്ങൾ നിങ്ങളെ ബന്ധപ്പെടും.");
  };

  return (
    <section className="admission container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-6">
          <div className="card admission-form-card glass-form p-4">
            <h2 className="text-center mb-4">അഡ്മിഷൻ ഫോം</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input name="studentName" className="form-control" placeholder="വിദ്യാർത്ഥിയുടെ പേര്" value={formData.studentName} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <input name="fatherName" className="form-control" placeholder="പിതാവിന്റെ / രക്ഷിതാവിന്റെ പേര്" value={formData.fatherName} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <input type="date" name="dob" className="form-control" placeholder="ജന്മതീയതി" value={formData.dob} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <textarea name="address" className="form-control" placeholder="വിലാസം" rows="3" value={formData.address} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <input type="tel" name="phone" className="form-control" placeholder="ഫോൺ നമ്പർ" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="mb-4">
                <input name="previousEdu" className="form-control" placeholder="മുൻ വിദ്യാഭ്യാസം" value={formData.previousEdu} onChange={handleChange} />
              </div>
              <button type="submit" className="btn btn-teal-primary w-100 py-3 fw-bold">അപേക്ഷ സമർപ്പിക്കുക</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Admission;
