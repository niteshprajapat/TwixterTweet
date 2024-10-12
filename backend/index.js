import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';



// Configuration



// Initialization
const app = express();
const port = process.env.PORT || 5000;


// Middlewwares
// app.use('');


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

