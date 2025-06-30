import React, { useEffect, useState } from "react";
import "./ClassTeacher.css";

const ClassTeacher = () => {
  const [classTeachers, setClassTeachers] = useState([]);
  const [form, setForm] = useState({ classNumber: "", teacherName: "" });
  const [editingClass, setEditingClass] = useState(null);
  const [teachers,setTeacherdata]=useState([])

  const BASE_URL = "http://localhost:4000/admin/classteacher";

  const getTeachers=async ()=>{
    const res=await fetch(`http://localhost:4000/admin/staff`)
    const data=await res.json()
    setTeacherdata(data)
    }
  


  // Fetch all class teachers
  const fetchClassTeachers = async () => {
    try {
      const res = await fetch(BASE_URL);
      const data = await res.json();
      setClassTeachers(data);
    } catch (err) {
      alert("Error fetching class teachers");
    }
  };

  useEffect(() => {
    fetchClassTeachers();
    getTeachers()
  }, []);
console.log(teachers)

  // Create or update a class teacher
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingClass ? "PUT" : "POST";
      const url = editingClass ? `${BASE_URL}/${editingClass}` : BASE_URL;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Request failed");

      setForm({ classNumber: "", teacherName: "" });
      setEditingClass(null);
      await fetchClassTeachers();
    } catch (err) {
      alert("Error saving class teacher");
    }
  };

  // Populate form for editing
  const handleEdit = (classNumber) => {
    const ct = classTeachers.find((c) => c.classNumber === classNumber);
    setForm({ classNumber: ct.classNumber, teacherName: ct.teacherName });
    setEditingClass(classNumber);
  };

  // Delete a class teacher
  const handleDelete = async (classNumber) => {
    try {
      const res = await fetch(`${BASE_URL}/${classNumber}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      await fetchClassTeachers();
    } catch (err) {
      alert("Error deleting class teacher");
    }
  };
  console.log("93",teachers)
  return (
    <div className="container">
      <h2>Class Teacher Management</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Class Number"
          value={form.classNumber}
          onChange={(e) => setForm({ ...form, classNumber: e.target.value })}
          required
        />
        <select
    value={form.teacherName}
    onChange={(e) => setForm({ ...form, teacherName: e.target.value })}
    className="teacher-dropdown"
  required
>
  <option value="" disabled>Select a teacher</option>
  {teachers.map((teacher, index) => (

    <option key={index} value={teacher.teacherName}>
      {teacher.teacherName}
    </option>
  ))}
</select>
        <button type="submit">{editingClass ? "Update" : "Add"} Teacher</button>
        {editingClass && (
          <button
            type="button"
            onClick={() => {
              setForm({ classNumber: "", teacherName: "" });
              setEditingClass(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <table className="class-teacher-table">
        <thead>
          <tr>
            <th>Class Number</th>
            <th>Teacher Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classTeachers.map((ct) => (
            <tr key={ct.classNumber}>
              <td>{ct.classNumber}</td>
              <td>{ct.teacherName}</td>
              <td className="button-container">
                <button onClick={() => handleEdit(ct.classNumber)}>Edit</button>
                <button onClick={() => handleDelete(ct.classNumber)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassTeacher;
