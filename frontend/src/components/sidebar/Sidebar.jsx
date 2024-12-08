import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Bell, Ellipsis, Home, MessageCircle, Search, User2 } from 'lucide-react'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import axios from 'axios';
import { routes } from '@/routes/route';
import { getCookie } from '@/utils/getCookie';
import Cookies from 'universal-cookie';
import { Link, useLocation, useParams } from 'react-router-dom';

const Sidebar = () => {
    const cookies = new Cookies();
    const queryClient = useQueryClient();

    const cookiesData = getCookie("twixter");

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    console.log("THIS IS AUTH =>> ", authUser);


    const { mutate: logoutMutate, isError, error, isPending } = useMutation({
        mutationFn: async () => {
            const response = await axios.post(routes.LOGOUT, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + cookiesData,
                },
                withCredentials: true,
            });

            const data = await response.data;

            cookies.remove("twixter");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            window.location.reload();


            return data;
        },

    });



    return (
        <div className='h-screen p-5 border-r flex flex-col justify-between '>
            <div className='flex flex-col  gap-5 '>
                <div className='flex items-center gap-4 cursor-pointer hover:bg-zinc-900  py-3 px-5 rounded-full'>
                    <Home />
                    <span>Home</span>
                </div>
                <div className='flex items-center gap-4 cursor-pointer hover:bg-zinc-900  py-3 px-5 rounded-full'>
                    <Search />
                    <span>Explore</span>
                </div>
                <div className='flex items-center gap-4 cursor-pointer hover:bg-zinc-900  py-3 px-5 rounded-full'>
                    <Bell />
                    <span>Notifications</span>
                </div>
                <div className='flex items-center gap-4 cursor-pointer hover:bg-zinc-900  py-3 px-5 rounded-full'>
                    <MessageCircle />
                    <span>Messages</span>
                </div>
                <Link to={`/profile/${authUser?._id}`} className='flex items-center gap-4 cursor-pointer hover:bg-zinc-900  py-3 px-5 rounded-full'>
                    <User2 />
                    <span>Profile</span>
                </Link>
                <div className='cursor-pointer bg-white text-center hover:bg-white/85  py-3 px-5 rounded-full'>
                    <span className='font-semibold text-black'>Post</span>
                </div>
            </div>

            <div className='cursor-pointer text-black  text-center hover:bg-zinc-900  py-2 px-3 rounded-full flex justify-between items-center gap-4'>

                <div className='flex items-center gap-3'>
                    <Avatar>
                        <AvatarImage src={authUser?.avatar} alt="avatar" />
                        <AvatarFallback>{authUser?.userName?.[0]}</AvatarFallback>
                    </Avatar>

                    <div className='text-start'>
                        <p className='text-white font-semibold'>{authUser?.fullName}</p>
                        <span className='text-zinc-600'>@{authUser?.userName}</span>
                    </div>

                </div>
                <div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Ellipsis className='text-white' />
                        </PopoverTrigger>

                        <PopoverContent className="cursor-pointer hover:bg-zinc-900 mb-5 h-10 w-[200px] flex justify-center items-center bg-black text-white/80">
                            <span onClick={() => logoutMutate()} className='font-bold '>Log Out @{authUser?.userName}</span>
                        </PopoverContent>
                    </Popover>
                </div>

            </div>
        </div>
    )
}

export default Sidebar