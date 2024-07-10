
import React from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

const Post = ({ _id, title, summary, postImg, createdAt, author }) => {
    return (
        <>
            <div className='flex flex-col sm:flex-row sm:gap-4 my-4 md:px-3'>
                <div className='mb-2 md:mb-0 sm:w-1/2'>
                    <Link to={`/post/${_id}`}>
                        <img src={postImg} className='rounded-lg w-[100vw] sm:w-[350px] h-[200px] object-cover' />
                    </Link>

                </div>
                <div className='sm:w-1/2 overflow-hidden break-words'>
                    <Link to={`/post/${_id}`} className='text-black'>
                        <h1 className='text-lg font-bold'>{title}</h1>
                    </Link>
                    <p className='my-[6px] text-xs font-bold flex gap-3'>
                        <div>{author.username}</div>
                        <time className='text-gray-400'>{format(new Date(createdAt), 'MMM d, yyyy HH:mm')}</time>
                    </p>
                    <p>{summary}</p>
                </div>
            </div>
        </>
    )
}

export default Post