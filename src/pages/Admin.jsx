import { useState, useEffect } from "react";
import "./Admin.css";

function Admin() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [username, setUsername] = useState("ramees baqavi");
  const [password, setPassword] = useState("remees786");
  
  // Dashboard states
  const [activeTab, setActiveTab] = useState("overview");
  const [students, setStudents] = useState([]);
  const [admissionActive, setAdmissionActive] = useState(true);
  const [admissionMsg, setAdmissionMsg] = useState("");
  const [results, setResults] = useState([]);

  // Result Form
  const [resultStudent, setResultStudent] = useState("");
  const [examName, setExamName] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [grade, setGrade] = useState("");

  // Gallery Form
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryFile, setGalleryFile] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  useEffect(() => {
    if (token) {
      fetchStudents();
      fetchSettings();
      fetchResults();
      fetchGallery();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.role === 'admin') {
        localStorage.setItem("adminToken", data.token);
        setToken(data.token);
      } else {
        alert(data.error || "Login Failed");
      }
    } catch(err) {
      alert("Network Error");
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
  };

  const fetchStudents = async () => {
    const res = await fetch("/api/students", { headers: { Authorization: `Bearer ${token}` } });
    if(res.ok) setStudents(await res.json());
  };

  const fetchSettings = async () => {
    const res = await fetch("/api/settings/admission");
    if(res.ok) {
      const data = await res.json();
      setAdmissionActive(data.active);
      setAdmissionMsg(data.message || "");
    }
  };

  const fetchResults = async () => {
    const res = await fetch("/api/results", { headers: { Authorization: `Bearer ${token}` } });
    if(res.ok) setResults(await res.json());
  };

  const fetchGallery = async () => {
    const res = await fetch("/api/gallery");
    if(res.ok) setGalleryItems(await res.json());
  };

  const updateSetting = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/settings/admission", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ active: admissionActive, message: admissionMsg })
    });
    if(res.ok) alert("Settings Updated!");
  };

  const deleteStudent = async (id) => {
    if(!window.confirm("Delete this student permanently?")) return;
    await fetch(`/api/students/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchStudents();
  };

  const publishResult = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/results", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ student: resultStudent, examName, totalMarks: Number(totalMarks), grade })
    });
    if(res.ok) {
      alert("Result Published");
      setResultStudent(""); setExamName(""); setTotalMarks(""); setGrade("");
      fetchResults();
    }
  };

  const uploadMedia = async (e) => {
    e.preventDefault();
    if (!galleryFile) return;
    setUploadingMedia(true);
    
    // Upload file to Cloudinary first
    const formData = new FormData();
    formData.append("file", galleryFile);
    
    try {
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      
      if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");
      
      // Save URL to MongoDB
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          url: uploadData.url, 
          title: galleryTitle,
          type: galleryFile.type.includes("video") ? "video" : "image"
        })
      });
      
      if(res.ok) {
        alert("Media uploaded successfully!");
        setGalleryTitle("");
        setGalleryFile(null);
        fetchGallery();
      }
    } catch(err) {
      alert(err.message || "Failed to upload media");
    } finally {
      setUploadingMedia(false);
    }
  };

  const deleteGalleryItem = async (id) => {
    if(!window.confirm("Delete this media from gallery?")) return;
    await fetch(`/api/gallery/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchGallery();
  };

  if (!token) {
    return (
      <section className="admin-login container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="card glass-card p-4 mx-auto text-center shadow-lg border-0" style={{ maxWidth: '400px', width: '100%' }}>
          <h2 className="mb-4 text-teal fw-bold">ADMIN LOGIN</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3 text-start">
              <label className="form-label text-muted small px-1 fw-bold">Username</label>
              <input type="text" className="form-control p-3 bg-light" placeholder="ramees baqavi" value={username} onChange={e=>setUsername(e.target.value)} required />
            </div>
            <div className="mb-4 text-start">
              <label className="form-label text-muted small px-1 fw-bold">Password</label>
              <input type="password" className="form-control p-3 bg-light" placeholder="remees786" value={password} onChange={e=>setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-teal-primary w-100 py-3 fw-bold rounded-pill shadow-sm">SECURE LOGIN</button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <div className="admin-dashboard container-fluid bg-light min-vh-100 p-0" style={{fontFamily: 'Inter, sans-serif'}}>
      <div className="row g-0">
        <div className="col-md-3 bg-dark-teal text-white min-vh-100 p-4 shadow-lg sidebar">
          <h4 className="mb-4 text-center pb-3 border-bottom border-secondary fw-bold">ADMIN PANEL</h4>
          <div className="nav flex-column nav-pills gap-2 text-start">
            <button className={`nav-link text-start rounded text-white ${activeTab === 'overview' ? 'active bg-teal-primary fw-bold shadow-sm' : ''}`} onClick={() => setActiveTab('overview')}>📊 Dashboard</button>
            <button className={`nav-link text-start rounded text-white ${activeTab === 'students' ? 'active bg-teal-primary fw-bold shadow-sm' : ''}`} onClick={() => setActiveTab('students')}>👨‍🎓 Students List</button>
            <button className={`nav-link text-start rounded text-white ${activeTab === 'results' ? 'active bg-teal-primary fw-bold shadow-sm' : ''}`} onClick={() => setActiveTab('results')}>📝 Publish Results</button>
            <button className={`nav-link text-start rounded text-white ${activeTab === 'gallery' ? 'active bg-teal-primary fw-bold shadow-sm' : ''}`} onClick={() => setActiveTab('gallery')}>📸 Gallery Uploads</button>
            <button className={`nav-link text-start rounded text-white ${activeTab === 'settings' ? 'active bg-teal-primary fw-bold shadow-sm' : ''}`} onClick={() => setActiveTab('settings')}>⚙️ Settings / Notices</button>
          </div>
          <button className="btn btn-outline-light w-100 rounded-pill mt-5 fw-bold" onClick={logout}>Sign Out</button>
        </div>
        
        <div className="col-md-9 p-5 bg-white overflow-auto pb-5">
          {activeTab === 'overview' && (
            <div>
              <h2 className="mb-4 fw-bold">Dashboard Overview</h2>
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="card p-4 bg-light-teal border-0 shadow-sm rounded-4 text-center">
                    <h3 className="display-4 fw-bold text-teal">{students.length}</h3>
                    <p className="text-muted mb-0 fw-medium">Total Students</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card p-4 bg-light border-0 shadow-sm rounded-4 text-center">
                    <h3 className="display-4 fw-bold text-teal">{results.length}</h3>
                    <p className="text-muted mb-0 fw-medium">Results Published</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card p-4 bg-light border-0 shadow-sm rounded-4 text-center">
                    <h3 className={`display-5 my-2 fw-bold ${admissionActive ? "text-success" : "text-danger"}`}>
                      {admissionActive ? "OPEN" : "CLOSED"}
                    </h3>
                    <p className="text-muted mb-0 fw-medium">Admissions</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div>
              <h2 className="mb-4 fw-bold">Student Directory</h2>
              <div className="table-responsive bg-white shadow-sm rounded-4 p-3 border">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="text-muted">NAME</th>
                      <th className="text-muted">PHONE/USER</th>
                      <th className="text-muted">DOCUMENTS</th>
                      <th className="text-muted text-end">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s._id}>
                        <td className="fw-bold fs-6">
                          {s.profilePhoto && <img src={s.profilePhoto} alt="Profile" className="rounded-circle me-2" width="30" height="30" style={{objectFit: 'cover'}}/>}
                          {s.studentName}
                        </td>
                        <td className="font-monospace text-teal">{s.phone}</td>
                        <td>
                          {s.aadharFile && <a href={s.aadharFile} target="_blank" rel="noreferrer" className="badge bg-primary text-decoration-none me-1">Aadhar</a>}
                          {s.sslcFile && <a href={s.sslcFile} target="_blank" rel="noreferrer" className="badge bg-info text-dark text-decoration-none">SSLC</a>}
                          {!s.aadharFile && !s.sslcFile && <span className="small text-muted">-</span>}
                        </td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-danger shadow-sm rounded border-0 fw-bold px-3 py-1" onClick={() => deleteStudent(s._id)}>Remove</button>
                        </td>
                      </tr>
                    ))}
                    {students.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-5">No students found</td></tr>}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 small text-muted">* Student login credentials are automatically set to Phone (username) and DOB (password).</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div style={{maxWidth: "600px"}}>
              <h2 className="mb-4 fw-bold">System Settings</h2>
              <div className="card shadow-sm border rounded-4 p-4 mb-4">
                <h5 className="mb-3 text-teal fw-bold">Admission Controls</h5>
                <form onSubmit={updateSetting}>
                  <div className="form-check form-switch mb-3 ps-5">
                    <input className="form-check-input fs-4 ms-n5" type="checkbox" id="admissionToggle" checked={admissionActive} onChange={(e) => setAdmissionActive(e.target.checked)} />
                    <label className="form-check-label ms-2 mt-1 fw-bold fs-5" htmlFor="admissionToggle">
                      Admissions Open
                    </label>
                  </div>
                  <div className="mb-4">
                    <label className="form-label text-muted small fw-bold">Admission Notice / Alert Box</label>
                    <input type="text" className="form-control p-3 bg-light" value={admissionMsg} onChange={(e) => setAdmissionMsg(e.target.value)} placeholder="(e.g. 'Admissions close in 7 days!')" />
                    <div className="form-text mt-2">This notice will be displayed immediately to the public on the admission page.</div>
                  </div>
                  <button type="submit" className="btn btn-teal-primary w-100 py-3 rounded shadow-sm fw-bold">Save Changes</button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div>
              <h2 className="mb-4 fw-bold">Publish Results</h2>
              <div className="card shadow-sm border rounded-4 p-4 mb-5 bg-white">
                <form onSubmit={publishResult} className="row g-4 align-items-end">
                  <div className="col-md-4">
                    <label className="form-label fw-bold text-muted small">Select Student</label>
                    <select className="form-select p-3 bg-light" value={resultStudent} onChange={e=>setResultStudent(e.target.value)} required>
                      <option value="">-- Choose Student --</option>
                      {students.map(s => <option key={s._id} value={s._id}>{s.studentName} ({s.phone})</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold text-muted small">Exam Name</label>
                    <input type="text" className="form-control p-3 bg-light" placeholder="Mid Term 2026" value={examName} onChange={e=>setExamName(e.target.value)} required />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-bold text-muted small">Marks Output</label>
                    <input type="number" className="form-control p-3 bg-light" placeholder="e.g. 500" value={totalMarks} onChange={e=>setTotalMarks(e.target.value)} required />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-bold text-muted small">Grade</label>
                    <input type="text" className="form-control p-3 bg-light" placeholder="A+" value={grade} onChange={e=>setGrade(e.target.value)} required />
                  </div>
                  <div className="col-12 mt-4 text-end">
                    <button type="submit" className="btn btn-teal-primary px-5 py-3 rounded shadow-sm fw-bold w-100">Publish Now</button>
                  </div>
                </form>
              </div>

              <h4 className="mb-3 fw-bold">Published Results Log</h4>
              <div className="table-responsive shadow-sm rounded-4 border bg-white p-2">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="table-light"><tr><th className="text-muted">STUDENT</th><th className="text-muted">EXAM</th><th className="text-muted">TOTAL SCORE</th><th className="text-muted">GRADE</th><th className="text-muted">DATE</th></tr></thead>
                  <tbody>
                    {results.map(r => (
                      <tr key={r._id}>
                        <td className="fw-bold">{r.student?.studentName || "Deleted User"}</td>
                        <td>{r.examName}</td>
                        <td className="fw-bold">{r.totalMarks}</td>
                        <td><span className="badge bg-success py-2 px-3">{r.grade}</span></td>
                        <td className="text-muted small">{new Date(r.publishedDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {results.length === 0 && <tr><td colSpan="5" className="text-center py-5 text-muted">No results</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div>
              <h2 className="mb-4 fw-bold">Manage Gallery</h2>
              
              <div className="card shadow-sm border rounded-4 p-4 mb-5 bg-white">
                <h5 className="mb-3 text-teal fw-bold">Upload Photo or Video</h5>
                <form onSubmit={uploadMedia} className="row g-4 align-items-end">
                  <div className="col-md-5">
                    <label className="form-label fw-bold text-muted small">File (Image/Video)</label>
                    <input type="file" className="form-control p-3 bg-light" accept="image/*,video/*" onChange={e=>setGalleryFile(e.target.files[0])} required />
                  </div>
                  <div className="col-md-5">
                    <label className="form-label fw-bold text-muted small">Title / Caption</label>
                    <input type="text" className="form-control p-3 bg-light" placeholder="Annual Event 2026" value={galleryTitle} onChange={e=>setGalleryTitle(e.target.value)} required />
                  </div>
                  <div className="col-md-2">
                    <button type="submit" className="btn btn-teal-primary w-100 py-3 rounded fw-bold shadow-sm" disabled={uploadingMedia}>
                      {uploadingMedia ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                </form>
              </div>

              <h4 className="mb-3 fw-bold">Current Gallery</h4>
              <div className="row g-4">
                {galleryItems.map(item => (
                  <div className="col-md-4 col-sm-6" key={item._id}>
                    <div className="card shadow-sm border-0 rounded-4 overflow-hidden position-relative">
                      {item.type === 'video' ? (
                        <video src={item.url} controls className="w-100" style={{objectFit: 'cover', height: '200px'}} />
                      ) : (
                        <img src={item.url} alt={item.title} className="w-100" style={{objectFit: 'cover', height: '200px'}} />
                      )}
                      <div className="p-3 bg-white">
                        <p className="mb-1 fw-bold text-truncate">{item.title}</p>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <span className="badge bg-light text-dark border small">{item.type.toUpperCase()}</span>
                          <button onClick={() => deleteGalleryItem(item._id)} className="btn btn-sm btn-outline-danger">Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {galleryItems.length === 0 && <p className="text-muted w-100 mt-4 ms-3">No gallery items uploaded yet.</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
