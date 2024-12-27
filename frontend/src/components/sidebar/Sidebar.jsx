import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Bell, BookmarkIcon, Ellipsis, Home, MessageCircle, Search, User2 } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import axios from 'axios';
import { routes } from '@/routes/route';
import { getCookie } from '@/utils/getCookie';
import Cookies from 'universal-cookie';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const Sidebar = () => {
    const { pathname } = useLocation();
    const cookies = new Cookies();
    const queryClient = useQueryClient();

    const cookiesData = getCookie("twixter");






    const imageRef = useRef();
    const [tweetContent, setTweetContent,] = useState("");
    const [tweetImage, setTweetImage,] = useState("");
    const [filePreview, setFilePreview] = useState(null);


    const readFileAsDataUrl = async (file) => {
        const fileUrlData = new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error("Error reading file"));

            reader.readAsDataURL(file);
        });

        return fileUrlData;
    }


    const handleUploadPost = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file) {

                const dataUri = await readFileAsDataUrl(file);
                setFilePreview(dataUri);
            }


            try {
                const response = await axios.post(`${routes.uploadFile}`, {
                    media: file
                }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                });


                const data = await response.data;

                if (data?.success) {
                    console.log("pictureda,", data);
                    setTweetImage(data?.url);
                }


            } catch (error) {
                console.log(error);
            }
        }
    }














    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    console.log("THIS IS AUTH =>> ", authUser);


    const { mutate: createTweetMutate } = useMutation({
        mutationFn: async (dataTweet) => {
            const response = await axios.post(`${routes.createTweet}`, dataTweet, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + cookiesData,
                },
                withCredentials: true,
            });

            const data = await response.data;
            console.log("createTweet", data);

            return data;
        },
        onSuccess: (data) => {
            console.log("createTweetDATA", data);
            queryClient.invalidateQueries({ queryKey: ["fetchAllTweets"] });
            queryClient.invalidateQueries({ queryKey: ["tweetByUserId"] });


        },
        onerror: (error) => {
            console.log(error);
        }
    })


    const { mutate: logoutMutate, isError, error, isPending } = useMutation({
        mutationFn: async () => {
            const response = await axios.post(routes.logout, {}, {
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

    console.log("tweetImage", tweetImage);

    return (
        // <div className='h-screen p-5  border-r  border-zinc-800 flex flex-col justify-between fixed w-[20%]'>
        <div className='h-screen p-5    border-zinc-800 flex flex-col justify-between fixed w-[20%]'>
            <div className='flex flex-col  gap-5 '>
                <Link to={"/"} className='flex items-center gap-4 cursor-pointer hover:bg-zinc-900  py-3 px-5 rounded-full'>
                    <Home />
                    <span>Home</span>
                </Link>
                <Link to={"/explore"} className='flex items-center gap-4 cursor-pointer hover:bg-zinc-900  py-3 px-5 rounded-full'>
                    <Search />
                    <span>Explore</span>
                </Link>
                <div className='flex items-center gap-4 cursor-pointer hover:bg-zinc-900  py-3 px-5 rounded-full'>
                    <Bell />
                    <span>Notifications</span>
                </div>
                <div className='flex items-center gap-4 cursor-pointer hover:bg-zinc-900  py-3 px-5 rounded-full'>
                    <MessageCircle />
                    <span>Messages</span>
                </div>
                <Link to={`/bookmarks`} className='flex items-center gap-4 cursor-pointer hover:bg-zinc-900  py-3 px-5 rounded-full'>
                    <BookmarkIcon />
                    <span>Bookmarks</span>
                </Link>
                <Link to={`/profile/${authUser?._id}`} className='flex items-center gap-4 cursor-pointer hover:bg-zinc-900  py-3 px-5 rounded-full'>
                    <User2 />
                    <span>Profile</span>
                </Link>
                <div className='cursor-pointer bg-white text-center hover:bg-white/85  py-3 px-5 rounded-full'>

                    <Dialog onOpenChange={() => {
                        setTweetContent("")
                        setTweetImage("")
                        setFilePreview(null);
                    }}


                        className=""
                    >
                        <DialogTrigger asChild>
                            <span className='font-semibold text-black'>Post</span>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-black p-5 ">
                            <div className='flex items-center gap-5'>
                                <Avatar>
                                    <AvatarImage src={authUser?.avatar} alt="avatar" />
                                    <AvatarFallback>{authUser?.userName?.[0]}</AvatarFallback>
                                </Avatar>

                                <div>
                                    <input
                                        value={tweetContent}
                                        onChange={(e) => setTweetContent(e.target.value)}
                                        placeholder="What is happening?!"
                                        className="w-[280px] border-none outline-none focus:border-none focus:outline-none bg-transparent text-white"
                                    />
                                </div>
                            </div>

                            {
                                filePreview && (
                                    !tweetImage?.includes(".mp4") ? (
                                        <img src={filePreview} alt="preview" className='rounded-lg h-[250px] w-full object-cover' />
                                    ) : (
                                        <video src={filePreview} alt="preview" className='rounded-lg h-[250px] w-full object-cover' controls muted />
                                    )
                                )

                            }


                            {
                                !filePreview && (
                                    <div className='h-[100px]  flex justify-center items-center wf'>
                                        <input
                                            onChange={handleUploadPost}
                                            ref={imageRef}
                                            type="file"
                                            className='hidden'
                                            accept="image/*,video/*"
                                        />

                                        <Button
                                            onClick={() => imageRef.current.click()}
                                            type="button"
                                            variant=""
                                            className=""
                                        >Select from Computer</Button>
                                    </div>
                                )
                            }


                            <Button
                                onClick={() => createTweetMutate({ tweetContent, tweetImage })}

                                className="bg-white text-black hover:bg-white/70 font-bold text-[14px]">Post</Button>
                        </DialogContent>
                    </Dialog>

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