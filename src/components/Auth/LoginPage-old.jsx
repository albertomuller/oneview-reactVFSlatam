import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = onLogin(password);
      if (!success) {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm">
        {/* Minimalist Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light text-primary mb-2">OneView</h1>
          <p className="text-sm text-text-secondary">Strategic Portfolio Management</p>
        </div>

        {/* Minimalist Form */}
        <div className="bg-surface rounded-lg border border-border p-8 shadow-sm">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="volvo-heading text-2xl mb-3" style={{ color: 'var(--volvo-dark-blue)' }}>
                <VolvoIcon name="shield" size={24} color="var(--volvo-blue)" className="mr-3" />
                Secure Access
              </h2>
              <p className="volvo-body text-muted">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="password" className="block volvo-subheading text-sm">
                  Access Password
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="volvo-input"
                    placeholder="Enter your access password"
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-4 transition-colors duration-200"
                    style={{ color: 'var(--volvo-gray)' }}
                  >
                    <VolvoIcon name={showPassword ? 'eye-off' : 'eye'} size={18} />
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 text-red-700 px-4 py-4 rounded-lg volvo-fade-in animate-shake"
                     style={{ borderColor: 'var(--error)' }}>
                  <div className="flex items-center">
                    <VolvoIcon name="alert-triangle" size={18} color="var(--error)" className="mr-3" />
                    <span className="volvo-body font-medium">{error}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !password.trim()}
                className="volvo-btn volvo-btn-primary w-full py-4 text-lg"
              >
                {loading ? (
                  <>
                    <VolvoIcon name="spinner" size={20} className="mr-3" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <VolvoIcon name="shield" size={20} className="mr-3" />
                    Access OneView
                  </>
                )}
              </button>
            </form>

            {/* Login Hints with Volvo Design */}
            <div className="border-t pt-6" style={{ borderColor: 'var(--border)' }}>
              <div className="rounded-xl p-6" 
                   style={{ 
                     background: 'linear-gradient(135deg, var(--volvo-off-white) 0%, var(--surface-alt) 100%)',
                     border: '1px solid var(--border)'
                   }}>
                <h3 className="volvo-subheading text-sm mb-4 flex items-center">
                  <VolvoIcon name="info" size={16} color="var(--volvo-blue)" className="mr-2" />
                  Access Levels
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg transition-colors duration-200"
                       style={{ backgroundColor: 'var(--surface)' }}>
                    <span className="flex items-center volvo-body">
                      <span className="text-2xl mr-3">👨‍💼</span>
                      <span className="font-medium">Executive Access</span>
                    </span>
                    <code className="px-3 py-1 rounded-md font-mono text-sm font-semibold"
                          style={{ backgroundColor: 'var(--volvo-teal-light)', color: 'var(--volvo-dark-blue)' }}>
                      admin
                    </code>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg transition-colors duration-200"
                       style={{ backgroundColor: 'var(--surface)' }}>
                    <span className="flex items-center volvo-body">
                      <span className="text-2xl mr-3">📊</span>
                      <span className="font-medium">Manager Access</span>
                    </span>
                    <code className="px-3 py-1 rounded-md font-mono text-sm font-semibold"
                          style={{ backgroundColor: 'var(--volvo-teal-light)', color: 'var(--volvo-dark-blue)' }}>
                      oneview2025
                    </code>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg transition-colors duration-200"
                       style={{ backgroundColor: 'var(--surface)' }}>
                    <span className="flex items-center volvo-body">
                      <span className="text-2xl mr-3">👤</span>
                      <span className="font-medium">User Access</span>
                    </span>
                    <code className="px-3 py-1 rounded-md font-mono text-sm font-semibold"
                          style={{ backgroundColor: 'var(--volvo-teal-light)', color: 'var(--volvo-dark-blue)' }}>
                      volvo123
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Volvo Branding */}
        <div className="text-center volvo-fade-in animation-delay-400">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <div className="w-2 h-2 rounded-full animate-pulse" 
                 style={{ backgroundColor: 'var(--volvo-green)' }}></div>
            <p className="volvo-caption font-medium">
              © 2025 Volvo Group • Strategic Portfolio Management System
            </p>
          </div>
          <p className="volvo-caption">
            Secure access to executive initiatives and strategic oversight
          </p>
        </div>
      </div>
      
      {/* Enhanced Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
             style={{ backgroundColor: 'rgba(30, 40, 50, 0.2)', backdropFilter: 'blur(4px)' }}>
          <div className="volvo-card p-8 flex flex-col items-center">
            <div className="mb-4">
              <VolvoIcon name="spinner" size={48} color="var(--volvo-blue)" />
            </div>
            <h3 className="volvo-heading text-lg mb-2" style={{ color: 'var(--volvo-blue)' }}>
              Authenticating
            </h3>
            <p className="volvo-body text-muted">Verifying your credentials...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
