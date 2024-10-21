import express from 'express';
import { db } from '../db-utils/db-connection.js'; // Assuming MongoDB
import { ObjectId } from 'mongodb'; // Ensure you import ObjectId from MongoDB


const examRouter = express.Router();
const examsCollection = db.collection('exams');
const questionsCollection = db.collection('questions'); // Assuming there's a collection for questions

// Route to add a new exam
examRouter.post('/add-exam', async (req, res) => {
  const newExam = req.body;

  if (!newExam.subjectName || !newExam.examDesc || !newExam.examLevel || !newExam.totalQuestions || !newExam.totalMarks || !newExam.passMarks) {
    return res.status(400).json({ msg: 'All fields are required.' });
  }

  try {
    await examsCollection.insertOne(newExam);
    res.status(201).json({ msg: 'Exam added successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Error adding exam', error });
  }
});

// Route to fetch all exams
examRouter.get('/get-exams', async (req, res) => {
  try {
    const exams = await examsCollection.find({}).toArray();
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching exams', error });
  }
});

// Route to submit exam answers and calculate results
examRouter.post('/submit', async (req, res) => {
    const { subject, answers } = req.body;

    // Fetch the questions for the given subject
    try {
        const questions = await questionsCollection.find({ subject }).toArray();

        if (!questions || questions.length === 0) {
            return res.status(404).json({ msg: 'No questions found for this subject.' });
        }

        // Initialize scoring variables
        let totalMarks = questions.length;
        let score = 0;

        // Calculate the score based on the provided answers
        questions.forEach((question, index) => {
            if (answers[index] === question.answer) {
                score++;
            }
        });

        // Define passing criteria
        const passMarks = Math.ceil(totalMarks / 2); // Example: Passing marks are half of total marks
        const passed = score >= passMarks;

        // Respond with the result
        res.status(200).json({
            subject,
            totalMarks,
            score,
            passMarks,
            passed,
        });
    } catch (error) {
        res.status(500).json({ msg: 'Error processing submission', error });
    }
});


// Route to delete an exam by ID
examRouter.delete('/delete-exam/:id', async (req, res) => {
    const examId = req.params.id;
  
    try {
      // Convert the string ID to MongoDB ObjectId
      const objectId = new ObjectId(examId);
  
      // Delete the exam from the 'exams' collection
      const result = await examsCollection.deleteOne({ _id: objectId });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ msg: 'Exam not found' });
      }
  
      res.status(200).json({ msg: 'Exam deleted successfully' });
    } catch (error) {
      res.status(500).json({ msg: 'Error deleting exam', error });
    }
  });
  

export default examRouter;









// import express from 'express';
// import { db } from '../db-utils/db-connection.js'; // Assuming MongoDB

// const examRouter = express.Router();
// const examsCollection = db.collection('exams');

// // Route to add a new exam
// examRouter.post('/add-exam', async (req, res) => {
//   const newExam = req.body;

//   if (!newExam.subjectName || !newExam.examDesc || !newExam.examLevel || !newExam.totalQuestions || !newExam.totalMarks || !newExam.passMarks) {
//     return res.status(400).json({ msg: 'All fields are required.' });
//   }

//   try {
//     await examsCollection.insertOne(newExam);
//     res.status(201).json({ msg: 'Exam added successfully' });
//   } catch (error) {
//     res.status(500).json({ msg: 'Error adding exam', error });
//   }
// });

// // Route to fetch all exams
// examRouter.get('/get-exams', async (req, res) => {
//   try {
//     const exams = await examsCollection.find({}).toArray();
//     res.status(200).json(exams);
//   } catch (error) {
//     res.status(500).json({ msg: 'Error fetching exams', error });
//   }
// });



// export default examRouter;
