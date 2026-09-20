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

const DEFAULT_MONGO_URI = 'mongodb+srv://samirbhandari666_db_user:9ZnsPrZ87GziDtsu@cluster0.sl6gxgc.mongodb.net/goodlifefitness?retryWrites=true&w=majority&appName=Cluster0';

let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (connectionPromise) {
    return connectionPromise;
  }

  const uri = process.env.MONGODB_URI || DEFAULT_MONGO_URI;

  if (!uri || uri.includes('YOUR_USERNAME') || uri.includes('cluster0.xxxxx')) {
    console.warn('⚠️  MONGODB_URI is not configured yet.');
    console.warn('👉 Operating in High-Availability Local JSON Database mode.');
    return null;
  }

  connectionPromise = mongoose
    .connect(uri, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    })
    .then((conn) => {
      isConnected = true;
      connectedHost = mongoose.connection.host;
      console.log(`✅ MongoDB Atlas Connected: ${mongoose.connection.host} (DB: ${mongoose.connection.name})`);
      return conn;
    })
    .catch((error) => {
      console.error(`❌ MongoDB Connection Error: ${error.message}`);
      console.warn('👉 Running on resilient storage. Will retry on next request.');
      connectionPromise = null;
      return null;
    });

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
