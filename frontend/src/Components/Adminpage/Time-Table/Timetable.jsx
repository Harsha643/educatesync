import React, { useState, useEffect } from "react";
import "./Timetable.css";

const Timetable = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:4000/admin/timetable');
                const data = await response.json();
                setData(data);
            } catch (error) {
                console.error('Error fetching timetable:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="timetable-container">
            <h1>Time Table</h1>
            <table className="timetable" cellSpacing="0" cellPadding="5" border="1">
                <thead>
                    <tr>
                        <th>Class</th>
                        <th>Subject and Time</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((classItem, classIndex) => (
                        <React.Fragment key={classIndex}>
                            <tr className="class-header">
                                <td>{classItem.className}</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Monday-Saturday</td>
                                <td className="subject-time-container">
                                    <div className="subject-time-grid">
                                        {classItem.schedule.map((item, itemIndex) => (
                                            <div key={itemIndex} className="subject-time-item">
                                                <div className="subject">{item.subject}</div>
                                                <div className="time">{item.time}</div>
                                                <div className="teacher">{item.teacher}</div>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Timetable;