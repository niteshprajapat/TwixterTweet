import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import tweetRoutes from './routes/tweet.routes.js'
import './utils/passportSetup.js';
import { cloudinaryConfig } from './config/cloudinary.js';


// Configuration
dotenv.config({});
connectDB();
cloudinaryConfig();


// Initialization
const app = express();
const port = process.env.PORT || 5000;



app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());



// Middlewwares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// Route Middlewares
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/tweet', tweetRoutes);




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

