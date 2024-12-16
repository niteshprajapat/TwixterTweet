
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getCookie } from '@/utils/getCookie'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import Cookies from 'universal-cookie'

const EditProfile = () => {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    const cookies = new Cookies();
    const queryClient = useQueryClient();

    const cookiesData = getCookie("twixter");

    const { userId } = useParams();


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="rounded-full bg-black border border-zinc-700">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="w-full bg-black">
                <DialogHeader>
                    <DialogTitle className="font-semibold text-white" >Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col">

                    <div>
                        <img src={authUser?.coverImage} alt="cover-image" className='rounded-lg w-full' />
                    </div>
                    <div>
                        <img src={authUser?.avatar} alt="avatar" className='rounded-full size-28' />
                    </div>


                    <div>
                        <Input
                            value={authUser?.fullName}
                            className="text-white"
                            placeholder="Full Name"
                        />
                    </div>

                    <div>
                        <Input
                            value={authUser?.userName}
                            className="text-white"
                            placeholder="User Name"
                        />
                    </div>

                    <div>
                        <Input
                            value={authUser?.bio}
                            className="text-white"
                            placeholder="Bio"
                        />
                    </div>


                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" value="Pedro Duarte" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Username
                        </Label>
                        <Input id="username" value="@peduarte" className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditProfile