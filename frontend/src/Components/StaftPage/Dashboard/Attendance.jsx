import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Attendance = () => {
  const location = useLocation();
  const staffdata = location.state?.staffdata;
  const teacherName = staffdata?.teacherName || "";
  const [classteacher, setClassTeacher] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substr(0, 10));

  // Fetch class assigned to teacher
  const getClassTeacher = async () => {
    try {
      const response = await fetch(`http://localhost:4000/admin/classTeacher/${teacherName}`);
      const data = await response.json();
      setClassTeacher(data);
    } catch (error) {
      console.error("Error fetching class teacher:", error);
    }
  };

  // Fetch students of that class
  const getStudents = async (classNumber) => {
    console.log("this is class number", classNumber);
    try {
      const response = await fetch(`http://localhost:4000/admin/students/${classNumber}`);
      const data = await response.json();
      setStudentData(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
console.log("student",studentData)
console.log("classteacher",classteacher)
console.log("attendance",attendanceRecords)
  
const getAttendance = async (classNumber) => {
  console.log(classNumber)
  try {
    const response = await fetch(`http://localhost:4000/admin/attendance/classAttendance/${classNumber}`);
    const data = await response.json();
    setAttendanceRecords(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    setAttendanceRecords([]); // fallback to empty array on error
  }
};

  // Load class teacher on mount
  useEffect(() => {
    getClassTeacher();
  }, []);

  // When class teacher data is available, fetch students and attendance
  useEffect(() => {
    if (classteacher.length > 0 && classteacher[0].classNumber) {
      const classNumber = classteacher[0].classNumber;
      console.log("this is",classNumber)
      getStudents(classNumber);
      
    }
  }, [classteacher]);
  useEffect(()=>{
    if(classteacher.length>0&&classteacher[0].classNumber){
      const classNumber = classteacher[0].classNumber;
      getAttendance(classNumber);
      console.log("this line okey")
    }
  },[classteacher])

  // Create Attendance
  const handleMarkAttendance = async (rollNumber, status) => {
    const body = {
      rollNumber,
      date: selectedDate,
      status,
      classNumber: classteacher[0].classNumber
    };

    const response = await fetch(`http://localhost:4000/admin/attendance`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      getAttendance(classteacher[0].classNumber);
    }
  };

  // Update Attendance
  const handleUpdateAttendance = async (id, newStatus) => {
    const response = await fetch(`http://localhost:4000/admin/attendance/${id}`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });

    if (response.ok) {
      getAttendance(classteacher[0].classNumber);
    }
  };

  // Delete Attendance
  const handleDeleteAttendance = async (id) => {
    const response = await fetch(`http://localhost:4000/admin/attendance/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      getAttendance(classteacher[0].classNumber);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Attendance Management</h2>

      <div>
        <label>Select Date:&nbsp;</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <h3>Students</h3>
      {studentData.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <ul>
          {studentData.map(student => (
            <li key={student._id}>
              {student.rollNumber} - {student.StudentName || student.name}
              &nbsp;
              <button onClick={() => handleMarkAttendance(student.rollNumber, "Present")}>Present</button>
              <button onClick={() => handleMarkAttendance(student.rollNumber, "Absent")}>Absent</button>
            </li>
          ))}
        </ul>
      )}

      <h3>Attendance Records for {selectedDate}</h3>
      <ul>
        {attendanceRecords.filter(record => record.date?.substr(0, 10) === selectedDate)
          .map(record => (
            <li key={record._id}>
              {record.rollNumber} | {record.date?.substr(0, 10)} | {record.status}
              &nbsp;
              <button onClick={() => handleUpdateAttendance(record._id, record.status === "Present" ? "Absent" : "Present")}>
                Toggle Status
              </button>
              <button onClick={() => handleDeleteAttendance(record._id)}>Delete</button>
            </li>
          ))
        }
        {attendanceRecords.filter(record => record.date?.substr(0, 10) === selectedDate).length === 0 && (
          <p>No attendance records found for this date.</p>
        )}
      </ul>
    </div>
  );
};

export default Attendance;
