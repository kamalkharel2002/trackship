import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../db/index.js';
import config from '../config/index.js';
import { emailService } from './emailService.js';

const otpStore = new Map(); // In-memory OTP store (use Redis in production)

export const authService = {
  async requestOTP(email) {
    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + config.otp.expiryMinutes);

    // Store OTP
    otpStore.set(email, {
      otp: otp,
      expiresAt: expiry,
    });

    // Send email
    try {
      await emailService.sendOTP(email, otp);
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      throw new Error('Failed to send OTP email');
    }

    return {
      message: 'OTP sent to email',
      expiresIn: config.otp.expiryMinutes * 60,
    };
  },

  async verifyOTP(email, otp, userData = {}) {
    const stored = otpStore.get(email);

    if (!stored) {
      throw new Error('OTP not found or expired');
    }

    if (new Date() > stored.expiresAt) {
      otpStore.delete(email);
      throw new Error('OTP expired');
    }

    if (stored.otp !== otp) {
      throw new Error('Invalid OTP');
    }

    // OTP verified - remove from store
    otpStore.delete(email);

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT user_id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error('User already exists. Please login instead.');
    }

    // Validate password is provided
    if (!userData.password) {
      throw new Error('Password is required for registration');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(userData.password, 10);

    // Create new user with hashed password
    const result = await pool.query(
      `INSERT INTO users (user_name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING user_id, user_name, email, phone, role`,
      [
        userData.user_name || email.split('@')[0],
        email,
        userData.phone || null,
        passwordHash,
        'customer',
      ]
    );

    const userRow = result.rows[0];

    // Return user without tokens (registration only)
    return {
      user: {
        user_id: userRow.user_id,
        user_name: userRow.user_name,
        email: userRow.email,
        phone: userRow.phone,
        role: userRow.role,
      },
    };
  },

  async login(email, password) {
    // Get user with password hash
    const user = await pool.query(
      'SELECT user_id, user_name, email, phone, role, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (user.rows.length === 0) {
      throw new Error('Invalid email or password');
    }

    const userRow = user.rows[0];

    // Check if user has a password (for users registered before password implementation)
    if (!userRow.password_hash) {
      throw new Error('Password not set. Please reset your password.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, userRow.password_hash);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const accessToken = jwt.sign(
      {
        userId: userRow.user_id,
        email: userRow.email,
        role: userRow.role,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.accessExpiry }
    );

    const refreshToken = jwt.sign(
      {
        userId: userRow.user_id,
        email: userRow.email,
        type: 'refresh',
      },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiry }
    );

    // Hash and store refresh token
    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [userRow.user_id, tokenHash, expiresAt]
    );

    return {
      user: {
        user_id: userRow.user_id,
        user_name: userRow.user_name,
        email: userRow.email,
        phone: userRow.phone,
        role: userRow.role,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  },

  async refreshAccessToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      // Check if token exists in database
      const tokens = await pool.query(
        `SELECT token_hash, expires_at FROM refresh_tokens
         WHERE user_id = $1 AND expires_at > NOW()
         ORDER BY created_at DESC`,
        [decoded.userId]
      );

      let tokenFound = false;
      for (const tokenRow of tokens.rows) {
        const isValid = await bcrypt.compare(refreshToken, tokenRow.token_hash);
        if (isValid) {
          tokenFound = true;
          break;
        }
      }

      if (!tokenFound) {
        throw new Error('Invalid refresh token');
      }

      // Get user
      const user = await pool.query(
        'SELECT user_id, user_name, email, phone, role FROM users WHERE user_id = $1',
        [decoded.userId]
      );

      if (user.rows.length === 0) {
        throw new Error('User not found');
      }

      const userRow = user.rows[0];

      // Generate new access token
      const accessToken = jwt.sign(
        {
          userId: userRow.user_id,
          email: userRow.email,
          role: userRow.role,
        },
        config.jwt.secret,
        { expiresIn: config.jwt.accessExpiry }
      );

      return {
        access_token: accessToken,
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  },

  async logout(userId, refreshToken) {
    try {
      // Delete all refresh tokens for user (or just the one provided)
      if (refreshToken) {
        const tokens = await pool.query(
          `SELECT token_id, token_hash FROM refresh_tokens
           WHERE user_id = $1 AND expires_at > NOW()`,
          [userId]
        );

        for (const tokenRow of tokens.rows) {
          const isValid = await bcrypt.compare(refreshToken, tokenRow.token_hash);
          if (isValid) {
            await pool.query('DELETE FROM refresh_tokens WHERE token_id = $1', [
              tokenRow.token_id,
            ]);
            return;
          }
        }
      } else {
        // Delete all tokens for user
        await pool.query('DELETE FROM refresh_tokens WHERE user_id = $1', [
          userId,
        ]);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
};

