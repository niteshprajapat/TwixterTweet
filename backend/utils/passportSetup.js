import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'auth/google/callback'
        },

        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });

                console.log("PROFILE", profile);

                if (!user) {
                    user = await User.create({
                        googleId: profile.id,
                        fullName: profile?.displayName,
                        email: profile.emails[0].value,
                        avatar: profile.photos[0].value,
                        bio: '',           // default bio
                        coverImage: '',             // default cover image
                        socialLink: profile.profileUrl || '',           // using Google profile URL if available
                        followers: [],                                  // empty array for followers
                        following: [],                                  // empty array for following
                        joinedOn: Date.now(),                           // current date
                    })
                } else {
                    done(null, user);
                }
            } catch (error) {
                done(err, null);
            }
        }

    )
)