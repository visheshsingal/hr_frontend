import React, { useState, useEffect } from 'react';
import api from '../../config/axios';
import { format } from 'date-fns';

const AttendanceHistory = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchAttendance();
  }, [filters]);

  const fetchAttendance = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      const res = await api.get(`/api/attendance/my?${params}`);
      setAttendance(res.data.attendance);
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
    return <div className="loading">Loading attendance history...</div>;
  }

  return (
    <div>
      <h2>Attendance History</h2>
      
      {/* Filters */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <h3>Filters</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
            <label className="form-label">Start Date</label>
            <input
              type="date"
              name="startDate"
              className="form-input"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
            <label className="form-label">End Date</label>
            <input
              type="date"
              name="endDate"
              className="form-input"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
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
          <p>No attendance records found for the selected period.</p>
        )}
      </div>
    </div>
  );
};

export default AttendanceHistory; 