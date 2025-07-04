import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './feedback.css';

const Feedback = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [classList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [selectRollNumber, setSelectRollNumber] = useState('');
  const location = useLocation();
  const staff = location.state?.staffdata;
  const [staffdata, setStaffdata] = useState({});
  const [studentData, setStudentData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const baseUrl = "https://educatesync.onrender.com" || "http://localhost:4000";

  const [formData, setFormData] = useState({
    studentName: '',
    rollNumber: '',
    class: '',
    teacher: '',
    feedback: ''
  });

  const [searchTerm, setSearchTerm] = useState(""); // 🔍 New search state

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setStaffdata(staff);
  }, [staff]);

  useEffect(() => {
    async function fetchStudentsByClass() {
      if (!selectedClass) return;
      try {
        const response = await fetch(`${baseUrl}/admin/students/${selectedClass}`);
        const data = await response.json();
        setStudentData(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    }
    fetchStudentsByClass();
  }, [selectedClass]);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch(`${baseUrl}/staff/feedback`);
      if (!response.ok) throw new Error("Failed to fetch feedback");
      const data = await response.json();
      setFeedback(data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const openFeedbackModal = (student = null) => {
    const selectedStudent = student || studentData.find(s => s.rollNumber === selectRollNumber);
    if (!selectedStudent) return alert("Please select a valid student.");
    setFormData({
      studentName: selectedStudent.studentName,
      rollNumber: selectedStudent.rollNumber,
      class: selectedStudent.presentClass || selectedClass,
      teacher: staffdata?.teacherName || '',
      feedback: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmitFeedback = async () => {
    try {
      const response = await fetch(`${baseUrl}/staff/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Failed to submit feedback");
      alert("Feedback submitted!");
      setIsModalOpen(false);
      setFormData({ studentName: '', rollNumber: '', class: '', teacher: '', feedback: '' });
      fetchFeedback(); // Refresh list
    } catch (err) {
      console.error("Feedback submit error:", err);
      alert("Failed to submit feedback");
    }
  };

  // 🔍 Filter based on search
  const filteredFeedback = feedback.filter((item) =>
    item.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.rollNumber?.toString().includes(searchTerm) ||
    item.class?.toString().includes(searchTerm) ||
    item.feedback?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredFeedback.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFeedback = filteredFeedback.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="feedback-container">
      <h1>Student Feedback by Class</h1>

      <div className="feedback-header">
        <label>Select Class: </label>
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
          <option value="">-- Select Class --</option>
          {classList.map((cls, index) => (
            <option key={index} value={cls}>{cls}</option>
          ))}
        </select>

        <label>Roll No: </label>
        <select value={selectRollNumber} onChange={(e) => setSelectRollNumber(e.target.value)}>
          <option value="">-- Select Roll Number --</option>
          {studentData.map((item, index) => (
            <option key={index} value={item.rollNumber}>{item.rollNumber}</option>
          ))}
        </select>

        <button onClick={() => openFeedbackModal(null)}>Add Feedback</button>
      </div>

      {/* 🔍 Search input */}
      <div className="search-bar" style={{ margin: "10px 0" }}>
        <input
          type="text"
          placeholder="Search by name, roll number, class or feedback..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset page on search
          }}
          style={{ width: "300px", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
      </div>

      <table className="assignment-table" cellSpacing="0" cellPadding="5" border="1">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Roll Number</th>
            <th>Student Name</th>
            <th>Class</th>
            <th>Feedback</th>
          </tr>
        </thead>
        <tbody>
          {paginatedFeedback.map((item, index) => (
            <tr key={item._id || index}>
              <td>{startIndex + index + 1}</td>
              <td>{item.rollNumber}</td>
              <td>{item.studentName}</td>
              <td>{item.class}</td>
              <td>{item.feedback}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>⬅ Prev</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Next ➡</button>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h2>Add Feedback</h2>
            <label>Student Name:</label>
            <input value={formData.studentName} readOnly /><br />
            <label>Roll Number:</label>
            <input value={formData.rollNumber} readOnly /><br />
            <label>Feedback:</label><br />
            <textarea
              value={formData.feedback}
              onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
              rows="4"
              style={{ width: '100%' }}
            ></textarea><br />
            <button onClick={handleSubmitFeedback}>Submit</button>
            <button onClick={() => setIsModalOpen(false)} style={{ marginLeft: '10px' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
