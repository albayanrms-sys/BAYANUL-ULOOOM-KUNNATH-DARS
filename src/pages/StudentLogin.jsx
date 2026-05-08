import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./StudentLogin.css";

function StudentLogin() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem('studentToken'));
    }
  }, []);
  const [loginMode, setLoginMode] = useState("login"); // 'login' or 'activate'
  
  // Login States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // Activation States
  const [activationStep, setActivationStep] = useState(1);
  const [actName, setActName] = useState("");
  const [actPhone, setActPhone] = useState("");
  const [actUser, setActUser] = useState("");
  const [actPass, setActPass] = useState("");
  const [actPhoto, setActPhoto] = useState("");
  const [studentToActivate, setStudentToActivate] = useState(null);

  // Dashboard Data
  const [studentInfo, setStudentInfo] = useState(null);
  const [results, setResults] = useState([]);
  const [activeTab, setActiveTab] = useState("results");
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [tempBio, setTempBio] = useState("");

  useEffect(() => {
    if (token) {
      fetchMyResults();
      fetchNotifications();
    }
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if(res.ok) setNotifications(await res.json());
    } catch(err) { console.error("Notif fetch failed"); }
  };

  const fetchMyResults = async () => {
    const res = await fetch("/api/my-results", { headers: { Authorization: `Bearer ${token}` } });
    if(res.ok) {
      const data = await res.json();
      setResults(data.results);
      setStudentInfo(data.student);
      setTempBio(data.student?.bio || "");
    } else {
      localStorage.removeItem('studentToken');
      setToken(null);
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
      if (res.ok && data.role === 'student') {
        localStorage.setItem("studentToken", data.token);
        setToken(data.token);
      } else {
        alert(data.error || "Login Failed. Check username/password.");
      }
    } catch(err) {
      alert("Network Error. Please try again later.");
    }
  };

  const checkStudentActivation = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/check-activation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentName: actName, phone: actPhone })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.hasCustomCredentials) {
          alert("Your account is already active. Please use the login form.");
          setLoginMode("login");
        } else {
          setStudentToActivate(data.id);
          setActivationStep(2);
        }
      } else {
        alert(data.error || "Candidate not found. Match your name/phone exactly with admission.");
      }
    } catch(err) { alert("Check failed"); }
  };

  const finalizeActivation = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/activate-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
           studentId: studentToActivate, 
           username: actUser, 
           password: actPass,
           profilePhoto: actPhoto
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Account Activated Successfully!");
        localStorage.setItem("studentToken", data.token);
        setToken(data.token);
      } else {
        alert(data.error || "Activation failed");
      }
    } catch(err) { alert("Error during activation"); }
  };

  const handleActivationPhoto = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    setUploadingDoc(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if(res.ok) setActPhoto(data.url);
      else alert("Photo upload failed");
    } catch(err) { alert("Upload error"); }
    finally { setUploadingDoc(false); }
  };

  const logout = () => {
    localStorage.removeItem("studentToken");
    setToken(null);
  };

  const handleDocumentUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingDoc(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error);

      const updatePayload = {};
      if (type === 'aadhar') updatePayload.aadharFile = uploadData.url;
      if (type === 'sslc') updatePayload.sslcFile = uploadData.url;
      if (type === 'profile') updatePayload.profilePhoto = uploadData.url;
      if (type === 'birthCert') updatePayload.birthCertFile = uploadData.url;
      if (type === 'tc') updatePayload.tcFile = uploadData.url;
      if (type === 'marklist') updatePayload.marklistFile = uploadData.url;
      if (type === 'extra') {
        const currentCerts = studentInfo?.extraCertificates || [];
        updatePayload.extraCertificates = [...currentCerts, uploadData.url];
      }

      const updateRes = await fetch("/api/my-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(updatePayload)
      });
      
      if(updateRes.ok) {
        alert("Document uploaded successfully!");
        fetchMyResults();
      }
    } catch(err) {
      alert("Failed to upload. Use smaller files or check connection.");
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleProfileUpdate = async (payload) => {
    try {
      const res = await fetch("/api/my-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if(res.ok) {
        alert("Profile updated!");
        fetchMyResults();
      }
    } catch (err) { alert("Update failed"); }
  };

  const downloadMarksheet = (res) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("AL BAYAN KUNNATH DARS", 105, 20, { align: "center" });
    doc.setFontSize(14);
    doc.text(`${res.examType} Examination - ${res.year}`, 105, 30, { align: "center" });
    
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(12);
    doc.text(`Student Name: ${studentInfo.studentName}`, 20, 45);
    doc.text(`Phone: ${studentInfo.phone}`, 20, 52);

    const tableData = res.subjects.map(s => [s.subject, s.mark]);
    doc.autoTable({
      startY: 60,
      head: [["Subject", "Mark"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillStyle: "#006d77" }
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text(`Total Marks: ${res.totalMarks}`, 20, finalY);
    doc.text(`Grade: ${res.grade}`, 150, finalY);

    doc.save(`${studentInfo.studentName}_Result.pdf`);
  };

  if (!token) {
    return (
      <div className="login-container min-vh-100 d-flex align-items-center justify-content-center py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-5">
              <div className="modern-card animate-up">
                <div className="text-center mb-4">
                  <div className="bg-primary-light d-inline-flex p-3 rounded-circle mb-3">
                     <i className="bi bi-mortarboard fs-1 text-primary"></i>
                  </div>
                  <h2 className="fw-bold">Student Portal</h2>
                  <p className="text-muted small">Access your academic records and profile</p>
                </div>

                <div className="btn-group w-100 mb-4 rounded-pill overflow-hidden border">
                   <button className={`btn py-2 fw-bold ${loginMode==='login'?'btn-primary':'btn-light text-muted'}`} onClick={()=>setLoginMode("login")}>LOGIN</button>
                   <button className={`btn py-2 fw-bold ${loginMode==='activate'?'btn-primary':'btn-light text-muted'}`} onClick={()=>setLoginMode("activate")}>ACTIVATE</button>
                </div>

                {loginMode === 'login' ? (
                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label className="small fw-bold text-muted mb-1">USERNAME</label>
                      <input type="text" className="form-control" placeholder="Your username" value={username} onChange={e=>setUsername(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                      <label className="small fw-bold text-muted mb-1">PASSWORD</label>
                      <input type="password" className="form-control" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-premium w-100">SIGN IN</button>
                  </form>
                ) : (
                  <div>
                    {activationStep === 1 ? (
                      <form onSubmit={checkStudentActivation}>
                        <div className="text-center bg-info bg-opacity-10 p-3 rounded-4 mb-4">
                           <i className="bi bi-shield-exclamation text-info fs-4 d-block"></i>
                           <span className="small text-info fw-medium">First-time users must activate their account using admission details.</span>
                        </div>
                        <div className="mb-3">
                          <label className="small fw-bold text-muted mb-1">CANDIDATE NAME</label>
                          <input type="text" className="form-control shadow-none" placeholder="Exact name as in admission" value={actName} onChange={e=>setActName(e.target.value)} required />
                        </div>
                        <div className="mb-4">
                          <label className="small fw-bold text-muted mb-1">PHONE NUMBER</label>
                          <input type="text" className="form-control shadow-none" placeholder="Registered mobile number" value={actPhone} onChange={e=>setActPhone(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-premium w-100">VERIFY MY DETAILS</button>
                      </form>
                    ) : (
                      <form onSubmit={finalizeActivation}>
                        <div className="alert alert-success border-0 small py-2 mb-4">Candidate Verified! Now set your portal credentials.</div>
                        <div className="text-center mb-4">
                           <div className="position-relative d-inline-block">
                              <img src={actPhoto || "/default-avatar.png"} className="rounded-circle border border-4 border-white shadow-sm" width="100" height="100" alt="Profile" />
                              <label className="position-absolute bottom-0 end-0 bg-primary text-white p-2 rounded-circle shadow ripple-effect" style={{cursor:'pointer'}}>
                                 <i className="bi bi-camera-fill"></i>
                                 <input type="file" className="d-none" onChange={handleActivationPhoto} />
                              </label>
                           </div>
                           <div className="small text-muted mt-2">Upload Profile Photo</div>
                        </div>
                        <div className="mb-3">
                          <label className="small fw-bold text-muted mb-1">SET USERNAME</label>
                          <input type="text" className="form-control shadow-none" placeholder="Choose a unique username" value={actUser} onChange={e=>setActUser(e.target.value)} required />
                        </div>
                        <div className="mb-4">
                          <label className="small fw-bold text-muted mb-1">SET PASSWORD</label>
                          <input type="password" className="form-control shadow-none" placeholder="Choose a strong password" value={actPass} onChange={e=>setActPass(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-premium w-100">ACTIVATE NOW</button>
                        <button type="button" className="btn btn-link text-muted w-100 mt-2 small text-decoration-none" onClick={()=>setActivationStep(1)}>Back to Step 1</button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="dashboard-wrapper min-vh-100 py-4 bg-light">
      <div className="container">
        {/* Dashboard Header */}
        <div className="modern-card p-4 mb-4 border-0">
          <div className="d-flex flex-column flex-md-row align-items-center gap-4">
            <div className="position-relative">
               <img src={studentInfo?.profilePhoto || "/default-avatar.png"} alt="Profile" className="rounded-circle border border-5 border-light shadow-sm" width="110" height="110" />
               <label className="position-absolute bottom-0 end-0 bg-white shadow-sm p-2 rounded-circle" style={{cursor:'pointer'}}>
                  <i className="bi bi-pencil-fill text-primary"></i>
                  <input type="file" className="d-none" onChange={e => handleDocumentUpload(e, 'profile')} />
               </label>
            </div>
            <div className="flex-grow-1 text-center text-md-start">
              <h2 className="fw-bold mb-1 text-uppercase">{studentInfo?.studentName}</h2>
              <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-2 mb-2">
                 <span className="badge bg-primary text-white badge-role">OFFICIAL STUDENT</span>
                 <span className="badge bg-light text-dark border badge-role">ID: {studentInfo?._id.slice(-6).toUpperCase()}</span>
              </div>
              <p className="text-muted mb-0"><i className="bi bi-telephone-fill me-2"></i>{studentInfo?.phone}</p>
            </div>
            <div className="d-flex gap-2">
               <button className="btn btn-outline-danger px-4 rounded-pill fw-bold" onClick={logout}><i className="bi bi-power me-2"></i>LOGOUT</button>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-3">
             <div className="modern-card p-3 sticky-top" style={{top: '100px'}}>
                <button className={`btn w-100 text-start rounded-4 p-3 mb-2 d-flex align-items-center gap-3 transition-all ${activeTab==='results'?'btn-primary shadow-sm':'btn-light'}`} onClick={()=>setActiveTab('results')}>
                   <i className="bi bi-graph-up-arrow fs-5"></i> <span className="fw-bold">My Results</span>
                </button>
                <button className={`btn w-100 text-start rounded-4 p-3 mb-2 d-flex align-items-center gap-3 transition-all ${activeTab==='profile'?'btn-primary shadow-sm':'btn-light'}`} onClick={()=>setActiveTab('profile')}>
                   <i className="bi bi-person-badge fs-5"></i> <span className="fw-bold">My Dossier</span>
                </button>
                <button className={`btn w-100 text-start rounded-4 p-3 d-flex align-items-center gap-3 transition-all ${activeTab==='notices'?'btn-primary shadow-sm':'btn-light'}`} onClick={()=>setActiveTab('notices')}>
                   <i className="bi bi-bell-fill fs-5"></i> <span className="fw-bold">Notices</span>
                   {notifications.length > 0 && <span className="ms-auto badge bg-danger rounded-circle p-1" style={{width:20, height:20, fontSize:10}}>{notifications.length}</span>}
                </button>
             </div>
          </div>

          <div className="col-lg-9">
             <div className="modern-card min-vh-75">
                {activeTab === 'results' && (
                  <div>
                    <h4 className="fw-bold mb-4 border-start border-primary border-4 ps-3">ACADEMIC PERFORMANCE</h4>
                    {results.length === 0 ? (
                      <div className="text-center py-5 opacity-50">
                         <i className="bi bi-journal-x display-1 d-block mb-3"></i>
                         <h5>No results published yet</h5>
                         <p className="small">Check back later after the exam cycle.</p>
                      </div>
                    ) : (
                      <div className="row g-4">
                        {results.map(res => (
                          <div key={res._id} className="col-md-6">
                            <div className="p-4 rounded-4 border bg-white shadow-sm transition-hover h-100">
                               <div className="d-flex justify-content-between align-items-start mb-3">
                                  <div>
                                     <h5 className="fw-bold mb-0 text-primary">{res.examType}</h5>
                                     <span className="small text-muted">{res.year} - Academic Row</span>
                                  </div>
                                  <div className={`badge fs-5 rounded-4 p-2 bg-primary shadow-sm`}>{res.grade}</div>
                               </div>
                               <div className="bg-light p-3 rounded-4 mb-3">
                                  <div className="d-flex justify-content-between mb-1">
                                     <span className="small fw-bold">SUBJECTS</span>
                                     <span className="small fw-bold">MARK</span>
                                  </div>
                                  <hr className="my-1 opacity-10"/>
                                  {res.subjects.map((s,i)=>(
                                    <div key={i} className="d-flex justify-content-between small py-1 border-bottom border-dashed last-child-no-border">
                                       <span>{s.subject}</span>
                                       <span className="fw-bold">{s.mark}</span>
                                    </div>
                                  ))}
                                  <div className="d-flex justify-content-between mt-2 pt-2 border-top border-2 border-white">
                                     <span className="fw-bold">TOTAL SCORE:</span>
                                     <span className="fw-bold text-primary">{res.totalMarks}</span>
                                  </div>
                               </div>
                               <button className="btn btn-premium w-100 rounded-pill btn-sm" onClick={() => downloadMarksheet(res)}>
                                  <i className="bi bi-download me-2"></i> DOWNLOAD SHEET
                               </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div className="row g-4">
                     <div className="col-md-4 text-center">
                        <div className="p-4 bg-light rounded-5 h-100 shadow-inner">
                           <img src={studentInfo?.profilePhoto || "/default-avatar.png"} className="rounded-circle border border-5 border-white shadow-md mb-3" width="140" height="140" alt="Avatar" />
                           <h5 className="fw-bold text-primary">{studentInfo?.studentName}</h5>
                           <p className="text-muted small mb-3">{studentInfo?.phone}</p>
                           <hr/>
                           <div className="text-start">
                              <label className="x-small fw-bold text-muted mb-2 text-uppercase">Profile Bio</label>
                              <textarea className="form-control mb-2 small shadow-none border-0" rows="4" value={tempBio} onChange={e=>setTempBio(e.target.value)} placeholder="Tell us about yourself..." />
                              <button className="btn btn-primary w-100 rounded-pill py-2 fw-bold" onClick={() => handleProfileUpdate({ bio: tempBio })}>UPDATE BIO</button>
                           </div>
                        </div>
                     </div>
                     <div className="col-md-8">
                        {studentInfo?.adminNote && (
                           <div className="alert alert-warning border-0 shadow-sm rounded-4 mb-4 p-4 d-flex gap-3 animate-up">
                              <i className="bi bi-info-circle-fill fs-2 text-warning"></i>
                              <div>
                                 <strong className="d-block mb-1">OFFICE INSTRUCTION:</strong>
                                 <p className="small mb-0 opacity-75">{studentInfo.adminNote}</p>
                              </div>
                           </div>
                        )}

                        <h5 className="fw-bold text-primary border-bottom pb-2 mb-3">MANDATORY DOCUMENTS</h5>
                        <div className="row g-3 mb-4">
                           {[
                             { label: "AADHAR CARD", key: "aadhar", file: studentInfo?.aadharFile },
                             { label: "SSLC BOOK", key: "sslc", file: studentInfo?.sslcFile },
                             { label: "BIRTH CERT", key: "birthCert", file: studentInfo?.birthCertFile },
                             { label: "T.C FILE", key: "tc", file: studentInfo?.tcFile },
                             { label: "PREV MARKLIST", key: "marklist", file: studentInfo?.marklistFile }
                           ].map(doc => (
                             <div className="col-md-6" key={doc.key}>
                                <div className="p-3 border rounded-4 bg-white h-100 shadow-sm transition-all hover-translate-up">
                                   <label className="x-small fw-bold text-muted d-block opacity-50 mb-2">{doc.label}</label>
                                   {doc.file ? (
                                     <div className="d-flex align-items-center justify-content-between">
                                        <span className="text-success fw-bold small"><i className="bi bi-check-circle-fill me-2"></i>VERIFIED</span>
                                        <div className="d-flex gap-2">
                                           <a href={doc.file} target="_blank" rel="noreferrer" className="btn btn-xs btn-primary px-3 rounded-pill">VIEW</a>
                                           <label className="btn btn-xs btn-light rounded-circle shadow-sm" title="Replace">
                                              <i className="bi bi-pencil"></i><input type="file" className="d-none" onChange={e => handleDocumentUpload(e, doc.key)} />
                                           </label>
                                        </div>
                                     </div>
                                   ) : (
                                     <div className="text-center py-2">
                                        <input type="file" id={`file-${doc.key}`} className="d-none" onChange={e => handleDocumentUpload(e, doc.key)} disabled={uploadingDoc} />
                                        <label htmlFor={`file-${doc.key}`} className="btn btn-sm btn-outline-primary w-100 rounded-pill">UPLOAD</label>
                                     </div>
                                   )}
                                </div>
                             </div>
                           ))}
                        </div>

                        <h5 className="fw-bold text-secondary border-bottom pb-2 mb-3">OTHER ACHIEVEMENTS</h5>
                        <div className="row g-2">
                           {(studentInfo?.extraCertificates || []).map((url, idx) => (
                             <div className="col-md-4" key={idx}>
                                <div className="p-3 border rounded-4 bg-white shadow-sm d-flex align-items-center justify-content-between animate-up">
                                   <span className="small truncate me-1 text-muted">Cert {idx+1}</span>
                                   <a href={url} target="_blank" rel="noreferrer" className="btn btn-xs btn-link p-0 text-primary">OPEN</a>
                                </div>
                             </div>
                           ))}
                           <div className="col-md-4">
                              <label className="btn btn-outline-secondary w-100 border-dashed rounded-4 py-3 d-flex flex-column align-items-center gap-1 bg-light bg-opacity-50">
                                 <i className="bi bi-plus-circle-dotted fs-3"></i>
                                 <span className="x-small fw-bold">ADD NEW</span>
                                 <input type="file" className="d-none" onChange={e => handleDocumentUpload(e, 'extra')} disabled={uploadingDoc} />
                              </label>
                           </div>
                        </div>
                     </div>
                  </div>
                )}

                {activeTab === 'notices' && (
                  <div>
                     <h4 className="fw-bold mb-4 border-start border-primary border-4 ps-3">COMMUNICATIONS</h4>
                     <div className="row g-3">
                        {notifications.length === 0 ? (
                           <div className="text-center py-5 opacity-25">
                              <i className="bi bi-mailbox display-1"></i>
                              <p className="mt-3">No new notifications</p>
                           </div>
                        ) : notifications.map(n => (
                          <div key={n._id} className={`p-4 rounded-5 border-0 shadow-sm animate-up ${n.type === 'urgent' ? 'bg-danger bg-opacity-10 text-danger border-start border-danger border-5' : 'bg-white'}`}>
                             <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold mb-0">{n.title}</h5>
                                <span className="badge bg-light text-muted fw-bold">{new Date(n.createdAt).toLocaleDateString()}</span>
                             </div>
                             <p className="mb-0 text-secondary lead small">{n.message}</p>
                          </div>
                        ))}
                     </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudentLogin;
