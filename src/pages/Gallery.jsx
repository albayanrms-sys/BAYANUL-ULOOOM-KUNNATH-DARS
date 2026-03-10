import "./Gallery.css";

function Gallery() {
  const galleryItems = [
    { title: "ദർസ് കെട്ടിടം", subtitle: "Dars Building", image: "/dars_building.jpg" },
    { title: "ക്ലാസ് മുറികൾ", subtitle: "Class Rooms", image: "/dars_building.jpg" }, // Use same image for placeholder
    { title: "ലൈബ്രറി", subtitle: "Library", image: "/dars_building.jpg" },
    { title: "ഓഡിറ്റോറിയം", subtitle: "Auditorium", image: "/dars_building.jpg" },
    { title: "പരിപാടികൾ", subtitle: "Events", image: "/dars_building.jpg" },
    { title: "മഹല്ല് പരിസരം", subtitle: "Mahall Surroundings", image: "/dars_building.jpg" },
  ];

  return (
    <section className="gallery-page py-5 container">
      <div className="text-center mb-5">
        <h1 className="gallery-title mb-2">ഗാലറി <br/><span className="sub-title fs-5 text-muted">GALLERY</span></h1>
        <p className="section-desc opacity-75">നമ്മുടെ വിദ്യാലയത്തിലെ മറക്കാനാവാത്ത നിമിഷങ്ങളും മനോഹരമായ കാഴ്ചകളും.</p>
      </div>

      <div className="row g-4 gallery-grid">
        {galleryItems.map((item, index) => (
          <div key={index} className="col-md-6 col-lg-4">
            <div className="gallery-card border-0 shadow-lg position-relative overflow-hidden rounded-4 h-100">
              <div className="card-img-wrapper" style={{ height: '280px' }}>
                <img src={item.image} alt={item.title} className="card-img-top h-100 w-100 object-fit-cover transition-img" />
              </div>
              <div className="gallery-overlay d-flex flex-column justify-content-end p-4">
                <h4 className="card-title text-white mb-1 shadow-text">{item.title}</h4>
                <p className="card-subtitle text-white-50 small shadow-text">{item.subtitle}</p>
                <div className="overlay-bg position-absolute top-0 start-0 w-100 h-100 opacity-30 bg-dark z-index-minus-1"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Gallery;
