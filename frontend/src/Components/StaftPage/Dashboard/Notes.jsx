import React, { useState, useEffect } from "react";
import "../DashboardStyles/notes.css";
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notes = ({ staffdata }) => {
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [viewLink, setViewLink] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [Teacherdata, setTeacherdata] = useState({});
    const [selectedClass, setSelectedClass] = useState("");
    const location = useLocation();
    const staff = location.state?.staffdata;

    useEffect(() => {
        fetchNotes();
    }, []);

    useEffect(() => {
        setTeacherdata(staff);
    }, [staffdata]);

    const fetchNotes = async () => {
        try {
            const response = await fetch("http://localhost:4000/staff/notes");
            const data = await response.json();
            setNotes(data);
        } catch (error) {
            toast.error("Failed to fetch notes");
        }
    };

    const handleClassChange = (e) => {
        const classNum = e.target.value;
        setSelectedClass(classNum);
        if (classNum === "") {
            setFilteredNotes(notes);
        } else {
            const filtered = notes.filter(note => note.classNumber.toString() === classNum);
            setFilteredNotes(filtered);
        }
    };

    const handleAddNote = () => {
        setSelectedNote({
            classNumber: "",
            subject: "",
            title: "",
            link: "",
            teacherName: staffdata?.teacherName || "",
        });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleEdit = (note) => {
        setSelectedNote({ ...note });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:4000/staff/notes/${id}`, {
                method: "DELETE"
            });
            const updatedNotes = notes.filter(note => note._id !== id);
            setNotes(updatedNotes);
            setFilteredNotes(updatedNotes.filter(note => note.classNumber === selectedClass));
            toast.success("Note deleted successfully");
        } catch (error) {
            toast.error("Failed to delete note");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedNote(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const url = isEditing
                ? `http://localhost:4000/staff/notes/${selectedNote._id}`
                : `http://localhost:4000/staff/notes`;

            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedNote)
            });

            const result = await response.json();

            if (isEditing) {
                const updated = notes.map(note => note._id === result._id ? result : note);
                setNotes(updated);
                setFilteredNotes(updated.filter(note => note.classNumber.toString() === selectedClass));
                toast.success("Note updated successfully");
            } else {
                const newNotes = [...notes, result];
                setNotes(newNotes);
                setFilteredNotes(newNotes.filter(note => note.classNumber === selectedClass));
                toast.success("Note added successfully");
            }

            setShowModal(false);
            setSelectedNote(null);
        } catch (error) {
            toast.error("Failed to submit note");
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedNote(null);
    };

    const openViewModal = (link) => {
        setViewLink(link);
    };

    const closeViewModal = () => {
        setViewLink("");
    };

    return (
        <div className="notes-container">
            <div className="notes-header">
                <select className="class-select" value={selectedClass} onChange={handleClassChange}>
                    <option value="">Select Class</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((classNum) => (
                        <option key={classNum} value={classNum}>Class {classNum}</option>
                    ))}
                </select>
                <button className="add-note-button" onClick={handleAddNote}>Add Note</button>
            </div>

            {selectedClass && filteredNotes.length === 0 ? (
                <p className="no-notes-msg">This class notes are not present</p>
            ) : (
                <div className="notes-table-wrapper">
                    <table className="notes-table">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Class</th>
                                <th>Subject</th>
                                <th>Title</th>
                                <th>Link</th>
                                <th>Teacher Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredNotes.map((note, index) => (
                                <tr key={note._id}>
                                    <td>{index + 1}</td>
                                    <td>{note.classNumber}</td>
                                    <td>{note.subject}</td>
                                    <td>{note.title}</td>
                                    <td>
                                        <button className="view-button" onClick={() => openViewModal(note.link)}>View</button>
                                    </td>
                                    <td>{note.teacherName}</td>
                                    <td>
                                        <button className="edit-button" onClick={() => handleEdit(note)}>Edit</button>
                                        <button className="delete-button" onClick={() => handleDelete(note._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && selectedNote && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{isEditing ? "Edit Note" : "Add Note"}</h2>
                        <label>Class Number:</label>
                        <input name="classNumber" value={selectedNote.classNumber} onChange={handleChange} />
                        <label>Subject:</label>
                        <input name="subject" value={selectedNote.subject} onChange={handleChange} />
                        <label>Title:</label>
                        <input name="title" value={selectedNote.title} onChange={handleChange} />
                        <label>Link:</label>
                        <input name="link" value={selectedNote.link} onChange={handleChange} />
                        <label>Teacher Name:</label>
                        <input name="teacherName" value={selectedNote.teacherName} onChange={handleChange} />
                        <div style={{ marginTop: "15px" }}>
                            <button onClick={handleSubmit}>{isEditing ? "Update" : "Add"}</button>
                            <button onClick={handleCloseModal} style={{ marginLeft: "10px" }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Iframe Modal */}
            {viewLink && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: "90%", height: "90%" }}>
                        <h2>Note Viewer</h2>
                        <iframe
                            src={viewLink}
                            width="100%"
                            height="85%"
                            style={{ border: "1px solid #ccc", borderRadius: "5px" }}
                            title="Note Preview"
                        ></iframe>
                        <div style={{ textAlign: "right", marginTop: "10px" }}>
                            <button onClick={closeViewModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast container for notifications */}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Notes;
