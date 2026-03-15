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
  const closeMenu = () => {
    const el = document.getElementById('navbarNav');
    if (el && el.classList.contains('show')) {
       const bsCollapse = new window.bootstrap.Collapse(el);
       bsCollapse.hide();
    }
  };

  return (
    <nav className="navbar navbar-expand-xl navbar-light sticky-top glass-nav px-lg-4" id="mainNav">
      <div className="container-fluid">
        <NavLink className="navbar-brand d-flex align-items-center gap-3" to="/" onClick={closeMenu}>
          <img src="/logo.png" alt="Logo" width="45" height="45" className="rounded-circle shadow-sm" />
          <div className="brand-text">
            <span className="brand-title fw-bold text-primary">AL BAYAN KUNNATH</span>
          </div>
        </NavLink>
        
        <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <i className="bi bi-list fs-1 text-primary"></i>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto nav-links gap-lg-2 me-lg-4">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end onClick={closeMenu}>HOME</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about" onClick={closeMenu}>ABOUT</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/gallery" onClick={closeMenu}>GALLERY</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/admission" onClick={closeMenu}>ADMISSION</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact" onClick={closeMenu}>CONTACT</NavLink>
            </li>
          </ul>
          
            <div className="dropdown">
              <button className="btn btn-teal-solid dropdown-toggle fw-bold rounded-pill px-4" type="button" data-bs-toggle="dropdown">
                <i className="bi bi-shield-lock-fill fs-5 me-2"></i>
                <span>LOGIN</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 mt-2 overflow-hidden">
                <li>
                  <NavLink className="dropdown-item py-3 d-flex align-items-center gap-3" to="/student-login" onClick={closeMenu}>
                      <span className="fs-4">🎓</span>
                      <div>
                        <div className="fw-bold">Student Portal</div>
                        <div className="small text-muted">View results & docs</div>
                      </div>
                  </NavLink>
                </li>
                <hr className="dropdown-divider m-0 opacity-10"/>
                <li>
                  <NavLink className="dropdown-item py-3 d-flex align-items-center gap-3" to="/admin" onClick={closeMenu}>
                      <span className="fs-4">🛡️</span>
                      <div>
                        <div className="fw-bold">Admin Panel</div>
                        <div className="small text-muted">Management access</div>
                      </div>
                  </NavLink>
                </li>
              </ul>
            </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer-main">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-4">
            <img src="/logo.png" alt="Logo" width="60" className="mb-4 rounded-circle bg-white p-1" />
            <h4 className="fw-bold mb-3">AL BAYAN KUNNATH</h4>
            <p className="text-white-50 lh-lg">Empowering the next generation of scholars through a unique blend of traditional wisdom and modern academic rigor.</p>
          </div>
          <div className="col-md-4 col-lg-2">
            <h5 className="fw-bold mb-4">RESOURCES</h5>
            <div className="d-flex flex-column gap-3">
              <NavLink to="/" className="text-white-50 text-decoration-none hover-white">Home</NavLink>
              <NavLink to="/admission" className="text-white-50 text-decoration-none hover-white">Admission 2026</NavLink>
              <NavLink to="/gallery" className="text-white-50 text-decoration-none hover-white">Gallery</NavLink>
              <NavLink to="/contact" className="text-white-50 text-decoration-none hover-white">Contact</NavLink>
            </div>
          </div>
          <div className="col-md-8 col-lg-6">
            <h5 className="fw-bold mb-4 text-uppercase">Direct Contact</h5>
            <div className="row g-4">
               <div className="col-sm-6">
                  <div className="d-flex gap-3 align-items-center mb-4">
                     <div className="bg-primary p-3 rounded-circle d-flex align-items-center justify-content-center" style={{width:50, height:50}}>
                        <i className="bi bi-envelope-at-fill fs-5 text-white"></i>
                     </div>
                     <div>
                        <div className="x-small fw-bold text-white-50">EMAIL US</div>
                        <a href="mailto:albayanrms@gmail.com" className="text-white text-decoration-none fw-medium">albayanrms@gmail.com</a>
                     </div>
                  </div>
                  <div className="d-flex gap-3">
                     <a href="https://wa.me/9745304342" target="_blank" className="btn btn-outline-light rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center" style={{width:40, height:40}}>
                        <i className="bi bi-whatsapp"></i>
                     </a>
                     <a href="https://www.instagram.com/bayanul_uloom_dars_/" target="_blank" className="btn btn-outline-light rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center" style={{width:40, height:40}}>
                        <i className="bi bi-instagram"></i>
                     </a>
                     <a href="#" className="btn btn-outline-light rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center" style={{width:40, height:40}}>
                        <i className="bi bi-facebook"></i>
                     </a>
                  </div>
               </div>
                <div className="col-sm-6 text-sm-end">
                   <h6 className="fw-bold text-white text-uppercase small">Find Us</h6>
                   <p className="text-white-50 small mb-0">SH 72, Oorakam,<br/>Kerala - 676519, India</p>
                </div>
            </div>
          </div>
        </div>
        <hr className="my-5 opacity-10"/>
        <div className="text-center text-white-50 x-small">
          © {new Date().getFullYear()} Al Bayan Kunnath. All rights reserved.
        </div>
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
          <Route path="/contact" element={<Contact />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
