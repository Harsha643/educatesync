import React, { useState, useEffect } from 'react';
import "./Newstudent.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Newstudent = ({ existingStudent, onClose, refreshData }) => {
  const baseUrl = "https://educatesync.onrender.com" || "http://localhost:4000";

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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (existingStudent) {
      const formattedDate = existingStudent.dateOfBirth?.split('T')[0] || '';
      setStudent(prev => ({
        ...prev,
        ...existingStudent,
        dateOfBirth: formattedDate
      }));
    }
    setLoading(false);
  }, [existingStudent]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setStudent({
      ...student,
      [name]: type === 'file' ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const allStudentsRes = await fetch(`${baseUrl}/admin/students`);
      const allStudents = await allStudentsRes.json();

      const isDuplicate = allStudents.some(
        (s) =>
          s.aadharCardNumber === student.aadharCardNumber &&
          (!existingStudent || s._id !== existingStudent._id)
      );

      if (isDuplicate) {
        toast.error("This Aadhar card number is already registered.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      Object.keys(student).forEach(key => {
        if (!existingStudent && key === 'admissionNumber') return;
        if (student[key] !== null && student[key] !== undefined) {
          formData.append(key, student[key]);
        }
      });

      const url = existingStudent
        ? `${baseUrl}/admin/students/${existingStudent._id}`
        : `${baseUrl}/admin/students`;

      const method = existingStudent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData
      });

      if (response.ok) {
        toast.success(existingStudent ? 'Student updated successfully!' : 'Student added successfully!');
        if (refreshData) refreshData();
        if (onClose) onClose();
      } else {
        console.error('Error:', await response.text());
        toast.error('Something went wrong.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="skeleton-loader">Loading...</div>;
  }

  return (
    <div className="form-container">
      <h2 className="form-title">{existingStudent ? 'Update' : 'Add'} Student Details</h2>
      <form onSubmit={handleSubmit}>
        {[{
          name: "studentName", label: "Student Name", type: "text"
        }, {
          name: "fatherName", label: "Father's Name", type: "text"
        }, {
          name: "previousClass", label: "Previous Class", type: "text"
        }, {
          name: "presentClass", label: "Present Class", type: "text"
        }, {
          name: "age", label: "Age", type: "number"
        }, {
          name: "aadharCardNumber", label: "Aadhar Card Number", type: "text"
        }, {
          name: "address", label: "Address", type: "textarea"
        }, {
          name: "parentEmailAddress", label: "Parent Email", type: "email"
        }, {
          name: "parentPhoneNumber", label: "Parent Phone", type: "tel"
        }, {
          name: "dateOfBirth", label: "Date of Birth", type: "date"
        }, {
          name: "nationality", label: "Nationality", type: "text"
        }, {
          name: "religion", label: "Religion", type: "text"
        }, {
          name: "MotherTongue", label: "Mother Tongue", type: "text"
        }].map(({ name, label, type }) => (
          <div className="input-group" key={name}>
            {type === 'textarea' ? (
              <textarea
                name={name}
                value={student[name]}
                onChange={handleChange}
                placeholder={`Enter ${label}`}
                required
              />
            ) : (
              <input
                type={type}
                name={name}
                value={student[name]}
                onChange={handleChange}
                placeholder={`Enter ${label}`}
                {...(type === "tel" ? { pattern: "[0-9]{10}" } : {})}
                required
              />
            )}
            <label>{label}</label>
          </div>
        ))}

        <div className="input-group">
          <select
            name="gender"
            value={student.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <label>Gender</label>
        </div>

        <div className="input-group">
          <input
            type="file"
            name="image"
            onChange={handleChange}
          />
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

export default Newstudent;