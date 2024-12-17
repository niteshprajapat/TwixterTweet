import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Bookmark, Heart, MessageCircle, Repeat, Repeat2, Share, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { routes } from '@/routes/route';
import Cookies from 'universal-cookie';
import { getCookie } from '@/utils/getCookie';
import { toast } from 'sonner';

const TweetIndividual = ({ tweet }) => {

    const formattedDate = (date) => {
        const isoDate = format(new Date(date), 'MMM dd');
        return isoDate;
    }

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const { data: tweetByUserId } = useQuery({ queryKey: ["tweetByUserId"] });


    const isBookmarked = authUser?.bookmarkedTweet?.includes(tweet?._id?.toString());

    console.log("tweet", tweet);

    const cookies = new Cookies();
    const queryClient = useQueryClient();

    const cookiesData = getCookie("twixter");





    const { mutate: likedUnlikeMutate } = useMutation({
        mutationKey: ["likedUnlikeMutate"],
        mutationFn: async (tweetID) => {
            const response = await axios.post(`${routes.likeUnlikeTweetByTweetID}/${tweetID}`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + cookiesData,
                },
                withCredentials: true,
            });

            const data = await response.data;
            return data;
        },
        onSuccess: (data) => {
            console.log("dataLIKED", data);
            queryClient.invalidateQueries({ queryKey: ["tweetByUserId"] });
            queryClient.invalidateQueries({ queryKey: ["tweetLikedByUserID"] });
            toast.success(data?.message);

        }
    });

    const { mutate: deleteMutate, } = useMutation({
        mutationFn: async (tweetID) => {
            const response = await axios.delete(`${routes.deleteTweetByTweetID}/${tweetID}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + cookiesData,
                },
                withCredentials: true,
            });

            const data = await response.data;
            return data;
        },
        onSuccess: (data) => {
            console.log("TWEETDELEET", data);
            toast.success(data?.message);
            queryClient.invalidateQueries({ queryKey: ["tweetByUserId"] });
            queryClient.invalidateQueries({ queryKey: ["fetchAllTweets"] });
            queryClient.invalidateQueries({ queryKey: ["tweetLikedByUserID"] });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);

        }
    })


    const isLiked = tweet?.likes?.includes(authUser?._id?.toString());

    console.log("isLiked", isLiked);



    return (
        <div className='bg-black hover:bg-zinc-950 p-5 border border-zinc-800 cursor-pointer'>

            <div className='flex justify-between w-full'>



                <div className='flex gap-5 w-full'>

                    <Avatar>
                        <AvatarImage src={tweet?.userId?.avatar} alt="avatar" />
                        <AvatarFallback>{tweet?.userId?.fullName[0]}</AvatarFallback>
                    </Avatar>

                    <div className='flex flex-col gap-2 w-full'>
                        <div className='flex items-center gap-1'>
                            <h1>{tweet?.userId?.fullName}</h1>
                            <span>@{tweet?.userId?.userName}</span>
                            <span>{formattedDate(tweet?.createdAt)}</span>
                        </div>

                        <p>{tweet?.tweetContent}</p>

                        {
                            tweet?.tweetImage && (
                                <img src={tweet?.tweetImage} alt={tweet?.tweetContent} className='w-full rounded-lg' />
                            )
                        }

                        <div className='flex justify-between items-center mt-3 p-1 w-full'>
                            <div className='flex items-center gap-1'>
                                <MessageCircle size={16} />
                                <span>{tweet?.comments?.length}</span>
                            </div>
                            <div className='flex items-center gap-1'>
                                <Repeat2 size={16} />
                                <span>{tweet?.retweet?.length}</span>
                            </div>
                            <div className='flex items-center gap-1'>


                                <Heart size={16} fill={isLiked ? 'red' : 'none'} color={isLiked ? 'red' : 'white'} onClick={() => likedUnlikeMutate(tweet?._id)} />
                                <span>{tweet?.likes?.length}</span>
                            </div>
                            <div>
                                {isBookmarked ? <Bookmark color='pink' size={17} /> : <Bookmark size={17} />}
                            </div>
                            <div className='flex items-center gap-1'>
                                <Share size={17} />
                            </div>
                        </div>


                    </div>




                </div>

                {
                    authUser?._id?.toString() === tweet?.userId?._id?.toString() && (
                        <div>
                            <Trash2 onClick={() => deleteMutate(tweet?._id)} />
                        </div>
                    )
                }
            </div>




        </div>
    )
}

export default TweetIndividual