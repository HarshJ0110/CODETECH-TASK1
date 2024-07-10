import React, { useContext, useEffect, useState } from 'react'
import Post from '../components/Post'
import Loader from '../components/Loader'
import { UserContext } from '../UserContext'
import { LuLogOut } from "react-icons/lu";
import { Button } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';

const Profile = () => {

    const [posts, setPosts] = useState('')
    const { userInfo, setUserInfo } = useContext(UserContext)
    const [active, setActive] = useState(1);
    const [pageNo, setPageNo] = useState(1);
    const [totalNoOfPosts, setTotalNoOfPosts] = useState(0);
    const [postPerPage, setPostPerPage] = useState(0)
    const navigation = useNavigate();

    const next = () => {
        if (active === totalNoOfPosts / postPerPage) return;
        setPageNo(active + 1)
        setActive(active + 1);
    };

    console.log(pageNo);

    const prev = () => {
        if (active === 1) return;
        setPageNo(active - 1)
        setActive(active - 1);
    };


    const logoutUser = async () => {
        const response = await fetch('http://localhost:4000/api/users/logout', {
            method: 'GET',
            credentials: 'include',
        });

        if (response.ok) {
            setUserInfo(null)
        }
    }

    useEffect(() => {
        const getMyPosts = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/posts/getmypost?page=${pageNo}`, {
                    method: 'GET',
                    credentials: 'include'
                })
                const data = await response.json();
                if (response.ok) {
                    setPosts(data.posts)
                    console.log(data.posts)
                    setTotalNoOfPosts(data.len)
                    setPostPerPage(data.postPerPage)
                }
            } catch (error) {
                console.log(error);
            }
        }
        getMyPosts()

    }, [pageNo])

    useEffect(() => {
        console.log(userInfo)
        if (!userInfo?.username) {
          navigation("/login");
        }
      }, [userInfo?.username]);

    return (
        <div className='mb-20'>
            <div className='flex justify-between items-center m-5 my-10'>
                <p className='font-bold text-2xl' >Your Blogs</p>
                {/* <p className='font-bold text-2xl' >{userInfo.username}</p> */}
                <button onClick={logoutUser} className='text-xl px-2 py-1 rounded-lg transition duration-300 ease-in-out transform hover:bg-slate-200 text-black'><LuLogOut /></button>
            </div>

            {posts ? posts.map((post, index) => {
                return <Post key={index} {...post} />
            }) : <Loader />}

            {console.log(totalNoOfPosts, postPerPage)}

            { totalNoOfPosts > postPerPage &&  <div className='fixed bottom-0 left-0 right-0 w-full bg-white flex justify-center'>
                <div className="flex justify-center items-center gap-4 py-2">
                    <Button
                        variant="text"
                        className="flex items-center gap-2"
                        onClick={prev}
                        disabled={active === 1}
                    >
                        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Prev
                    </Button>
                    <div className="flex items-center gap-2">
                        {pageNo}
                    </div>
                    <Button
                        variant="text"
                        className="flex items-center gap-2"
                        onClick={next}
                        disabled={active === Math.ceil(totalNoOfPosts / postPerPage)}
                    >
                        Next
                        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
                    </Button>
                </div>
            </div>}
        </div>
    )
}

export default Profile