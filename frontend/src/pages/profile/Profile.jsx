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


const Profile = () => {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    const cookies = new Cookies();
    const queryClient = useQueryClient();

    const cookiesData = getCookie("twixter");


    const formatDate = (date) => {
        const dateData = new Date(date)
        const formattedDate = format(dateData, 'MMMM yyyy');
        return formattedDate;
    }


    const { data: tweetsByUserId, isLoading, isError, error } = useQuery({
        queryKey: ["tweetByUserId"],
        queryFn: async () => {
            const response = await axios.get(`${routes.TWEETBYUSERID}/${authUser?._id}`, {
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


    const [currentData, setCurrentData] = useState("posts");

    console.log("tweetsByUserId", tweetsByUserId);


    return (
        <div className='flex flex-col max-h-screen overflow-auto'>
            <div className='bg-[#121314]'>
                <h1>{authUser?.fullName}</h1>
                <span>{tweetsByUserId?.length} {tweetsByUserId?.length > 1 ? "Posts" : "Post"}</span>
            </div>

            <div>
                <div className='relative h-60 w-full bg-black'>
                    <img className='w-full h-full object-cover' src={authUser?.coverImage} alt="coverImg" />

                    <div className='absolute -bottom-14 left-5 rounded-full   '>
                        <img src={authUser?.avatar} alt="avatar" className='rounded-full size-32 border-4 border-black' />
                    </div>
                </div>

                <div className='bg-black h-60 w-full p-5 pt-20'>
                    <div className=''>
                        <h1>{authUser?.fullName}</h1>
                        <span>@{authUser?.userName}</span>
                    </div>

                    <div>
                        <span>{authUser?.bio}</span>
                    </div>

                    <div className='flex items-center gap-5'>
                        <div className='flex items-center gap-3 text-[#6C7075]'>
                            <LucideLink size={15} />
                            <span className='text-[#177BBF]'>{authUser?.socialLink}</span>
                        </div>
                        <div className='flex items-center gap-3 text-[#6C7075]'>
                            <Calendar1 size={15} />
                            <span>Joined   {formatDate(authUser?.joinedOn)}</span>
                        </div>
                    </div>

                    <div className='flex items-center gap-5'>
                        <div className='flex items-center gap-[3px] hover:cursor-pointer'>
                            {authUser?.following?.length}
                            <span className='text-[#71767B]'>Following</span>
                        </div>
                        <div className='flex items-center gap-[3px] hover:cursor-pointer'>
                            {authUser?.followers?.length}
                            <span className='text-[#71767B]'>Followers</span>
                        </div>
                    </div>
                </div>

            </div>

            <div>
                <div className='flex bg-gray-700 justify-between items-center w-full '>
                    <span onClick={(e) => setCurrentData("posts")} className={`${currentData === "posts" ? "bg-[#252626] text-white font-semibold" : "bg-black text-[#6C7075]"} w-1/2 text-center py-4 cursor-pointer`}>Posts</span>
                    <span onClick={(e) => setCurrentData("likes")} className={`${currentData === "likes" ? "bg-[#252626] text-white font-semibold" : "bg-black text-[#6C7075]"} w-1/2 text-center py-4 cursor-pointer`}>Likes</span>
                </div>

                {
                    currentData === "posts" ? (
                        <div>
                            {
                                tweetsByUserId && tweetsByUserId?.map((tweet) => (
                                    <div key={tweet?._id}>
                                        <TweetIndividual key={tweet?._id} tweet={tweet} />
                                    </div>
                                ))
                            }
                        </div>
                    ) : ("")
                }


            </div>

        </div>
    )
}

export default Profile