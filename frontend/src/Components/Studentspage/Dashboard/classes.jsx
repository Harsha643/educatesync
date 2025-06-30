import React, { useEffect, useState } from "react";
import "../DashboardStyles/Classes.css";

const Classes = ({ classData }) => {
  const [classes, setClasses] = useState([]);
  const [filteredClass, setFilteredClass] = useState([]);
  const [loading, setLoading] = useState(true); // loading state

  useEffect(() => {
    async function getClasses() {
      try {
        const response = await fetch("http://localhost:4000/staff/class");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        // Always stop loading after 2 seconds
        setTimeout(() => setLoading(false), 2000);
      }
    }

    getClasses();
  }, []);

  useEffect(() => {
    const filteringData = classes.filter((item) => item.class === classData);
    setFilteredClass(filteringData);
  }, [classes, classData]);

  const handleClick = () => {
    // Your logic here
    console.log("Notes button clicked");
  };

  return (
    <div className="classes-container">
      <h1>Classes</h1>

      {loading ? (
        <div className="spinner-wrapper">
          <div className="spinner" />
        </div>
      ) : (
        <div className="class-list">
          {filteredClass.length > 0 ? (
            filteredClass.map((item, index) => {
              const onlyDate = new Date(item.date).toISOString().split("T")[0];
              return (
                <div key={index} className="inside-list">
                  <h2>Topic: {item.topic}</h2>
                  <h2>Subject: {item.subject}</h2>
                  <h2>Date: {onlyDate}</h2>
                  <button onClick={handleClick}>Notes</button>
                </div>
              );
            })
          ) : (
            <p>No class data found for this class.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Classes;
