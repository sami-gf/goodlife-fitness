import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('YOUR_USERNAME') || uri.includes('cluster0.xxxxx')) {
    console.warn('⚠️  MONGODB_URI is not configured yet in .env.');
    console.warn('👉 Please update .env with your MongoDB Atlas or local MongoDB connection string.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('👉 Make sure your MONGODB_URI in .env is correct and IP whitelist is set in Atlas.');
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

export default connectDB;
