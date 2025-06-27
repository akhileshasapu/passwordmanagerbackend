import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import authroute from './routes/auth.js';
import Manageroute from './routes/manage.js';

const app = express();

// Only allow your Vercel frontend
const allowedOrigins = ['https://pass-o-ppasswordmanager.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // If you're sending cookies or authorization headers
}));

// Allow preflight (OPTIONS) requests
app.options("*", cors());

app.use(express.json());

mongoose.connect(process.env.mongo_url)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Error is ", err);
  });

app.use("/api/auth", authroute);
app.use("/api", Manageroute);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening at ${port}`));
