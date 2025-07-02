import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminLogin.css'; // Make sure to style as 

const baseUrl="https://educatesync.onrender.com" || "http://localhost:4000"

const RoleBasedLogin = () => {
  const [role, setRole] = useState('admin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    teacherName: '',
    StaffPassword: '',
    rollnumber: '',
    StudentPassword: ''
  });
  const [staffList, setStaffList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'staff') {
      fetch(`${baseUrl}/admin/staff`)
        .then((res) => res.json())
        .then(setStaffList);
    } else if (role === 'student') {
      fetch(`${baseUrl}/admin/students`)
        .then((res) => res.json())
        .then(setStudentList);
    }
  }, [role]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Handle Guest Admin Login
    if (role === 'admin') {
      toast.success('Guest Admin Login Successful');
      setTimeout(() => navigate('/admin'), 2000);
      return;
    }

    // Handle Guest Staff Login
    if (role === 'staff') {
      const guestStaff = { teacherName: 'Guest Staff', subject: 'N/A' };
      toast.success('Guest Staff Login Successful');
      setTimeout(() => navigate('/Staff-Dashboard', { state: { staffdata: guestStaff } }), 2000);
      return;
    }

    // Handle Guest Student Login
    if (role === 'student') {
      const guestStudent = { name: 'Guest Student', rollNumber: 'GUEST001' };
      toast.success('Guest Student Login Successful');
      setTimeout(() => navigate('/Student-Dashboard', { state: { studentdata: guestStudent } }), 2000);
      return;
    }

    // Admin Login
    if (role === 'admin') {
      try {
        const res = await fetch(`${baseUrl}/admin/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });
        const data = await res.json();

        if (res.ok) {
          localStorage.setItem('token', data.token);
          toast.success('Admin Login successful!');
          setTimeout(() => navigate('/admin'), 2000);
        } else {
          toast.error(data.msg || 'Login failed');
        }
      } catch (error) {
        toast.error('Server error during admin login');
      }

    } else if (role === 'staff') {
      const staff = staffList.find(
        (s) => s.teacherName === formData.teacherName && s.password === formData.StaffPassword
      );
      if (staff) {
        toast.success('Staff login successful');
        setTimeout(() => navigate('/Staff-Dashboard', { state: { staffdata: staff } }), 2000);
      } else {
        toast.error('Invalid staff credentials');
      }

    } else if (role === 'student') {
      const student = studentList.find(
        (s) => s.rollNumber === formData.rollnumber && s.Studentpassword === formData.StudentPassword
      );
      if (student) {
        toast.success('Student login successful');
        setTimeout(() => navigate('/Student-Dashboard', { state: { studentdata: student } }), 2000);
      } else {
        toast.error('Invalid student credentials');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <select name="role" value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
          <option value="student">Student</option>
         
        </select>

        {/* Optional Guest Info Text
        {role.startsWith('guest') && (
          <p className="guest-warning">You are logging in as a guest. Limited access granted.</p>
        )} */}

        {/* Admin login fields */}
        {role === 'admin' && (
          <>
            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Admin Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </>
        )}

        {/* Staff login fields */}
        {role === 'staff' && (
          <>
            <input
              type="text"
              name="teacherName"
              placeholder="Teacher Name"
              value={formData.teacherName}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="StaffPassword"
              placeholder="Staff Password"
              value={formData.StaffPassword}
              onChange={handleChange}
              required
            />
          </>
        )}

        {/* Student login fields */}
        {role === 'student' && (
          <>
            <input
              type="text"
              name="rollnumber"
              placeholder="Roll Number"
              value={formData.rollnumber}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="StudentPassword"
              placeholder="Student Password"
              value={formData.StudentPassword}
              onChange={handleChange}
              required
            />
          </>
        )}

        <button type="submit">Login</button>
        <button type='submit'>Guest Login</button>
      </form>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default RoleBasedLogin;
