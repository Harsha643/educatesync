import React from 'react'
import "./Admin.css"
import {useNavigate} from "react-router-dom"

const Admin = () => {
  const navigate=useNavigate()
  return (
    <>
    <div className="container-Admin">
    <h1 onClick={()=>navigate("/admin/NewStudent")}>Admission</h1>
<h1 onClick={() => navigate("/admin/Studentsdata")}>Student Management</h1>
{/* <h1 onClick={() => navigate("/admin/Newstaff")}>Staffadding </h1> */}
<h1 onClick={() => navigate("/admin/Staffdata")}>Staff management</h1>
<h1 onClick={() =>navigate("/admin/ClassTeacher")}>ClassTeacher</h1>
<h1 onClick={() => navigate("/admin/Events")}>Events</h1>
<h1 onClick={() => navigate("/admin/Timetable")}>Time Table</h1>
<h1 onClick={() => navigate("/admin/Assign")}>Subject and class</h1>
<h1 onClick={() => navigate("/admin/feemanagement")}>Fee Management</h1>
<h1 onClick={() => navigate("/admin/ClassManagement")}>Class Management</h1>
<h1 onClick={() => navigate("/admin/Notes")}>Notes</h1>
<h1 onClick={() => navigate("/admin/Attendance")}>ClassTeacher Management</h1>
<h1 onClick={() => navigate("/admin/Feedback")}>Feedback</h1>
<h1 onClick={() => navigate("/admin/Gallery")}>Gallery</h1>
{/* <h1 onClick={()=>navigate("/admin/NewStdt")}></h1> */}

    </div>
    
    </>
  )
} 

export default Admin
