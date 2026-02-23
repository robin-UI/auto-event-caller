import dotenv from 'dotenv';
dotenv.config(); // Must be first — loads env vars before any other module reads them

import connectDB from './config/connectMongooDB';
connectDB();

import app from './app';
import config from './config/config';
// import './services/cronJobService';

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
