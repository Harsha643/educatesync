import React, { useState, useEffect } from "react";
import "./staffdata.css";
import Newstaff from "../Newstaft/Newstaff";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StaffDataFetching = () => {
  const [staffData, setStaffData] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:4000/admin/staff');
      const data = await response.json();
      setStaffData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error("Failed to fetch staff data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4000/admin/staff/${id._id}`, { method: 'DELETE' });
      toast.success("Staff deleted successfully");
      fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Failed to delete staff");
    }
  };

  const handleUpdate = (staff) => {
    setSelectedStaff(staff);
    setShowModal(true);
  };

  const handleAddNewStaff = () => {
    setSelectedStaff(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedStaff(null);
    setShowModal(false);
    fetchData();
  };

  return (
    <div className="staffdata">
      <ToastContainer position="top-center" autoClose={3000} />
      <h1>Staff Data</h1>
      <button className="add-btn" onClick={handleAddNewStaff}>Add New Staff</button>

      {showModal && (
        <Newstaff 
          existingStaff={selectedStaff} 
          onClose={closeModal} 
          refreshData={fetchData} 
        />
      )}

      <div className="table-scroll-container">
        <table>
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Teacher Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Image</th>
              <th>Gender</th>
              <th>Aadhar Number</th>
              <th>Phone Number</th>
              <th>Designation</th>
              <th>Experience</th>
              <th>Date of Joining</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {staffData.map((staff) => (
              <tr key={staff.staffId}>
                <td>{staff.staffId}</td>
                <td>{staff.teacherName}</td>
                <td>{staff.email}</td>
                <td>{staff.address}</td>
                <td>
                  <img src={staff.image} alt="Staff" width="100px" />
                </td>
                <td>{staff.gender}</td>
                <td>{staff.aadharNumber}</td>
                <td>{staff.phoneNumber}</td>
                <td>{staff.designation}</td>
                <td>{staff.exprerence}</td>
                <td>{staff.dateOfJoining}</td>
                <td>
                  <button className="update-btn" onClick={() => handleUpdate(staff)}>Update</button>
                  <button className="delete-btn" onClick={() => handleDelete(staff)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffDataFetching;
