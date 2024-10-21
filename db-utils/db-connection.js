import mongodb from 'mongodb';
import dotenv from "dotenv"

dotenv.config();

// const localdb = "127.0.0.1:27017"; //localhost:27017
const dbname= "final-project";

// colud db
// const url = `mongodb+srv://prasanthraj0910:NVGuygHjkO86n6bG
// @cluster0.bkpu2.mongodb.net/${dbname}?retryWrites=true&w=majority&appName=Cluster0`;

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}`;

export const client = new mongodb.MongoClient(url);

// localdb
// const client = new mongodb.MongoClient(`mongodb://${localdb}`);

export const db = client.db(dbname);

export const connectbd = async () => {
    try{
        await client.connect();
        console.log("db connected successfully");
    }catch (e) {
        console.log("erro in connecting to db", e);
        process.exit();
    }
};


 
