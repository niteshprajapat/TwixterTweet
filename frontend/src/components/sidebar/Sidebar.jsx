import { Bell, Home, MessageCircle, Search, User2 } from 'lucide-react'
import React from 'react'

const Sidebar = () => {
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
                <div className='flex items-center gap-4 cursor-pointer hover:bg-zinc-900  py-3 px-5 rounded-full'>
                    <User2 />
                    <span>Profile</span>
                </div>
                <div className='cursor-pointer bg-white text-center hover:bg-white/85  py-3 px-5 rounded-full'>
                    <span className='font-semibold text-black'>Post</span>
                </div>
            </div>

            <div className='cursor-pointer bg-white text-center hover:bg-white/85  py-3 px-5 rounded-full'>

            </div>
        </div>
    )
}

export default Sidebar