import { routes } from '@/routes/route';
import { getCookie } from '@/utils/getCookie';
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios';
import { Calendar, Calendar1, Link, Link2, Link2Icon, LinkIcon, LucideLink } from 'lucide-react';
import React, { useState } from 'react'
import Cookies from 'universal-cookie';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import TweetIndividual from '@/components/tweet/TweetIndividual';
import TweetLikedByYou from '@/components/tweet/TweetLikedByYou';
import { useParams } from 'react-router-dom';
import EditProfile from './EditProfile';
import TweetIndividualMedia from '@/components/tweet/TweetIndividualMedia';


const Profile = () => {

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    console.log("authUser", authUser);

    const cookies = new Cookies();
    const queryClient = useQueryClient();

    const cookiesData = getCookie("twixter");

    const { userId } = useParams();

    console.log("userId", userId);




    const { data: userProfile, } = useQuery({
        queryKey: ["userByUserId"],
        queryFn: async () => {
            const response = await axios.get(`${routes.profileByUserId}/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + cookiesData,
                },
                withCredentials: true,
            });

            const data = await response.data.user;
            console.log("profileByUserId", data);
            queryClient.invalidateQueries({ queryKey: ["tweetByUserId"] });
            queryClient.invalidateQueries({ queryKey: ["tweetLikedByUserID"] });

            return data;
        },
    });

    const { data: tweetsByUserId, isLoading, isError, error } = useQuery({
        queryKey: ["tweetByUserId"],
        queryFn: async () => {
            const response = await axios.get(`${routes.tweetByUserID}/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + cookiesData,
                },
                withCredentials: true,
            });

            const data = await response.data.tweets;
            return data;
        },
    });

    console.log("tweetsByUserId", tweetsByUserId);


    const { data: tweetsLikedByUserID } = useQuery({
        queryKey: ["tweetLikedByUserID"],
        queryFn: async () => {
            const response = await axios.get(`${routes.tweetLikedByUserID}/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + cookiesData,
                },
                withCredentials: true,
            });


            const data = await response.data.likedPosts;
            return data;
        }
    })


    const formatDate = (date) => {
        const dateData = new Date(date)
        const formattedDate = format(dateData, 'MMMM yyyy');
        return formattedDate;
    }

    const [currentData, setCurrentData] = useState("posts");

    console.log("tweetsLikedByUserID", tweetsLikedByUserID);
    console.log("userProfile", userProfile);


    return (
        <div className='flex flex-col '>
            <div className='bg-[#121314]'>
                <h1>{userProfile?.fullName}</h1>
                <span>{tweetsByUserId?.length} {tweetsByUserId?.length > 1 ? "Posts" : "Post"}</span>
            </div>

            <div>
                <div className='relative h-60 w-full bg-black'>
                    <img className='w-full h-full object-cover' src={userProfile?.coverImage} alt="coverImg" />

                    <div className='absolute -bottom-14 left-5 rounded-full   '>
                        <img src={userProfile?.avatar} alt="avatar" className='rounded-full size-32 border-4 border-black' />
                    </div>
                </div>

                <div className='bg-black h-60 w-full p-5 pt-20'>
                    <div className='flex justify-between items-center'>
                        <div>
                            <h1>{userProfile?.fullName}</h1>
                            <span>@{userProfile?.userName}</span>
                        </div>

                        {
                            authUser?._id?.toString() === userId?.toString() ? (
                                <EditProfile />

                            ) : (
                                <div>
                                    follow
                                </div>
                            )
                        }


                        {/* <Button className="rounded-full bg-black border border-zinc-700">Edit Profile</Button> */}
                    </div>

                    <div>
                        <span>{userProfile?.bio}</span>
                    </div>

                    <div className='flex items-center gap-5'>
                        <div className='flex items-center gap-3 text-[#6C7075]'>
                            <LucideLink size={15} />
                            <span className='text-[#177BBF]'>{userProfile?.socialLink}</span>
                        </div>
                        <div className='flex items-center gap-3 text-[#6C7075]'>
                            <Calendar1 size={15} />
                            {/* <span>Joined   {formatDate(userProfile?.joinedOn)}</span> */}
                        </div>
                    </div>

                    <div className='flex items-center gap-5'>
                        <div className='flex items-center gap-[3px] hover:cursor-pointer'>
                            {userProfile?.following?.length}
                            <span className='text-[#71767B]'>Following</span>
                        </div>
                        <div className='flex items-center gap-[3px] hover:cursor-pointer'>
                            {userProfile?.followers?.length}
                            <span className='text-[#71767B]'>Followers</span>
                        </div>
                    </div>
                </div>

            </div>

            <div>
                <div className='flex bg-gray-700 justify-between items-center w-full '>
                    <span onClick={(e) => setCurrentData("posts")} className={`${currentData === "posts" ? "bg-[#252626] text-white font-semibold" : "bg-black text-[#6C7075]"} w-1/2 text-center py-4 cursor-pointer`}>Posts</span>

                    {
                        authUser?._id?.toString() === userId?.toString() && (
                            <span onClick={(e) => setCurrentData("likes")} className={`${currentData === "likes" ? "bg-[#252626] text-white font-semibold" : "bg-black text-[#6C7075]"} w-1/2 text-center py-4 cursor-pointer`}>Likes</span>

                        )
                    }

                    <span onClick={(e) => setCurrentData("media")} className={`${currentData === "media" ? "bg-[#252626] text-white font-semibold" : "bg-black text-[#6C7075]"} w-1/2 text-center py-4 cursor-pointer`}>Media</span>
                </div>

                {
                    currentData === "posts" ? (
                        <div>
                            {
                                tweetsByUserId?.length > 0 ? (
                                    tweetsByUserId && tweetsByUserId?.map((tweet) => (
                                        <div key={tweet?._id}>
                                            <TweetIndividual key={tweet?._id} tweet={tweet} />
                                        </div>
                                    ))
                                ) : (
                                    <div className='flex  justify-center items-center py-10'>
                                        <span className='text-zinc-600 font-bold text-2xl'>No Tweets Yet</span>
                                    </div>
                                )

                            }
                        </div>
                    ) : currentData === "likes" ? (
                        <div>
                            {
                                authUser?._id?.toString() === userId?.toString() && (

                                    tweetsLikedByUserID?.length > 0 ? (
                                        tweetsLikedByUserID && tweetsLikedByUserID?.map((likedTweet) => (
                                            <div key={likedTweet?._id}>
                                                {/* New Component for this */}
                                                <TweetLikedByYou key={likedTweet?._id} tweet={likedTweet} />
                                            </div>
                                        ))
                                    ) : (
                                        <div className='flex  justify-center items-center py-10'>
                                            <span className='text-zinc-600 font-bold text-2xl'>No Liked Tweets Yet</span>
                                        </div>
                                    )
                                )

                            }
                        </div>
                    ) : (
                        <div className='grid grid-cols-3 gap-1'>
                            {
                                tweetsByUserId?.length > 0 ? (
                                    tweetsByUserId && tweetsByUserId?.map((tweet) => (
                                        <div key={tweet?._id} className=''>
                                            <TweetIndividualMedia key={tweet?._id} tweet={tweet} />
                                        </div>
                                    ))
                                ) : (
                                    <div className='flex  justify-center items-center py-10 '>
                                        <span className='text-zinc-600 font-bold text-2xl '>No Media Found!</span>
                                    </div>
                                )

                            }
                        </div>
                    )
                }


            </div>

        </div>
    )
}

export default Profile