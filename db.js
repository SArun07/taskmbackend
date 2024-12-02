const mongoose = require('mongoose');

// Use environment variables to configure the MongoDB URI
const password = encodeURIComponent(process.env.MONGO_PASSWORD.trim());
const MONGO_URI =`mongodb+srv://arunsingh0789:${password}@taskcluster.fzu6s.mongodb.net/?retryWrites=true&w=majority&appName=TaskCluster`;

const mongoURI = MONGO_URI;

// Function to connect to MongoDB
const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectToMongo;


//  The below code for local system

// const mongoose= require('mongoose');
// const mongoURI = "mongodb://localhost:27017/taskm";

// const connetcToMongo = () =>{
//     mongoose.connect(mongoURI, ()=>{
//         console.log("Connected to Mongo Successfully")
//     })
// }

// module.exports = connetcToMongo;