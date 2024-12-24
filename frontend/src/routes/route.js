const BASE_URL = "http://127.0.0.1:5000/api/v1"

export const routes = {
    register: `${BASE_URL}/auth/register`,
    login: `${BASE_URL}/auth/login`,
    logout: `${BASE_URL}/auth/logout`,
    meProfile: `${BASE_URL}/user/me`,

    profileByUserId: `${BASE_URL}/user/profile`, // /:userId

    uploadFile: `${BASE_URL}/user/uploadFile`,

    searchAccount: `${BASE_URL}/user/search`,  // ?query=    


    // tweets routes

    createTweet: `${BASE_URL}/tweet/createTweet`,
    fetchAllTweets: `${BASE_URL}/tweet/fetchAllTweets`,
    fetchTweetByTweetId: `${BASE_URL}/tweet/tweetsById`, // /:tweetId

    tweetByUserID: `${BASE_URL}/tweet/tweetsByUserId`, // /:userId
    tweetLikedByUserID: `${BASE_URL}/tweet/likedTweetByUserId`, // /:userId
    likeUnlikeTweetByTweetID: `${BASE_URL}/tweet/likeUnlikeTweet`, // /:tweetId 
    deleteTweetByTweetID: `${BASE_URL}/tweet/deleteTweet`, // /:tweetId

    bookMarkTweet: `${BASE_URL}/tweet/bookmark-tweet`, // /:tweetId
    fetchAllBookMarkTweets: `${BASE_URL}/tweet/get-bookmark-tweets`,

    // comment routes
    createCommment: `${BASE_URL}/comment/createComment`,  //   /:tweetId

    fetchCommentByTweetId: `${BASE_URL}/comment/fetchCommentsByTweetId`, //   /:tweetId 
}

