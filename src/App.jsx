import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Gallery from './pages/Gallery.jsx';
import Contact from './pages/Contact.jsx';
import Admission from './pages/Admission.jsx';
import StudentLogin from './pages/StudentLogin.jsx';
import Admin from './pages/Admin.jsx';
import { useEffect } from 'react';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Header() {
  return (
    <nav className="navbar navbar-expand-xl navbar-dark sticky-top glass-nav" id="mainNav">
      <div className="container">
        <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img src="/logo.png" alt="Logo" width="45" height="45" className="rounded-circle logo-glow" />
          <div className="brand-text">
            <span className="brand-title">ബയാനുൾ ഉലൂം ദർസ്</span>
            <span className="brand-subtitle">BAYANUL ULOOM DARS</span>
          </div>
        </NavLink>
        
        <button className="navbar-toggler custom-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto nav-links">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>ഹോം <small>HOME</small></NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">ഞങ്ങളെക്കുറിച്ച് <small>ABOUT US</small></NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/gallery">ഗാലറി <small>GALLERY</small></NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/admission">അഡ്മിഷൻ <small>ADMISSION</small></NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">ബന്ധപ്പെടുക <small>CONTACT</small></NavLink>
            </li>
          </ul>
          
          <div className="nav-auth-btns d-flex gap-2">
            <NavLink className="btn btn-outline-light login-btn student-login" to="/student-login">
              STUDENT LOGIN
            </NavLink>
            <NavLink className="btn btn-teal-solid login-btn admin-login-btn" to="/admin">
              ADMIN LOGIN
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="professional-footer">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="footer-brand border-bottom-teal pb-3 mb-3">
              <h4 className="footer-title">ബയാനുൾ ഉലൂം ദർസ്</h4>
              <p className="footer-desc">പരമ്പരാഗത മൂല്യങ്ങളും ആധുനിക അറിവുകളും കൂട്ടിയിണക്കുന്ന ഉൽകൃഷ്ട വിദ്യാലയം.</p>
            </div>
          </div>
          <div className="col-lg-4">
            <h5 className="footer-subtitle">ദ്രുത ലിങ്കുകൾ</h5>
            <ul className="footer-links list-unstyled">
              <li><NavLink to="/about">ഞങ്ങളെക്കുറിച്ച്</NavLink></li>
              <li><NavLink to="/gallery">ഗാലറി</NavLink></li>
              <li><NavLink to="/admission">അഡ്മിഷൻ</NavLink></li>
              <li><NavLink to="/contact">ബന്ധപ്പെടുക</NavLink></li>
            </ul>
          </div>
          <div className="col-lg-4">
            <h5 className="footer-subtitle">ബന്ധപ്പെടുക</h5>
            <div className="footer-contact">
              <a href="mailto:albayanrms@gmail.com" className="d-block mb-2">📧 albayanrms@gmail.com</a>
              <a href="tel:+919745304342" className="d-block mb-1">📞 97453 04342</a>
              <a href="tel:+919895404342" className="d-block mb-3">📞 98954 04342</a>
              <div className="social-icons d-flex gap-3">
                <a href="https://wa.me/9745304342" target="_blank" rel="noopener">WhatsApp</a>
                <a href="https://t.me/ALBAYANKUNNATH" target="_blank" rel="noopener">Telegram</a>
                <a href="https://www.instagram.com/bayanul_uloom_dars_/" target="_blank" rel="noopener">Instagram</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom text-center py-3 bg-dark-teal text-white-50">
        <p className="mb-0">© 2025 Bayanul Uloom Dars Kunnath. All rights reserved.</p>
      </div>
    </footer>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
