import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './Newstaff.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Newstaff = ({ existingStaff, onClose, refreshData }) => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState({
    teacherName: '',
    gender: '',
    email: '',
    phoneNumber: '',
    address: '',
    image: null,
    aadharNumber: '',
    designation: '',
    exprerence: '',
    dateOfJoining: ''
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (existingStaff) {
      const formattedDate = existingStaff.dateOfJoining?.split('T')[0] || '';
      setStaff(prev => ({
        ...prev,
        ...existingStaff,
        dateOfJoining: formattedDate
      }));
      if (existingStaff.image) {
        setImagePreview(existingStaff.image);
      }
    } else {
      setStaff({
        teacherName: '',
        gender: '',
        email: '',
        phoneNumber: '',
        address: '',
        image: null,
        aadharNumber: '',
        designation: '',
        exprerence: '',
        dateOfJoining: ''
      });
      setImagePreview(null);
    }
  }, [existingStaff]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const selectedFile = files[0];
      setStaff({ ...staff, [name]: selectedFile });
      if (selectedFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setImagePreview(null);
      }
    } else {
      setStaff({ ...staff, [name]: value });
    }
  };

  const handleCancel = () => {
    navigate("/Admin");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/admin/staff");
      const allStaff = await res.json();

      const isDuplicate = allStaff.some(
        (s) =>
          s.aadharNumber === staff.aadharNumber &&
          (!existingStaff || s._id !== existingStaff._id)
      );

      if (isDuplicate) {
        toast.error("This Aadhar number already exists.");
        return;
      }

      const formData = new FormData();
      for (const key in staff) {
        if (staff[key] !== null) {
          formData.append(key, staff[key]);
        }
      }

      const url = existingStaff
        ? `http://localhost:4000/admin/staff/${existingStaff.staffId}`
        : 'http://localhost:4000/admin/staff';

      const method = existingStaff ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success(existingStaff ? "Staff updated successfully!" : "Staff added successfully!");

      if (refreshData) refreshData();
      if (onClose) onClose();
    } catch (error) {
      console.error("Error saving staff:", error);
      toast.error("Error saving staff. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="modal-overlay">
        <div className='form-container'>
          <div className="modal-header">
            <h2 className="form-title">{existingStaff ? 'Update Staff' : 'Add New Staff'}</h2>
            <button className="close-button" onClick={onClose}>{existingStaff ? 'X' : 'X'}</button>
          </div>

          <form onSubmit={handleSubmit} >
            <div className="form-grid">
              {[{
                label: "Teacher Name", name: "teacherName", type: "text"
              }, {
                label: "Email", name: "email", type: "email"
              }, {
                label: "Phone Number", name: "phoneNumber", type: "text"
              }, {
                label: "Address", name: "address", type: "text"
              }, {
                label: "Aadhar Card Number", name: "aadharNumber", type: "number"
              }, {
                label: "Designation", name: "designation", type: "text"
              }, {
                label: "Experience (years)", name: "exprerence", type: "number"
              }, {
                label: "Date of Joining", name: "dateOfJoining", type: "date"
              }].map(({ label, name, type }) => (
                <div className="input-group" key={name}>
                  <input
                    type={type}
                    name={name}
                    value={staff[name]}
                    onChange={handleChange}
                    placeholder=" "
                    required
                  />
                  <label>{label}</label>
                </div>
              ))}

              <div className="input-group">
                <select name="gender" value={staff.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <label>Gender</label>
              </div>

              <div className="input-group image-upload">
                <input type="file" name="image" onChange={handleChange} accept="image/*" />
                <label>Staff Photo</label>
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">
                {existingStaff ? 'Update Staff' : 'Add Staff'}
              </button>
              <button type="button" className="cancel-button" onClick={existingStaff ? onClose : handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Newstaff;
