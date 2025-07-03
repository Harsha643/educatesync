import React, { useState, useEffect } from 'react';
import './NewStdt.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewStdt = ({ existingStudent, onClose, refreshData }) => {
  const baseUrl = "https://educatesync.onrender.com";
  const [isLoading, setIsLoading] = useState(true);

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

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      if (existingStudent) {
        const formattedDate = existingStudent.dateOfBirth?.split('T')[0] || '';
        setStudent(prev => ({
          ...prev,
          ...existingStudent,
          dateOfBirth: formattedDate
        }));
      }
      setIsLoading(false);
    }, 800); // Optional delay for smooth skeleton

    return () => clearTimeout(timeout);
  }, [existingStudent]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setStudent({ ...student, [name]: files[0] });
    } else {
      setStudent({ ...student, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!student.studentName.trim()) newErrors.studentName = "Enter Student Name";
    if (!student.fatherName.trim()) newErrors.fatherName = "Enter Father's Name";
    if (!student.previousClass.trim()) newErrors.previousClass = "Enter Previous Class";
    if (!student.presentClass.trim()) newErrors.presentClass = "Enter Present Class";
    if (!student.age) newErrors.age = "Enter Age";
    if (!student.aadharCardNumber.trim()) newErrors.aadharCardNumber = "Enter Aadhar Card Number";
    if (!student.address.trim()) newErrors.address = "Enter Address";
    if (!student.parentEmailAddress.trim()) newErrors.parentEmailAddress = "Enter Parent Email";
    if (!student.parentPhoneNumber.trim()) newErrors.parentPhoneNumber = "Enter Parent Phone";
    if (!student.dateOfBirth.trim()) newErrors.dateOfBirth = "Enter Date of Birth";
    if (!student.nationality.trim()) newErrors.nationality = "Enter Nationality";
    if (!student.religion.trim()) newErrors.religion = "Enter Religion";
    if (!student.gender.trim()) newErrors.gender = "Select Gender";
    if (!student.MotherTongue.trim()) newErrors.MotherTongue = "Enter Mother Tongue";
    if (!student.image && !existingStudent) newErrors.image = "Upload Student Image";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields!");
      return;
    }

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
        return;
      }

      const formData = new FormData();
      Object.keys(student).forEach((key) => {
        if (!existingStudent && key === "admissionNumber") return;
        if (student[key] !== null && student[key] !== undefined) {
          formData.append(key, student[key]);
        }
      });

      const url = `${baseUrl}/admin/students`;
      const method = "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        toast.success("Student added successfully!");
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
        if (refreshData) refreshData();
        if (onClose) onClose();
      } else {
        const errorText = await response.text();
        toast.error(`Error: ${errorText}`);
      }
    } catch (error) {
      toast.error("Submission failed. Please try again.");
      console.error("Submission error:", error);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={5000} />
      <div className="student-form">
        <h2 className="student-form__title">Add Student Details</h2>

        {isLoading ? (
          <div className="skeleton-form">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton-line" />
            ))}
            <div className="skeleton-input" />
            <div className="skeleton-input" />
            <div className="skeleton-button" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="student-form__body">
            {[
              { name: "studentName", label: "Student Name", type: "text" },
              { name: "fatherName", label: "Father's Name", type: "text" },
              { name: "previousClass", label: "Previous Class", type: "text" },
              { name: "presentClass", label: "Present Class", type: "text" },
              { name: "age", label: "Age", type: "number" },
              { name: "aadharCardNumber", label: "Aadhar Card Number", type: "text" },
              { name: "address", label: "Address", type: "textarea" },
              { name: "parentEmailAddress", label: "Parent Email", type: "email" },
              { name: "parentPhoneNumber", label: "Parent Phone", type: "tel" },
              { name: "dateOfBirth", label: "Date of Birth", type: "date" },
              { name: "nationality", label: "Nationality", type: "text" },
              { name: "religion", label: "Religion", type: "text" },
              { name: "MotherTongue", label: "Mother Tongue", type: "text" },
            ].map(({ name, label, type }) => (
              <div className="student-form__group" key={name}>
                {type === "textarea" ? (
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
                {errors[name] && <span className="error-message">{errors[name]}</span>}
              </div>
            ))}

            <div className="student-form__group">
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
              {errors.gender && <span className="error-message">{errors.gender}</span>}
            </div>

            <div className="student-form__group">
              <input
                type="file"
                name="image"
                onChange={handleChange}
              />
              <label>Student Image</label>
              {errors.image && <span className="error-message">{errors.image}</span>}
              {existingStudent?.image && !(student.image instanceof File) && (
                <p className="student-form__current-image">Current: {existingStudent.image}</p>
              )}
            </div>

            <div className="student-form__actions">
              <button type="submit" className="student-form__submit">
                {existingStudent ? 'Update Student' : 'Add Student'}
              </button>
              {onClose && (
                <button type="button" className="student-form__cancel" onClick={onClose}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default NewStdt;
