import React, { useState, useEffect } from "react";
import "./ClassManagement.css";

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(9);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const studentsPerPage = 10;

  const baseUrl = "https://educatesync.onrender.com" || "http://localhost:4000";

  useEffect(() => {
    if (selectedClass) {
      fetchClasses();
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/admin/students/${selectedClass}`);
      const data = await response.json();
      setClasses(data);
      setCurrentPage(1); // Reset page on class change
    } catch (error) {
      console.error("Failed to fetch class data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (e) => {
    setSelectedClass(Number(e.target.value));
    setSearchTerm(""); // Clear search when class changes
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // 🔍 Search filter
  const filteredStudents = classes.filter((student) => {
    const search = searchTerm.toLowerCase();
    return (
      student.studentName?.toLowerCase().includes(search) ||
      student.fatherName?.toLowerCase().includes(search) ||
      student.rollNumber?.toString().includes(search) ||
      student.admissionNumber?.toString().includes(search)
    );
  });

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, startIndex + studentsPerPage);

  return (
    <div>
      <h1>Class Management</h1>

      <div className="top-bar">
        <select value={selectedClass} onChange={handleClassChange}>
          <option value="">Select Class</option>
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Class {i + 1}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by Name, Roll No, or Father's Name"
          className="search-input"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to page 1 on new search
          }}
        />
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Loading students...</p>
        </div>
      ) : currentStudents.length > 0 ? (
        <>
          <div className="table-wrapper">
            <table className="class-table">
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
                  <th>Parent Phn.No</th>
                  <th>Date of Birth</th>
                  <th>Aadhar Card Number</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((student) => (
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
            </table>
          </div>

          <div className="pagination">
            <button onClick={handlePrev} disabled={currentPage === 1}>
              ⬅ Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={handleNext} disabled={currentPage === totalPages}>
              Next ➡
            </button>
          </div>
        </>
      ) : (
        <p className="no-students">No students found for this class.</p>
      )}
    </div>
  );
};

export default ClassManagement;
