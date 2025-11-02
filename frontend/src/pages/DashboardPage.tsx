import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authApi } from '../api/authApi'

function DashboardPage() {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()

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

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">💰 Expense Tracker</h1>
        <div className="user-info">
          <div 
            className="user-avatar" 
            onClick={() => navigate('/profile')}
            style={{ cursor: 'pointer' }}
            title="View Profile"
          >
            {getInitials()}
          </div>
          <span className="user-name">
            {user?.firstName} {user?.lastName}
          </span>
          <button onClick={handleLogout} className="logout-button">
            🚪 Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon primary">💵</div>
              <h3>Total Expenses</h3>
            </div>
            <div className="stat-value">$0.00</div>
            <div className="stat-change">🚀 Coming in Phase 3</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon success">📊</div>
              <h3>Categories</h3>
            </div>
            <div className="stat-value">0</div>
            <div className="stat-change">🎯 Ready to track</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon warning">📈</div>
              <h3>This Month</h3>
            </div>
            <div className="stat-value">$0.00</div>
            <div className="stat-change">🗓️ Start tracking today</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon info">🎯</div>
              <h3>Budget Status</h3>
            </div>
            <div className="stat-value">100%</div>
            <div className="stat-change">✅ On track</div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="welcome-message">
          <h2>🎉 Welcome to Your Dashboard, {user?.firstName}!</h2>
          <p>
            Your authentication system is <strong>fully operational</strong> and you're now logged in securely.
            <br />
            <br />
            <strong>Phase 2 - Core Development Setup</strong> is complete! 
            <br />
            <br />
            🔐 <strong>Secure Authentication:</strong> JWT-based auth with session management
            <br />
            💾 <strong>Database Integration:</strong> PostgreSQL for reliable data storage
            <br />
            ⚡ <strong>Redis Caching:</strong> Lightning-fast session management
            <br />
            🎨 <strong>Modern UI:</strong> React + TypeScript with beautiful design
            <br />
            <br />
            Ready to build the expense tracking features in Phase 3!
          </p>
          <div className="welcome-badge">Phase 2 Complete ✅</div>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
