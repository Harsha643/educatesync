import React, { useState, useEffect } from "react";
import "./Timetable.css";

const Timetable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const baseUrl = "https://educatesync.onrender.com";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Show loading before fetch
      try {
        const response = await fetch(`${baseUrl}/admin/timetable`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching timetable:", error);
      } finally {
        setLoading(false); // Hide loading after fetch
      }
    };
    fetchData();
  }, []);

  return (
    <div className="timetable-container">
      <h1>Time Table</h1>

      {loading ? (
        <div className="loading-spinner">Loading timetable...</div>
      ) : (
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
      )}
    </div>
  );
};

export default Timetable;
