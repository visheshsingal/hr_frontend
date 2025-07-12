import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import api from '../../config/axios';
import { toast } from 'react-toastify';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';
import AttendanceView from './AttendanceView';
import CreateHR from './CreateHR';

const HRDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    todayAttendance: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [employeesRes, attendanceRes] = await Promise.all([
        api.get('/api/employees'),
        api.get('/api/attendance')
      ]);

      const totalEmployees = employeesRes.data.total;
      const activeEmployees = employeesRes.data.employees.filter(emp => emp.isActive).length;
      const todayAttendance = attendanceRes.data.attendance.filter(att => {
        const today = new Date();
        const todayString = today.getFullYear() + '-' + 
                           String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                           String(today.getDate()).padStart(2, '0');
        const attDate = new Date(att.date);
        const attDateString = attDate.getFullYear() + '-' + 
                             String(attDate.getMonth() + 1).padStart(2, '0') + '-' + 
                             String(attDate.getDate()).padStart(2, '0');
        return attDateString === todayString;
      }).length;

      setStats({ totalEmployees, activeEmployees, todayAttendance });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>HR Dashboard</h1>
      
      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="card">
          <h3>Total Employees</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
            {stats.totalEmployees}
          </p>
        </div>
        <div className="card">
          <h3>Active Employees</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
            {stats.activeEmployees}
          </p>
        </div>
        <div className="card">
          <h3>Today's Attendance</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
            {stats.todayAttendance}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        <Link to="/hr" className="btn btn-primary">Dashboard</Link>
        <Link to="/hr/employees" className="btn btn-secondary">Manage Employees</Link>
        <Link to="/hr/employees/add" className="btn btn-success">Add Employee</Link>
        <Link to="/hr/attendance" className="btn btn-secondary">View Attendance</Link>
        <Link to="/hr/create-hr" className="btn btn-info">Create HR Account</Link>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={
          <div className="card">
            <h2>Welcome to HR Portal</h2>
            <p>Use the navigation above to manage employees and view attendance records.</p>
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f9ff', borderRadius: '0.375rem' }}>
              <h4>Quick Actions:</h4>
              <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                <li>Add new employees to the system</li>
                <li>View and manage employee attendance</li>
                <li>Create additional HR accounts for your team</li>
                <li>Monitor daily attendance statistics</li>
              </ul>
            </div>
          </div>
        } />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/employees/add" element={<EmployeeForm />} />
        <Route path="/employees/edit/:id" element={<EmployeeForm />} />
        <Route path="/attendance" element={<AttendanceView />} />
        <Route path="/create-hr" element={<CreateHR />} />
      </Routes>
    </div>
  );
};

export default HRDashboard; 