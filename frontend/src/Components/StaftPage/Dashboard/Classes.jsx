import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../DashboardStyles/Classes.css';
import Header from './Header'; // Adjust path if needed

const Classes = () => {
    const location = useLocation();
    const staffdata = location.state?.staffdata;

    const [classes, setClasses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [formData, setFormData] = useState({
        class: '',
        subject: '',
        topic: '',
        date: '',
        teacher: ''
    });

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await fetch('http://localhost:4000/staff/class');
            const data = await response.json();
            setClasses(data);
        } catch (error) {
            console.error('Error fetching classes:', error);
            toast.error('Failed to fetch class data');
        }
    };

    const openNewClassModal = () => {
        setSelectedClass(null);
        setFormData({
            class: '',
            subject: '',
            topic: '',
            date: '',
            teacher: staffdata?.teacherName || '',
        });
        setShowModal(true);
    };

    const handleEdit = (classItem) => {
        setSelectedClass(classItem);
        setFormData({
            class: classItem.class,
            subject: classItem.subject,
            topic: classItem.topic,
            date: new Date(classItem.date).toISOString().split('T')[0],
            notes: classItem.notes || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:4000/staff/class/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setClasses(prev => prev.filter(item => item._id !== id));
                toast.success('Class deleted successfully');
            } else {
                toast.error('Failed to delete class');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Error occurred while deleting');
        }
    };

    const handleSave = async () => {
        const url = selectedClass
            ? `http://localhost:4000/staff/class/${selectedClass._id}`
            : 'http://localhost:4000/staff/class';

        const method = selectedClass ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                fetchClasses();
                setShowModal(false);
                toast.success(selectedClass ? "Class updated successfully" : "Class added successfully");
            } else {
                toast.error("Failed to save class");
            }
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Error occurred while saving");
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />

            {/* {staffdata && <Header staffdata={staffdata} />} */}

            <button className="add-class-btn" onClick={openNewClassModal}>Add New Class</button>
            <div className="table-wrapper">
                <table className="classes-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Class</th>
                            <th>Subject</th>
                            <th>Topic</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.map((classItem, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{classItem.class}</td>
                                <td>{classItem.subject}</td>
                                <td>{classItem.topic}</td>
                                <td>{new Date(classItem.date).toLocaleDateString()}</td>
                                <td>
                                    <button onClick={() => handleEdit(classItem)}>Edit</button>
                                    <button onClick={() => handleDelete(classItem._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div >

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{selectedClass ? 'Edit Class' : 'Add New Class'}</h2>

                        <label>Class:</label>
                        <input type="text" name="class" value={formData.class} onChange={handleChange} />

                        <label>Subject:</label>
                        <input type="text" name="subject" value={formData.subject} onChange={handleChange} />

                        <label>Topic:</label>
                        <input type="text" name="topic" value={formData.topic} onChange={handleChange} />

                        <label>Date:</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} />

                        <div className="modal-actions">
                            <button onClick={handleSave}>{selectedClass ? "Update" : "Add"}</button>
                            <button onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Classes;
