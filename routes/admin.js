import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db-utils/db-connection.js'; // Assuming MongoDB connection
import { createJwtToken } from '../utils/jwt-utils.js';

const adminRouter = express.Router();

const adminsCollection = db.collection('admins'); // Collection for admin users

// Middleware to protect admin routes
const authenticateAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'No token provided, unauthorized access' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await adminsCollection.findOne({ email: decoded.email });
    if (!admin) {
      return res.status(401).json({ msg: 'Unauthorized access' });
    }
    req.admin = admin;
    next();
  } catch (e) {
    return res.status(401).json({ msg: 'Invalid token, unauthorized access' });
  }
};

// Admin Login Route (supports either username or email)

adminRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;  // Only capture email and password
  
    try {
      // Log input values for debugging
      console.log("Login attempt with:", { email });
  
      // Check if email is not empty
      if (!email || !password) {
        console.log("Email or password is missing");
        return res.status(400).json({ msg: 'Email and password are required' });
      }
  
      // Find the admin by email
      const admin = await adminsCollection.findOne({ email });
      
      if (!admin) {
        console.log(`Admin not found for email: ${email}`);
        return res.status(404).json({ msg: 'Admin not found' });
      }
  
      // Log the found admin
      console.log("Admin found:", admin);
  
      // Compare the provided password with the stored hashed password
      const match = await bcrypt.compare(password, admin.password);
      if (!match) {
        console.log("Password mismatch for email:", email);
        return res.status(401).json({ msg: 'Invalid credentials' });
      }
  
      // Log password success
      console.log("Password matched successfully for email:", email);
  
      // Generate JWT token using email
      const token = createJwtToken({ email: admin.email }, '1d');
      console.log("JWT Token generated:", token);
  
      // Send success response
      return res.json({ msg: 'Admin logged in successfully', token });
    } catch (e) {
      console.error("Error during login:", e);
      res.status(500).json({ msg: 'Internal server error' });
    }
  });
  


adminRouter.post('/logout', authenticateAdmin, async (req, res) => {
    try {
      // Update isLoggedIn to false
      await adminsCollection.updateOne({ email: req.admin.email }, { $set: { isLoggedIn: false } });
      
      res.json({ msg: 'Admin logged out successfully' });
    } catch (e) {
      console.error(e);
      res.status(500).json({ msg: 'Internal server error' });
    }
  });
  


export default adminRouter;



















































