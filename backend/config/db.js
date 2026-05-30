import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const connString = process.env.MONGO_URI || 'mongodb://localhost:27017/eduai';
    console.log(`[Database] Connecting to: ${connString.replace(/:([^@]+)@/, ':****@')}`);
    
    const conn = await mongoose.connect(connString);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database] Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
