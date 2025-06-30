import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import "../DashboardStyles/assignment.css";

Modal.setAppElement('#root');

const Assignment = ({ classData }) => {
    const [data, setData] = useState([]);
    const [assignments, setFilteredAssignments] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedLink, setSelectedLink] = useState('');
    const [submitModalOpen, setSubmitModalOpen] = useState(false);
    const [submitLink, setSubmitLink] = useState('');
    const [currentAssignment, setCurrentAssignment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // console.log(classData)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/staff/assignments`);
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching assignments:', error);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 2000);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (data.length > 0 && classData) {
            const filtered = data.filter(item => Number(item.classNumber) === Number(classData.presentClass));
            setFilteredAssignments(filtered);
        } else {
            setFilteredAssignments([]);
        }
    }, [data, classData]);

    const openModalWithDoc = (link) => {
        setSelectedLink(link);
        setModalIsOpen(true);
    };

    const openSubmitModal = (assignment) => {
        setCurrentAssignment(assignment);
        setSubmitModalOpen(true);
    };
const handleSubmitAssignment = async () => {
    const isValidLink = /^https:\/\/docs\.google\.com\/document\/d\/[a-zA-Z0-9_-]+/i.test(submitLink);
    if (!isValidLink) {
        alert("Only Google Docs links are allowed. Example: https://docs.google.com/document/d/your-doc-id/edit");
        return;
    }

    try {
        const response = await fetch('http://localhost:4000/student/assignment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                classNumber: classData.presentClass,
                rollNumber: classData.rollNumber,
                subject: currentAssignment.subject,
                topic: currentAssignment.topic,
                link: submitLink
            })
        });

        const result = await response.json();
        if (response.ok) {
            alert("Assignment submitted successfully!");
            setSubmitModalOpen(false);
            setSubmitLink('');
        } else {
            alert(result.message || "Submission failed.");
        }
    } catch (err) {
        console.error(err);
        alert("Submission failed. Please try again.");
    }
};


    return (
        <div className="assignment-container">
            <h1>Assignments</h1>

            {isLoading ? (
                <div className="spinner-overlay">
                    <div className="spinner" />
                </div>
            ) : (
                <div className="assignment-list">
                    {assignments.length > 0 ? (
                        assignments.map((assignment, index) => (
                            <div key={index} className="assignment-item">
                                <h2>{assignment.subject}</h2>
                                <h3>{assignment.topic}</h3>
                                <button onClick={() => openModalWithDoc(assignment.link)} className="view-doc-button">
                                    View Assignment
                                </button>
                                <p>{assignment.description}</p>
                                <p>Due Date: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                                <button className="Submit-Ass" onClick={() => openSubmitModal(assignment)}>
                                    Submit Assignment
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No assignments available for this class.</p>
                    )}
                </div>
            )}

            {/* View Assignment Modal */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Document Viewer"
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <h2>Assignment Document</h2>
                <iframe
                    src={selectedLink}
                    title="Document Viewer"
                    width="100%"
                    height="100%"
                    style={{ border: 'none', minHeight: '600px' }}
                />
                <button onClick={() => setModalIsOpen(false)} className="view-doc-button">Close</button>
            </Modal>

            {/* Submit Assignment Modal */}
            <Modal
                isOpen={submitModalOpen}
                onRequestClose={() => setSubmitModalOpen(false)}
                contentLabel="Submit Assignment"
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <h2>Submit Assignment Link</h2>
                <input
                    type="url"
                    placeholder="Paste your .pdf/.doc/.docx link"
                    value={submitLink}
                    onChange={(e) => setSubmitLink(e.target.value)}
                    style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
                />
                <button onClick={handleSubmitAssignment} className="view-doc-button">Submit</button>
                <button onClick={() => setSubmitModalOpen(false)} style={{ marginLeft: '10px' }}>Cancel</button>
            </Modal>
        </div>
    );
};

export default Assignment;
