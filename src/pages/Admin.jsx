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

  // Result Form States (Enhanced)
  const [resYear, setResYear] = useState(new Date().getFullYear().toString());
  const [resExamType, setResExamType] = useState("Midterm");
  const [resStudentId, setResStudentId] = useState("");
  const [resSubjects, setResSubjects] = useState([{ subject: "", mark: "" }]);

  // Poster States
  const [posters, setPosters] = useState([]);
  const [posterTitle, setPosterTitle] = useState("");
  const [posterFile, setPosterFile] = useState(null);
  const [uploadingPoster, setUploadingPoster] = useState(false);

  // Gallery Form
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryFile, setGalleryFile] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  
  // Security
  const [newPassword, setNewPassword] = useState("");
  const [passwordChangeMsg, setPasswordChangeMsg] = useState({ text: "", type: "" });

  // Deadline & Notification
  const [admissionDeadline, setAdmissionDeadline] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", message: "", type: "info" });

  const [viewingStudent, setViewingStudent] = useState(null);
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    if (viewingStudent) setAdminNote(viewingStudent.adminNote || "");
  }, [viewingStudent]);

  useEffect(() => {
    if (token) {
      fetchStudents();
      fetchSettings();
      fetchResults();
      fetchGallery();
      fetchNotifications();
      fetchPosters();
    }
  }, [token]);

  const fetchPosters = async () => {
    const res = await fetch("/api/posters");
    if(res.ok) setPosters(await res.json());
  };

  const addSubjectField = () => setResSubjects([...resSubjects, { subject: "", mark: "" }]);
  const updateSubject = (index, field, value) => {
    const newSubs = [...resSubjects];
    newSubs[index][field] = value;
    setResSubjects(newSubs);
  };

  const publishResult = async (e) => {
    e.preventDefault();
    if(!resStudentId) return alert("Select a student");
    const res = await fetch("/api/results", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ 
        student: resStudentId, 
        year: resYear, 
        examType: resExamType, 
        subjects: resSubjects 
      })
    });
    if(res.ok) {
      alert("Result Published with Auto-Total!");
      setResSubjects([{ subject: "", mark: "" }]);
      fetchResults();
    }
  };

  const uploadPoster = async (e) => {
    e.preventDefault();
    if(!posterFile) return;
    setUploadingPoster(true);
    const formData = new FormData();
    formData.append("file", posterFile);
    try {
      const up = await fetch("/api/upload", { method: "POST", body: formData });
      const upData = await up.json();
      await fetch("/api/posters", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ url: upData.url, title: posterTitle })
      });
      alert("Poster Added!");
      setPosterTitle(""); setPosterFile(null); fetchPosters();
    } catch(err) { alert("Upload failed"); }
    finally { setUploadingPoster(false); }
  };

  const deletePoster = async (id) => {
    if(window.confirm("Delete poster?")) {
      await fetch(`/api/posters/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      fetchPosters();
    }
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

  const fetchNotifications = async () => {
    const res = await fetch("/api/notifications");
    if(res.ok) setNotifications(await res.json());
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

  const saveAdminNote = async () => {
    try {
      const res = await fetch(`/api/students/${viewingStudent._id}/note`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ adminNote })
      });
      if (res.ok) {
        alert("Note updated successfully");
        fetchStudents();
        setViewingStudent({ ...viewingStudent, adminNote });
      } else alert("Failed to update note");
    } catch (err) { alert("Error updating note"); }
  };

  const approveStudent = async (id) => {
    if(!window.confirm("Move this candidate to official students list?")) return;
    const res = await fetch(`/api/students/${id}/approve`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    });
    if(res.ok) {
      alert("Approved!");
      setViewingStudent(null);
      fetchStudents();
    }
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

  const uploadMedia = async (e) => {
    e.preventDefault();
    if (!galleryFile) return;
    setUploadingMedia(true);
    const formData = new FormData();
    formData.append("file", galleryFile);
    try {
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");
      await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          url: uploadData.url, 
          title: galleryTitle,
          type: galleryFile.type.includes("video") ? "video" : "image"
        })
      });
      alert("Media uploaded!");
      setGalleryTitle(""); setGalleryFile(null); fetchGallery();
    } catch(err) { alert(err.message); }
    finally { setUploadingMedia(false); }
  };

  const deleteGalleryItem = async (id) => {
    if(!window.confirm("Delete gallery item?")) return;
    await fetch(`/api/gallery/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchGallery();
  };

  const changeAdminPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) return alert("Min 6 chars");
    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ newPassword })
    });
    if (res.ok) {
      alert("Updated!");
      setNewPassword("");
    }
  };

  if (!token) {
    return (
      <section className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="p-5 text-center bg-dark-teal text-white rounded-top-4">
                <h3 className="fw-bold">ADMIN ACCESS</h3>
                <p className="small mb-0 opacity-75">Bayanul Uloom Management</p>
              </div>
              <div className="p-4 bg-white rounded-bottom-4">
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="small fw-bold text-muted">USERNAME</label>
                    <input type="text" className="form-control p-3 bg-light border-0" value={username} onChange={e=>setUsername(e.target.value)} required />
                  </div>
                  <div className="mb-4">
                    <label className="small fw-bold text-muted">PASSWORD</label>
                    <input type="password" className="form-control p-3 bg-light border-0" value={password} onChange={e=>setPassword(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn btn-teal-primary w-100 py-3 fw-bold rounded-pill">SIGN IN</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="container-fluid min-vh-100 bg-light p-0">
      <div className="row g-0">
        <div className="col-lg-2 bg-dark-teal text-white sticky-top h-lg-100 p-4">
          <div className="text-center mb-5">
            <img src="/logo.png" alt="Logo" width="60" className="rounded-circle mb-2 shadow" />
            <h6 className="fw-bold">ADMIN PORTAL</h6>
          </div>
          <div className="nav flex-column gap-3">
            {[
              { id: 'overview', icon: '📊', label: 'Dashboard' },
              { id: 'students', icon: '👥', label: 'Candidates' },
              { id: 'results', icon: '📝', label: 'Exam Results' },
              { id: 'posters', icon: '🏙️', label: 'Posters' },
              { id: 'gallery', icon: '📸', label: 'Gallery' },
              { id: 'notifications', icon: '📢', label: 'Notices' },
              { id: 'settings', icon: '⚙️', label: 'Admission' },
              { id: 'security', icon: '🔐', label: 'Security' }
            ].map(tab => (
              <button key={tab.id} className={`btn text-start text-white border-0 py-2 px-3 rounded-pill fw-bold ${activeTab === tab.id ? 'bg-teal-primary shadow' : ''}`} onClick={()=>setActiveTab(tab.id)}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
          <button className="btn btn-outline-light btn-sm w-100 mt-5 rounded-pill" onClick={logout}>Sign Out</button>
        </div>

        <div className="col-lg-10 p-5">
          {activeTab === 'overview' && (
            <div className="row g-4">
              <div className="col-md-3">
                <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100 text-center">
                  <h1 className="fw-bold text-teal">{students.length}</h1>
                  <p className="text-muted fw-bold small mb-0">TOTAL APPLICANTS</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100 text-center border-start border-warning border-5">
                  <h1 className="fw-bold text-warning">{students.filter(s=>!s.isStudent).length}</h1>
                  <p className="text-muted fw-bold small mb-0">NEW CANDIDATES</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100 text-center border-start border-success border-5">
                  <h1 className="fw-bold text-success">{students.filter(s=>s.isStudent).length}</h1>
                  <p className="text-muted fw-bold small mb-0">OFFICIAL STUDENTS</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100 text-center">
                  <h4 className={`fw-bold mt-3 ${admissionActive?"text-success":"text-danger"}`}>{admissionActive?"ADMISSION ON":"CLOSED"}</h4>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                 <h2 className="fw-bold">Management</h2>
                 <div className="btn-group">
                    <button className="btn btn-teal-primary btn-sm px-3" onClick={fetchStudents}>Refresh</button>
                 </div>
              </div>

              {viewingStudent ? (
                <div className="card border-0 shadow rounded-4 overflow-hidden mb-5">
                  <div className="bg-teal-primary p-4 text-white d-flex justify-content-between">
                    <h4 className="mb-0 fw-bold">PROFILING: {viewingStudent.studentName}</h4>
                    <button className="btn btn-sm btn-light rounded-circle" onClick={()=>setViewingStudent(null)}>╳</button>
                  </div>
                  <div className="card-body p-4 bg-white">
                     <div className="row">
                        <div className="col-md-3 text-center border-end">
                           <img src={viewingStudent.profilePhoto || "/logo.png"} className="rounded-4 w-100 mb-3" style={{objectFit:'cover', aspectRatio:'1'}} />
                           <h5 className="fw-bold">{viewingStudent.studentName}</h5>
                           <div className="d-grid gap-2 mt-3">
                             {!viewingStudent.isStudent && <button className="btn btn-success fw-bold" onClick={()=>approveStudent(viewingStudent._id)}>ACCEPT TO DARS</button>}
                             <button className="btn btn-outline-danger btn-sm" onClick={()=>deleteStudent(viewingStudent._id)}>DELETE RECORD</button>
                           </div>
                        </div>
                        <div className="col-md-9 px-4">
                           <h6 className="fw-bold text-teal text-uppercase border-bottom pb-2">Candidate Details</h6>
                           <div className="row g-3 mt-1 mb-4">
                              <div className="col-6"><strong>DOB:</strong> {viewingStudent.dob}</div>
                              <div className="col-6"><strong>Phone:</strong> {viewingStudent.phone}</div>
                              <div className="col-6"><strong>Father:</strong> {viewingStudent.fatherName}</div>
                              <div className="col-6"><strong>Mother:</strong> {viewingStudent.motherName}</div>
                              <div className="col-12"><strong>Address:</strong> {viewingStudent.address}</div>
                           </div>

                            <div className="mt-4 p-3 bg-warning bg-opacity-10 border border-warning rounded-4">
                               <label className="small fw-bold text-dark mb-2"><i className="bi bi-pencil-square me-2"></i>OFFICE NOTES / INSTRUCTIONS</label>
                               <textarea 
                                 className="form-control bg-white border-0 shadow-sm mb-2" 
                                 rows="2" 
                                 value={adminNote} 
                                 onChange={e=>setAdminNote(e.target.value)} 
                                 placeholder="Add registration notes (e.g. Above 12 year old, need bio update)" 
                               />
                               <button className="btn btn-warning btn-sm fw-bold px-3 rounded-pill" onClick={saveAdminNote}>SAVE NOTE</button>
                            </div>
                           <h6 className="fw-bold text-teal text-uppercase border-bottom pb-2">Verification Files</h6>
                           <div className="row g-2 mt-2">
                             {[
                               {l:'Aadhar Card', f:viewingStudent.aadharFile},
                               {l:'SSLC Copy', f:viewingStudent.sslcFile},
                               {l:'Birth Cert', f:viewingStudent.birthCertFile},
                               {l:'TC File', f:viewingStudent.tcFile},
                               {l:'Marklist', f:viewingStudent.marklistFile}
                             ].map((d,i)=> (
                               <div className="col-md-4" key={i}>
                                  <div className="p-2 border rounded text-center small bg-light h-100">
                                     <div className="fw-bold">{d.l}</div>
                                     {d.f ? (
                                       <a href={d.f} target="_blank" rel="noreferrer" className="btn btn-xs btn-link p-0 text-success fw-bold">👁 VIEW ONLINE</a>
                                     ) : <span className="text-danger">NOT UPLOADED</span>}
                                  </div>
                               </div>
                             ))}
                           </div>
                        </div>
                     </div>
                  </div>
                </div>
              ) : (
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                       <tr><th className="ps-4">Candidate</th><th>Phone</th><th>Level</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                       {students.map(s => (
                         <tr key={s._id}>
                            <td className="ps-4 py-3 fw-bold">{s.studentName} {s.isStudent && <span className="badge bg-success small ms-2">Student</span>}</td>
                            <td>{s.phone}</td>
                            <td><span className={`badge ${s.status==='approved'?'bg-success':'bg-warning text-dark'}`}>{s.status||'pending'}</span></td>
                            <td><button className="btn btn-sm btn-teal-primary px-3 rounded-pill" onClick={()=>setViewingStudent(s)}>View dossier</button></td>
                         </tr>
                       ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'results' && (
            <div className="row">
                <div className="col-md-5">
                  <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                     <h4 className="fw-bold text-teal mb-4"><i className="bi bi-patch-check-fill me-2"></i>Publish Marksheet</h4>
                     <form onSubmit={publishResult}>
                        <div className="row g-2 mb-3">
                           <div className="col-12 mb-2">
                               <label className="small fw-bold text-muted text-uppercase">Academic Year</label>
                               <input className="form-control bg-light border-0 py-2" value={resYear} onChange={e=>setResYear(e.target.value)} placeholder="2025-26" />
                           </div>
                           <div className="col-12">
                               <label className="small fw-bold text-muted text-uppercase">Student Candidate</label>
                               <select className="form-select bg-light border-0 py-2" value={resStudentId} onChange={e=>setResStudentId(e.target.value)} required>
                                  <option value="">-- Choose Student --</option>
                                  {students.map(s => <option key={s._id} value={s._id}>{s.studentName}</option>)}
                               </select>
                           </div>
                        </div>
                        <div className="mb-4">
                           <label className="small fw-bold text-muted text-uppercase">Examination Category</label>
                           <select className="form-select bg-light border-0 py-2" value={resExamType} onChange={e=>setResExamType(e.target.value)}>
                              <option value="Quarterly">Quarterly Exam</option>
                              <option value="Midterm">Mid-Term Exam</option>
                              <option value="Final">Final Examination</option>
                           </select>
                        </div>
                        <hr className="opacity-10"/>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                           <h6 className="fw-bold mb-0 text-secondary">SUBJECT-WISE MARKS</h6>
                           <button type="button" className="btn btn-sm btn-teal-primary px-3 rounded-pill" onClick={addSubjectField}>+ ADD MORE</button>
                        </div>
                        <div className="res-subject-container" style={{maxHeight: 250, overflowY: 'auto', overflowX:'hidden'}}>
                          {resSubjects.map((s,i) => (
                             <div className="row g-2 mb-2 align-items-center animate-fade-in" key={i}>
                                <div className="col-7"><input className="form-control form-control-sm bg-light border-0" placeholder="Subject Name" value={s.subject} onChange={e=>updateSubject(i,'subject',e.target.value)} required /></div>
                                <div className="col-3"><input type="number" className="form-control form-control-sm bg-light border-0" placeholder="Mark" value={s.mark} onChange={e=>updateSubject(i,'mark',e.target.value)} required /></div>
                                <div className="col-2 text-end">
                                   {resSubjects.length > 1 && <button type="button" className="btn btn-sm text-danger p-0" onClick={()=>setResSubjects(resSubjects.filter((_,idx)=>idx!==i))}><i className="bi bi-trash"></i></button>}
                                </div>
                             </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 p-3 bg-light rounded-4 border-start border-teal border-4">
                           <div className="d-flex justify-content-between">
                              <span className="fw-bold text-muted small">TOTAL SCORE:</span>
                              <span className="fw-bold text-teal">{resSubjects.reduce((acc,curr)=>acc+(Number(curr.mark)||0), 0)}</span>
                           </div>
                        </div>

                        <button className="btn btn-teal-primary w-100 py-3 mt-4 fw-bold rounded-pill shadow-sm">
                           GENERATE & PUBLISH CERTIFICATE
                        </button>
                     </form>
                  </div>
                </div>
                <div className="col-md-7">
                  <div className="card border-0 shadow-sm rounded-4 p-4">
                     <h5 className="fw-bold mb-4 text-secondary">PUBLISHED RESULTS LOG</h5>
                     <div className="table-responsive">
                        <table className="table table-hover align-middle">
                           <thead className="table-light"><tr className="small text-muted"><th>STUDENT</th><th>TYPE</th><th>YEAR</th><th>TOTAL</th><th>GRADE</th></tr></thead>
                           <tbody>
                              {results.map(r => (
                                <tr key={r._id}>
                                   <td className="fw-bold">{r.student?.studentName}</td>
                                   <td><span className="badge bg-light text-dark border">{r.examType}</span></td>
                                   <td>{r.year}</td>
                                   <td className="fw-bold text-teal">{r.totalMarks}</td>
                                   <td><span className={`badge ${r.grade.includes('A')?'bg-success':'bg-primary'}`}>{r.grade}</span></td>
                                </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
                </div>
            </div>
          )}

          {activeTab === 'posters' && (
            <div>
               <h2 className="fw-bold mb-4">Admission Posters</h2>
               <div className="card border-0 shadow-sm p-4 rounded-4 mb-5">
                  <form onSubmit={uploadPoster} className="row g-3">
                     <div className="col-md-5">
                        <label className="small fw-bold">Poster Title</label>
                        <input className="form-control bg-light" value={posterTitle} onChange={e=>setPosterTitle(e.target.value)} placeholder="e.g. Admission 2026 Poster" required />
                     </div>
                     <div className="col-md-5">
                        <label className="small fw-bold">Choose File</label>
                        <input type="file" className="form-control bg-light" onChange={e=>setPosterFile(e.target.files[0])} required />
                     </div>
                     <div className="col-md-2 d-flex align-items-end">
                        <button className="btn btn-teal-primary w-100 fw-bold" disabled={uploadingPoster}>{uploadingPoster?"...":"ADD"}</button>
                     </div>
                  </form>
               </div>
               <div className="row g-4">
                  {posters.map(p => (
                    <div className="col-md-4" key={p._id}>
                       <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                          <img src={p.url} className="w-100" style={{height:'300px', objectFit:'contain', background:'#f0f0f0'}} />
                          <div className="p-3 d-flex justify-content-between align-items-center">
                             <span className="fw-bold small">{p.title}</span>
                             <button className="btn btn-sm btn-outline-danger" onClick={()=>deletePoster(p._id)}>Remove</button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div>
              <h2 className="mb-4 fw-bold">Media Repository</h2>
              <div className="card border-0 shadow-sm p-4 rounded-4 mb-4">
                <form onSubmit={uploadMedia} className="row g-3">
                  <div className="col-md-5"><input className="form-control bg-light" placeholder="Event Title" value={galleryTitle} onChange={e=>setGalleryTitle(e.target.value)} required /></div>
                  <div className="col-md-5"><input type="file" className="form-control bg-light" onChange={e=>setGalleryFile(e.target.files[0])} required /></div>
                  <div className="col-md-2"><button type="submit" className="btn btn-teal-primary w-100 fw-bold" disabled={uploadingMedia}>{uploadingMedia?"...":"UPLOAD"}</button></div>
                </form>
              </div>
              <div className="row g-3">
                 {galleryItems.map(item => (
                    <div className="col-md-3" key={item._id}>
                       <div className="card border-0 h-100 shadow-sm rounded-4 overflow-hidden">
                          {item.type==='video'? <video src={item.url} style={{height:150, objectFit:'cover'}} /> : <img src={item.url} style={{height:150, objectFit:'cover'}} />}
                          <div className="p-2 d-flex justify-content-between">
                             <span className="small text-truncate">{item.title}</span>
                             <button className="btn btn-xs btn-outline-danger border-0" onClick={()=>deleteGalleryItem(item._id)}>╳</button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 className="mb-4 fw-bold">Live Notices</h2>
              <div className="card border-0 shadow-sm p-4 rounded-4 mb-4">
                 <form onSubmit={addNotification} className="row g-2">
                    <div className="col-md-4"><input className="form-control bg-light" placeholder="Title" value={newNote.title} onChange={e=>setNewNote({...newNote, title:e.target.value})} required /></div>
                    <div className="col-md-5"><input className="form-control bg-light" placeholder="Message" value={newNote.message} onChange={e=>setNewNote({...newNote, message:e.target.value})} required /></div>
                    <div className="col-md-3">
                       <select className="form-select bg-light" value={newNote.type} onChange={e=>setNewNote({...newNote, type:e.target.value})}>
                          <option value="info">Info</option>
                          <option value="urgent">Urgent</option>
                          <option value="result">Result</option>
                       </select>
                    </div>
                    <div className="col-12 mt-3"><button className="btn btn-teal-primary px-5 fw-bold rounded-pill">POST ANNOUNCEMENT</button></div>
                 </form>
              </div>
              {notifications.map(n => (
                <div key={n._id} className="alert alert-light border-start border-teal border-5 shadow-sm d-flex justify-content-between align-items-center">
                   <div><strong className="text-teal">{n.title}</strong>: {n.message}</div>
                   <button className="btn btn-sm btn-link text-danger" onClick={()=>deleteNotification(n._id)}>Delete</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div style={{maxWidth:600}}>
              <h2 className="fw-bold mb-4">Admission Config</h2>
              <div className="card border-0 shadow-sm p-4 rounded-4">
                 <form onSubmit={updateSetting}>
                    <div className="form-check form-switch mb-4">
                       <input className="form-check-input" type="checkbox" checked={admissionActive} onChange={e=>setAdmissionActive(e.target.checked)} />
                       <label className="fw-bold ms-2">Admissions Open</label>
                    </div>
                    <div className="mb-3">
                       <label className="small fw-bold text-muted">NOTICE MESSAGE</label>
                       <textarea className="form-control bg-light" value={admissionMsg} onChange={e=>setAdmissionMsg(e.target.value)} rows="3" />
                    </div>
                    <div className="mb-4">
                       <label className="small fw-bold text-muted">CLOSING DEADLINE</label>
                       <input type="datetime-local" className="form-control bg-light" value={admissionDeadline} onChange={e=>setAdmissionDeadline(e.target.value)} />
                    </div>
                    <button className="btn btn-teal-primary w-100 py-3 rounded-pill fw-bold shadow">SAVE SETTINGS</button>
                 </form>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{maxWidth:400}}>
              <h2 className="fw-bold mb-4">Security</h2>
              <div className="card border-0 shadow-sm p-4 rounded-4">
                 <form onSubmit={changeAdminPassword}>
                    <div className="mb-4">
                       <label className="small fw-bold text-muted">NEW PASSWORD</label>
                       <input type="password" name="password" className="form-control bg-light" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required />
                    </div>
                    <button className="btn btn-teal-primary w-100 py-3 rounded-pill fw-bold">UPDATE PASS</button>
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
