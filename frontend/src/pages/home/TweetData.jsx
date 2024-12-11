import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Bookmark, Heart, MessageCircle, Repeat2, Share, Trash2 } from 'lucide-react'
import React from 'react'

const TweetData = ({ tweet }) => {
    const isLiked = true;
    const isBookmarked = true;

    console.log("TweetData", tweet);

    const formattedDate = (date) => {
        const isoDate = format(new Date(date), 'MMM dd');
        return isoDate;
    }


    const { mutate: likedUnlikeMutate } = useMutation({ mutationKey: ["likedUnlikeMutate"] });

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

                <div>
                    <Trash2 />
                </div>
            </div>




        </div>)
}

export default TweetData