import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { db } from "../db-utils/db-connection.js";
import { v4 } from "uuid";
import { studentModel } from "../db-utils/models.js";
import mongoose from "mongoose";
import { mailOptions, transporter } from "../utils/mail-utils.js";
import { createJwtToken } from "../utils/jwt-utils.js";

const studentsRouter = express.Router();

const studentsCollection = db.collection("students");

// Get all students
studentsRouter.get("/", async (req, res) => {
  // Get all students using the same collection

  const studentsData = await studentsCollection
    .find({}, { projection: { _id: 0 } })
    .toArray();

  res.json(studentsData);
});

studentsRouter.post("/", async (req, res) => {
  const userDetails = req.body;

  // check if the user exists
  const user = await studentsCollection.findOne({ email: userDetails.email });

  if (user) {
    res.status(409).json({ msg: "User Already Exists" });
  } else {
    const userObj = new studentModel({
      ...userDetails,
    });
    await userObj.validate();
    bcrypt.hash(userDetails.password, 10, async (err, hash) => {
      try {
        userDetails.password = hash;
        await studentsCollection.insertOne({
          ...userDetails,
          id: v4(),
          isVerified: false,
        });

        const token = createJwtToken({ email: userDetails.email }, "1d");

        const link = `${process.env.FE_URL}/verify-account?token=${token}`;

        await transporter.sendMail({
          ...mailOptions,
          to: userDetails.email,
          subject: `Welcome to the Application ${userDetails.name}`,
          text: `Hi ${userDetails.name}, \nThank You for Registering with Us. \nTo Verify You account Click ${link}`,
        });
        res.json({ msg: "User created Successfully" });
      } catch (e) {
        if (e instanceof mongoose.Error.ValidationError) {
          res.status(400).json({ msg: e.message });
        } else {
          res.status(500).json({ msg: "Internal Server Error" });
        }
        console.log(e);
      }
    });
  }
});

// Delete a user with id
studentsRouter.delete("/", async (req, res) => {
  const { id } = req.query;

  // check if the user exists
  const user = await studentsCollection.findOne({ id });

  if (user) {
    await studentsCollection.deleteOne({ id });

    res.json({ msg: "User Deleted Successfully" });
  } else {
    res.status(404).json({ msg: "User not Found" });
  }
});

studentsRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updateDetails = req.body;

  const user = await studentsCollection.findOne({ id });

  // check if the user exists
  if (user) {
    // Updation logic

    await studentsCollection.updateOne(
      { id },
      {
        $set: {
          ...updateDetails,
        },
      }
    );

    res.json({ msg: "User Updated Successfully" });
  } else {
    res.status(404).json({ msg: "user not found" });
  }
});

// Verify Account
studentsRouter.get("/verify-account", (req, res) => {
  const { token } = req.query;

  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      res
        .status(400)
        .json({ msg: "Link Seems To Be Expired, Please try again" });
    }
    const { email } = data;
    await studentsCollection.updateOne(
      { email },
      {
        $set: {
          isVerified: true,
        },
      }
    );
    res.json({ msg: "User verified successfully" });
  });
});

// User Login
studentsRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await studentsCollection.findOne({ email });

    if (user) {
      // user exists in DB
      // Verify the incoming pass with the DB password
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.log(err);
          res.status(400).json({ msg: "Something went wrong" });
        } else if (result) {
          delete user.password;
          res.json({ msg: "User Logged In Successfully", user });
        } else {
          res.status(400).json({ msg: "Invalid Credentials" });
        }
      });
    } else {
      res.status(404).json({ msg: "User Not Found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});


// Send Reset Password Link
studentsRouter.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    const user = await studentsCollection.findOne({ email });
  
    if (user) {
      const token = createJwtToken({ email }, "1h"); // Token expires in 1 hour
      const link = `${process.env.FE_URL}/reset-password?token=${token}`;
  
      try {
        await transporter.sendMail({
          ...mailOptions,
          to: email,
          subject: "Password Reset Request",
          text: `Hello, \nYou requested a password reset. Click the link to reset your password: ${link}\nIf you didn't request this, please ignore this email.`,
        });
        res.json({ msg: "Reset password link sent to your email." });
      } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
      }
    } else {
      res.status(404).json({ msg: "User not found" });
    }
  });
  

  // Reset Password
studentsRouter.post("/reset-password", (req, res) => {
    const { token } = req.query;
    const { password } = req.body;
  
    jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
      if (err) {
        return res.status(400).json({ msg: "Invalid or expired token" });
      }
  
      const { email } = data;
      const hashedPassword = await bcrypt.hash(password, 10);
  
      try {
        await studentsCollection.updateOne(
          { email },
          { $set: { password: hashedPassword } }
        );
        res.json({ msg: "Password reset successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
      }
    });
  });
  

export default studentsRouter;