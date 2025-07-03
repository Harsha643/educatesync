import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../DashboardStyles/Timetable.css";

const Timetable = () => {
  const baseUrl = "https://educatesync.onrender.com";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const staff = location.state?.staffdata;
  const [staffData, setStaffData] = useState({});

  useEffect(() => {
    setStaffData(staff);
  }, [staff]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/admin/timetable`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching timetable:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="timetable-wrapper">
      <h1 className="timetable-title">Time Table</h1>

      {loading ? (
        <div className="loading-spinner">Loading timetable...</div>
      ) : (
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
      )}
    </div>
  );
};

export default Timetable;
