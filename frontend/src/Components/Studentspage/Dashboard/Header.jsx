import React from 'react';
import "../DashboardStyles/Header.css";

const Header = ({ studentdata }) => {
    return (
        <div className='header-container'>
            <img 
                src={studentdata?.image}
                alt={`${studentdata?.studentName || 'Student'} profile`}
                width="50px"
                style={{ 
                    borderRadius: "50%",
                    border: "2px solid #4285f4",
                    boxSizing: "border-box"
                }}
                onError={(e) => {
                    e.target.src = '/default-profile.png';
                    e.target.alt = 'Default profile';
                }}
            />
            <h2>{studentdata?.studentName}</h2>
            <h2>{studentdata?.rollNumber}</h2>
            <h2>Class : {studentdata?.presentClass}th</h2>
        </div>
    );
};

export default Header;