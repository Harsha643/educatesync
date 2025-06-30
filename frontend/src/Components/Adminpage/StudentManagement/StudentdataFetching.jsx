import React, { useState, useEffect } from 'react';
import "./studentdata.css";

const StudentDataFetching = () => {
  const [studentData, setStudentData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:4000/admin/students');
      const data = await response.json();
      setStudentData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4000/admin/students/${id}`, { method: 'DELETE' });
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
    setSelectedStudent(null); // new student form
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setShowModal(false);
    fetchData();
  };

  const Newstudent = ({ existingStudent, onClose }) => {
    const [student, setStudent] = useState({
      studentName: '',
      fatherName: '',
      previousClass: '',
      presentClass: '',
      age: '',
      address: '',
      parentEmailAddress: '',
      parentPhoneNumber: '',
      dateOfBirth: '',
      image: null,
      aadharCardNumber: '',
      nationality: '',
      religion: '',
      gender: '',
      MotherTongue: ''
    });

    useEffect(() => {
      if (existingStudent) {
        const formattedDate = existingStudent.dateOfBirth?.split('T')[0] || '';
        setStudent(prev => ({
          ...prev,
          ...existingStudent,
          dateOfBirth: formattedDate
        }));
      } else {
        setStudent({
          studentName: '',
          fatherName: '',
          previousClass: '',
          presentClass: '',
          age: '',
          address: '',
          parentEmailAddress: '',
          parentPhoneNumber: '',
          dateOfBirth: '',
          image: null,
          aadharCardNumber: '',
          nationality: '',
          religion: '',
          gender: '',
          MotherTongue: ''
        });
      }
    }, [existingStudent]);

    const handleChange = (e) => {
      const { name, value, type, files } = e.target;
      if (type === 'file') {
        setStudent({ ...student, [name]: files[0] });
      } else {
        setStudent({ ...student, [name]: value });
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData();

      Object.keys(student).forEach(key => {
        if (!existingStudent && key === 'admissionNumber') return;
        if (student[key] !== null && student[key] !== undefined) {
          formData.append(key, student[key]);
        }
      });

      try {
        const url = existingStudent
          ? `http://localhost:4000/admin/students/${student._id}`
          : 'http://localhost:4000/admin/students';

        const method = existingStudent ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          body: formData
        });

        if (response.ok) {
          if (onClose) onClose();
        } else {
          console.error('Error:', await response.text());
        }
      } catch (error) {
        console.error('Submission error:', error);
      }
    };

    return (
      <div className="form-container">
        <h2 className="form-title">{existingStudent ? 'Update' : 'Add'} Student Details</h2>
        <form onSubmit={handleSubmit}>
          {/* Input Fields */}
          {[
            { name: 'studentName', type: 'text', label: "Student Name" },
            { name: 'fatherName', type: 'text', label: "Father's Name" },
            { name: 'previousClass', type: 'text', label: "Previous Class" },
            { name: 'presentClass', type: 'text', label: "Present Class" },
            { name: 'aadharCardNumber', type: 'text', label: "Aadhar Card Number" },
            { name: 'nationality', type: 'text', label: "Nationality" },
            { name: 'religion', type: 'text', label: "Religion" },
            { name: 'MotherTongue', type: 'text', label: "Mother Tongue" },
            { name: 'age', type: 'number', label: "Age" },
            { name: 'parentEmailAddress', type: 'email', label: "Parent Email" },
            { name: 'parentPhoneNumber', type: 'tel', label: "Parent Phone", pattern: "[0-9]{10}" }
          ].map(({ name, type, label, ...rest }) => (
            <div key={name} className="input-group">
              <input
                type={type}
                name={name}
                value={student[name]}
                onChange={handleChange}
                placeholder={`Enter ${label}`}
                required
                {...rest}
              />
              <label>{label}</label>
            </div>
          ))}

          <div className="input-group">
            <select name="gender" value={student.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <label>Gender</label>
          </div>

          <div className="input-group">
            <textarea
              name="address"
              value={student.address}
              onChange={handleChange}
              placeholder="Enter Address"
              required
            />
            <label>Address</label>
          </div>

          <div className="input-group">
            <input
              type="date"
              name="dateOfBirth"
              value={student.dateOfBirth}
              onChange={handleChange}
              min="1900-01-01"
              required
            />
            <label>Date of Birth</label>
          </div>

          <div className="input-group">
            <input type="file" name="image" onChange={handleChange} />
            <label>Student Image</label>
            {existingStudent?.image && !(student.image instanceof File) && (
              <p className="current-image">Current: {existingStudent.image}</p>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              {existingStudent ? 'Update Student' : 'Add Student'}
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="student-data-container">
      <div className="header-with-button">
        <h1>Students Data</h1>
        <button className="add-btn" onClick={handleAddNewStudent}>
          + Add New Student
        </button>
      </div>
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
            {studentData.map((student, index) => (
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
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
  <>
    <div className="modal-overlay" onClick={closeModal}></div>
    <Newstudent existingStudent={selectedStudent} onClose={closeModal} />
  </>
)}

 
    </div>
  );
};

export default StudentDataFetching;
