import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../DashboardStyles/feedback.css';

const Feedback = () => {
    const [feedback, setFeedback] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [classList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const [selectRollNumber, setSelectRollNumber] = useState('');
    const location = useLocation();
    const staff = location.state?.staffdata;
    const [staffdata, setStaffdata] = useState({});
    const [studentData, setStudentData] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        studentName: '',
        rollNumber: '',
        class: '',
        teacher: '',
        feedback: ''
    });

    useEffect(() => {
        setStaffdata(staff);
    }, [staff]);

    useEffect(() => {
        async function fetchStudentsByClass() {
            if (!selectedClass) return;
            try {
                const response = await fetch(`http://localhost:4000/admin/students/${selectedClass}`);
                const data = await response.json();
                setStudentData(data);
            } catch (error) {
                console.error('Error fetching students:', error);
                toast.error('Failed to fetch students');
            }
        }
        fetchStudentsByClass();
    }, [selectedClass]);

    const openFeedbackModal = (student = null) => {
        if (student) {
            setFormData({
                studentName: student.studentName,
                rollNumber: student.rollNumber,
                class: student.presentClass || selectedClass,
                teacher: staffdata?.teacherName || '',
                feedback: ''
            });
        } else {
            const selectedStudent = studentData.find(s => s.rollNumber === selectRollNumber);
            if (!selectedStudent) {
                toast.warning("Please select a valid student.");
                return;
            }
            setFormData({
                studentName: selectedStudent.studentName,
                rollNumber: selectedStudent.rollNumber,
                class: selectedClass,
                teacher: staffdata?.teacherName || '',
                feedback: ''
            });
        }
        setIsModalOpen(true);
    };

    async function fetchFeedback() {
        try {
            const response = await fetch('http://localhost:4000/staff/feedback');
            if (!response.ok) throw new Error("Failed to fetch feedback");
            const data = await response.json();
            setFeedback(data);
        } catch (error) {
            console.error('Error fetching feedback:', error);
            toast.error("Error fetching feedback data");
        }
    }

    useEffect(() => {
        fetchFeedback();
    }, []);

    const handleSubmitFeedback = async () => {
        try {
            const response = await fetch('http://localhost:4000/staff/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error("Failed to submit feedback");
            toast.success("Feedback submitted successfully!");
            setIsModalOpen(false);
            setFormData({ studentName: '', rollNumber: '', class: '', teacher: '', feedback: '' });
            fetchFeedback();
        } catch (err) {
            console.error("Feedback submit error:", err);
            toast.error("Failed to submit feedback");
        }
    };

    return (
        <div className="feedback-container">
            <ToastContainer position="top-right" autoClose={3000} />
            <h1>Student Feedback by Class</h1>

            <div className="feedback-header">
                <label>Select Class: </label>
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                    <option value="">-- Select Class --</option>
                    {classList.map((cls, index) => (
                        <option key={index} value={cls}>{cls}</option>
                    ))}
                </select>

                <label>Roll No: </label>
                <select value={selectRollNumber} onChange={(e) => setSelectRollNumber(e.target.value)}>
                    <option value="">-- Select Roll Number --</option>
                    {studentData.map((item, index) => (
                        <option key={index} value={item.rollNumber}>{item.rollNumber}</option>
                    ))}
                </select>

                <button onClick={() => openFeedbackModal(null)}>Add Feedback</button>
            </div>

            <div className="feedback-table-wrapper">
                <table className="assignment-table" cellSpacing="0" cellPadding="5" border="1">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Roll Number</th>
                            <th>Student Name</th>
                            <th>Class</th>
                            <th>Feedback</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedback.map((item, index) => (
                            <tr key={item._id || index}>
                                <td>{index + 1}</td>
                                <td>{item.rollNumber}</td>
                                <td>{item.studentName}</td>
                                <td>{item.class}</td>
                                <td>{item.feedback}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '10px',
                        minWidth: '300px'
                    }}>
                        <h2>Add Feedback</h2>
                        <label>Student Name:</label>
                        <input value={formData.studentName} readOnly /><br />

                        <label>Roll Number:</label>
                        <input value={formData.rollNumber} readOnly /><br />

                        <label>Feedback:</label><br />
                        <textarea
                            value={formData.feedback}
                            onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                            rows="4"
                            style={{ width: '100%' }}
                        ></textarea><br />

                        <button onClick={handleSubmitFeedback}>Submit</button>
                        <button onClick={() => setIsModalOpen(false)} style={{ marginLeft: '10px' }}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Feedback;
