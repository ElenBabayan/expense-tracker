import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authApi, RegisterRequest } from '../api/authApi'
import { useAuthStore } from '../store/authStore'

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const password = watch('password')

  const getPasswordStrength = () => {
    if (!password) return null
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    
    if (strength <= 2) return { label: 'Weak', color: '#e74c3c' }
    if (strength <= 4) return { label: 'Medium', color: '#f39c12' }
    return { label: 'Strong', color: '#2ecc71' }
  }

  const strengthInfo = getPasswordStrength()

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      setApiError(null)
      
      const { confirmPassword, ...registerData } = data
      const response = await authApi.register(registerData as RegisterRequest)
      
      if (response.success) {
        const { user, accessToken, refreshToken } = response.data
        setAuth(user, accessToken, refreshToken)
        setToast({ message: '✅ Account created successfully!', type: 'success' })
        setTimeout(() => navigate('/dashboard'), 500)
      }
    } catch (error: any) {
      const errorData = error.response?.data
      let errorMessage = 'Registration failed. Please try again.'
      
      if (errorData?.data && typeof errorData.data === 'object') {
        errorMessage = Object.values(errorData.data).join(', ')
      } else if (errorData?.message) {
        errorMessage = errorData.message
      }
      
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
            <h1>💰 Create Account</h1>
            <p>Start tracking your expenses today</p>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label htmlFor="firstName">👤 First Name</label>
                <input
                  {...register('firstName')}
                  type="text"
                  id="firstName"
                  placeholder="John"
                  className={errors.firstName ? 'error' : ''}
                  autoComplete="given-name"
                />
                {errors.firstName && (
                  <span className="error-message">⚠️ {errors.firstName.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">👤 Last Name</label>
                <input
                  {...register('lastName')}
                  type="text"
                  id="lastName"
                  placeholder="Doe"
                  className={errors.lastName ? 'error' : ''}
                  autoComplete="family-name"
                />
                {errors.lastName && (
                  <span className="error-message">⚠️ {errors.lastName.message}</span>
                )}
              </div>
            </div>

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
                  placeholder="Create a strong password"
                  className={errors.password ? 'error' : ''}
                  autoComplete="new-password"
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
              {strengthInfo && (
                <div style={{ 
                  marginTop: '8px',
                  fontSize: '12px',
                  color: strengthInfo.color,
                  fontWeight: 600
                }}>
                  Strength: {strengthInfo.label}
                </div>
              )}
              {errors.password && (
                <span className="error-message">⚠️ {errors.password.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">🔒 Confirm Password</label>
              <div className="input-wrapper">
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  className={errors.confirmPassword ? 'error' : ''}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-message">⚠️ {errors.confirmPassword.message}</span>
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
                  Creating Account...
                </>
              ) : (
                '🚀 Create Account'
              )}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
