import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Home from './pages/Home.jsx';
import Usthads from './pages/Usthads.jsx';
import Admission from './pages/Admission.jsx';
import Contact from './pages/Contact.jsx';
import Admin from './pages/Admin.jsx';

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" id="mainNav">
      <div className="container">
        <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img src="/icon kunnath dars.png" alt="Logo" width="42" height="42" className="rounded-circle logo-icon" />
          <span className="brand-title">ബയാനുൾ ഉലൂം ദർസ്</span>
        </NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><NavLink className="nav-link" to="/" end>ഹോം</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/usthads">ഉസ്താദുകൾ</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/admission">അഡ്മിഷൻ</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/contact">ബന്ധപ്പെടുക</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link admin-nav-link" to="/admin">⚙ അഡ്മിൻ</NavLink></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="site-footer text-center py-4">
      <div className="container">
        <p className="mb-1">© 2025 ബയാനുൾ ഉലൂം ദർസ് കുന്നത്ത്</p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <a href="mailto:albayanrms@gmail.com" className="footer-link">📧 albayanrms@gmail.com</a>
          <a href="tel:+919745304342" className="footer-link">📞 97453 04342</a>
          <a href="https://t.me/ALBAYANKUNNATH" target="_blank" rel="noopener" className="footer-link">✈ Telegram</a>
          <a href="https://wa.me/9745304342" target="_blank" rel="noopener" className="footer-link">💬 WhatsApp</a>
          <a href="https://www.instagram.com/bayanul_uloom_dars_/" target="_blank" rel="noopener" className="footer-link">📸 Instagram</a>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/usthads" element={<Usthads />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
