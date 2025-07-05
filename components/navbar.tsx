"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { 
  Menu, 
  X, 
  Truck, 
  User, 
  LogOut, 
  Settings, 
  BarChart3,
  UserPlus,
  LogIn
} from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { useAdminAuth } from '@/context/admin-auth-context'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [loginType, setLoginType] = useState<'admin' | 'user'>('user')
  
  const { user, logout } = useAuth()
  const { admin, logout: adminLogout } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    if (admin) {
      adminLogout()
      router.push('/admin/login')
    } else {
      logout()
      router.push('/')
    }
    setIsOpen(false)
  }

  const handleDashboard = () => {
    if (admin) {
      router.push('/admin/dashboard')
    } else if (user?.role === 'admin') {
      router.push('/admin/dashboard')
    } else {
      router.push('/dashboard')
    }
    setIsOpen(false)
  }

  const openAdminLogin = () => {
    setLoginType('admin')
    setShowLoginModal(true)
    setIsOpen(false)
  }

  const openUserLogin = () => {
    setLoginType('user')
    setShowLoginModal(true)
    setIsOpen(false)
  }

  const openRegister = () => {
    setShowRegisterModal(true)
    setIsOpen(false)
  }

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Truck className="h-8 w-8 text-red-600" />
                <span className="text-xl font-bold text-gray-900">Prince Enterprises</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link 
                href="/" 
                className={`${pathname === '/' ? 'text-red-600' : 'text-gray-700'} hover:text-red-600 transition-colors`}
              >
                Home
              </Link>
              <Link 
                href="/services" 
                className={`${pathname === '/services' ? 'text-red-600' : 'text-gray-700'} hover:text-red-600 transition-colors`}
              >
                Services
              </Link>
              <Link 
                href="/tracking" 
                className={`${pathname === '/tracking' ? 'text-red-600' : 'text-gray-700'} hover:text-red-600 transition-colors`}
              >
                Track
              </Link>
              <Link 
                href="/booking" 
                className={`${pathname === '/booking' ? 'text-red-600' : 'text-gray-700'} hover:text-red-600 transition-colors`}
              >
                Book Now
              </Link>
              <Link 
                href="/contact" 
                className={`${pathname === '/contact' ? 'text-red-600' : 'text-gray-700'} hover:text-red-600 transition-colors`}
              >
                Contact
              </Link>

              {(user || admin) ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Welcome, <span className="font-semibold">{admin?.username || user?.name}</span>
                  </span>
                  <Button 
                    onClick={handleDashboard}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>{admin ? 'Admin Panel' : 'Dashboard'}</span>
                  </Button>
                  <Button 
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1 text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button 
                    onClick={openAdminLogin}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin</span>
                  </Button>
                  <Button 
                    onClick={openRegister}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Register</span>
                  </Button>
                  <Button 
                    onClick={openUserLogin}
                    size="sm"
                    className="flex items-center space-x-1 bg-red-600 hover:bg-red-700"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Button>
                </div>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-red-600 transition-colors"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                title={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {isOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
                <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-red-600 transition-colors" onClick={() => setIsOpen(false)}>
                  Home
                </Link>
                <Link href="/services" className="block px-3 py-2 text-gray-700 hover:text-red-600 transition-colors" onClick={() => setIsOpen(false)}>
                  Services
                </Link>
                <Link href="/tracking" className="block px-3 py-2 text-gray-700 hover:text-red-600 transition-colors" onClick={() => setIsOpen(false)}>
                  Track
                </Link>
                <Link href="/booking" className="block px-3 py-2 text-gray-700 hover:text-red-600 transition-colors" onClick={() => setIsOpen(false)}>
                  Book Now
                </Link>
                <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:text-red-600 transition-colors" onClick={() => setIsOpen(false)}>
                  Contact
                </Link>

                <div className="border-t pt-4">
                  {(user || admin) ? (
                    <div className="space-y-2">
                      <div className="px-3 py-2 text-sm text-gray-600">
                        Welcome, <span className="font-semibold">{admin?.username || user?.name}</span>
                      </div>
                      <button onClick={handleDashboard} className="flex items-center space-x-2 w-full px-3 py-2 text-left text-gray-700 hover:text-red-600 transition-colors">
                        <BarChart3 className="h-4 w-4" />
                        <span>{admin ? 'Admin Panel' : 'Dashboard'}</span>
                      </button>
                      <button onClick={handleLogout} className="flex items-center space-x-2 w-full px-3 py-2 text-left text-red-600 hover:text-red-700 transition-colors">
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button onClick={openAdminLogin} className="flex items-center space-x-2 w-full px-3 py-2 text-left text-gray-700 hover:text-red-600 transition-colors">
                        <Settings className="h-4 w-4" />
                        <span>Admin Login</span>
                      </button>
                      <button onClick={openRegister} className="flex items-center space-x-2 w-full px-3 py-2 text-left text-gray-700 hover:text-red-600 transition-colors">
                        <UserPlus className="h-4 w-4" />
                        <span>Register</span>
                      </button>
                      <button onClick={openUserLogin} className="flex items-center space-x-2 w-full px-3 py-2 text-left text-red-600 hover:text-red-700 transition-colors">
                        <LogIn className="h-4 w-4" />
                        <span>User Login</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          loginType={loginType}
        />
      )}

      {showRegisterModal && (
        <RegisterModal 
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
        />
      )}
    </>
  )
}

function LoginModal({ isOpen, onClose, loginType }: { isOpen: boolean; onClose: () => void; loginType: 'admin' | 'user' }) {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const { login: adminLogin } = useAdminAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (loginType === 'admin') {
        await adminLogin(username, password)
        onClose()
        router.push('/admin/dashboard')
      } else {
        const result = await login(email, password, loginType)
        if (result.success) {
          onClose()
          router.push('/dashboard')
        } else {
          setError(result.message)
        }
      }
    } catch (error: any) {
      setError(error.message || 'Login failed')
    }
    
    setIsLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {loginType === 'admin' ? 'Admin Login' : 'User Login'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close login modal"
            title="Close login modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          {loginType === 'admin' ? (
            <>
              <div>
                <label htmlFor="admin-username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="admin"
                />
              </div>
              <div>
                <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="admin123"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="user-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="user-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label htmlFor="user-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  id="user-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Password"
                />
              </div>
            </>
          )}

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>Demo Credentials:</p>
          {loginType === 'admin' ? (
            <>
              <p>Username: admin</p>
              <p>Password: admin123</p>
            </>
          ) : (
            <>
              <p>Email: user@example.com</p>
              <p>Password: user123</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function RegisterModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const result = await register(name, email, password)
      
      if (result.success) {
        onClose()
        router.push('/dashboard')
      } else {
        setError(result.message)
      }
    } catch (error: any) {
      setError(error.message || 'Registration failed')
    }
    
    setIsLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create Account</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close registration modal"
            title="Close registration modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              id="register-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your email address"
            />
          </div>

          <div>
            <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Create a password"
            />
          </div>

          <div>
            <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              id="register-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Confirm your password"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  )
}
