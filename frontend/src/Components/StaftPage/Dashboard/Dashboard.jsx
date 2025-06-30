import React, { useEffect, useState } from 'react';
import { useLocation ,useNavigate} from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import Classes from './Classes';
import Notes from './Notes';
import Timetable from './Timetable';
import Assignment from './Assignment.jsx';
import Feedback from './Feedback';
import '../DashboardStyles/Dashboard.css';
import Attendance from '../Dashboard/Attendance.jsx';
// import modal from './modal';



const StaffDashboard = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const staff = state?.staffdata;
    const [staffdata, setStaffdata] = useState({});
    const [currentPage, setCurrentPage] = useState('home');
    const [isTimetableOpen, setTimetableOpen] = useState(false);

    console.log("ddash Data:", staffdata);
    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <Home /> || <h2>Home Page</h2>;
            case 'notes':
                return <Notes staffdata={staffdata} /> || <h2>Notes Page</h2>;
            case 'assignment':
                return <Assignment staffdata={staffdata} /> || <h2>Assignment Page</h2>;
            case 'timetable':
                return <Timetable  staffdata={staffdata} /> || <h2>Time Table Page</h2>;
            case 'classes':
                return <Classes staffdata={staffdata} /> || <h2>Classes Page</h2>;
            case 'attendance':
                return <Attendance staffdata={staffdata} /> ||<h2>Attendance Page</h2>;
            case 'feedback':
                return <Feedback /> || <h2>Feedback Page</h2>;
            default:
                return <Home /> || <h2>Home Page</h2>;
        }
    }

    useEffect(() => {
        setStaffdata(staff);
    }, [staff]);

    // console.log("Staff Data:", staffdata);
    const handleLogout = () => {
    // Optional: clear any auth tokens/localStorage here
    navigate("/"); // make sure your route matches this path
};

    return (
          <div className="dashboard-container">
            
            <div className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h2>Staff Portal</h2>
                </div>
                <nav className="sidebar-nav">
                    <button className="nav-button" onClick={() => setCurrentPage('home')}>
                        <span className="icon"><img src='/home1.png'  width={"30px"}/></span>
                        <span o>Home</span>
                    </button>
                    <button className="nav-button" onClick={() => setCurrentPage('classes')}>
                        <span className="icon"><img src='/class.png'  width={"30px"}/></span>
                        <span>Classes</span>
                    </button>
                    <button className="nav-button" onClick={() => setCurrentPage('notes')}>
                        <span className="icon"><img src='/notes.png'  width={"30px"}/></span>
                        <span>Notes</span>
                    </button>
                    <button className="nav-button" onClick={() => setCurrentPage('assignment')}>
                        <span className="icon"><img src='/assignment.png'  width={"30px"}/></span>
                        <span>Assignments</span>
                    </button>
                     <button className="nav-button" onClick={() => setCurrentPage('attendance')}>
                        <span className="icon"><img src='/attendence.png'  width={"30px"}/></span>
                        <span>Attendance</span>
                    </button>
                  
                    <button className="nav-button" onClick={() => setCurrentPage('timetable')}>
                        <span className="icon"><img src='/timetable.png'  width={"30px"}/></span>
                        <span>Time Table</span>
                    </button>
                    <button className="nav-button" onClick={() => setCurrentPage('feedback')}>
                        <span className="icon"><img src='/fb.png'  width={"30px"}/></span>
                        <span>Feedback</span>
                    </button>
                </nav>
                <div className="sidebar-footer">
                    <button className="logout-button" onClick={() =>{handleLogout()}}>
                        <span className="icon">🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            <div className="dashboard-main">
                    <Header staffdata={staffdata}/>
                
                <div className="dashboard-content">
                    
                    
                    <modal isOpen={isTimetableOpen} onClose={() => setTimetableOpen(false)}>
                       {renderPage()}
                    </modal>
                </div>
            </div>
        </div>
    );
}
export default StaffDashboard;