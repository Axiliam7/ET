import mongoose from 'mongoose';

const MAX_RETRIES = 5;
const RETRY_BASE_MS = 5000;

let retryTimer = null;
let isConnecting = false;

const MONGO_OPTIONS = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  tls: true,
  family: 4,
  retryWrites: true,
};

const connectDB = async (attempt = 1) => {
  if (!process.env.MONGODB_URI) {
    console.error('✗ MONGODB_URI environment variable is not set. Cannot connect to MongoDB.');
    process.exit(1);
  }

  if (isConnecting) return;
  isConnecting = true;

  try {
    await mongoose.connect(process.env.MONGODB_URI, MONGO_OPTIONS);
    console.log('✓ Connected to MongoDB');
    isConnecting = false;
  } catch (err) {
    isConnecting = false;
    console.error(`✗ MongoDB connection failed (attempt ${attempt}/${MAX_RETRIES}): ${err.message}`);
    if (attempt < MAX_RETRIES) {
      const delay = Math.pow(2, attempt - 1) * RETRY_BASE_MS;
      console.log(`  Retrying in ${delay / 1000}s…`);
      retryTimer = setTimeout(() => connectDB(attempt + 1), delay);
    } else {
      console.error('  Max retries reached. Exiting.');
      process.exit(1);
    }
  }
};

mongoose.connection.on('connected', () => {
  console.log('✓ MongoDB connection established');
});

mongoose.connection.on('reconnected', () => {
  console.log('✓ MongoDB reconnected');
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠ MongoDB disconnected. Attempting to reconnect…');
  if (retryTimer) {
    clearTimeout(retryTimer);
    retryTimer = null;
  }
  connectDB(1).catch((err) => {
    console.error('✗ Reconnect attempt failed:', err.message);
  });
});

mongoose.connection.on('error', (err) => {
  console.error('✗ MongoDB connection error:', err.message);
});

export { connectDB };
