// Mongoose Models used in the application
import { model, Schema } from "mongoose";

// No/Empty Scheme --> No validation

const studentScheme = new Schema({
  password: {
    type: "string",
    minLength: [6, "Should be 6 characters in length"],
    maxLength: 12,
    required: true,
  },
});

// const adminSchema = new Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   isLoggedIn: { type: Boolean, default: false },
// });

const adminSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isLoggedIn: { type: Boolean, default: false },  // Ensure this is part of the schema
});




export const studentModel = new model("student", studentScheme, "students");
export const adminModel =new model("admin", adminSchema, "admins");

