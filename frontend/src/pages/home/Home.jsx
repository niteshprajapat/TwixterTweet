import { routes } from '@/routes/route'
import { getCookie } from '@/utils/getCookie'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import Cookies from 'universal-cookie'
import TweetData from './TweetData'

const Home = () => {
    const cookies = new Cookies();
    const queryClient = useQueryClient();

    const cookiesData = getCookie("twixter");

    const { data: fetchAllTweets, isLoading, isError, error } = useQuery({
        queryKey: ["fetchAllTweets"],
        queryFn: async () => {
            const response = await axios.get(routes.fetchAllTweets, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + cookiesData,
                },
                withCredentials: true,
            });

            const data = await response.data.tweets;
            console.log("fetchAllTweets", data);
            return data;
        },
    });

    console.log("fetchAllTweets", fetchAllTweets);

    return (
        <div className='flex flex-col '>

            <div></div>
            <div></div>



            <div className='flex flex-col'>
                {
                    fetchAllTweets && fetchAllTweets?.map((tweet) => (
                        <div key={tweet?._id}>
                            <TweetData key={tweet?._id} tweet={tweet} />
                        </div>
                    ))
                }

            </div>

        </div>
    )
}

export default Home