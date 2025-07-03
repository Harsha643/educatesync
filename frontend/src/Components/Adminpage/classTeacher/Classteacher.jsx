import React, { useEffect, useState } from "react";
import "./ClassTeacher.css";

const ClassTeacher = () => {
  const [classTeachers, setClassTeachers] = useState([]);
  const [form, setForm] = useState({ classNumber: "", teacherName: "" });
  const [editingClass, setEditingClass] = useState(null);
  const [teachers, setTeacherdata] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const baseUrl = "https://educatesync.onrender.com" || "http://localhost:4000";
  const BASE_URL = `${baseUrl}/admin/classteacher`;

  const getTeachers = async () => {
    const res = await fetch(`${baseUrl}/admin/staff`);
    const data = await res.json();
    setTeacherdata(data);
  };

  const fetchClassTeachers = async () => {
    try {
      setLoading(true);
      const res = await fetch(BASE_URL);
      const data = await res.json();
      setClassTeachers(data);
    } catch (err) {
      alert("Error fetching class teachers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassTeachers();
    getTeachers();
  }, []);

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

  const handleEdit = (classNumber) => {
    const ct = classTeachers.find((c) => c.classNumber === classNumber);
    setForm({ classNumber: ct.classNumber, teacherName: ct.teacherName });
    setEditingClass(classNumber);
  };

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

  // Pagination Logic
  const totalPages = Math.ceil(classTeachers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTeachers = classTeachers.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

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

      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="class-teacher-table">
              <thead>
                <tr>
                  <th>Class Number</th>
                  <th>Teacher Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTeachers.map((ct) => (
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

          <div className="pagination">
            <button onClick={handlePrev} disabled={currentPage === 1}>⬅ Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={handleNext} disabled={currentPage === totalPages}>Next ➡</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ClassTeacher;
