import Link from 'next/link';
export default function Footer() {
  return (
    <footer className="bg-white py-5 mt-5 border-top">
      <div className="container text-center text-md-start">
        <div className="row">
          <div className="col-md-4 mb-4">
             <h4 className="fw-bold text-teal">Al Bayan Kunnath</h4>
             <p className="text-muted small">Dedicated to spiritual and academic excellence.</p>
          </div>
          <div className="col-md-4 mb-4">
             <h6 className="fw-bold">Quick Links</h6>
             <ul className="list-unstyled small">
                <li><Link href="/about" className="text-decoration-none text-muted">About Us</Link></li>
                <li><Link href="/admission" className="text-decoration-none text-muted">Admission</Link></li>
                <li><Link href="/contact" className="text-decoration-none text-muted">Contact</Link></li>
             </ul>
          </div>
          <div className="col-md-4">
             <h6 className="fw-bold">Location</h6>
             <p className="small text-muted">SH 72, Oorakam, Kerala 676519</p>
             <p className="small text-muted">+91 94463 61571</p>
          </div>
        </div>
        <hr className="my-4 opacity-10" />
        <p className="text-center text-muted small">&copy; 2026 Al Bayan Kunnath Dars.</p>
      </div>
    </footer>
  );
}
