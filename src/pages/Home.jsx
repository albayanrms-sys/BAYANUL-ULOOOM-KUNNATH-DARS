import "./Home.css";

function Home() {
  return (
    <section className="home">
      <div className="hero">
        <h1>ബയാനുൾ ഉലൂം ദർസ്</h1>
        <p>ഇസ്ലാമിക വിദ്യാഭ്യാസത്തിൽ ഉയർന്ന നിലവാരം, പരമ്പരാഗത മൂല്യങ്ങൾ, ആധുനിക വിദ്യ.</p>
        <a href="/admission" className="cta-button">അഡ്മിഷൻ അപേക്ഷിക്കുക</a>
      </div>
      {/* Building illustration */}
      <div className="building-wrapper">
        <img src="/dars_building.jpg" alt="Dars Building" className="building-image" />
      </div>
    </section>
  );
}

export default Home;
