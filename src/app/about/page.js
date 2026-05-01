export const metadata = { title: 'About Us | Al Bayan Kunnath Dars' };

export default function AboutPage() {
  return (
    <div className="container py-5 mt-5">
      <div className="row justify-content-center text-center">
        <div className="col-lg-8">
          <h1 className="display-4 fw-bold text-teal mb-4">About Us</h1>
          <div className="divider" style={{ width: '60px', height: '4px', background: '#008080', margin: '0 auto 2rem' }}></div>
          <p className="lead text-muted mb-4">
            Al Bayan Kunnath Dars is a premium Islamic education institution blending traditional values with modern learning methodologies to guide students towards a bright future.
          </p>
          <div className="bg-white p-5 rounded-4 shadow-sm border mt-5">
            <h3 className="fw-bold mb-3">Our Mission</h3>
            <p className="text-muted">
              To provide comprehensive education that nurtures both the spiritual and intellectual growth of our students, preparing them to be responsible and knowledgeable members of society.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
