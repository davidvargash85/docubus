import mongoose from 'mongoose';

const connectDB = async (): Promise<typeof mongoose> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!, {
      // Optional: fine-tune options if needed (most defaults are good in Mongoose 6+)
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error; // allow .catch in main server file to handle it
  }
};


export default connectDB;