import mongoose from "mongoose";

const host="127.0.0.1:27017";
const dbname="final-project";

// Local URL
// const localurl = "mongodb://127.0.0.1:27017";
const localurl =`mongodb://${host}/${dbname}`

const url = `mongodb+srv://prasanthraj0910:NVGuygHjkO86n6bG
@cluster0.bkpu2.mongodb.net/${dbname}?retryWrites=true&w=majority&appName=Cluster0`;


export const connectViaMongoose = async () => {
    try{
        // await mongoose.connect(`${url}/${dbname}`);
        await mongoose.connect(url);
        console.log("connect to db via mongoose")
    }catch (e){
        console.log("error in connect to Db", e);
        process.exit(1);
    }
};


