import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { routes } from '@/routes/route';
import { getCookie } from '@/utils/getCookie';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import { Bookmark, Heart, Link2, Link2Icon, LucideLink, MessageCircle, Repeat2, Share, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Cookies from 'universal-cookie';

const TweetData = ({ tweet }) => {
    const navigate = useNavigate();
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const isBookmarked = authUser?.bookmarkedTweet?.includes(tweet?._id?.toString());
    const { pathname, } = useLocation();
    const [copyLink, setCopyLink] = useState("");
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
    });

    const { mutate: bookMarkTweet } = useMutation({
        mutationKey: ["bookMarkTweet"],
        mutationFn: async (tweetID) => {
            const response = await axios.post(`${routes.bookMarkTweet}/${tweetID}`, {}, {
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
            console.log("bookMarkTweet1", data);
            toast.success(data?.message);
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
        onError: (error) => {
            console.log(error);
        }
    });



    const handleCopyLink = async (e) => {
        e.stopPropagation();

        const newLink = `http://localhost:5173/${tweet?._id}`;

        navigator.clipboard.writeText(newLink).then(() => {
            toast.success("Link copied!")
        }).catch(() => {
            toast.error("Failed to copy link!");
        })
    }

    console.log("tweet", tweet)


    const [addComment, setAddComment] = useState("");
    const [openComment, setOpenComment] = useState(false);


    const { mutate: commentMutate } = useMutation({
        mutationFn: async (commentData) => {
            const response = await axios.post(`${routes.createCommment}/${tweet?._id}`, {
                comment: commentData.addComment
            }, {
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
            console.log("commentMutate", data);
            toast.success(data?.message);
            queryClient.invalidateQueries({ queryKey: ["fetchAllTweets"] });
            queryClient.invalidateQueries({ queryKey: ["fetchCommentByTweetId"] });
        },
        onError: (error) => {
            console.log(error);
        }

    })



    return (
        <div onClick={() => navigate(`/${tweet?.userId?.userName}/status/${tweet?._id}`)} className='bg-black hover:bg-zinc-950 p-5 border border-zinc-800 cursor-pointer'>

            {/* <div className='bg-black hover:bg-zinc-950 p-5 border border-zinc-800 cursor-pointer'> */}

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

                            tweet?.tweetImage && (
                                !tweet?.tweetImage?.includes(".mp4") ? (
                                    <img src={tweet?.tweetImage} alt={tweet?.tweetContent} className='w-full rounded-[20px] h-[250px] object-cover' />
                                ) : (
                                    <video src={tweet?.tweetImage} alt={tweet?.tweetContent} className='w-full rounded-[20px] h-[400px] object-contain' controls muted />
                                )
                            )
                        }

                        <div className='flex justify-between items-center mt-3 p-1 w-full'>
                            <div onClick={(e) => {
                                e.stopPropagation();
                                setOpenComment(!openComment)
                            }}
                                className='flex items-center gap-1' title='comment'
                            >

                                <MessageCircle size={16} />
                                <span>{tweet?.comments?.length}</span>




                            </div>
                            <div className='flex items-center gap-1' title='retweet'>
                                <Repeat2 size={16} />
                                <span>{tweet?.retweet?.length}</span>
                            </div>
                            <div className='flex items-center gap-1' title='like'>
                                <Heart size={16} fill={isLiked ? 'red' : 'none'} color={isLiked ? 'red' : 'white'} onClick={(e) => {
                                    e.stopPropagation();
                                    likedUnlikeMutate(tweet?._id)
                                }}
                                />
                                <span>{tweet?.likes?.length}</span>
                            </div>
                            <div title='bookmark'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    bookMarkTweet(tweet?._id)
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

                        <div>
                            {
                                openComment && (
                                    <div className='flex justify-between items-center gap-1'>
                                        <div className='flex items-center gap-3 w-full'>
                                            <Link to={`/profile/${tweet?.userId?._id}`}>
                                                <Avatar>
                                                    <AvatarImage src={authUser?.avatar} alt="avatar" />
                                                    <AvatarFallback>{authUser?.fullName[0]}</AvatarFallback>
                                                </Avatar>
                                            </Link>

                                            <input
                                                value={addComment}
                                                onChange={(e) => setAddComment(e.target.value)}
                                                className=' w-full outline-none border-none rounded-[5px] bg-black border border-zinc-800 h-9 max-w-[80%] px-5 text-white'
                                                placeholder='Post your reply'
                                            />
                                        </div>
                                        <Button onClick={() => commentMutate({ addComment })} className="rounded-full bg-white hover:bg-white text-black">Reply</Button>
                                    </div>
                                )
                            }
                        </div>


                    </div>




                </div>

                {
                    authUser?._id?.toString() === tweet?.userId?._id?.toString() && (
                        <div title='delete'>
                            <Trash2 onClick={() => deleteMutate(tweet?._id)} size={17} color='#BB1923' />
                        </div>
                    )
                    // <Trash2 onClick={() => deleteMutate(tweet?._id)} size={17} color='#BB1923' />
                }


            </div>




        </div>)
}

export default TweetData