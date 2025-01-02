
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { routes } from '@/routes/route';
import { getCookie } from '@/utils/getCookie';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import { Bookmark, Heart, Link2, Link2Icon, LucideLink, MessageCircle, Repeat2, Share, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Cookies from 'universal-cookie';

const TweetPostPage = () => {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });



    const { user, tweetId } = useParams();
    const cookies = new Cookies();
    const queryClient = useQueryClient();

    const cookiesData = getCookie("twixter");



    const { data: fetchCommentByTweetId } = useQuery({
        queryKey: ["fetchCommentByTweetId", tweetId],
        queryFn: async () => {
            const response = await axios.get(`${routes.fetchCommentByTweetId}/${tweetId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + cookiesData,
                },
                withCredentials: true,
            });

            const data = await response.data?.comments;
            console.log("fetchCommentByTweetId", data);
            return data;
        }
    })

    const { data: tweetByTweetId } = useQuery({
        queryKey: ["tweetByTweetId", tweetId],
        queryFn: async () => {
            const response = await axios.get(`${routes.fetchTweetByTweetId}/${tweetId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + cookiesData,
                },
                withCredentials: true,
            });

            const data = await response.data?.tweet;
            console.log("tweetByTweetId", data);
            return data;
        }
    });

    const isBookmarked = authUser?.bookmarkedTweet?.includes(tweetByTweetId?._id?.toString());
    const isLiked = tweetByTweetId?.likes?.includes(authUser?._id?.toString());

    console.log("fetchCommentByTweetId", fetchCommentByTweetId);

    return (
        <div className='bg-black   border border-zinc-800 cursor-pointer h-screen'>

            <div className='flex justify-between w-full p-5'>



                <div className='flex gap-5 w-full'>

                    <Link to={`/profile/${tweetByTweetId?.userId?._id}`}>
                        <Avatar>
                            <AvatarImage src={tweetByTweetId?.userId?.avatar} alt="avatar" />
                            <AvatarFallback>{tweetByTweetId?.userId?.fullName[0]}</AvatarFallback>
                        </Avatar>
                    </Link>

                    <div className='flex flex-col gap-2 w-full'>
                        <div className='flex items-center gap-2'>
                            <Link to={`/profile/${tweetByTweetId?.userId?._id}`} className='flex items-center gap-1'>
                                <h1>{tweetByTweetId?.userId?.fullName}</h1>
                                <span>@{tweetByTweetId?.userId?.userName}</span>
                            </Link>
                            {/* <span>{formattedDate(tweet?.createdAt)}</span> */}
                        </div>

                        <p>{tweetByTweetId?.tweetContent}</p>

                        {

                            tweetByTweetId?.tweetImage && (
                                !tweetByTweetId?.tweetImage?.includes(".mp4") ? (
                                    <img src={tweetByTweetId?.tweetImage} alt={tweetByTweetId?.tweetContent} className='w-full rounded-[20px] h-[250px] object-cover' />
                                ) : (
                                    <video src={tweetByTweetId?.tweetImage} alt={tweetByTweetId?.tweetContent} className='w-full rounded-[20px] h-[400px] object-contain' controls muted />
                                )
                            )
                        }

                        <div className='flex justify-between items-center mt-3 p-1 w-full'>
                            <div className='flex items-center gap-1' title='comment'>
                                <MessageCircle size={16} />
                                <span>{tweetByTweetId?.comments?.length}</span>
                            </div>
                            <div className='flex items-center gap-1' title='retweet'>
                                <Repeat2 size={16} />
                                <span>{tweetByTweetId?.retweet?.length}</span>
                            </div>
                            <div className='flex items-center gap-1' title='like'>


                                <Heart size={16} fill={isLiked ? 'red' : 'none'} color={isLiked ? 'red' : 'white'} onClick={(e) => {
                                    e.stopPropagation();
                                    likedUnlikeMutate(tweetByTweetId?._id)
                                }}
                                />
                                <span>{tweetByTweetId?.likes?.length}</span>
                            </div>
                            <div title='bookmark'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    bookMarkTweet(tweetByTweetId?._id)
                                }}

                            // onClick={() => bookMarkTweet(tweet?._id)}
                            >
                                {isBookmarked ? <Bookmark size={17} color='#1D9BF0' fill='#1D9BF0' /> : <Bookmark size={17} />}
                            </div>

                            <div className='flex items-center gap-1' title='share'>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Share size={17} />
                                    </PopoverTrigger>

                                    <PopoverContent onClick={(e) => handleCopyLink(e)} className="flex gap-5 items-center cursor-pointer hover:bg-zinc-900 mb-5 h-10 w-[130px]  bg-black text-white/80">
                                        <LucideLink size={14} />
                                        <span className='text-xs '>Copy Link</span>
                                    </PopoverContent>
                                </Popover>

                            </div>
                        </div>


                    </div>




                </div>

                {
                    authUser?._id?.toString() === tweetByTweetId?.userId?._id?.toString() && (
                        <div title='delete'>
                            <Trash2 onClick={() => deleteMutate(tweetByTweetId?._id)} size={17} color='#BB1923' />
                        </div>
                    )
                    // <Trash2 onClick={() => deleteMutate(tweet?._id)} size={17} color='#BB1923' />
                }


            </div>


            <div className=' flex items-center gap-3 bg-black hover:bg-zinc-950 p-5 border-b border-zinc-800 cursor-pointer'>


            </div>
        </div>
    )
}

export default TweetPostPage;








// return (
//         <Link to={`/profile/${account?._id}`} className=' flex items-center gap-3 bg-black hover:bg-zinc-950 p-5 border-b border-zinc-800 cursor-pointer'>
//             <img src={account?.avatar} alt={account?.userName} className='size-11 rounded-full' />

//             <div>
//                 <h1>{account?.fullName}</h1>
//                 <p className='text-sm  text-[#5A5E62]'>@{account?.userName}</p>
//             </div>
//         </Link>
//     )