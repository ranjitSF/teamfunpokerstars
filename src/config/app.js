/**
 * Application configuration
 * Centralized configuration values derived from environment variables
 */

// Check if running in demo mode (no backend required)
export const isDemoMode = import.meta.env.VITE_MODE === 'demo';

// API URL for backend requests
export const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Admin email for privilege checks
export const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
