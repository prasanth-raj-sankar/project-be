import express from 'express';
import { db } from '../db-utils/db-connection.js';
import { ObjectId } from 'mongodb';  // Import ObjectId from mongodb

const questionsrouter = express.Router();
const questionsCollection = db.collection('questions');

// Route to fetch all questions
questionsrouter.get('/get-questions', async (req, res) => {
    try {
        const questions = await questionsCollection.find({}).toArray();
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ msg: 'Error fetching questions', error });
    }
});

// Route to fetch questions by subject
questionsrouter.get('/get-questions/:subject', async (req, res) => {
    const { subject } = req.params;

    try {
        const questions = await questionsCollection.find({ subject: new RegExp(`^${subject}$`, "i") }).toArray();
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ msg: 'Error fetching questions', error });
    }
});

// Route to add a question
questionsrouter.post('/add-question', async (req, res) => {
    const { questionName, optionA, optionB, optionC, optionD, correctAnswer, subject } = req.body;

    if (!questionName || !optionA || !correctAnswer || !subject) {
        return res.status(400).json({ msg: 'All required fields must be filled.' });
    }

    try {
        const newQuestion = {
            questionName,
            options: {
                optionA,
                optionB,
                optionC,
                optionD,
            },
            correctAnswer,
            subject,
        };

        await questionsCollection.insertOne(newQuestion);
        res.status(201).json({ msg: 'Question added successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Error adding question', error });
    }
});

// Route to update a question by its ID
questionsrouter.put('/update-question/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        // Convert the string id to an ObjectId before querying
        const updatedQuestion = await questionsCollection.updateOne(
            { _id: new ObjectId(id) },  // Ensure correct usage of ObjectId
            { $set: updatedData }
        );
        if (updatedQuestion.matchedCount === 0) {
            return res.status(404).json({ msg: 'Question not found' });
        }
        res.status(200).json({ msg: 'Question updated successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Error updating question', error });
    }
});

// Route to delete a question by its ID
questionsrouter.delete('/delete-question/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Convert the string id to an ObjectId before querying
        const result = await questionsCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: 'Question not found' });
        }
        res.status(200).json({ msg: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Error deleting question', error });
    }
});

export default questionsrouter;























// import express from 'express';
// import { db } from '../db-utils/db-connection.js'; // Assuming MongoDB connection

// const questionsrouter = express.Router();
// const questionsCollection = db.collection('questions');


// // Route to fetch questions by subject
// questionsrouter.get('/get-questions/:subject', async (req, res) => {
//     const { subject } = req.params;
  
//     try {
//       const questions = await questionsCollection.find({ subject: new RegExp(`^${subject}$`, "i") }).toArray();
//       res.status(200).json(questions);
//     } catch (error) {
//       res.status(500).json({ msg: 'Error fetching questions', error });
//     }
//   });

// // Route to add a question
// questionsrouter.post('/add-question', async (req, res) => {
//   const { questionName, optionA, optionB, optionC, optionD, correctAnswer, subject } = req.body;

//   if (!questionName || !optionA || !correctAnswer || !subject) {
//     return res.status(400).json({ msg: 'All required fields must be filled.' });
//   }

//   try {
//     const newQuestion = {
//       questionName,
//       options: {
//         optionA,
//         optionB,
//         optionC,
//         optionD,
//       },
//       correctAnswer,
//       subject,
//     };

//     await questionsCollection.insertOne(newQuestion);
//     res.status(201).json({ msg: 'Question added successfully' });
//   } catch (error) {
//     res.status(500).json({ msg: 'Error adding question', error });
//   }
// });


// export default questionsrouter;











// questionsrouter.get('/get-questions/:subject', async (req, res) => {
//     const { subject } = req.params;
  
//     try {
//       const questions = await questionsCollection.find({ subject }).toArray();
//       res.status(200).json(questions);
//     } catch (error) {
//       res.status(500).json({ msg: 'Error fetching questions', error });
//     }
//   });
