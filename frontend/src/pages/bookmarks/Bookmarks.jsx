import { routes } from '@/routes/route'
import { getCookie } from '@/utils/getCookie'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import Cookies from 'universal-cookie'
import BookmarkTweet from './BookmarkTweet'

const Bookmarks = () => {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const cookies = new Cookies();
    const queryClient = useQueryClient();

    const cookiesData = getCookie("twixter");


    const { data: fetchAllBookmarkTweets } = useQuery({
        queryKey: ["fetchAllBookmarkTweets"],
        queryFn: async () => {
            const response = await axios.get(routes.fetchAllBookMarkTweets, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + cookiesData,
                },
                withCredentials: true,
            });

            const data = await response.data?.bookmarks;
            console.log("fetchAllBookmarkTweets", data);
            return data;
        },
    });

    console.log("fetchAllBookmarkTweets", fetchAllBookmarkTweets);

    return (
        <div className='border border-zinc-800 w-full h-full'>
            {
                fetchAllBookmarkTweets?.bookmarkedTweet?.length > 0 ? (
                    fetchAllBookmarkTweets?.bookmarkedTweet?.map((bookmarkTweet) => (
                        <div key={bookmarkTweet?._id} >
                            <BookmarkTweet bookmarktweet={bookmarkTweet} />
                        </div>

                    ))

                ) : (
                    <div className='flex  justify-center items-center py-10'>
                        <span className='text-zinc-600 font-bold text-2xl'>No Bookmaarked Found!</span>
                    </div>
                )
            }
        </div>
    )
}

export default Bookmarks