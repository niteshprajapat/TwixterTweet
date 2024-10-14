import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();



const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    }
})







export const sendLoginEmail = async (userEmail) => {
    try {
        const info = await transporter.sendMail({
            from: `TwisterTweet <${process.env.EMAIL_USER}> `,
            to: userEmail,
            subject: "Login Notification",
            text: "Hello! You have just logged into your account.",
            html: `<p>Hello! You have just logged into your account.</p>`,
        });

        console.log("Login mail Sent");
        console.log(`Login email send: ${info?.messageId}`);


    } catch (error) {
        console.log("Error sending login email", error);
    }
}



