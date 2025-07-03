import React, { useState, useEffect } from "react";
import "./FeeManagement.css"; 

const FeeManagement = () => {
    const [students, setStudents] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editedFees, setEditedFees] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const baseUrl = "https://educatesync.onrender.com" || "http://localhost:4000";

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = () => {
        fetch(`${baseUrl}/admin/students`)
            .then((res) => res.json())
            .then(setStudents)
            .catch((err) => console.error("Error fetching students:", err));
    };

    const handleEditClick = (id, fees) => {
        setEditingId(id);
        setEditedFees({ ...fees });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedFees((prev) => ({ ...prev, [name]: Number(value) }));
    };

    const handleSave = (id) => {
        const total =
            (editedFees.tuition ?? 0) +
            (editedFees.transport ?? 0) +
            (editedFees.lab ?? 0);
        const updatedFees = { ...editedFees, total };

        fetch(`${baseUrl}/admin/students/${id}/fees`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFees),
        })
            .then(() => {
                fetchStudents(); 
                setEditingId(null); 
            })
            .catch((err) => console.error("Error updating fees:", err));
    };

    // Pagination logic
    const totalPages = Math.ceil(students.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentStudents = students.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div>
            <h1>Fee Management</h1>
            <table className="fee-table" border="1" cellPadding="5">
                <thead>
                    <tr>
                        <th>Admission Number</th>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        <th>Class</th>
                        <th>Tuition</th>
                        <th>Transport</th>
                        <th>Lab</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentStudents.map((student) => {
                        const {
                            _id,
                            admissionNumber,
                            rollNumber,
                            studentName,
                            presentClass,
                            fees = {},
                        } = student;
                        const isEditing = editingId === _id;
                        const currentFees = isEditing ? editedFees : fees;
                        const total =
                            (currentFees.tuition ?? 0) +
                            (currentFees.transport ?? 0) +
                            (currentFees.lab ?? 0);

                        return (
                            <tr key={_id}>
                                <td>{admissionNumber}</td>
                                <td>{rollNumber}</td>
                                <td>{studentName}</td>
                                <td>{presentClass}</td>
                                <td>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            name="tuition"
                                            value={currentFees.tuition ?? 0}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        fees.tuition ?? 0
                                    )}
                                </td>
                                <td>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            name="transport"
                                            value={currentFees.transport ?? 0}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        fees.transport ?? 0
                                    )}
                                </td>
                                <td>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            name="lab"
                                            value={currentFees.lab ?? 0}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        fees.lab ?? 0
                                    )}
                                </td>
                                <td>{total}</td>
                                <td>{total === 0 ? "Paid" : "Unpaid"}</td>
                                <td>
                                    {isEditing ? (
                                        <>
                                            <button onClick={() => handleSave(_id)}>Save</button>
                                            <button onClick={() => setEditingId(null)}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEditClick(_id, fees)}>Edit</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination-controls">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    ⬅ Prev
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                >
                    Next ➡
                </button>
            </div>
        </div>
    );
};

export default FeeManagement;
