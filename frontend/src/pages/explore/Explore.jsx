import { routes } from '@/routes/route';
import { getCookie } from '@/utils/getCookie';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Cookies from 'universal-cookie';
import UserSearchDetail from './UserSearchDetail';

const Explore = () => {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const cookies = new Cookies();
    const queryClient = useQueryClient();

    const cookiesData = getCookie("twixter");

    const [search, setSearch] = useState("");
    const [debounceSearch, setDebounceSearch] = useState(search);


    useEffect(() => {
        const searchHandler = setTimeout(() => {
            setDebounceSearch(search)
        }, 300);

        return () => {
            clearTimeout(searchHandler)
        }

    }, [search]);


    const { data: searchData } = useQuery({
        queryKey: ["searchAccount", debounceSearch],
        queryFn: async () => {
            const response = await axios.get(`${routes.searchAccount}?query=${debounceSearch}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + cookiesData,
                },
                withCredentials: true,
            });

            const data = await response.data.users;
            console.log("searchData", data);

            return data;
        },
        enabled: !!debounceSearch,
    });




    return (
        <div className='border border-zinc-800 w-full h-screen py-2'>

            <div className='border-b border-zinc-800 pb-5'>
                <div className='max-w-[75%] mx-auto  bg-black rounded-full flex items-center gap-3 border border-[#1D9BF0] p-3'>
                    <Search size={17} color='#1D9BF0' />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder='Search'
                        type="text"
                        className='w-[85%] bg-transparent placeholder:text-[#71767B] outline-none'
                    />
                </div>
            </div>

            <div>



                {
                    searchData?.length > 0 ? (
                        searchData && searchData?.map((account) => (
                            <div key={account?._id} className=' '>
                                <UserSearchDetail account={account} />
                            </div>
                        ))
                    ) : (
                        <div className='flex  justify-center items-center py-10'>
                            <span className='text-zinc-600 font-bold text-2xl'>No Search Found!</span>
                        </div>
                    )
                }
            </div>

        </div>
    )
}

export default Explore