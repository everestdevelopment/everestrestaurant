import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google profile:', profile);
    // Check if user already exists
    let user = await User.findOne({ email: profile.emails && profile.emails[0] && profile.emails[0].value });
    
    if (user) {
      // User exists, check if verified
      if (!user.isEmailVerified) {
        // Resend verification code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        user.emailVerificationCode = code;
        await user.save();
        
        // Send verification code
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: user.email,
          subject: 'Your Everest Restaurant Verification Code',
          text: `Your verification code is: ${code}`,
        });
      }
      return done(null, user);
    }
    
    // User doesn't exist, create temporary user data (not saved to DB yet)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Send verification code first
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: profile.emails && profile.emails[0] && profile.emails[0].value,
      subject: 'Your Everest Restaurant Verification Code',
      text: `Your verification code is: ${code}`,
    });
    
    // Create temporary user object (not saved to DB)
    const tempUser = {
      name: profile.displayName,
      email: profile.emails && profile.emails[0] && profile.emails[0].value,
      googleId: profile.id,
      isGoogleAccount: true,
      isEmailVerified: false,
      emailVerificationCode: code,
      _id: null, // Will be set when actually saved
    };
    
    // Store temporary user data in session or pass it through
    done(null, tempUser);
  } catch (err) {
    console.error('GoogleStrategy error:', err);
    done(err, null);
  }
})); 