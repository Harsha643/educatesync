import React, { useState, useEffect } from "react";
import "./staffdata.css";
import Newstaff from "../Newstaft/Newstaff";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StaffDataFetching = () => {
  const baseUrl = "https://educatesync.onrender.com";

  const [staffData, setStaffData] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/admin/staff`);
      const data = await response.json();
      setStaffData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch staff data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`${baseUrl}/admin/staff/${id._id}`, { method: "DELETE" });
      toast.success("Staff deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Delete error:", error);
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

  // Filter staff by search term
  const filteredStaff = staffData.filter((staff) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      (staff.teacherName && staff.teacherName.toLowerCase().includes(lowerSearch)) ||
      (staff.email && staff.email.toLowerCase().includes(lowerSearch)) ||
      (staff.staffId && staff.staffId.toLowerCase().includes(lowerSearch))
    );
  });

  return (
    <div className="staffdata">
      <ToastContainer position="top-center" autoClose={3000} />
      <h1>Staff Data</h1>

      <div className="header-actions">
        <input
          type="text"
          placeholder="Search by Name, Email or ID"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="add-btn" onClick={handleAddNewStaff}>
          Add New Staff
        </button>
      </div>

      {showModal && (
        <Newstaff
          existingStaff={selectedStaff}
          onClose={closeModal}
          refreshData={fetchData}
        />
      )}

      {loading ? (
        <div className="loading-spinner">Loading staff data...</div>
      ) : (
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
              {filteredStaff.length > 0 ? (
                filteredStaff.map((staff) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan="12" style={{ textAlign: "center", padding: "20px" }}>
                    No staff found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffDataFetching;
