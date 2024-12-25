import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { routes } from '@/routes/route';
import axios from 'axios';
import { toast } from 'sonner';

import Cookies from 'universal-cookie';


const Auth = () => {
    const [fullName, setFullName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loginUserData, setLoginUserData] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const queryClient = useQueryClient();

    const cookies = new Cookies();



    const { mutate: registerMutate, isError, error, isPending } = useMutation({
        mutationFn: async (registerData) => {
            const response = await axios.post(routes.register, registerData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            const data = await response.data;
            return data;
        },
        onSuccess: (data) => {
            console.log("DATA", data);
        },
        onError: (error) => {
            console.log("error", error);
        }
    });


    const { mutate: loginMutate } = useMutation({
        mutationFn: async (loginData) => {
            const response = await axios.post(routes.login, { userData: loginData.loginUserData, password: loginData.loginPassword }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            const data = await response.data;
            return data;
        },
        onSuccess: (data) => {
            console.log("LOGINDARTA", data);
            toast.success(data?.message);

            cookies.set("twixter", data?.token);

            queryClient.invalidateQueries({ queryKey: ["authUser"] });

        },
        onError: (error) => {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    });


    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            cookies.set("twixter", token, { path: '/', secure: true });
            toast.success("Logged in successfully!");
            navigate('/'); // Redirect to the dashboard
        }
    }, []);


    return (
        <div className='w-full h-screen bg-[#000] flex justify-center items-center'>

            <Tabs defaultValue="register" className="w-[400px]  ">
                <TabsList className="grid w-full grid-cols-2 bg-[#09090B]">
                    <TabsTrigger value="register">Register</TabsTrigger>
                    <TabsTrigger value="login">Login</TabsTrigger>
                </TabsList>
                <TabsContent value="register">
                    <Card>
                        <CardHeader>
                            <CardTitle>Register</CardTitle>
                            <CardDescription>
                                Make changes to your account here. Click save when you're done.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="name">Fullname</Label>
                                <Input
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    type="text"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    type="text"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="username">Email</Label>
                                <Input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="username">Password</Label>
                                <Input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={() => registerMutate({ fullName, userName, email, password })}>Register Now</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>
                                Change your password here. After saving, you'll be logged out.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="current">Username or Email</Label>
                                <Input
                                    value={loginUserData}
                                    onChange={(e) => setLoginUserData(e.target.value)}
                                    type="text"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="new">Password</Label>
                                <Input
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    type="password"
                                />
                            </div>
                        </CardContent>
                        {/* <CardFooter>
                            <Button onClick={() => loginMutate({ loginUserData, loginPassword })}>Login Now</Button>
                        </CardFooter> */}

                        <CardFooter className="flex flex-col gap-2">
                            <Button onClick={() => loginMutate({ loginUserData, loginPassword })}>Login Now</Button>
                            {/* <Button
                                variant="outline"
                                onClick={() => window.location.href = `http://localhost:5000/api/v1/auth/auth/google`}
                            >
                                Continue with Google
                            </Button> */}
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>

    )
}

export default Auth;


