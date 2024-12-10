const BASE_CASE = "http://127.0.0.1:5000/api/v1"

export const routes = {
    register: `${BASE_CASE}/auth/register`,
    login: `${BASE_CASE}/auth/login`,
    logout: `${BASE_CASE}/auth/logout`,
    meProfile: `${BASE_CASE}/user/me`,


    // tweets routes

    tweetByUserID: `${BASE_CASE}/tweet/tweetsByUserId`, // /:userId
    tweetLikedByUserID: `${BASE_CASE}/tweet/likedTweetByUserId`, // /:userId
}

