import React, { useEffect, useState } from 'react';
import "./Admin.css";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay (e.g., API call)
    const timer = setTimeout(() => setLoading(false), 1000); // 1 second
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <div className="admin-skeleton-wrapper">
          {Array.from({ length: 10 }).map((_, index) => (
            <div className="admin-skeleton-box" key={index}></div>
          ))}
        </div>
      ) : (
        <div className="container-Admin">
          <h1 onClick={() => navigate("/admin/NewStudent")}>Admission</h1>
          <h1 onClick={() => navigate("/admin/Studentsdata")}>Student Management</h1>
          {/* <h1 onClick={() => navigate("/admin/Newstaff")}>Staffadding </h1> */}
          <h1 onClick={() => navigate("/admin/Staffdata")}>Staff management</h1>
          <h1 onClick={() => navigate("/admin/Attendance")}>ClassTeacher Management</h1>
          <h1 onClick={() => navigate("/admin/Events")}>Events</h1>
          <h1 onClick={() => navigate("/admin/Timetable")}>Time Table</h1>
          <h1 onClick={() => navigate("/admin/Assign")}>Subject and class</h1>
          <h1 onClick={() => navigate("/admin/feemanagement")}>Fee Management</h1>
          <h1 onClick={() => navigate("/admin/ClassManagement")}>Class Management</h1>
          <h1 onClick={() => navigate("/admin/Notes")}>Notes</h1>
          <h1 onClick={() => navigate("/admin/Feedback")}>Feedback</h1>
          <h1 onClick={() => navigate("/admin/Gallery")}>Gallery</h1>
        </div>
      )}
    </>
  );
};

export default Admin;
