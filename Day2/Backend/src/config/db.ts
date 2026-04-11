import mongoose from 'mongoose';
import config_api from './config.js';

const connectDB = async () => {
    try {
        const uri = (process.env.MONGO_URI as string) || 'mongodb://127.0.0.1:27017/ai-chat';
        await mongoose.connect(uri);
        console.log('MongoDB Connected successfully.');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

export default connectDB;
