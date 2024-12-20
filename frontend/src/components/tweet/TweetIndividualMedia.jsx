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

const TweetIndividualMedia = ({ tweet }) => {

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
        <div className='h-[150px] w-[180px]'>
            {
                tweet?.tweetImage && (
                    !tweet?.tweetImage?.includes(".mp4") ? (
                        <img src={tweet?.tweetImage} alt={tweet?.tweetContent} className='w-full aspect-square  object-cover' />
                    ) : (
                        <video src={tweet?.tweetImage} alt={tweet?.tweetContent} className='w-full aspect-square  object-contain' controls muted />
                    )
                )
            }
        </div>
    )
}


export default TweetIndividualMedia