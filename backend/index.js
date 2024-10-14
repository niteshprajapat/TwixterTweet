import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.routes.js'



// Configuration
dotenv.config({});
connectDB();


// Initialization
const app = express();
const port = process.env.PORT || 5000;


// Middlewwares
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
}));


// Route Middlewares
app.use('/api/v1/auth', authRoutes);




// Home Route
app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "This is Home Page of TwixterTweet",
    });
});


// App listen
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

