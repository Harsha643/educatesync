import React, { useState, useEffect } from "react";
import "../DashboardStyles/Attendance.css";

const Attendance = ({ rollNumber }) => {
    const [attendance, setAttendance] = useState([]);
    const [filteredAttendance, setFilteredAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAttendance = async () => {
        try {
            const response = await fetch('https://educatesync.onrender.com/admin/attendance');
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            const data = await response.json();
            setAttendance(data);
        } catch (err) {
            console.error("Error fetching attendance:", err);
        } finally {
            // Simulate 2-second delay
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
    };

    useEffect(() => {
        getAttendance();
    }, []);

    useEffect(() => {
        if (attendance.length > 0 && rollNumber) {
            const filtered = attendance.filter(item => item.rollNumber === rollNumber);
            setFilteredAttendance(filtered);
        } else {
            setFilteredAttendance([]);
        }
    }, [attendance, rollNumber]);
    console.log("attendance",filteredAttendance)

    return (
        <div className="attendance-wrapper">
            <h1>Attendance</h1>

            {loading ? (
                <div className="spinner-overlay">
                    <div className="spinner" />
                </div>
            ) : (
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAttendance.length > 0 ? (
                                filteredAttendance.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{new Date(item.date).toISOString().split("T")[0]}</td>
                                        <td>{item.status}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">No attendance records found for this student.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Attendance;
