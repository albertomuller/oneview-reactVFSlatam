import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
        setError('Invalid password. Please check your credentials and try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.3) 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center animate-fade-in-up">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300 border-4 border-white">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/29/Volvo-Iron-Mark-Black.svg"
                className="h-12 w-12 filter brightness-0 invert"
                alt="Volvo Logo"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Volvo OneView</h1>
          <p className="text-xl text-gray-600 font-medium">Strategic Portfolio Management</p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary-dark mx-auto mt-4 rounded-full"></div>
          <p className="text-sm text-gray-500 mt-4 leading-relaxed">
            Executive dashboard for initiative tracking and portfolio oversight
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/50 animate-fade-in-up animation-delay-200">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                <i className="fas fa-shield-alt text-primary mr-3 text-2xl"></i>
                Secure Access
              </h2>
              <p className="text-sm text-gray-600">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Access Password
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-base transition-all duration-300 group-hover:border-gray-300 bg-gray-50/50"
                    placeholder="Enter your access password"
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-lg`}></i>
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center animate-shake">
                  <i className="fas fa-exclamation-triangle mr-3 text-red-500"></i>
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !password.trim()}
                className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary focus:outline-none focus:ring-4 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-3 text-xl"></i>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt mr-3 text-xl"></i>
                    Access OneView
                  </>
                )}
              </button>
            </form>

            {/* Login Hints */}
            <div className="border-t border-gray-200/50 pt-6">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl p-5 border border-gray-200/50">
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
                  <i className="fas fa-info-circle text-primary mr-2"></i>
                  Access Levels
                </h3>
                <div className="text-xs text-gray-600 space-y-2">
                  <div className="flex justify-between items-center p-2 bg-white/70 rounded-lg hover:bg-white/90 transition-colors duration-200">
                    <span className="flex items-center">
                      <span className="text-lg mr-2">👨‍💼</span>
                      <span className="font-medium">Executive View</span>
                    </span>
                    <code className="bg-primary/10 text-primary px-3 py-1 rounded-md font-mono font-semibold">admin</code>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/70 rounded-lg hover:bg-white/90 transition-colors duration-200">
                    <span className="flex items-center">
                      <span className="text-lg mr-2">📊</span>
                      <span className="font-medium">Manager View</span>
                    </span>
                    <code className="bg-primary/10 text-primary px-3 py-1 rounded-md font-mono font-semibold">oneview2025</code>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/70 rounded-lg hover:bg-white/90 transition-colors duration-200">
                    <span className="flex items-center">
                      <span className="text-lg mr-2">👤</span>
                      <span className="font-medium">User View</span>
                    </span>
                    <code className="bg-primary/10 text-primary px-3 py-1 rounded-md font-mono font-semibold">volvo123</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center animate-fade-in-up animation-delay-400">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-xs text-gray-600 font-medium">
              © 2025 Volvo Group • Strategic Portfolio Management System
            </p>
          </div>
          <p className="text-xs text-gray-400">
            Secure access to executive initiatives and project oversight
          </p>
        </div>
      </div>
      
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">Authenticating...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
