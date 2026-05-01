import "./Usthads.css";

const usthads = [
  { name: "ഉസ്താദ് അഹ്മദ്", qualification: "മാസ്റ്റർ ഓഫ് അറബി", subject: "അറബി" },
  { name: "ഉസ്താദ് ഫൈസൽ", qualification: "മാസ്റ്റർ ഓഫ് ഹദീസ്", subject: "ഹദീസ്" },
];

function Usthads() {
  return (
    <section className="usthads container py-5">
      <h2 className="text-center mb-5 section-title">ബഹുമാനപ്പെട്ട ഉസ്താദുമാർ</h2>
      <div className="row g-4 justify-content-center">
        {usthads.map((u, i) => (
          <div key={i} className="col-md-4">
            <div className="card h-100 usthad-card text-center p-4">
              <div className="avatar mb-3"></div>
              <h3 className="h5 mb-2">{u.name}</h3>
              <p className="text-muted mb-1 small">{u.qualification}</p>
              <div className="badge bg-teal-soft text-teal mt-auto">വിഷയം: {u.subject}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Usthads;
