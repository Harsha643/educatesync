import React, { useState, useEffect } from "react";
import "./Assign.css";

const Assign = () => {
  const [className, setClassName] = useState("Class 8");
  const [day, setDay] = useState("All days");
  const [schedule, setSchedule] = useState([]);
  const [newEntry, setNewEntry] = useState({ subject: "", time: "", teacher: "" });
  const [staff, setStaff] = useState([]);
  const [teacher, setTeacher] = useState("");

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const response = await fetch(`http://localhost:4000/admin/timetable/${className}/${day}`);
        if (!response.ok) throw new Error("Not found");
        const data = await response.json();
        setSchedule(data.schedule || []);
      } catch (err) {
        console.error("Error fetching timetable:", err);
        setSchedule([]);
      }
    };

    const fetchStaff = async () => {
      try {
        const res = await fetch(`http://localhost:4000/admin/staff/${newEntry.subject}`);
        const data = await res.json();
        setStaff(data);
      } catch (err) {
        console.error("Error fetching staff:", err);
      }
    };

    fetchTimetable();
    fetchStaff();
  }, [className, day]);

  const handleEntryChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };
  

  const handleAddEntry = async (e) => {
    e.preventDefault();
    const updatedSchedule = [newEntry];

    const payload = {
      className,
      day,
      teacher,
      schedule: updatedSchedule,
    };

    try {
      const response = await fetch("http://localhost:4000/admin/timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
            // console.error(data);
  throw new Error('Failed to save');
}

      setSchedule((prev) => [...prev, ...updatedSchedule]);
      setNewEntry({ subject: "", time: "", teacher: "" });
    } catch (error) {
      console.error("Error adding entry:", error);
    }
  };















  const handleDelete = async (scheduleItemId) => {
    try {
      const res = await fetch(`http://localhost:4000/admin/timetable/${className}/${day}`);
      if (!res.ok) throw new Error("Failed to fetch timetable");

      const data = await res.json();
      const timetableId = data._id;

      const deleteRes = await fetch(
        `http://localhost:4000/admin/timetable/${timetableId}/${scheduleItemId}`,
        {
          method: "DELETE",
        }
      );

      if (!deleteRes.ok) throw new Error("Failed to delete");

      setSchedule((prev) => prev.filter((item) => item._id !== scheduleItemId));
      alert("Schedule item deleted successfully");
    } catch (err) {
      console.error("Error deleting schedule item:", err);
      alert("Failed to delete schedule item");
    }
  };

  const   filteredTeachers = staff.filter(
    (teacher) => teacher.designation && teacher.designation.toLowerCase() === newEntry.subject.toLowerCase()
  );
  console.log(newEntry.subject, "Filtered Teachers:", filteredTeachers);
  console.log("Filtered Teachers:", staff);
  return (
    <div className="assign-container">
      <h2>Timetable Manager</h2>

      <div className="select-group">
        <select value={className} onChange={(e) => setClassName(e.target.value)}>
          {[...Array(10)].map((_, i) => (
            <option key={i} value={`Class ${i + 1}`}>{`Class ${i + 1}`}</option>
          ))}
        </select>

        <select value={day} onChange={(e) => setDay(e.target.value)}>
          <option>All days</option>
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
          <option>Friday</option>
          <option>Saturday</option>
        </select>
      </div>

      <form onSubmit={handleAddEntry} className="form-group">
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={newEntry.subject}
          onChange={handleEntryChange}
          required
        />
        <input
          type="text"
          name="time"
          placeholder="Time (e.g., 9:00 - 9:45)"
          value={newEntry.time}
          onChange={handleEntryChange}
          required
        />
        <select
  name="teacher"
  value={newEntry.teacher}
  onChange={handleEntryChange}
  required
>
  <option value="">Select Teacher</option>
  <option value="prayer">Prayer</option>
  <option value="lunch">Lunch</option>
  <option value="interval">Interval</option>
  
  {filteredTeachers.map((teacher) => (
    <option key={teacher._id} value={teacher.teacherName}>
      {teacher.teacherName}
    </option>
  ))}
</select>
        <button type="submit">Add</button>
      </form>

      <ul className="schedule-list">
        {schedule.length === 0 ? (
          <p>No schedule for {day}</p>
        ) : (
          schedule.map((item, index) => (
            <li key={index}>
              <span>
                {item.time} - {item.subject} ({item.teacher})
              </span>
              <button onClick={() => handleDelete(item._id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Assign;
