import React from 'react'
import { Link } from 'react-router-dom'

const UserSearchDetail = ({ account }) => {
    return (
        <Link to={`/profile/${account?._id}`} className=' flex items-center gap-3 bg-black hover:bg-zinc-950 p-5 border-b border-zinc-800 cursor-pointer'>
            <img src={account?.avatar} alt={account?.userName} className='size-11 rounded-full' />

            <div>
                <h1>{account?.fullName}</h1>
                <p className='text-sm  text-[#5A5E62]'>@{account?.userName}</p>
            </div>
        </Link>
    )
}

export default UserSearchDetail