import React, { useState, useEffect } from 'react';
import '../DashboardStyles/Feedback.css';

const Feedback = ({ rollNumber }) => {
  const [feedback, setFeedback] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [loading, setLoading] = useState(true); // Spinner state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:4000/staff/feedback");
        if (!res.ok) throw new Error("Network error");
        const data = await res.json();
        setFeedback(data);
      } catch (error) {
        console.error("Error fetching feedback:", error.message);
      } finally {
        setTimeout(() => setLoading(false), 2000); // Simulate 2 sec loading
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (feedback.length > 0 && rollNumber) {
      const filteredData = feedback.filter(item => item.rollNumber === rollNumber);
      setFilteredFeedback(filteredData);
    } else {
      setFilteredFeedback([]);
    }
  }, [feedback, rollNumber]);

  return (
    <div className='feedback-container'>
      <h1>Feedback</h1>

      {loading ? (
        <div className="spinner-wrapper">
          <div className="spinner" />
        </div>
      ) : (
        <div className='feedback-table-wrapper'>
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedback.length > 0 ? (
                filteredFeedback.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.feedback}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No feedback available for this student.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Feedback;
