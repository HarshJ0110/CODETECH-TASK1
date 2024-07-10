import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import Loader from '../components/Loader'
import { UserContext } from '../UserContext';
import { format } from 'date-fns'
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router";
import Modal from '../components/Modal';

const PostPage = () => {

    const { userInfo } = useContext(UserContext);
    const [postInfo, setPostInfo] = useState(null);
    const [redirect, setRedirect] = useState(false);
    const [updating, setUpdaing] = useState(false);
    const [open, setOpen] = useState(false)

    let navigation = useNavigate();

    const { id } = useParams();

    const deletePost = async (e) => {
        setUpdaing(true);
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:4000/api/posts/delete/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            })

            const data = await response.json();
            if (data.success) {
                setRedirect(true)
            }
        } catch (error) {
            console.log(error);
        } finally {
            setUpdaing(true);
        }
    }
    if (redirect) {
        navigation("/");
    }

    useEffect(() => {
        const getPost = async () => {
            setPostInfo(null)
            try {
                const response = await fetch(`http://localhost:4000/api/posts/getsinglepost/${id}`, {
                    method: 'GET',
                })
                const data = await response.json();
                if (response.ok) {
                    setPostInfo(data.singlePost)
                }
            } catch (error) {
                console.log(error);
            }
        }
        getPost()
    }, [id])

    return (

        <div>
            {postInfo && userInfo ?
                <div className='px-3 my-5'>
                    <h1 className='text-3xl font-semibold text-center mt-10 mb-3'>{postInfo?.title}</h1>
                    <p className='flex flex-col justify-center items-center font-semibold mb-5'>
                        <time className='text-gray-400 text-sm'>{format(new Date(postInfo.createdAt), 'MMM d, yyyy HH:mm')}</time>
                        <div className='text-sm'>by @{postInfo.author.username}</div>
                        {userInfo._id === postInfo.author._id && (
                            <div className='flex gap-3'>
                                <div>
                                    <Link to={`/edit/${id}`} className='flex gap-1 items-center my-2 text-white bg-gray-800 p-2 px-4 rounded text-xs'><FaRegEdit /> Edit This Post</Link>
                                </div>
                                <div>
                                    <Modal open={open} setOpen={setOpen} deletePost={deletePost} updating={updating}/>
                                    <button onClick={() => setOpen(true)} className='flex gap-1 items-center my-2 text-white bg-gray-800 p-2 px-4 rounded text-xs'><MdDelete /> Delete This Post</button>
                                </div>
                            </div>
                        )}
                    </p>
                    <div>
                        <img src={postInfo?.postImg} className='rounded-lg w-[100vw] h-[200px] sm:h-[400px] object-cover mb-4' />
                    </div>

                    <div dangerouslySetInnerHTML={{ __html: postInfo?.content }}></div>
                </div>
                : <Loader />}
        </div>
    )
}

export default PostPage