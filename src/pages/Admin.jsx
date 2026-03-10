import { useState } from "react";
import "./Admin.css";

function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "dars2026") {
      setLoggedIn(true);
    } else {
      alert("പാസ്‌വേഡ് തെറ്റാണ്! (Hint: dars2026)");
    }
  };

  if (!loggedIn) {
    return (
      <section className="admin-login container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="card glass-card p-4 mx-auto text-center" style={{ maxWidth: '400px' }}>
          <h2 className="mb-4">അഡ്മിൻ ലോഗിൻ</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4 text-start">
              <label className="form-label text-muted small opacity-80 px-1">പാസ്‌വേഡ്</label>
              <input type="password" name="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-teal-primary w-100 py-3 fw-bold">ലോഗിൻ</button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-dashboard container py-5">
      <div className="row g-4">
        <div className="col-12 text-center mb-4">
          <h2 className="mb-3">അഡ്മിൻ ഡാഷ്ബോർഡ്</h2>
          <p className="text-muted fs-5">ഇവിടെ നിങ്ങൾക്ക് വിദ്യാർത്ഥികളുടെ പട്ടികയും, ഉസ്താദുകളെയും മാനേജ് ചെയ്യാം.</p>
        </div>
        
        <div className="col-md-4">
          <div className="card admin-stat-card glass-card p-4 h-100 text-center border-teal-soft">
            <span className="fs-1 mb-3">🎓</span>
            <h3 className="h5 mb-2">വിദ്യാർത്ഥികൾ</h3>
            <p className="text-muted small">വിദ്യാർത്ഥികളുടെ വിവരങ്ങൾ ചേർക്കുക അല്ലെങ്കിൽ മാറ്റങ്ങൾ വരുത്തുക</p>
            <button className="btn btn-outline-teal w-100 mt-auto">കാണുക</button>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card admin-stat-card glass-card p-4 h-100 text-center border-teal-soft">
            <span className="fs-1 mb-3">🧔</span>
            <h3 className="h5 mb-2">ഉസ്താദുകൾ</h3>
            <p className="text-muted small">ഉസ്താദുമാരുടെ പ്രൊഫൈലുകൾ മാനേജ് ചെയ്യുക</p>
            <button className="btn btn-outline-teal w-100 mt-auto">കാണുക</button>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card admin-stat-card glass-card p-4 h-100 text-center border-teal-soft">
            <span className="fs-1 mb-3">📝</span>
            <h3 className="h5 mb-2">അഡ്മിഷൻ അപേക്ഷകൾ</h3>
            <p className="text-muted small">പുതിയ അപേക്ഷകൾ പരിശോധിക്കാം</p>
            <button className="btn btn-outline-teal w-100 mt-auto">പരിശോധിക്കാം</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Admin;
