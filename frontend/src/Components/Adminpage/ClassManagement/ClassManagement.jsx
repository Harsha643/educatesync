import React, { useState, useEffect } from "react";
import "./ClassManagement.css"

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(9);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (selectedClass) {
      fetchClasses();
    }
  }, [selectedClass]); // Run effect only when selectedClass changes

//   console.log(typeof(selectedClass))
  const fetchClasses = async () => {
    try {
      const response = await fetch(`http://localhost:4000/admin/students/${selectedClass}`);
      const data = await response.json();
      console.log(data)
      setClasses(data);
    } catch (error) {
      console.error("Failed to fetch class data:", error);
    }
  };

  const handleClassChange = (e) => {
    setSelectedClass(Number(e.target.value));
  };


  return (
    <div>
      <h1>Class Management</h1>
    <select
  value={selectedClass}
  onChange={handleClassChange}
  style={{
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "20px",
    outline: "none",
    backgroundColor: "#f9f9f9",
    cursor: "pointer",
  }}
>
  <option value="">Select Class</option>
  {[...Array(10)].map((_, i) => (
    <option key={i + 1} value={i + 1}>
      Class {i + 1}
    </option>
  ))}
</select>

   
      {classes.length > 0 ? (
        <table className="class-table" border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Admission Number</th>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Father Name</th>
              <th>Gender</th>
              <th>Present Class</th>
              <th>Age</th>
              <th>Address</th>
              <th>Parent Email Address</th>
              <th>Parent Phone Number</th>
              <th>Date of Birth</th>
              <th>Aadhar Card Number</th>
              
            </tr>
          </thead>
          <tbody>
            {classes.map((student) => (
              <tr key={student._id}>
                <td>{student.admissionNumber}</td>
                <td>{student.rollNumber}</td>
                <td>{student.studentName}</td>
                <td>{student.fatherName}</td>
                <td>{student.gender}</td>
                <td>{student.presentClass}</td>
                <td>{student.age}</td>
                <td>{student.address}</td>
                <td>{student.parentEmailAddress}</td>
                <td>{student.parentPhoneNumber}</td>
                <td>{student.dateOfBirth}</td>
                <td>{student.aadharCardNumber}</td>
              </tr>
            ))}
          </tbody>
        </table> ) : (
   <p style={{ marginTop: "20px", color: "red", fontWeight: "bold",  textAlign:"center" ,fontSize:"2rem"}}>
      No students are present in this class.
    </p>
)}
      
    </div>
);
}

export default ClassManagement;
