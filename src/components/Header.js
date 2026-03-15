'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  useEffect(() => { require('bootstrap/dist/js/bootstrap.bundle.min.js'); }, []);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT', path: '/about' },
    { name: 'GALLERY', path: '/gallery' },
    { name: 'USTHADS', path: '/usthads' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <nav className="navbar navbar-expand-xl navbar-light sticky-top glass-nav px-lg-4" id="mainNav">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center gap-3" href="/">
          <div className="brand-text">
            <span className="brand-title fw-bold text-teal">AL BAYAN KUNNATH</span>
          </div>
        </Link>
        <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <i className="bi bi-list fs-1 text-teal"></i>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto nav-links gap-lg-2 me-lg-4">
            {navLinks.map((link) => (
              <li key={link.path} className="nav-item">
                <Link className={`nav-link ${pathname === link.path ? 'active' : ''}`} href={link.path}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="dropdown">
            <button className="btn btn-teal-solid dropdown-toggle fw-bold rounded-pill px-4" type="button" data-bs-toggle="dropdown">
              <i className="bi bi-shield-lock-fill me-2"></i>LOGIN
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 mt-2 overflow-hidden">
              <li><Link className="dropdown-item py-3" href="/student-login">🎓 Student Portal</Link></li>
              <li><Link className="dropdown-item py-3" href="/admin-login">🛡️ Admin Panel</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
