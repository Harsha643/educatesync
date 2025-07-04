import React, { useState, useEffect } from 'react';
import "./studentdata.css";

const StudentDataFetching = () => {
  const baseUrl = "https://educatesync.onrender.com";

  const [studentData, setStudentData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 8;

  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/admin/students`);
      const data = await response.json();
      setStudentData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`${baseUrl}/admin/students/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleUpdate = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleAddNewStudent = () => {
    setSelectedStudent(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setShowModal(false);
    fetchData();
  };

  // Filter logic
  const filteredStudents = studentData.filter((student) => {
    const nameMatch = (student.studentName || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const rollMatch =
      student.rollNumber !== undefined &&
      student.rollNumber.toString().includes(searchTerm);

    return nameMatch || rollMatch;
  });

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="student-data-container">
      <div className="header-with-button">
        <h1>Students Data</h1>
        <button className="add-btn" onClick={handleAddNewStudent}>
          + Add New Student
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Name or Roll No"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset page on search
          }}
        />
      </div>

      {loading ? (
        <div className="loading-spinner">Loading student data...</div>
      ) : (
        <div className="table-container">
          <table className="student-table">
            <thead>
              <tr>
                <th>Admission No</th>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Age</th>
                <th>Present Class</th>
                <th>Father Name</th>
                <th>Date of Birth</th>
                <th>Aadhar Card Number</th>
                <th>Nationality</th>
                <th>Religion</th>
                <th>Gender</th>
                <th>Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.length > 0 ? (
                currentStudents.map((student, index) => (
                  <tr key={index}>
                    <td>{student.admissionNumber}</td>
                    <td>{student.rollNumber}</td>
                    <td>{student.studentName}</td>
                    <td>{student.age}</td>
                    <td>{student.presentClass}</td>
                    <td>{student.fatherName}</td>
                    <td>{student.dateOfBirth}</td>
                    <td>{student.aadharCardNumber}</td>
                    <td>{student.nationality}</td>
                    <td>{student.religion}</td>
                    <td>{student.gender}</td>
                    <td>{student.address}</td>
                    <td className="action-buttons">
                      <button className="update-btn" onClick={() => handleUpdate(student)}>Update</button>
                      <button className="delete-btn" onClick={() => handleDelete(student._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="13" style={{ textAlign: "center", padding: "20px" }}>
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
            {[...Array(totalPages).keys()].map(n => (
              <button
                key={n + 1}
                className={currentPage === n + 1 ? 'active' : ''}
                onClick={() => goToPage(n + 1)}
              >
                {n + 1}
              </button>
            ))}
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDataFetching;
