import React from 'react';
import '../DashboardStyles/Header.css'; // make sure this file exists

const Header = ({ staffdata }) => {
    return (
        <div className='header-container'>
            <img 
                src={staffdata?.image}
                alt={`${staffdata?.teacherName || 'teacher'} profile`}
                className='profile-image'
                onError={(e) => {
                    e.target.src = '/profile.png';
                    e.target.alt = 'profile';
                }}
            />
            <div className="staff-info">
                <h2 className="staff-name">{staffdata?.teacherName}</h2>
                <h2 className="staff-id">{staffdata?.staffId}</h2>
            </div>
        </div>
    );
};

export default Header;
