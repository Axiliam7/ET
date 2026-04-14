import mongoose from 'mongoose';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Connect to MongoDB with retry logic for transient failures.
 * Exits the process if all retries are exhausted.
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('✗ MONGODB_URI is not set. Check your .env file.');
    process.exit(1);
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await mongoose.connect(uri);
      console.log('✓ Connected to MongoDB Atlas');
      return;
    } catch (err) {
      const isLast = attempt === MAX_RETRIES;
      console.error(
        `✗ MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed: ${err.message}`
      );

      if (isLast) {
        console.error(
          '  Troubleshooting tips:\n' +
          '  • IP Whitelist: add your IP to Atlas Network Access (or 0.0.0.0/0 for dev)\n' +
          '  • Credentials: verify username/password in MONGODB_URI (URL-encode special chars)\n' +
          '  • Connection string: ensure retryWrites=true&w=majority is present'
        );
        process.exit(1);
      }

      console.log(`  Retrying in ${RETRY_DELAY_MS / 1000}s…`);
      await sleep(RETRY_DELAY_MS);
    }
  }
}
