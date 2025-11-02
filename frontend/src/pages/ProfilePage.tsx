import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authApi } from '../api/authApi'

function ProfilePage() {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuth()
      navigate('/login')
    }
  }

  const getInitials = () => {
    if (!user) return '?'
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          💰 Expense Tracker
        </h1>
        <div className="user-info">
          <div className="user-avatar">{getInitials()}</div>
          <span className="user-name">
            {user?.firstName} {user?.lastName}
          </span>
          <button onClick={handleLogout} className="logout-button">
            🚪 Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="profile-container">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar-large">{getInitials()}</div>
            <div className="profile-header-info">
              <h2>{user?.firstName} {user?.lastName}</h2>
              <p className="profile-email">{user?.email}</p>
              <div className="profile-badges">
                <span className="badge badge-primary">Active User</span>
                {user?.roles?.includes('ROLE_ADMIN') && (
                  <span className="badge badge-admin">Admin</span>
                )}
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="profile-section">
            <div className="profile-section-header">
              <h3>👤 Account Information</h3>
              <button 
                className="btn-secondary"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? '❌ Cancel' : '✏️ Edit Profile'}
              </button>
            </div>

            <div className="profile-grid">
              <div className="profile-field">
                <label>First Name</label>
                <div className="profile-value">{user?.firstName || 'N/A'}</div>
              </div>

              <div className="profile-field">
                <label>Last Name</label>
                <div className="profile-value">{user?.lastName || 'N/A'}</div>
              </div>

              <div className="profile-field">
                <label>Email Address</label>
                <div className="profile-value">{user?.email || 'N/A'}</div>
              </div>

              <div className="profile-field">
                <label>User ID</label>
                <div className="profile-value">{user?.id || 'N/A'}</div>
              </div>

              <div className="profile-field">
                <label>Account Created</label>
                <div className="profile-value">{formatDate(user?.createdAt)}</div>
              </div>

              <div className="profile-field">
                <label>Last Updated</label>
                <div className="profile-value">{formatDate(user?.updatedAt)}</div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="profile-section">
            <div className="profile-section-header">
              <h3>🔒 Security</h3>
            </div>

            <div className="profile-grid">
              <div className="profile-field">
                <label>Password</label>
                <div className="profile-value">••••••••</div>
              </div>

              <div className="profile-field">
                <label>Two-Factor Auth</label>
                <div className="profile-value">
                  <span className="badge badge-warning">Not Enabled</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <button className="btn-secondary" disabled>
                🔑 Change Password (Coming Soon)
              </button>
            </div>
          </div>

          {/* Account Stats */}
          <div className="profile-section">
            <div className="profile-section-header">
              <h3>📊 Account Statistics</h3>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-card-header">
                  <div className="stat-icon primary">💵</div>
                  <h3>Total Expenses</h3>
                </div>
                <div className="stat-value">0</div>
                <div className="stat-change">🚀 Coming in Phase 3</div>
              </div>

              <div className="stat-card">
                <div className="stat-card-header">
                  <div className="stat-icon success">📁</div>
                  <h3>Categories</h3>
                </div>
                <div className="stat-value">0</div>
                <div className="stat-change">🎯 Ready to track</div>
              </div>

              <div className="stat-card">
                <div className="stat-card-header">
                  <div className="stat-icon info">📈</div>
                  <h3>Reports</h3>
                </div>
                <div className="stat-value">0</div>
                <div className="stat-change">📊 No reports yet</div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="profile-section danger-zone">
            <div className="profile-section-header">
              <h3>⚠️ Danger Zone</h3>
            </div>

            <div className="danger-zone-content">
              <div>
                <h4>Delete Account</h4>
                <p>Once you delete your account, there is no going back. Please be certain.</p>
              </div>
              <button className="btn-danger" disabled>
                🗑️ Delete Account (Coming Soon)
              </button>
            </div>
          </div>

          {/* Back to Dashboard Button */}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProfilePage

