import React, { useState, useEffect } from 'react';
import api from '../../config/axios';

const MarkAttendance = ({ onMarkAttendance }) => {
  const [formData, setFormData] = useState({
    type: 'full-day',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [holidayStatus, setHolidayStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    fetchHolidayStatus();
  }, []);

  const fetchHolidayStatus = async () => {
    try {
      const res = await api.get('/api/attendance/holiday-status');
      setHolidayStatus(res.data);
    } catch (error) {
      console.error('Error fetching holiday status:', error);
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onMarkAttendance(formData.type, formData.notes);
      setFormData({ type: 'full-day', notes: '' });
      // Refresh holiday status after marking attendance
      if (formData.type === 'holiday') {
        await fetchHolidayStatus();
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHolidayStatusMessage = () => {
    if (loadingStatus) return 'Loading holiday status...';
    if (!holidayStatus) return 'Unable to load holiday status';
    
    if (holidayStatus.canTake) {
      return `Holidays remaining: ${holidayStatus.remaining}/${holidayStatus.maxHolidays}`;
    } else {
      return `No holidays left this month (${holidayStatus.currentCount}/${holidayStatus.maxHolidays} used)`;
    }
  };

  const getHolidayStatusColor = () => {
    if (loadingStatus) return '#6b7280';
    if (!holidayStatus) return '#ef4444';
    return holidayStatus.canTake ? '#10b981' : '#ef4444';
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <h3>Mark Attendance</h3>
      
      {/* Holiday Status Display */}
      <div style={{
        padding: '0.75rem',
        marginBottom: '1rem',
        borderRadius: '0.375rem',
        backgroundColor: '#f8fafc',
        border: `1px solid ${getHolidayStatusColor()}`,
        color: getHolidayStatusColor()
      }}>
        <strong>Holiday Status:</strong> {getHolidayStatusMessage()}
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Attendance Type</label>
          <select
            name="type"
            className="form-input"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="full-day">Full Day</option>
            <option value="half-day">Half Day</option>
            <option 
              value="holiday" 
              disabled={!loadingStatus && holidayStatus && !holidayStatus.canTake}
            >
              Holiday {!loadingStatus && holidayStatus && !holidayStatus.canTake ? '(Limit Reached)' : ''}
            </option>
          </select>
          {!loadingStatus && holidayStatus && !holidayStatus.canTake && formData.type === 'holiday' && (
            <div style={{ 
              color: '#ef4444', 
              fontSize: '0.875rem', 
              marginTop: '0.25rem' 
            }}>
              You have reached the maximum holiday limit for this month.
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label className="form-label">Notes (Optional)</label>
          <textarea
            name="notes"
            className="form-input"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Any additional notes..."
          />
        </div>
        
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || (!loadingStatus && holidayStatus && !holidayStatus.canTake && formData.type === 'holiday')}
        >
          {loading ? 'Marking...' : 'Mark Attendance'}
        </button>
      </form>
    </div>
  );
};

export default MarkAttendance; 