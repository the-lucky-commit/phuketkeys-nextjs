// src/app/admin/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { getAuthHeaders } from '@/lib/auth';
import toast from 'react-hot-toast';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        toast.error('Failed to load users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error loading users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number, username: string) => {
    if (!confirm(`Are you sure you want to delete user "${username}"?`)) {
      return;
    }

    const notification = toast.loading('Deleting user...');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setUsers(users.filter(u => u.id !== userId));
        toast.success('User deleted successfully!', { id: notification });
      } else {
        toast.error('Failed to delete user', { id: notification });
      }
    } catch (error) {
      toast.error('An error occurred while deleting', { id: notification });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (isLoading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '50px 20px',
        fontSize: '1.1rem',
        color: '#6c757d'
      }}>
        Loading Users...
      </div>
    );
  }

  return (
    <div>
      <div className="main-header">
        <h1>User Management</h1>
      </div>

      {/* Filters */}
      <div className="table-filters">
        <input
          type="text"
          placeholder="Search by username or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="status-filter-buttons">
          <button 
            onClick={() => setRoleFilter('All')} 
            className={roleFilter === 'All' ? 'active' : ''}
          >
            All
          </button>
          <button 
            onClick={() => setRoleFilter('admin')}
            className={roleFilter === 'admin' ? 'active' : ''}
          >
            Admin
          </button>
          <button 
            onClick={() => setRoleFilter('user')}
            className={roleFilter === 'user' ? 'active' : ''}
          >
            User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container full-width">
        <table>
          <thead>
            <tr>
              <th style={{ width: '60px', textAlign: 'center' }}>#</th>
              <th>Username</th>
              <th>Email</th>
              <th style={{ width: '120px', textAlign: 'center' }}>Role</th>
              <th style={{ width: '180px', textAlign: 'center' }}>Created Date</th>
              <th style={{ width: '100px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => {
                const dateFormatted = new Date(user.created_at).toLocaleDateString('en-GB');
                return (
                  <tr key={user.id}>
                    <td style={{ textAlign: 'center', fontWeight: '500', color: '#666' }}>
                      {index + 1}
                    </td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`status ${user.role === 'admin' ? 'sale' : 'rent'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>{dateFormatted}</td>
                    <td className="actions">
                      <button
                        onClick={() => handleDeleteUser(user.id, user.username)}
                        className="action-btn delete"
                        title="Delete User"
                        disabled={user.role === 'admin'} // ป้องกันลบ admin
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center' }}>
                  No users found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <p style={{ margin: 0, color: '#6c757d' }}>
          Total Users: <strong>{filteredUsers.length}</strong> 
          {roleFilter !== 'All' && ` (${roleFilter})`}
        </p>
      </div>
    </div>
  );
}
