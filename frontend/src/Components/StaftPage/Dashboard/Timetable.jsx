import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../DashboardStyles/Timetable.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Timetable = () => {
    const [data, setData] = useState([]);
    const location = useLocation();
    const staff = location.state?.staffdata;
    const [staffData, setStaffData] = useState({});

    useEffect(() => {
        setStaffData(staff);
    }, [staff]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:4000/admin/timetable");
                const result = await response.json();
                setData(result);
                toast.success("Timetable loaded successfully");
            } catch (error) {
                console.error("Error fetching timetable:", error);
                toast.error("Failed to load timetable");
            }
        };
        fetchData();
    }, []);

    return (
        <div className="timetable-wrapper">
            <h1 className="timetable-title">Time Table</h1>
            <div className="timetable-scroll">
                <table className="timetable-table">
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>Schedule (Mon - Sat)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((classItem, classIndex) => (
                            <React.Fragment key={classIndex}>
                                <tr className="class-row">
                                    <td className="class-name">{classItem.className}</td>
                                    <td>
                                        <div className="schedule-grid">
                                            {classItem.schedule.map((item, index) => {
                                                const isCurrentTeacher =
                                                    item.teacher?.toLowerCase() ===
                                                    staffData?.teacherName?.toLowerCase();
                                                return (
                                                    <div
                                                        key={index}
                                                        className={`schedule-item ${isCurrentTeacher ? "highlight" : ""}`}
                                                    >
                                                        <div className="subject">{item.subject}</div>
                                                        <div className="time">{item.time}</div>
                                                        <div className="teacher">{item.teacher}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Toast container */}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Timetable;
