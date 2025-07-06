import React, { useState, useEffect } from 'react';
import api from '../../config/axios';
import { format } from 'date-fns';

const AttendanceView = () => {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    employeeId: '',
    startDate: '',
    endDate: '',
    type: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      fetchAttendance();
    }
  }, [currentPage, filters, employees]);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/api/employees?limit=1000');
      setEmployees(res.data.employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...filters
      });
      
      const res = await api.get(`/api/attendance?${params}`);
      setAttendance(res.data.attendance);
      setTotalPages(res.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    const badgeClasses = {
      present: 'badge-success',
      absent: 'badge-danger',
      late: 'badge-warning',
      'half-day': 'badge-info'
    };
    return `badge ${badgeClasses[status] || 'badge-secondary'}`;
  };

  if (loading) {
    return <div className="loading">Loading attendance records...</div>;
  }

  return (
    <div>
      <h2>Attendance Records</h2>
      
      {/* Filters */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <h3>Filters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Employee</label>
            <select
              name="employeeId"
              className="form-input"
              value={filters.employeeId}
              onChange={handleFilterChange}
            >
              <option value="">All Employees</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp.employeeId}>
                  {emp.name} ({emp.employeeId})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              name="startDate"
              className="form-input"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">End Date</label>
            <input
              type="date"
              name="endDate"
              className="form-input"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Type</label>
            <select
              name="type"
              className="form-input"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="full-day">Full Day</option>
              <option value="half-day">Half Day</option>
              <option value="holiday">Holiday</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="card">
        <h3>Records ({attendance.length})</h3>
        
        {attendance.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Type</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Work Hours</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record._id}>
                  <td>{format(new Date(record.date), 'MMM dd, yyyy')}</td>
                  <td>{record.employee?.name}</td>
                  <td>{record.employee?.employeeId}</td>
                  <td>{record.employee?.department}</td>
                  <td>{record.type}</td>
                  <td>
                    <span className={getStatusBadge(record.status)}>
                      {record.status}
                    </span>
                  </td>
                  <td>
                    {record.checkIn ? format(new Date(record.checkIn), 'HH:mm') : '-'}
                  </td>
                  <td>
                    {record.checkOut ? format(new Date(record.checkOut), 'HH:mm') : '-'}
                  </td>
                  <td>
                    {record.checkIn && record.checkOut 
                      ? `${((new Date(record.checkOut) - new Date(record.checkIn)) / (1000 * 60 * 60)).toFixed(1)}h`
                      : '-'
                    }
                  </td>
                  <td>{record.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No attendance records found for the selected filters.</p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className="btn btn-secondary"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span style={{ padding: '0.5rem' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="btn btn-secondary"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceView; 