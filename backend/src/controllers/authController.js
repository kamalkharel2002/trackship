import { authService } from '../services/authService.js';

export const authController = {
  async requestOTP(req, res, next) {
    try {
      const { email } = req.body;
      const result = await authService.requestOTP(email);
      res.json({
        success: true,
        message: result.message,
        expires_in: result.expiresIn,
      });
    } catch (error) {
      next(error);
    }
  },

  async verifyOTP(req, res, next) {
    try {
      const { email, otp, user_name, phone, password } = req.body;
      const result = await authService.verifyOTP(email, otp, {
        user_name,
        phone,
        password,
      });
      res.json({
        success: true,
        message: 'OTP verified successfully. User registered. Please login to get tokens.',
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'OTP verification failed',
      });
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message || 'Login failed',
      });
    }
  },

  async refresh(req, res, next) {
    try {
      const { refresh_token } = req.body;
      const result = await authService.refreshAccessToken(refresh_token);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message || 'Token refresh failed',
      });
    }
  },

  async logout(req, res, next) {
    try {
      const userId = req.user?.userId;
      const { refresh_token } = req.body;
      await authService.logout(userId, refresh_token);
      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};

