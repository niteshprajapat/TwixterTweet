import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { routes } from '@/routes/route';
import { getCookie } from '@/utils/getCookie';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import { Bookmark, Heart, MessageCircle, Repeat2, Share, Trash2 } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import Cookies from 'universal-cookie';

const TweetData = ({ tweet }) => {
    const isBookmarked = true;
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    console.log("tweettweet", tweet);

    console.log("tweettweet2", tweet?.tweetImage?.includes(".mp4"));

    const cookies = new Cookies();
    const queryClient = useQueryClient();

    const cookiesData = getCookie("twixter");

    console.log("TweetData", tweet);

    const formattedDate = (date) => {
        const isoDate = format(new Date(date), 'MMM dd');
        return isoDate;
    }

    const isLiked = tweet?.likes?.includes(authUser?._id?.toString());


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
            queryClient.invalidateQueries({ queryKey: ["fetchAllTweets"] });
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
            queryClient.invalidateQueries({ queryKey: ["fetchAllTweets"] });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
        }
    })

    return (
        <div className='bg-black hover:bg-zinc-950 p-5 border border-zinc-800 cursor-pointer'>

            <div className='flex justify-between w-full'>



                <div className='flex gap-5 w-full'>

                    <Link to={`/profile/${tweet?.userId?._id}`}>
                        <Avatar>
                            <AvatarImage src={tweet?.userId?.avatar} alt="avatar" />
                            <AvatarFallback>{tweet?.userId?.fullName[0]}</AvatarFallback>
                        </Avatar>
                    </Link>

                    <div className='flex flex-col gap-2 w-full'>
                        <div className='flex items-center gap-2'>
                            <Link to={`/profile/${tweet?.userId?._id}`} className='flex items-center gap-1'>
                                <h1>{tweet?.userId?.fullName}</h1>
                                <span>@{tweet?.userId?.userName}</span>
                            </Link>
                            <span>{formattedDate(tweet?.createdAt)}</span>
                        </div>

                        <p>{tweet?.tweetContent}</p>

                        {
                            !tweet?.tweetImage?.includes(".mp4") ? (
                                <img src={tweet?.tweetImage} alt={tweet?.tweetContent} className='w-full rounded-[20px] h-[250px] object-cover' />
                            ) : (
                                <video src={tweet?.tweetImage} alt={tweet?.tweetContent} className='w-full rounded-[20px] h-[450px] object-contain' controls />
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
                                {isBookmarked ? <Bookmark size={17} /> : <Bookmark size={17} />}
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




        </div>)
}

export default TweetData