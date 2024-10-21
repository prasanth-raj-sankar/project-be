// import express from 'express';
// import { db } from '../db-utils/db-connection.js';

// const getrouter = express.Router();
// const questionsCollection = db.collection('questions');

// // Route to fetch questions by subject
// getrouter.get('/get-questions/:subject', async (req, res) => {
//   const { subject } = req.params;

//   try {
//     const questions = await questionsCollection.find({ subject }).toArray();
//     res.status(200).json(questions);
//   } catch (error) {
//     res.status(500).json({ msg: 'Error fetching questions', error });
//   }
// });

// export default getrouter;
