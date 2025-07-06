import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/axios';
import { toast } from 'react-toastify';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    department: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, filters]);

  const fetchEmployees = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...filters
      });
      
      const res = await api.get(`/api/employees?${params}`);
      setEmployees(res.data.employees);
      setTotalPages(res.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
              await api.delete(`/api/employees/${id}`);
      toast.success('Employee deleted successfully');
      fetchEmployees();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete employee');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
    setCurrentPage(1);
  };

  const getStatusBadge = (isActive) => {
    return isActive ? 'badge badge-success' : 'badge badge-danger';
  };

  if (loading) {
    return <div className="loading">Loading employees...</div>;
  }

  return (
    <div>
      <h2>Employee Management</h2>
      
      {/* Filters */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <h3>Filters</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
            <label className="form-label">Search</label>
            <input
              type="text"
              name="search"
              className="form-input"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by name, email, or employee ID..."
            />
          </div>
          <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
            <label className="form-label">Department</label>
            <input
              type="text"
              name="department"
              className="form-input"
              value={filters.department}
              onChange={handleFilterChange}
              placeholder="Filter by department..."
            />
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Employees ({employees.length})</h3>
          <Link to="/hr/employees/add" className="btn btn-success">Add Employee</Link>
        </div>
        
        {employees.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Position</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee.employeeId}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.department}</td>
                  <td>{employee.position}</td>
                  <td>
                    <span className={getStatusBadge(employee.isActive)}>
                      {employee.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link 
                        to={`/hr/employees/edit/${employee._id}`}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(employee._id)}
                        className="btn btn-danger"
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No employees found.</p>
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

export default EmployeeList; 