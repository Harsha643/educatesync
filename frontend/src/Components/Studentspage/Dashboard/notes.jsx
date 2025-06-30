import React, { useState, useEffect } from 'react';
import "../DashboardStyles/notes.css";

const Notes = ({ classData }) => {
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNotes() {
            try {
                const response = await fetch('http://localhost:4000/staff/notes');
                if (!response.ok) throw new Error("Failed to fetch notes");
                const data = await response.json();
                setNotes(data);
            } catch (error) {
                console.error('Error fetching notes:', error);
            } finally {
                setTimeout(() => setLoading(false), 2000); // Show spinner for at least 2 seconds
            }
        }

        fetchNotes();
    }, []);

    useEffect(() => {
        if (notes.length > 0 && classData) {
            const classNotes = notes.filter(note => Number(note.classNumber) === Number(classData));
            setFilteredNotes(classNotes);
        } else {
            setFilteredNotes([]);
        }
    }, [notes, classData]);

    return (
        <div className="notes-container">
            <h1>Notes</h1>

            {loading ? (
                <div className="spinner-wrapper">
                    <div className="spinner"></div>
                </div>
            ) : (
                <ul className="notes-list">
                    {filteredNotes.length > 0 ? (
                        filteredNotes.map((note, index) => (
                            <li key={index} className="note-item">
                                <h2>Subject: {note.subject}</h2>
                                <h3>{note.title}</h3>
                                {note.link && (
                                    <a href={note.link} target="_blank" rel="noopener noreferrer">
                                        View Note
                                    </a>
                                )}
                            </li>
                        ))
                    ) : (
                        <p>No notes available for this class.</p>
                    )}
                </ul>
            )}
        </div>
    );
};

export default Notes;
