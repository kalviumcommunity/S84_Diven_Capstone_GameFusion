const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://sainidiven:DIVEN@cluster0.rt2gafg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected Successfully`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 