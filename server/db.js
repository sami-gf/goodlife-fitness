import 'dotenv/config';
import mongoose from 'mongoose';

let isConnected = false;
let connectedHost = null;

export const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

export const getMongoDetails = () => ({
  connected: mongoose.connection.readyState === 1,
  host: mongoose.connection.host || connectedHost || null,
  name: mongoose.connection.name || null,
  readyState: mongoose.connection.readyState,
});

let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (connectionPromise) {
    return connectionPromise;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('YOUR_USERNAME') || uri.includes('cluster0.xxxxx')) {
    console.warn('⚠️  MONGODB_URI is not configured yet in .env.');
    console.warn('👉 Operating in High-Availability Local JSON Database mode.');
    return null;
  }

  connectionPromise = (async () => {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
      });
      isConnected = true;
      connectedHost = mongoose.connection.host;
      console.log(`✅ MongoDB Atlas Connected: ${mongoose.connection.host} (DB: ${mongoose.connection.name})`);
      return mongoose.connection;
    } catch (error) {
      console.error(`❌ MongoDB Connection Error: ${error.message}`);
      console.warn('👉 Running on resilient local persistent storage. Atlas sync will retry on demand.');
      return null;
    } finally {
      connectionPromise = null;
    }
  })();

  return connectionPromise;
};

// Monitor connection state cleanly without spamming logs
mongoose.connection.on('disconnected', () => {
  if (isConnected) {
    isConnected = false;
    console.log('⚠️  MongoDB connection dropped. Operating in local storage mode.');
  }
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  console.log('✅ MongoDB connection restored.');
});

export default connectDB;
