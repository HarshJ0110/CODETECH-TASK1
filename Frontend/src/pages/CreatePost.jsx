
import React, { useState, useRef, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useNavigate } from "react-router";
import usePreviewImg from '../hooks/usePreviewImg';

const CreatePost = () => {

  const MAX_TITLE_CHAR = 60;
  const MAX_SUMMARY_CHAR = 160;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('')
  const [summary, setSummary] = useState('');
  const [redirect, setRedirect] = useState(false)
  const [remainingTitleCharacter, setRemainingTitleCharacter] = useState(MAX_TITLE_CHAR);
  const { handleImageChange, imgUrl } = usePreviewImg();
  const [remainingSummaryCharacter, setRemainingSummaryCharacter] = useState(MAX_SUMMARY_CHAR);
  const [updating, setUpdating] = useState(false);
  let navigation = useNavigate();
  const fileRef = useRef(null);
  const quillRef = useRef(null);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link']
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link'
  ]

  const handleTitleChange = (e) => {
    const inputTitle = e.target.value;
    if (inputTitle.length > MAX_TITLE_CHAR) {
      const truncatedTitle = inputTitle.slice(0, MAX_TITLE_CHAR);
      setTitle(truncatedTitle);
      setRemainingTitleCharacter(0);
    } else {
      setTitle(inputTitle);
      setRemainingTitleCharacter(MAX_TITLE_CHAR - inputTitle.length)
    }
  }

  const handleSummaryChange = (e) => {
    const inputSummary = e.target.value;
    if (inputSummary.length > MAX_SUMMARY_CHAR) {
      const truncatedSummary = inputSummary.slice(0, MAX_SUMMARY_CHAR);
      setSummary(truncatedSummary);
      setRemainingSummaryCharacter(0);
    } else {
      setSummary(inputSummary);
      setRemainingSummaryCharacter(MAX_SUMMARY_CHAR - inputSummary.length)
    }
  }

  const createPost = async (e) => {
    setUpdating(true);
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, summary, content, postImg: imgUrl }),
        credentials: 'include',
      });

      const post = await response.json();
      if (post.success) {
        setRedirect(true);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setUpdating(false);
    }
  }

  useEffect(() => {
    if (redirect) {
      navigation("/");
    }
  }, [redirect, navigation]);

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <div className="flex flex-col bg-white shadow-lg p-8 rounded-md w-full max-w-md">
        <div className='text-2xl font-medium mb-5'>Create New Post</div>
        <form onSubmit={createPost}>
          <input
            type='title'
            placeholder='Title'
            value={title}
            onChange={handleTitleChange}
            className="text-sm sm:text-base placeholder-gray-500 px-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-gray-700 my-2"
          />
          <div className='flex justify-end items-end text-xs w-full pr-2'>{remainingTitleCharacter}/{MAX_TITLE_CHAR}</div>

          <input
            type='summary'
            placeholder='Summary'
            value={summary}
            onChange={handleSummaryChange}
            className="text-sm sm:text-base placeholder-gray-500 px-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-gray-700 my-2"
          />
          <div className='flex justify-end items-end text-xs w-full pr-2'>{remainingSummaryCharacter}/{MAX_SUMMARY_CHAR}</div>

          <div className='flex flex-col justify-center items-center'>
            {imgUrl && <img src={imgUrl} alt='Selected img' className='h-[200px] mt-2' />}
            <button
              className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-gray-600 hover:bg-gray-700 rounded-lg py-2 w-full transition duration-150 ease-in my-2"
              onClick={(e) => {
                e.preventDefault();
                fileRef.current.click();
              }}>Select Image</button>
            <input type="file" className="hidden" ref={fileRef} onChange={handleImageChange} />
          </div>

          <div className="h-36 overflow-y-auto mb-4 custom-scrollbar">
            <ReactQuill
              ref={quillRef}
              value={content}
              modules={modules}
              formats={formats}
              onChange={(newValue) => setContent(newValue)}
              className="h-full"
            />
          </div>

          {!updating && <button
            type="submit"
            className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-gray-600 hover:bg-gray-700 rounded-lg py-2 w-full transition duration-150 ease-in"
          >
            <span className="mr-2 uppercase">Post</span>
          </button>}
          {updating && <div
            className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-gray-600 hover:bg-gray-700 rounded-lg py-2 w-full transition duration-150 ease-in"
          >
            <svg
              className="animate-spin h-5 w-5 md:h-6 md:w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          </div>}
        
        </form>
      </div>
    </div>
  )
}

export default CreatePost;
