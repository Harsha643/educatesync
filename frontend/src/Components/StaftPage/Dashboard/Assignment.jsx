import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../DashboardStyles/Assignment.css';

Modal.setAppElement('#root'); // Accessibility

const Assignment = () => {
    const [assignments, setAssignments] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const location = useLocation();
    const staff = location.state?.staffdata;
    const [staffdata, setStaffdata] = useState({});
    const [form, setForm] = useState({
        classNumber: '',
        subject: '',
        topic: '',
        link: '',
        teacher: '',
        dueDate: '',
        description: ''
    });

    useEffect(() => {
        if (staff) {
            setStaffdata(staff);
            setForm((prev) => ({ ...prev, teacher: staff.teacherName }));
        }
    }, [staff]);

    const fetchAssignment = async () => {
        try {
            const response = await fetch('http://localhost:4000/staff/assignments');
            const data = await response.json();
            setAssignments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Fetch failed:', error);
            toast.error('Failed to fetch assignments');
            setAssignments([]);
        }
    };

    useEffect(() => {
        fetchAssignment();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.classNumber || !form.subject || !form.topic || !form.link || !form.teacher || !form.dueDate || !form.description) {
            toast.error('Please fill all fields');
            return;
        }

        try {
            if (editIndex !== null) {
                const id = assignments[editIndex]._id;
                await fetch(`http://localhost:4000/staff/assignments/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form),
                });
                toast.success('Assignment updated successfully!');
            } else {
                await fetch('http://localhost:4000/staff/assignments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form),
                });
                toast.success('Assignment added successfully!');
            }

            setModalIsOpen(false);
            setForm({
                classNumber: '',
                subject: '',
                topic: '',
                link: '',
                teacher: staffdata?.teacherName || '',
                dueDate: '',
                description: ''
            });
            setEditIndex(null);
            fetchAssignment();
        } catch (err) {
            console.error('Submit failed', err);
            toast.error('Operation failed');
        }
    };

    const handleEdit = (index) => {
        const item = assignments[index];
        setForm({
            classNumber: item.classNumber,
            subject: item.subject,
            topic: item.topic,
            link: item.link,
            teacher: item.teacher,
            dueDate: item.dueDate,
            description: item.description
        });
        setEditIndex(index);
        setModalIsOpen(true);
    };

    return (
        <div className="assignment-container">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="assignment-header">
                <h2 className="assignment-heading">Assignments</h2>
                <button className="add-assignment-button" onClick={() => setModalIsOpen(true)}>+ Add Assignment</button>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => {
                    setModalIsOpen(false);
                    setForm({
                        classNumber: '',
                        subject: '',
                        topic: '',
                        link: '',
                        teacher: staffdata?.teacherName || '',
                        dueDate: '',
                        description: ''
                    });
                    setEditIndex(null);
                }}
                contentLabel="Assignment Modal"
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <h2>{editIndex !== null ? 'Edit Assignment' : 'Add New Assignment'}</h2>
                <form onSubmit={handleSubmit}>
                    <input name="classNumber" placeholder="Class" value={form.classNumber} onChange={handleChange} required />
                    <input name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} required />
                    <input name="topic" placeholder="Topic" value={form.topic} onChange={handleChange} required />
                    <input name="link" placeholder="Assignment Link" value={form.link} onChange={handleChange} required />
                    <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} required />
                    <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
                    <button type="submit">{editIndex !== null ? 'Update' : 'Add'}</button>
                    <button type="button" onClick={() => setModalIsOpen(false)}>Cancel</button>
                </form>
            </Modal>

            <div className="table-responsive">
                <table className="assignment-table" cellSpacing="0" cellPadding="5" border="1">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Class</th>
                            <th>Subject</th>
                            <th>Topic</th>
                            <th>Due Date</th>
                            <th>Link</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.map((item, index) => (
                            <tr key={item._id}>
                                <td>{index + 1}</td>
                                <td>{item.classNumber}</td>
                                <td>{item.subject}</td>
                                <td>{item.topic}</td>
                                <td>{item.dueDate}</td>
                                <td><a href={item.link} target="_blank" rel="noreferrer">Open</a></td>
                                <td>
                                    <button onClick={() => handleEdit(index)}>Edit</button>
                                    {/* <button onClick={() => handleDelete(item._id)}>Delete</button> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Assignment;
