import React, { useEffect, useState } from 'react'
import Post from '../components/Post'
import Loader from '../components/Loader'
import { Button } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const Home = () => {

  const [posts, setPosts] = useState('')
  const [active, setActive] = useState(1);
  const [pageNo, setPageNo] = useState(1);
  const [totalNoOfPosts, setTotalNoOfPosts] = useState(0);
  const [postPerPage, setPostPerPage] = useState(0)

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

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/posts/getpost?page=${pageNo}`, {
          method: 'GET',
          credentials: 'include'
        })
        const data = await response.json();
        if (response.ok) {
          setPosts(data.posts)
          setTotalNoOfPosts(data.len)
          setPostPerPage(data.postPerPage)
          console.log(data)
        }
      } catch (error) {
        console.log(error);
      }
    }
    getPosts()
  }, [pageNo])

  return (
    <div className='mb-20 flex flex-col justify-center '>
      {posts ? posts.map((post, index) => {
        return <Post key={index} {...post} />
      }) : <Loader />}

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

export default Home