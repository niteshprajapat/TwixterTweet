import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/auth/Auth';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { routes } from './routes/route';
import Home from './pages/home/Home';
import { getCookie } from './utils/getCookie';
import Sidebar from './components/sidebar/Sidebar';
import RightSidebar from './components/sidebar/RightSidebar';
import Profile from './pages/profile/Profile';
import Bookmarks from './pages/bookmarks/Bookmarks';
import Explore from './pages/explore/Explore';
import TweetPostPage from './pages/home/TweetPostPage';




const App = () => {

    const cookiesData = getCookie("twixter");
    console.log("cookiesData", cookiesData);



    const { data: authUser, isError, error, isLoading } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            const response = await axios.get(routes.meProfile, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${cookiesData}`,
                },
                withCredentials: true,
            });

            const data = await response.data?.user;
            console.log("DDDDD", data);

            return data;
        },
        retry: false,
    });

    console.log("authUser", authUser);


    return (
        <Router>
            <div className='bg-[#000] text-white'>


                <div className='flex max-w-7xl mx-auto w-full'>


                    {authUser && <Sidebar />}

                    <div className='w-[53%] mx-auto'>
                        <Routes>
                            <Route path='/auth' element={!authUser ? <Auth /> : <Navigate to={'/'} />} />
                            <Route path='/' element={authUser ? <Home /> : <Navigate to={'/auth'} />} />
                            <Route path='/profile/:userId' element={authUser ? <Profile /> : <Navigate to={'/'} />} />
                            <Route path='/bookmarks' element={authUser ? <Bookmarks /> : <Navigate to={'/'} />} />
                            <Route path='/explore' element={authUser ? <Explore /> : <Navigate to={'/'} />} />
                            <Route path='/:user/status/:tweetId' element={authUser ? <TweetPostPage /> : <Navigate to={'/'} />} />
                        </Routes>
                    </div>

                    {authUser && <RightSidebar />}
                </div>
            </div>
        </Router >
    )
}

export default App