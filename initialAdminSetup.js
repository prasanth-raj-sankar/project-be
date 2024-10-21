import bcrypt from 'bcrypt';
import { db } from './db-utils/db-connection.js'; // Assuming you already have a database connection setup

const adminsCollection = db.collection('admins');

// Function to create initial admin if not present
export const createInitialAdmin = async () => {  // Use "export" here
  const existingAdmin = await adminsCollection.findOne({ email: 'admin@example.com' });
  
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10); // Hash the admin password
    await adminsCollection.insertOne({
      email: 'admin@example.com',
      password: hashedPassword,
      isLoggedIn: false,  // Set to false initially
    });
    console.log('Initial admin user created successfully');
  } else {
    console.log('Admin user already exists');
  }
};




