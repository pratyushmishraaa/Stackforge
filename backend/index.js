import dotenv from 'dotenv';
dotenv.config({ path: './env/.env' });

import app from './src/app.js';
import connectDB from './src/database/mongo.js';
import logger from './src/utils/logger.js';

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
