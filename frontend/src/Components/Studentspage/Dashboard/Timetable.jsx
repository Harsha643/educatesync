import React, { useEffect, useState } from "react";
import "../DashboardStyles/Timetable.css";

const Timetable = ({ classData }) => {
  const [timetable, setTimetable] = useState([]);
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTimetable() {
      try {
        const response = await fetch("http://localhost:4000/admin/timetable");
        if (!response.ok) {
          throw new Error("Failed to fetch timetable");
        }
        const data = await response.json();
        setTimetable(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching timetable:", err);
      } finally {
        setTimeout(() => setLoading(false), 2000); // 2-second spinner delay
      }
    }

    fetchTimetable();
  }, []);

  useEffect(() => {
    if (timetable.length > 0 && classData) {
      const foundClass = timetable.find(
        (item) => Number(item.className.split(" ").pop()) === classData
      );
      if (foundClass) {
        setFilteredSchedule(foundClass.schedule);
      } else {
        setFilteredSchedule([]);
      }
    }
  }, [timetable, classData]);

  if (loading) return (
    <div className="spinner-wrapper">
      <div className="spinner"></div>
    </div>
  );
  if (error) return <div className="error">Error: {error}</div>;
  if (!timetable || timetable.length === 0)
    return <div className="no-data">No timetable data available</div>;
  if (!classData)
    return <div className="no-class">Please select a class to view timetable</div>;
  if (filteredSchedule.length === 0)
    return <div className="no-schedule">No schedule available for Class {classData}</div>;

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const secondary = [
    "9:00-9:45", "9:45-10:30", "10:30-11:15", "11:15-11:30",
    "11:30-12:15", "12:15-1:00", "1:00-1:45", "1:45-2:30",
    "2:30-3:15", "3:15-3:30", "3:30-4:15", "4:15-5:00"
  ];
  const primary = [
    "9:00-9:45", "9:45 - 10:30", "10:30-11:15", "11:15-11:30",
    "11:30-12:15", "12:15-1:00", "1:00-1:45", "1:45-2:30",
    "2:30-2:45", "2:45 - 3:30", "3:30 - 4:15"
  ];

  const isPrimaryClass = [1, 2, 3, 4, 5].includes(classData);
  const currentClassTime = isPrimaryClass ? primary : secondary;

  return (
    <div className="timetable-container">
      <h2>Class {classData} Timetable</h2>
      <div className="timetable-table">
        <table cellPadding="0px" border="2" cellSpacing="0">
          <thead>
            <tr>
              <th>Day\Time</th>
              {currentClassTime.map((time, index) => (
                <th key={time + index}>{time}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day, index) => (
              <tr key={index + 1}>
                <td>{day}</td>
                {currentClassTime.map((timeSlot, timeIndex) => {
                  const scheduleEntry = filteredSchedule.find(
                    item => item.time === timeSlot
                  );
                  return (
                    <td key={`${day}-${timeSlot}`}>
                      {scheduleEntry ? scheduleEntry.subject : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timetable;
