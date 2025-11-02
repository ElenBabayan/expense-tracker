import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authApi, LoginRequest } from '../api/authApi'
import { useAuthStore } from '../store/authStore'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      setApiError(null)
      const response = await authApi.login(data as LoginRequest)
      
      if (response.success) {
        const { user, accessToken, refreshToken } = response.data
        setAuth(user, accessToken, refreshToken)
        setToast({ message: '✅ Login successful!', type: 'success' })
        setTimeout(() => navigate('/dashboard'), 500)
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.'
      setApiError(errorMessage)
      setToast({ message: `❌ ${errorMessage}`, type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
      
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>💰 Welcome Back</h1>
            <p>Sign in to your account to continue</p>
          </div>

          {apiError && (
            <div style={{ 
              background: 'linear-gradient(135deg, #fee 0%, #fdd 100%)', 
              color: '#c00', 
              padding: '14px 16px', 
              borderRadius: '12px', 
              marginBottom: '20px',
              fontSize: '14px',
              border: '1px solid #fcc',
              animation: 'shake 0.3s ease'
            }}>
              ⚠️ {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="email">📧 Email Address</label>
              <input
                {...register('email')}
                type="email"
                id="email"
                placeholder="you@example.com"
                className={errors.email ? 'error' : ''}
                autoComplete="email"
              />
              {errors.email && (
                <span className="error-message">⚠️ {errors.email.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">🔒 Password</label>
              <div className="input-wrapper">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter your password"
                  className={errors.password ? 'error' : ''}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <span className="error-message">⚠️ {errors.password.message}</span>
              )}
            </div>

            <button 
              type="submit" 
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Signing In...
                </>
              ) : (
                '🚀 Sign In'
              )}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

