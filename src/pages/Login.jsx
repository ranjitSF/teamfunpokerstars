import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Mail, CheckCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { sendSignInLink, currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await sendSignInLink(email);
      setEmailSent(true);
      // Store email for verification after redirect
      window.localStorage.setItem('emailForSignIn', email);
    } catch (error) {
      setError(error.message || 'Failed to send sign-in link');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-poker-accent to-poker-gold rounded-2xl shadow-gold mb-4">
              <CheckCircle className="w-10 h-10 text-poker-dark" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold gold-gradient-text mb-2">
              Check Your Email
            </h1>
            <p className="text-gray-400">Magic link sent!</p>
          </div>

          <div className="bg-poker-card rounded-2xl p-8 border border-poker-accent/20 shadow-card">
            <div className="text-center space-y-4">
              <Mail className="w-16 h-16 text-poker-accent mx-auto" />
              <p className="text-white">
                We've sent a sign-in link to:
              </p>
              <p className="text-poker-accent font-medium text-lg">
                {email}
              </p>
              <p className="text-gray-400 text-sm">
                Click the link in your email to sign in. The link will expire in 60 minutes.
              </p>
              <div className="pt-4 border-t border-poker-accent/20">
                <button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                  className="text-poker-accent hover:text-poker-gold transition-colors text-sm"
                >
                  Use a different email
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">
            Didn't receive the email? Check your spam folder.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-poker-accent to-poker-gold rounded-2xl shadow-gold mb-4">
            <span className="text-5xl">♠️</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold gold-gradient-text mb-2 leading-tight">
            Team Fun Poker Stars<br/>Championship Series
          </h1>
          <p className="text-gray-400">Elite Rankings System</p>
        </div>

        {/* Form Card */}
        <div className="bg-poker-card rounded-2xl p-8 border border-poker-accent/20 shadow-card">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-white mb-2">Sign In</h2>
            <p className="text-gray-400 text-sm">Enter your email to receive a magic link</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-poker-darker border border-poker-accent/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-poker-accent transition-colors"
                placeholder="you@example.com"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                'Sending...'
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Send Magic Link
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Authorized players only. Contact your admin for access.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
