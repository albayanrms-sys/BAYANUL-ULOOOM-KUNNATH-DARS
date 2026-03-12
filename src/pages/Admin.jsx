import { useState, useEffect } from "react";
import "./Admin.css";

function Admin() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
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
  
  // Security states
  const [newPassword, setNewPassword] = useState("");
  const [passwordChangeMsg, setPasswordChangeMsg] = useState({ text: "", type: "" });

  // Deadline & Notification states
  const [admissionDeadline, setAdmissionDeadline] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", message: "", type: "info" });

  const [viewingStudent, setViewingStudent] = useState(null);

  useEffect(() => {
    if (token) {
      fetchStudents();
      fetchSettings();
      fetchResults();
      fetchGallery();
      fetchNotifications();
    }
  }, [token]);

  const fetchNotifications = async () => {
    const res = await fetch("/api/notifications");
    if(res.ok) setNotifications(await res.json());
  };

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
      setAdmissionDeadline(data.deadline || "");
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
      body: JSON.stringify({ active: admissionActive, message: admissionMsg, deadline: admissionDeadline })
    });
    if(res.ok) alert("Settings Updated!");
  };

  const approveStudent = async (id, status) => {
    const res = await fetch(`/api/students/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
    if(res.ok) fetchStudents();
  };

  const addNotification = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(newNote)
    });
    if(res.ok) {
      setNewNote({ title: "", message: "", type: "info" });
      fetchNotifications();
      alert("Notification Added!");
    }
  };

  const deleteNotification = async (id) => {
    await fetch(`/api/notifications/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchNotifications();
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

  const changeAdminPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordChangeMsg({ text: "Password must be at least 6 characters!", type: "error" });
      return;
    }
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordChangeMsg({ text: "Password updated successfully!", type: "success" });
        setNewPassword("");
      } else {
        setPasswordChangeMsg({ text: data.error || "Update failed", type: "error" });
      }
    } catch (err) {
      setPasswordChangeMsg({ text: "Network error", type: "error" });
    }
  };

  if (!token) {
    return (
      <section className="admin-login container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="card glass-card p-4 mx-auto text-center shadow-lg border-0" style={{ maxWidth: '400px', width: '100%' }}>
          <h2 className="mb-4 text-teal fw-bold">ADMIN LOGIN</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3 text-start">
              <label className="form-label text-muted small px-1 fw-bold">Username</label>
              <input type="text" className="form-control p-3 bg-light" value={username} onChange={e=>setUsername(e.target.value)} required />
            </div>
            <div className="mb-4 text-start">
              <label className="form-label text-muted small px-1 fw-bold">Password</label>
              <input type="password" className="form-control p-3 bg-light" value={password} onChange={e=>setPassword(e.target.value)} required />
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
            <button className={`nav-link text-start rounded text-white ${activeTab === 'students' ? 'active bg-teal-primary fw-bold shadow-sm' : ''}`} onClick={() => setActiveTab('students')}>📋 Candidate Records</button>
            <button className={`nav-link text-start rounded text-white ${activeTab === 'results' ? 'active bg-teal-primary fw-bold shadow-sm' : ''}`} onClick={() => setActiveTab('results')}>📝 Exam & Results</button>
            <button className={`nav-link text-start rounded text-white ${activeTab === 'gallery' ? 'active bg-teal-primary fw-bold shadow-sm' : ''}`} onClick={() => setActiveTab('gallery')}>📸 Gallery Management</button>
            <button className={`nav-link text-start rounded text-white ${activeTab === 'notifications' ? 'active bg-teal-primary fw-bold shadow-sm' : ''}`} onClick={() => setActiveTab('notifications')}>📢 Notifications</button>
            <button className={`nav-link text-start rounded text-white ${activeTab === 'settings' ? 'active bg-teal-primary fw-bold shadow-sm' : ''}`} onClick={() => setActiveTab('settings')}>⚙️ Admission Setup</button>
            <button className={`nav-link text-start rounded text-white ${activeTab === 'security' ? 'active bg-teal-primary fw-bold shadow-sm' : ''}`} onClick={() => setActiveTab('security')}>🔐 Change Password</button>
          </div>
          <button className="btn btn-outline-light w-100 rounded-pill mt-5 fw-bold" onClick={logout}>Sign Out</button>
        </div>
        
        <div className="col-md-9 p-5 bg-white overflow-auto pb-5">
          {activeTab === 'overview' && (
            <div>
              <h2 className="mb-4 fw-bold">Dashboard Overview</h2>
              <div className="row g-4">
                <div className="col-md-3">
                  <div className="card p-4 bg-light-teal border-0 shadow-sm rounded-4 text-center h-100">
                    <h3 className="display-4 fw-bold text-teal">{students.length}</h3>
                    <p className="text-muted mb-0 fw-medium">Total Students</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card p-4 bg-warning-light border-0 shadow-sm rounded-4 text-center h-100">
                    <h3 className="display-4 fw-bold text-warning">{students.filter(s => s.status === 'pending' || !s.status).length}</h3>
                    <p className="text-muted mb-0 fw-medium">Pending Apps</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card p-4 bg-light border-0 shadow-sm rounded-4 text-center h-100">
                    <h3 className="display-4 fw-bold text-teal">{results.length}</h3>
                    <p className="text-muted mb-0 fw-medium">Results</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card p-4 bg-light border-0 shadow-sm rounded-4 text-center h-100">
                    <h3 className={`display-5 my-2 fw-bold ${admissionActive ? "text-success" : "text-danger"}`}>
                      {admissionActive ? "OPEN" : "CLOSED"}
                    </h3>
                    <p className="text-muted mb-0 fw-medium">Status</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">Student Directory</h2>
                <button className="btn btn-sm btn-outline-teal fw-bold" onClick={fetchStudents}>🔄 Refresh List</button>
              </div>

              {viewingStudent ? (
                <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
                  <div className="bg-teal-primary text-white p-4 d-flex justify-content-between align-items-center">
                    <h4 className="mb-0 fw-bold">Candidate Profile: {viewingStudent.studentName}</h4>
                    <button className="btn btn-sm btn-light fw-bold" onClick={() => setViewingStudent(null)}>Close Profile</button>
                  </div>
                  <div className="card-body p-4 bg-white">
                    <div className="row g-4">
                      <div className="col-md-3 text-center border-end">
                        <img 
                          src={viewingStudent.profilePhoto || "/logo.png"} 
                          alt="Profile" 
                          className="rounded-4 shadow-sm mb-3 w-100" 
                          style={{aspectRatio: '1/1', objectFit: 'cover', maxWidth: '200px'}} 
                        />
                        <h5 className="fw-bold mb-1">{viewingStudent.studentName}</h5>
                        <p className="badge bg-light text-teal border mb-2">{viewingStudent.status?.toUpperCase()}</p>
                        <div className="d-grid gap-2 mt-3">
                          <button className="btn btn-sm btn-success" onClick={() => approveStudent(viewingStudent._id, 'approved')}>Approve Now</button>
                          <button className="btn btn-sm btn-danger" onClick={() => approveStudent(viewingStudent._id, 'rejected')}>Reject Candidate</button>
                        </div>
                      </div>
                      <div className="col-md-9">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <h6 className="text-muted small fw-bold text-uppercase border-bottom pb-1">Personal Details</h6>
                            <p className="mb-1"><strong>Father:</strong> {viewingStudent.fatherName || "-"}</p>
                            <p className="mb-1"><strong>Mother:</strong> {viewingStudent.motherName || "-"}</p>
                            <p className="mb-1"><strong>DOB:</strong> {viewingStudent.dob || "-"}</p>
                            <p className="mb-1"><strong>Blood Group:</strong> {viewingStudent.bloodGroup || "-"}</p>
                            <p className="mb-1"><strong>Place:</strong> {viewingStudent.place || "-"}</p>
                          </div>
                          <div className="col-md-6">
                            <h6 className="text-muted small fw-bold text-uppercase border-bottom pb-1">Contact Details</h6>
                            <p className="mb-1"><strong>Phone:</strong> {viewingStudent.phone || "-"}</p>
                            <p className="mb-1"><strong>Guardian Phone:</strong> {viewingStudent.guardianPhone || "-"}</p>
                            <p className="mb-1"><strong>Email:</strong> {viewingStudent.email || "-"}</p>
                            <p className="mb-1"><strong>Address:</strong> {viewingStudent.address || "-"}</p>
                          </div>
                          <div className="col-12 mt-4">
                            <h6 className="text-muted small fw-bold text-uppercase border-bottom pb-1">Uploaded Documents</h6>
                            <div className="d-flex flex-wrap gap-3 mt-2">
                              {[
                                { label: "Aadhar Card", file: viewingStudent.aadharFile },
                                { label: "SSLC Book", file: viewingStudent.sslcFile },
                                { label: "Birth Cert", file: viewingStudent.birthCertFile },
                                { label: "TC File", file: viewingStudent.tcFile },
                                { label: "Marklist", file: viewingStudent.marklistFile }
                              ].map((doc, idx) => doc.file ? (
                                <a key={idx} href={doc.file} target="_blank" rel="noreferrer" className="btn btn-outline-teal btn-sm shadow-sm d-flex align-items-center gap-2">
                                  📂 {doc.label}
                                </a>
                              ) : (
                                <span key={idx} className="btn btn-sm btn-light disabled text-muted border">❌ {doc.label} (Pending)</span>
                              ))}
                            </div>
                          </div>
                          <div className="col-12 mt-4">
                            <h6 className="text-muted small fw-bold text-uppercase border-bottom pb-1">Student Bio / About</h6>
                            <div className="p-3 bg-light rounded-3 mt-2">
                               {viewingStudent.bio || "No bio provided by student."}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="table-responsive bg-white shadow-sm rounded-4 p-3 border">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="text-muted">NAME</th>
                        <th className="text-muted">PHONE/USER</th>
                        <th className="text-muted">STATUS</th>
                        <th className="text-muted">DOCS</th>
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
                            <span className={`badge ${s.status === 'approved' ? 'bg-success' : s.status === 'rejected' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                              {s.status?.toUpperCase() || 'PENDING'}
                            </span>
                          </td>
                          <td>
                             <span className="small text-muted">
                               {(s.aadharFile ? 1 : 0) + (s.sslcFile ? 1 : 0) + (s.birthCertFile ? 1 : 0)} / 5
                             </span>
                          </td>
                          <td className="text-end">
                            <div className="btn-group gap-1">
                              <button className="btn btn-sm btn-teal-primary px-3 py-1" onClick={() => setViewingStudent(s)}>View Detail</button>
                               {s.status === 'pending' && (
                                <>
                                  <button className="btn btn-sm btn-success px-2 py-1" onClick={() => approveStudent(s._id, 'approved')}>Approve</button>
                                  <button className="btn btn-sm btn-danger px-2 py-1" onClick={() => approveStudent(s._id, 'rejected')}>Reject</button>
                                </>
                              )}
                              <button className="btn btn-sm btn-outline-danger px-1 py-1" onClick={() => deleteStudent(s._id)}>🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {students.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-5">No students found</td></tr>}
                    </tbody>
                  </table>
                </div>
              )}
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
                    <label className="form-label text-muted small fw-bold">Admission Note (Criteria/Guidelines)</label>
                    <textarea className="form-control p-3 bg-light" rows="2" value={admissionMsg} onChange={(e) => setAdmissionMsg(e.target.value)} placeholder="e.g. Applicants must be above 12 years old. Original documents required at time of interview." />
                    <div className="form-text mt-2 text-info small">This note will appear at the top of the Registration Form for all applicants.</div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label text-muted small fw-bold">Admission Deadline (Auto-Close)</label>
                    <input type="datetime-local" className="form-control p-3 bg-light" value={admissionDeadline} onChange={(e) => setAdmissionDeadline(e.target.value)} />
                    <div className="form-text mt-2 small">Admissions will automatically disable after this time.</div>
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

          {activeTab === 'notifications' && (
            <div>
              <h2 className="mb-4 fw-bold">Manage Notifications</h2>
              <div className="card shadow-sm border rounded-4 p-4 mb-5 bg-white">
                <h5 className="mb-3 text-teal fw-bold">Create New Announcement</h5>
                <form onSubmit={addNotification} className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Title</label>
                    <input type="text" className="form-control bg-light" value={newNote.title} onChange={e=>setNewNote({...newNote, title: e.target.value})} required placeholder="e.g. Results Out!" />
                  </div>
                  <div className="col-md-5">
                    <label className="form-label small fw-bold">Message</label>
                    <input type="text" className="form-control bg-light" value={newNote.message} onChange={e=>setNewNote({...newNote, message: e.target.value})} required placeholder="Full announcement detail..." />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-bold">Alert Type</label>
                    <select className="form-select bg-light" value={newNote.type} onChange={e=>setNewNote({...newNote, type: e.target.value})}>
                      <option value="info">Info (Blue)</option>
                      <option value="warning">Warning (Yellow)</option>
                      <option value="urgent">Urgent (Red)</option>
                      <option value="result">Result (Green)</option>
                    </select>
                  </div>
                  <div className="col-12 text-end">
                    <button type="submit" className="btn btn-teal-primary px-4 fw-bold">Post Announcement</button>
                  </div>
                </form>
              </div>

              <h4 className="mb-3 fw-bold">Active Announcements</h4>
              <div className="list-group shadow-sm border-0">
                {notifications.map(n => (
                  <div key={n._id} className="list-group-item list-group-item-action border-0 shadow-sm mb-2 rounded-3 d-flex justify-content-between align-items-center">
                    <div>
                      <span className={`badge me-2 ${n.type === 'urgent' ? 'bg-danger' : n.type === 'warning' ? 'bg-warning text-dark' : n.type === 'result' ? 'bg-success' : 'bg-info'}`}>
                        {n.type.toUpperCase()}
                      </span>
                      <strong className="text-teal">{n.title}</strong>: <span className="ms-1">{n.message}</span>
                      <div className="small text-muted mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                    <button onClick={() => deleteNotification(n._id)} className="btn btn-sm btn-link text-danger text-decoration-none">Remove</button>
                  </div>
                ))}
                {notifications.length === 0 && <p className="text-muted p-4 text-center">No active notifications.</p>}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{maxWidth: "500px"}}>
              <h2 className="mb-4 fw-bold">Security Settings</h2>
              <div className="card shadow-sm border rounded-4 p-4 bg-white">
                <h5 className="mb-3 text-teal fw-bold">Change Admin Password</h5>
                {passwordChangeMsg.text && (
                  <div className={`alert ${passwordChangeMsg.type === 'success' ? 'alert-success' : 'alert-danger'} small py-2`}>
                    {passwordChangeMsg.text}
                  </div>
                )}
                <form onSubmit={changeAdminPassword}>
                  <div className="mb-4">
                    <label className="form-label text-muted small fw-bold">New Secure Password</label>
                    <input 
                      type="password" 
                      className="form-control p-3 bg-light" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      placeholder="Enter new password"
                      required
                      minLength="6"
                    />
                    <div className="form-text mt-2 small">Min 6 characters. Use a strong password for security.</div>
                  </div>
                  <button type="submit" className="btn btn-teal-primary w-100 py-3 rounded shadow-sm fw-bold">Update Password</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
