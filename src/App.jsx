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
    <nav className="navbar navbar-expand-xl navbar-dark sticky-top glass-nav px-lg-4" id="mainNav">
      <div className="container-fluid">
        <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/" onClick={closeMenu}>
          <img src="/logo.png" alt="Logo" width="50" height="50" className="rounded-circle logo-glow" />
          <div className="brand-text">
            <span className="brand-title fw-bold">AL BAYAN KUNNATH</span>
          </div>
        </NavLink>
        
        <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <i className="bi bi-list fs-1 text-white"></i>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto nav-links gap-lg-3 me-lg-4">
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
          
          <div className="d-flex align-items-center gap-3 mt-3 mt-xl-0">
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
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-dark-teal text-white pt-5">
      <div className="container pb-4">
        <div className="row g-5">
          <div className="col-lg-4">
            <img src="/logo.png" alt="Logo" width="70" className="mb-4 rounded-circle bg-white p-1" />
            <h4 className="fw-bold mb-3">AL BAYAN KUNNATH</h4>
            <p className="opacity-75 lh-lg">Leading the way in traditional Islamic education integrated with modern academic excellence. Empowering students for a brighter future.</p>
          </div>
          <div className="col-md-4 col-lg-2">
            <h5 className="fw-bold mb-4 border-start border-teal border-4 ps-3">QUICK LINKS</h5>
            <div className="d-flex flex-column gap-3 fs-6">
              <NavLink to="/" className="text-white-50 text-decoration-none hover-white">Home</NavLink>
              <NavLink to="/admission" className="text-white-50 text-decoration-none hover-white">Admission 2026</NavLink>
              <NavLink to="/gallery" className="text-white-50 text-decoration-none hover-white">Media Gallery</NavLink>
              <NavLink to="/contact" className="text-white-50 text-decoration-none hover-white">Help & Support</NavLink>
            </div>
          </div>
          <div className="col-md-8 col-lg-6">
            <h5 className="fw-bold mb-4 border-start border-teal border-4 ps-3">CONTACT US</h5>
            <div className="row g-4">
               <div className="col-sm-6">
                  <div className="d-flex gap-3 align-items-center mb-4">
                     <div className="bg-teal p-3 rounded-circle d-flex align-items-center justify-content-center" style={{width:55, height:55}}>
                        <i className="bi bi-envelope-fill fs-4 text-white"></i>
                     </div>
                     <div>
                        <div className="small fw-bold opacity-50">EMAIL ADDRESS</div>
                        <a href="mailto:albayanrms@gmail.com" className="text-white text-decoration-none fw-medium">albayanrms@gmail.com</a>
                     </div>
                  </div>
                  <div className="social-grid d-flex gap-3">
                     <a href="https://wa.me/9745304342" target="_blank" className="btn btn-success rounded-circle shadow p-0 d-flex align-items-center justify-content-center" style={{width:45, height:45}}>
                        <i className="bi bi-whatsapp fs-4"></i>
                     </a>
                     <a href="https://www.instagram.com/bayanul_uloom_dars_/" target="_blank" className="btn btn-danger rounded-circle shadow p-0 d-flex align-items-center justify-content-center" style={{width:45, height:45, background:'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)'}}>
                        <i className="bi bi-instagram fs-4"></i>
                     </a>
                     <a href="#" className="btn btn-primary rounded-circle shadow p-0 d-flex align-items-center justify-content-center" style={{width:45, height:45}}>
                        <i className="bi bi-facebook fs-4"></i>
                     </a>
                  </div>
               </div>
               <div className="col-sm-6">
                  <div className="d-flex gap-3 align-items-center mb-3">
                     <div className="bg-teal p-3 rounded-circle d-flex align-items-center justify-content-center" style={{width:55, height:55}}>
                        <i className="bi bi-telephone-fill fs-4 text-white"></i>
                     </div>
                     <div>
                        <div className="small fw-bold opacity-50">PHONE SUPPORT</div>
                        <div className="fw-bold fs-5">+91 97453 04342</div>
                        <div className="small opacity-75">+91 98954 04342</div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-black py-4 mt-5">
        <div className="container text-center">
           <p className="mb-0 small text-white-50">© 2026 Al Bayan Kunnath Dars. Developed by Al Bayan Tech Division.</p>
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
