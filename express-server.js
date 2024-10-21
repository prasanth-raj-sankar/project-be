// express-server.js

import express from 'express';
import cors from 'cors';
import { connectbd } from "./db-utils/db-connection.js";
import studentsRouter from './routes/students.js';
import adminRouter from './routes/admin.js';
import questionsrouter from './routes/AddQuestion.js';
import examRouter from './routes/exam.js';
// import resultRouter from './routes/result.js';
import { connectViaMongoose } from "./db-utils/mongoos-connetions.js";
// import { createInitialAdmin } from './initialAdminSetup.js';
import { createInitialAdmin } from './initialAdminSetup.js';


const server = express();


server.use(express.json());
server.use(cors());

server.use('/students', studentsRouter);
server.use('/admins', adminRouter);
server.use('/questions', questionsrouter);
server.use('/exams', examRouter);
// server.use('/result', resultRouter);

const PORT = 4500;

await connectViaMongoose();
await connectbd();
createInitialAdmin();



server.listen(PORT, () => {
  console.log("Server listening on ", PORT);
});


