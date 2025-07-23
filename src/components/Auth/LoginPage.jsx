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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background 
                          focus:ring-2 focus:ring-primary focus:border-transparent 
                          transition-colors duration-200 text-text-primary"
                placeholder="Enter password"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="text-sm text-error bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium
                        hover:bg-primary-dark transition-colors duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed
                        focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Minimalist Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-text-muted">© 2025 Volvo Group</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
