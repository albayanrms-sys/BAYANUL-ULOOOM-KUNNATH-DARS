import { useState, useEffect } from "react";
import "./Admin.css";

function Admin() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem('adminToken'));
    }
  }, []);
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
    formData.append("title", posterTitle);
    try {
      const res = await fetch("/api/posters", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        alert("Poster Added!");
        setPosterTitle(""); setPosterFile(null); fetchPosters();
      } else alert("Upload failed");
    } catch(err) { alert("Upload error"); }
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
        alert(data.error || "Login Failed. Try 'ramees baqavi' with correct password.");
      }
    } catch(err) {
      alert("Network Error. Check server connection.");
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
    const res = await fetch(`/api/students/${id}/approve`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    });
    if(res.ok) {
      alert("Approved!");
      fetchStudents();
      setViewingStudent(null);
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
    if(!window.confirm("Delete student?")) return;
    await fetch(`/api/students/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchStudents();
  };

  const uploadMedia = async (e) => {
    e.preventDefault();
    if (!galleryFile) return;
    setUploadingMedia(true);
    const formData = new FormData();
    formData.append("file", galleryFile);
    formData.append("title", galleryTitle);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        alert("Media Added!");
        setGalleryTitle(""); setGalleryFile(null); fetchGallery();
      } else alert("Upload failed");
    } catch(err) { alert("Upload error"); }
    finally { setUploadingMedia(false); }
  };

  const deleteGalleryItem = async (id) => {
    await fetch(`/api/gallery/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchGallery();
  };

  const changePassword = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ newPassword })
    });
    const data = await res.json();
    if(res.ok) {
       setPasswordChangeMsg({ text: "Password updated!", type: "success" });
       setNewPassword("");
    } else {
       setPasswordChangeMsg({ text: data.error || "Failed", type: "danger" });
    }
  };

  if (!token) {
    return (
      <div className="login-container min-vh-100 d-flex align-items-center justify-content-center py-5 bg-dark">
        <div className="col-md-4">
          <div className="modern-card animate-up shadow-2xl p-5">
            <div className="text-center mb-5">
              <div className="bg-primary p-3 rounded-circle d-inline-block mb-3 text-white">
                 <i className="bi bi-shield-lock-fill fs-1"></i>
              </div>
              <h2 className="fw-bold">Admin Authority</h2>
              <p className="text-muted">Secure Access Only</p>
            </div>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="small fw-bold text-muted mb-1">IDENTIFIER</label>
                <input type="text" className="form-control" placeholder="Admin username" value={username} onChange={e=>setUsername(e.target.value)} required />
              </div>
              <div className="mb-4">
                <label className="small fw-bold text-muted mb-1">SECURITY KEY</label>
                <input type="password" className="form-control" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-premium w-100 py-3 fs-5">AUTHENTICATE</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard container-fluid py-4 min-vh-100 bg-light">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2">
           <div className="modern-card p-3 sticky-top" style={{top:'20px'}}>
              <h5 className="fw-bold mb-4 px-3 text-primary">ADMIN PANEL</h5>
              <div className="d-grid gap-2">
                 {[
                   {id:'overview', l:'Overview', i:'bi-speedometer2'},
                   {id:'admissions', l:'Admissions', i:'bi-person-plus'},
                   {id:'results', l:'Academic Info', i:'bi-clipboard-check'},
                   {id:'posters', l:'Posters', i:'bi-image'},
                   {id:'gallery', l:'Gallery', i:'bi-images'},
                   {id:'notices', l:'Notifications', i:'bi-megaphone'},
                   {id:'settings', l:'Management', i:'bi-gear'}
                 ].map(tab => (
                   <button key={tab.id} className={`btn text-start p-2 rounded-3 d-flex align-items-center gap-3 transition-all ${activeTab===tab.id?'btn-primary':'btn-light'}`} onClick={()=>setActiveTab(tab.id)}>
                      <i className={`bi ${tab.i}`}></i> {tab.l}
                   </button>
                 ))}
                 <hr/>
                 <button className="btn btn-outline-danger btn-sm rounded-pill" onClick={logout}>Sign Out</button>
              </div>
           </div>
        </div>

        {/* Content */}
        <div className="col-md-9 col-lg-10">
           <div className="modern-card min-vh-100 p-4">
              {activeTab === 'overview' && (
                <div className="row g-4">
                   <div className="col-12"><h2 className="fw-bold mb-4">System Overview</h2></div>
                   {[
                     { l: 'Total Candidates', v: students.length, c: 'primary' },
                     { l: 'Official Students', v: students.filter(s=>s.isStudent).length, c: 'success' },
                     { l: 'Pending Review', v: students.filter(s=>s.status==='pending').length, c: 'warning' },
                     { l: 'Results Published', v: results.length, c: 'info' }
                   ].map((stat, idx) => (
                     <div className="col-md-3" key={idx}>
                        <div className={`p-4 rounded-4 bg-${stat.c} bg-opacity-10 border border-${stat.c} border-opacity-25`}>
                           <div className={`text-${stat.c} small fw-bold text-uppercase`}>{stat.l}</div>
                           <div className="display-5 fw-bold">{stat.v}</div>
                        </div>
                     </div>
                   ))}
                </div>
              )}

              {activeTab === 'admissions' && (
                <div>
                   <h2 className="fw-bold mb-4">Candidate Management</h2>
                   {viewingStudent ? (
                     <div className="modern-card shadow-lg p-5 animate-up">
                        <button className="btn btn-link text-decoration-none p-0 mb-4" onClick={()=>setViewingStudent(null)}>← Back to list</button>
                        <div className="row g-4">
                           <div className="col-md-4 text-center border-end">
                              <img src={viewingStudent.profilePhoto || "/default-avatar.png"} className="rounded-circle mb-3 shadow-sm border border-4 border-white" width="150" height="150" alt="Avatar" />
                              <h3 className="fw-bold">{viewingStudent.studentName}</h3>
                              <p className="text-muted">{viewingStudent.phone}</p>
                              <div className="d-grid gap-2">
                                 {viewingStudent.isStudent ? (
                                   <span className="badge bg-success p-2">Official Student</span>
                                 ) : (
                                   <button className="btn btn-primary rounded-pill fw-bold" onClick={()=>approveStudent(viewingStudent._id)}>Approve for Admission</button>
                                 )}
                                 <button className="btn btn-outline-danger btn-sm rounded-pill" onClick={()=>deleteStudent(viewingStudent._id)}>Delete Record</button>
                              </div>
                           </div>
                           <div className="col-md-8">
                              <div className="row g-3">
                                 <div className="col-md-6"><label className="small text-muted fw-bold">FATHER NAME</label><div className="fw-bold">{viewingStudent.fatherName}</div></div>
                                 <div className="col-md-6"><label className="small text-muted fw-bold">MOTHER NAME</label><div className="fw-bold">{viewingStudent.motherName}</div></div>
                                 <div className="col-md-6"><label className="small text-muted fw-bold">DATE OF BIRTH</label><div className="fw-bold">{viewingStudent.dob}</div></div>
                                 <div className="col-md-6"><label className="small text-muted fw-bold">ADDRESS</label><div className="fw-bold">{viewingStudent.address}</div></div>
                              </div>
                              <hr className="my-4"/>
                              <div className="bg-warning bg-opacity-10 p-4 rounded-4 border border-warning mb-4">
                                 <h6 className="fw-bold"><i className="bi bi-pencil-square me-2"></i>Registration Instructions</h6>
                                 <textarea className="form-control mb-3" rows="3" value={adminNote} onChange={e=>setAdminNote(e.target.value)} placeholder="Type notes for the student to see..."></textarea>
                                 <button className="btn btn-warning fw-bold px-4 rounded-pill" onClick={saveAdminNote}>Update Information</button>
                              </div>

                              <div className="bg-light p-4 rounded-4 border">
                                 <h6 className="fw-bold mb-3">Verification Documents</h6>
                                 <div className="row g-2">
                                    {[
                                      { label: "AADHAR", url: viewingStudent.aadharFile },
                                      { label: "SSLC", url: viewingStudent.sslcFile },
                                      { label: "BIRTH CERT", url: viewingStudent.birthCertFile },
                                      { label: "T.C", url: viewingStudent.tcFile },
                                      { label: "MARKLIST", url: viewingStudent.marklistFile },
                                      { label: "PHOTO", url: viewingStudent.profilePhoto }
                                    ].map((doc, i) => doc.url && (
                                      <div key={i} className="col-md-4">
                                         <div className="p-2 bg-white rounded border d-flex justify-content-between align-items-center">
                                            <span className="small fw-bold">{doc.label}</span>
                                            <a href={doc.url} target="_blank" rel="noreferrer" className="btn btn-xs btn-primary p-1 px-2"><i className="bi bi-eye"></i></a>
                                         </div>
                                      </div>
                                    ))}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                   ) : (
                     <div className="table-responsive">
                        <table className="table align-middle table-hover">
                           <thead className="table-light">
                              <tr><th>Name</th><th>Phone</th><th>Status</th><th>Action</th></tr>
                           </thead>
                           <tbody>
                              {students.map(s => (
                                <tr key={s._id}>
                                   <td className="fw-bold">{s.studentName}</td>
                                   <td>{s.phone}</td>
                                   <td><span className={`badge-role badge ${s.status==='approved'?'bg-success text-white':'bg-warning text-dark'}`}>{s.status}</span></td>
                                   <td><button className="btn btn-sm btn-primary px-3 rounded-pill" onClick={()=>setViewingStudent(s)}>Examine</button></td>
                                </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                   )}
                </div>
              )}

              {activeTab === 'results' && (
                <div className="row g-4">
                   <div className="col-md-4">
                      <div className="modern-card shadow-sm p-4 border h-100">
                         <h4 className="fw-bold mb-4">Publish Marklist</h4>
                         <form onSubmit={publishResult}>
                            <div className="mb-3">
                               <label className="small fw-bold">Academic Year</label>
                               <input className="form-control" value={resYear} onChange={e=>setResYear(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                               <label className="small fw-bold">Student Selection</label>
                               <select className="form-select" value={resStudentId} onChange={e=>setResStudentId(e.target.value)} required>
                                  <option value="">-- Select Student --</option>
                                  {students.filter(s=>s.isStudent).map(s=>(
                                    <option key={s._id} value={s._id}>{s.studentName}</option>
                                  ))}
                               </select>
                            </div>
                            <div className="mb-3">
                               <label className="small fw-bold">Exam Category</label>
                               <select className="form-select" value={resExamType} onChange={e=>setResExamType(e.target.value)}>
                                  <option value="Midterm">Midterm</option>
                                  <option value="Final">Final</option>
                                  <option value="Quarterly">Quarterly</option>
                               </select>
                            </div>
                            <div className="mb-3">
                               <div className="d-flex justify-content-between mb-2">
                                  <label className="small fw-bold">Subject Marks</label>
                                  <button type="button" className="btn btn-xs btn-outline-primary" onClick={addSubjectField}>+ Subject</button>
                               </div>
                               {resSubjects.map((sub, idx) => (
                                 <div key={idx} className="d-flex gap-2 mb-2">
                                    <input className="form-control" placeholder="Subject" value={sub.subject} onChange={e=>updateSubject(idx, 'subject', e.target.value)} required />
                                    <input className="form-control" style={{width:80}} placeholder="Mark" type="number" value={sub.mark} onChange={e=>updateSubject(idx, 'mark', e.target.value)} required />
                                 </div>
                               ))}
                            </div>
                            <button className="btn btn-premium w-100 mt-3">PUBLISH NOW</button>
                         </form>
                      </div>
                   </div>
                   <div className="col-md-8">
                      <h4 className="fw-bold mb-4">Published Registry</h4>
                      <div className="table-responsive">
                         <table className="table table-hover">
                            <thead className="table-light">
                               <tr><th>Student</th><th>Exam</th><th>Total</th><th>Grade</th></tr>
                            </thead>
                            <tbody>
                               {results.map(r => (
                                 <tr key={r._id}>
                                    <td className="fw-bold">{r.student?.studentName || "Unknown"}</td>
                                    <td>{r.examType} ({r.year})</td>
                                    <td className="fw-bold text-primary">{r.totalMarks}</td>
                                    <td><span className="badge bg-dark px-3">{r.grade}</span></td>
                                 </tr>
                               ))}
                            </tbody>
                         </table>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'posters' && (
                <div>
                   <h2 className="fw-bold mb-4 text-primary">Admission Posters</h2>
                   <div className="card border-0 shadow-sm p-4 rounded-4 mb-4 bg-white border">
                      <form onSubmit={uploadPoster} className="row g-3">
                        <div className="col-md-5">
                           <label className="small fw-bold mb-1">POSTER TITLE</label>
                           <input className="form-control" value={posterTitle} onChange={e=>setPosterTitle(e.target.value)} required />
                        </div>
                        <div className="col-md-5">
                           <label className="small fw-bold mb-1">CHOOSE FILE</label>
                           <input type="file" className="form-control" onChange={e=>setPosterFile(e.target.files[0])} required />
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                           <button className="btn btn-premium w-100" disabled={uploadingPoster}>{uploadingPoster?"...":"ADD"}</button>
                        </div>
                      </form>
                   </div>
                   <div className="row g-4">
                      {posters.map(p => (
                        <div className="col-md-4" key={p._id}>
                           <div className="modern-card p-2 animate-up">
                              <img src={p.url} className="w-100 rounded-3" style={{height:'350px', objectFit:'contain', background:'#fafafa'}} />
                              <div className="p-3 d-flex justify-content-between align-items-center">
                                 <span className="fw-bold">{p.title}</span>
                                 <button className="btn btn-sm btn-outline-danger px-3 rounded-pill" onClick={()=>deletePoster(p._id)}>Delete</button>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {activeTab === 'gallery' && (
                <div>
                  <h2 className="fw-bold mb-4">Gallery Management</h2>
                  <div className="modern-card p-4 mb-4 border shadow-sm">
                    <form onSubmit={uploadMedia} className="row g-3">
                      <div className="col-md-5"><label className="small fw-bold mb-1">CAPTION</label><input className="form-control" value={galleryTitle} onChange={e=>setGalleryTitle(e.target.value)} required /></div>
                      <div className="col-md-5"><label className="small fw-bold mb-1">IMAGE/VIDEO FILE</label><input type="file" className="form-control" onChange={e=>setGalleryFile(e.target.files[0])} required /></div>
                      <div className="col-md-2 d-flex align-items-end"><button type="submit" className="btn btn-premium w-100" disabled={uploadingMedia}>{uploadingMedia?"...":"UPLOAD"}</button></div>
                    </form>
                  </div>
                  <div className="row g-4">
                     {galleryItems.map(item => (
                        <div className="col-md-3" key={item._id}>
                           <div className="modern-card p-1 shadow-sm h-100 transition-hover">
                              {item.type==='video'? <video src={item.url} style={{height:180, objectFit:'cover'}} className="w-100 rounded-3" /> : <img src={item.url} style={{height:180, objectFit:'cover'}} className="w-100 rounded-3" />}
                              <div className="p-2 d-flex justify-content-between align-items-center">
                                 <span className="small text-truncate fw-bold">{item.title}</span>
                                 <button className="btn btn-xs text-danger" onClick={()=>deleteGalleryItem(item._id)}><i className="bi bi-trash"></i></button>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
                </div>
              )}

              {activeTab === 'notices' && (
                <div className="row g-4">
                   <div className="col-md-5">
                      <div className="modern-card shadow-sm p-4 border">
                         <h4 className="fw-bold mb-4">Broadcast Notice</h4>
                         <div className="mb-3">
                            <label className="small fw-bold">Notice Title</label>
                            <input className="form-control" value={newNote.title} onChange={e=>setNewNote({...newNote, title:e.target.value})} required />
                         </div>
                         <div className="mb-3">
                            <label className="small fw-bold">Importance Level</label>
                            <select className="form-select" value={newNote.type} onChange={e=>setNewNote({...newNote, type:e.target.value})}>
                               <option value="info">Info</option>
                               <option value="warning">Warning</option>
                               <option value="urgent">Urgent</option>
                            </select>
                         </div>
                         <div className="mb-4">
                            <label className="small fw-bold">Message Content</label>
                            <textarea className="form-control" rows="4" value={newNote.message} onChange={e=>setNewNote({...newNote, message:e.target.value})} required></textarea>
                         </div>
                         <button className="btn btn-premium w-100" onClick={addNotification}>POST NOTICE</button>
                      </div>
                   </div>
                   <div className="col-md-7">
                      <h4 className="fw-bold mb-4">Live Bulletin</h4>
                      {notifications.map(n => (
                        <div key={n._id} className="modern-card p-3 mb-3 border shadow-none bg-light d-flex justify-content-between align-items-center">
                           <div>
                              <div className="fw-bold fs-5">{n.title}</div>
                              <p className="small text-muted mb-0">{n.message}</p>
                           </div>
                           <button className="btn btn-sm btn-outline-danger border-0" onClick={()=>deleteNotification(n._id)}><i className="bi bi-x-circle"></i></button>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="row g-4">
                   <div className="col-md-6">
                      <div className="modern-card p-4 border shadow-sm h-100">
                         <h4 className="fw-bold mb-4 text-primary">Admission Settings</h4>
                         <div className="form-check form-switch mb-4">
                            <input className="form-check-input" type="checkbox" checked={admissionActive} onChange={e=>setAdmissionActive(e.target.checked)} id="adActive" />
                            <label className="form-check-label fw-bold" htmlFor="adActive">Open for New Admissions</label>
                         </div>
                         <div className="mb-3">
                            <label className="small fw-bold">Admission Message</label>
                            <textarea className="form-control" rows="2" value={admissionMsg} onChange={e=>setAdmissionMsg(e.target.value)}></textarea>
                         </div>
                         <div className="mb-4">
                            <label className="small fw-bold">Auto-Close Deadline</label>
                            <input type="datetime-local" className="form-control" value={admissionDeadline} onChange={e=>setAdmissionDeadline(e.target.value)} />
                         </div>
                         <button className="btn btn-premium w-100 py-3" onClick={updateSetting}>SAVE PORTAL SETTINGS</button>
                      </div>
                   </div>
                   <div className="col-md-6">
                      <div className="modern-card p-4 border shadow-sm h-100">
                         <h4 className="fw-bold mb-4 text-danger">Administrative Security</h4>
                         <form onSubmit={changePassword}>
                            <div className="mb-4">
                               <label className="small fw-bold">New Security Key (Password)</label>
                               <input type="password" placeholder="Min. 6 characters" className="form-control shadow-none" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required />
                            </div>
                            <button className="btn btn-danger w-100 py-3 fw-bold">UPDATE ADMIN KEY</button>
                            {passwordChangeMsg.text && <div className={`mt-3 alert alert-${passwordChangeMsg.type} p-2 small`}>{passwordChangeMsg.text}</div>}
                         </form>
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
