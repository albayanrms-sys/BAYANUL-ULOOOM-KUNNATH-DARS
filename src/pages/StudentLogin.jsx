import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./StudentLogin.css";

function StudentLogin() {
  const [token, setToken] = useState(localStorage.getItem('studentToken'));
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
        alert(data.error || "Login Failed");
      }
    } catch(err) {
      alert("Network Error");
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
        alert(data.error || "Candidate not found");
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
        alert("Activation Successful! Now login with your new credentials.");
        setLoginMode("login");
        setActivationStep(1);
        setUsername(actUser);
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

  const handleProfileUpdate = async (updateData) => {
    try {
      const res = await fetch("/api/my-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(updateData)
      });
      if(res.ok) {
        alert("Profile updated!");
        fetchMyResults();
      }
    } catch(err) { alert("Update failed"); }
  };

  const downloadMarklist = (result) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(0, 109, 119);
    doc.text("BAYANUL ULOOM DARS KUNNATH", 105, 20, null, null, "center");
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`${result.examType} Exam Marksheet - ${result.year}`, 105, 30, null, null, "center");

    doc.setFontSize(12);
    doc.text(`Student: ${studentInfo?.studentName}`, 20, 50);
    doc.text(`Date Published: ${new Date(result.publishedDate).toLocaleDateString()}`, 20, 60);

    const body = result.subjects.map(s => [s.subject, s.mark]);
    body.push([{ content: 'Total Marks', styles: { fontStyle: 'bold' } }, { content: result.totalMarks, styles: { fontStyle: 'bold' } }]);
    body.push([{ content: 'Final Grade', styles: { fontStyle: 'bold' } }, { content: result.grade, styles: { fontStyle: 'bold' } }]);

    doc.autoTable({
      startY: 70,
      head: [['Subject', 'Marks Output']],
      body: body,
      headStyles: { fillColor: [0, 109, 119] },
      theme: 'grid'
    });

    doc.setFontSize(10);
    doc.text("Officially generated by Al Bayan Digital System", 105, 280, null, null, "center");
    doc.save(`${studentInfo?.studentName}_Results.pdf`);
  };

  if (!token) {
    return (
      <section className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="bg-teal-primary p-4 text-center text-white">
                <img src="/logo.png" alt="Logo" width="70" className="mb-3 rounded-circle shadow" />
                <h3 className="fw-bold mb-0">STUDENT PORTAL</h3>
              </div>
              
              <div className="p-4">
                <div className="nav nav-pills nav-fill mb-4 bg-light rounded-pill p-1">
                  <button className={`nav-link rounded-pill fw-bold ${loginMode === 'login' ? 'active bg-teal-primary' : 'text-dark'}`} onClick={() => setLoginMode('login')}>LOGIN</button>
                  <button className={`nav-link rounded-pill fw-bold ${loginMode === 'activate' ? 'active bg-teal-primary' : 'text-dark'}`} onClick={() => setLoginMode('activate')}>FIRST TIME?</button>
                </div>

                {loginMode === 'login' ? (
                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label className="small fw-bold text-muted">USERNAME</label>
                      <input type="text" className="form-control form-control-lg bg-light border-0 shadow-none rounded-3" value={username} onChange={e=>setUsername(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                      <label className="small fw-bold text-muted">PASSWORD</label>
                      <input type="password" className="form-control form-control-lg bg-light border-0 shadow-none rounded-3" value={password} onChange={e=>setPassword(e.target.value)} required />
                    </div>
                    <button className="btn btn-teal-primary w-100 py-3 fw-bold rounded-pill shadow-sm transition-hover">
                       SIGN IN TO PORTAL <i className="bi bi-arrow-right-short fs-4"></i>
                    </button>
                  </form>
                ) : (
                  <div>
                    {activationStep === 1 ? (
                      <form onSubmit={checkStudentActivation}>
                        <div className="alert alert-info small py-3 rounded-3 mb-4">
                           <i className="bi bi-info-circle-fill me-2"></i>
                           Enter your details exactly as given in your admission form to activate your digital portal.
                        </div>
                        <div className="mb-3">
                          <label className="small fw-bold text-muted">NAME OF CANDIDATE</label>
                          <input type="text" className="form-control bg-light border-0" value={actName} onChange={e=>setActName(e.target.value)} required placeholder="Full Name" />
                        </div>
                        <div className="mb-4">
                          <label className="small fw-bold text-muted">REGISTERED PHONE</label>
                          <input type="tel" className="form-control bg-light border-0" value={actPhone} onChange={e=>setActPhone(e.target.value)} required placeholder="+91 XXXX XXXX" />
                        </div>
                        <button className="btn btn-teal-primary w-100 py-3 fw-bold rounded-pill">VERIFY CANDIDATE ➡️</button>
                      </form>
                    ) : (
                      <form onSubmit={finalizeActivation}>
                        <div className="text-center mb-4">
                           <div className="p-3 bg-warning bg-opacity-10 border border-warning rounded-4">
                              <h6 className="fw-bold text-warning mb-1">⚠️ IMPORTANT WARNING</h6>
                              <p className="small mb-0">Please set your unique username and password. This will be used for all future logins to your candidate portal.</p>
                           </div>
                        </div>

                        <div className="text-center mb-4">
                           <label className="small fw-bold text-muted d-block mb-2">UPLOAD PROFILE PHOTO</label>
                           <div className="position-relative d-inline-block">
                              <img src={actPhoto || "/logo.png"} className="rounded-circle border shadow-sm" width="100" height="100" style={{objectFit:'cover'}} />
                              <label className="btn btn-sm btn-teal-primary position-absolute bottom-0 end-0 rounded-circle p-1">
                                 <i className="bi bi-camera"></i>
                                 <input type="file" className="d-none" accept="image/*" onChange={handleActivationPhoto} />
                              </label>
                           </div>
                        </div>

                        <div className="mb-3">
                          <label className="small fw-bold text-muted">CREATE USERNAME</label>
                          <input type="text" className="form-control bg-light border-0" value={actUser} onChange={e=>setActUser(e.target.value)} required placeholder="e.g. m_ameen_01" />
                        </div>
                        <div className="mb-4">
                          <label className="small fw-bold text-muted">SECURE PASSWORD</label>
                          <input type="password" className="form-control bg-light border-0" value={actPass} onChange={e=>setActPass(e.target.value)} required minLength="6" />
                        </div>
                        <button className="btn btn-success w-100 py-3 fw-bold rounded-pill shadow-sm" disabled={uploadingDoc}>
                           {uploadingDoc ? 'Uploading...' : 'ACTIVATE PORTAL ACCOUNT'}
                        </button>
                        <button type="button" className="btn btn-link w-100 mt-2 text-muted small" onClick={() => setActivationStep(1)}>Go back</button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container-fluid py-4 min-vh-100 bg-light">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4 p-4 d-flex flex-row justify-content-between align-items-center bg-white">
              <div className="d-flex align-items-center gap-3">
                 <img src={studentInfo?.profilePhoto || "/logo.png"} alt="DP" className="rounded-circle shadow-sm" width="60" height="60" style={{objectFit: 'cover'}} />
                 <div>
                    <h4 className="fw-bold mb-0 text-teal">{studentInfo?.studentName}</h4>
                    <span className="badge bg-light text-success border">✓ OFFICIAL CANDIDATE</span>
                 </div>
              </div>
              <button onClick={logout} className="btn btn-outline-danger btn-sm rounded-pill px-3">SIGN OUT</button>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-3">
            <div className="nav flex-column nav-pills bg-white shadow-sm p-3 rounded-4 gap-2">
              <button className={`nav-link text-start py-3 fw-bold ${activeTab === 'results' ? 'active bg-teal-primary' : 'text-dark'}`} onClick={() => setActiveTab('results')}>🏆 MY RESULTS</button>
              <button className={`nav-link text-start py-3 fw-bold ${activeTab === 'profile' ? 'active bg-teal-primary' : 'text-dark'}`} onClick={() => setActiveTab('profile')}>👤 MY PROFILE</button>
              <button className={`nav-link text-start py-3 fw-bold ${activeTab === 'notices' ? 'active bg-teal-primary' : 'text-dark'}`} onClick={() => setActiveTab('notices')}>📢 NOTICES ({notifications.length})</button>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white min-vh-50">
               {activeTab === 'results' && (
                 <div>
                   <h4 className="fw-bold mb-4">Official Marksheets</h4>
                   {results.length === 0 ? <p className="text-center py-5 text-muted">No results published yet.</p> : (
                     <div className="row g-3">
                        {results.map(r => (
                          <div className="col-md-6" key={r._id}>
                             <div className="border rounded-4 p-4 text-center bg-light">
                                <span className="badge bg-teal-primary mb-2">{r.examType} - {r.year}</span>
                                <h3 className="display-5 fw-bold mb-0">{r.totalMarks}</h3>
                                <p className="text-muted small">Total Score</p>
                                <div className="badge bg-success fs-6 px-4 py-2 rounded-pill mb-4">GRADE: {r.grade}</div>
                                <button className="btn btn-outline-teal w-100 fw-bold py-2 rounded-pill" onClick={() => downloadMarklist(r)}>📥 DOWNLOAD CERTIFICATE</button>
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
                       <div className="position-relative d-inline-block mb-3">
                          <img src={studentInfo?.profilePhoto || "/logo.png"} alt="Profile" className="rounded-circle shadow" width="160" height="160" style={{objectFit: 'cover'}} />
                          <label className="btn btn-teal-primary position-absolute bottom-0 end-0 rounded-circle p-2 shadow" style={{width: 40, height: 40}}>
                             {uploadingDoc ? '...' : '✏️'}
                             <input type="file" className="d-none" accept="image/*" onChange={e => handleDocumentUpload(e, 'profile')} disabled={uploadingDoc} />
                          </label>
                       </div>
                       <h5 className="fw-bold">{studentInfo?.studentName}</h5>
                       <p className="text-muted small">{studentInfo?.phone}</p>
                       <hr/>
                       <div className="text-start">
                          <label className="small fw-bold text-muted">ABOUT ME</label>
                          <textarea className="form-control bg-light small mb-2" rows="3" value={tempBio} onChange={e=>setTempBio(e.target.value)} />
                          <button className="btn btn-teal-primary btn-sm w-100 rounded-pill" onClick={() => handleProfileUpdate({ bio: tempBio })}>SAVE BIO</button>
                       </div>
                    </div>
                    <div className="col-md-9">
                        {studentInfo?.adminNote && (
                           <div className="alert alert-warning border-0 shadow-sm rounded-4 mb-4 p-3 d-flex gap-3">
                              <i className="bi bi-info-circle-fill fs-3 text-warning"></i>
                              <div>
                                 <strong className="d-block mb-1">OFFICE INSTRUCTION:</strong>
                                 <p className="small mb-0 opacity-75">{studentInfo.adminNote}</p>
                              </div>
                           </div>
                        )}

                        <h5 className="fw-bold text-teal border-bottom pb-2 mb-3">MANDATORY DOCUMENTS</h5>
                        <div className="row g-2 mb-4">
                           {[
                             { label: "AADHAR CARD", key: "aadhar", file: studentInfo?.aadharFile },
                             { label: "SSLC BOOK", key: "sslc", file: studentInfo?.sslcFile },
                             { label: "BIRTH CERT", key: "birthCert", file: studentInfo?.birthCertFile },
                             { label: "T.C FILE", key: "tc", file: studentInfo?.tcFile },
                             { label: "PREV MARKLIST", key: "marklist", file: studentInfo?.marklistFile }
                           ].map(doc => (
                             <div className="col-md-6 col-lg-4" key={doc.key}>
                                <div className="p-3 border rounded-4 bg-light h-100 shadow-sm transition-hover">
                                   <label className="x-small fw-bold text-muted d-block opacity-50">{doc.label}</label>
                                   {doc.file ? (
                                     <div className="d-flex align-items-center justify-content-between mt-2">
                                        <span className="text-success fw-bold small"><i className="bi bi-check-circle-fill me-1"></i>LOADED</span>
                                        <div className="d-flex gap-2">
                                           <a href={doc.file} target="_blank" rel="noreferrer" className="btn btn-sm btn-teal-primary px-3 rounded-pill py-0 small">VIEW</a>
                                           <label className="btn btn-sm btn-outline-secondary px-2 rounded-pill py-0 small">
                                              <i className="bi bi-pencil"></i><input type="file" className="d-none" onChange={e => handleDocumentUpload(e, doc.key)} />
                                           </label>
                                        </div>
                                     </div>
                                   ) : (
                                     <div className="mt-2">
                                        <input type="file" id={`file-${doc.key}`} className="d-none" onChange={e => handleDocumentUpload(e, doc.key)} disabled={uploadingDoc} />
                                        <label htmlFor={`file-${doc.key}`} className="btn btn-sm btn-outline-teal w-100 rounded-pill py-1">UPLOAD NOW</label>
                                     </div>
                                   )}
                                </div>
                             </div>
                           ))}
                        </div>

                        <h5 className="fw-bold text-secondary border-bottom pb-2 mb-3">ACHIEVEMENTS & EXTRA CERTIFICATES</h5>
                        <div className="row g-2">
                           {(studentInfo?.extraCertificates || []).map((url, idx) => (
                             <div className="col-md-4" key={idx}>
                                <div className="p-2 border rounded-4 bg-white shadow-sm d-flex align-items-center justify-content-between">
                                   <span className="small truncate me-2">Cert {idx+1}</span>
                                   <a href={url} target="_blank" className="btn btn-xs btn-link p-0 text-teal">OPEN</a>
                                </div>
                             </div>
                           ))}
                           <div className="col-md-4">
                              <label className="btn btn-sm btn-outline-secondary w-100 border-dashed rounded-4 py-3 d-flex flex-column align-items-center justify-content-center">
                                 <i className="bi bi-plus-circle fs-4 mb-1"></i>
                                 <span className="x-small fw-bold">ADD NEW DOC</span>
                                 <input type="file" className="d-none" onChange={e => handleDocumentUpload(e, 'extra')} disabled={uploadingDoc} />
                              </label>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'notices' && (
                 <div className="row justify-content-center">
                    <div className="col-lg-10">
                       <h4 className="fw-bold mb-4 text-center">CAMPUS ANNOUNCEMENTS</h4>
                       {notifications.map(n => (
                         <div key={n._id} className={`alert border-0 shadow-sm rounded-4 p-4 mb-3 ${n.type === 'urgent' ? 'alert-danger' : 'alert-light'}`}>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                               <h5 className="fw-bold mb-0 text-teal">{n.title}</h5>
                               <span className="small text-muted">{new Date(n.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="mb-0 text-secondary lh-base">{n.message}</p>
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
