import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import path from 'path';

dotenv.config();


const __dirname = path.resolve();
const app = express();

// Configure CORS with specific options
app.use(cors());


app.use(express.json());
app.use(cookieParser());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));



app.use('/backend/auth', authRoutes);


app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Handle frontend routes - only catch routes that don't start with /backend
app.get(/^(?!\/backend).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
