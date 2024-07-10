import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router";
import { useParams } from 'react-router-dom';
import usePreviewImg from '../hooks/usePreviewImg';

const EditPost = () => {
  const MAX_TITLE_CHAR = 60;
  const MAX_SUMMARY_CHAR = 160;

  const { id } = useParams();
  const { handleImageChange, imgUrl } = usePreviewImg();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [files, setFiles] = useState(null);
  const [remainingTitleCharacter, setRemainingTitleCharacter] = useState(MAX_TITLE_CHAR);
  const [remainingSummaryCharacter, setRemainingSummaryCharacter] = useState(MAX_SUMMARY_CHAR);
  const [redirect, setRedirect] = useState(false);
  const [updating, setUpdating] = useState(false);
  const quillRef = useRef(null);
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link'
  ];

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/posts/getsinglepost/${id}`, {
          method: 'GET',
        });
        const data = await response.json();
        if (response.ok) {
          setFiles(data.singlePost.postImg);
          setTitle(data.singlePost.title);
          setContent(data.singlePost.content);
          setSummary(data.singlePost.summary);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getPost();
  }, [id]);

  const handleTitleChange = (e) => {
    const inputTitle = e.target.value;
    if (inputTitle.length > MAX_TITLE_CHAR) {
      const truncatedTitle = inputTitle.slice(0, MAX_TITLE_CHAR);
      setTitle(truncatedTitle);
      setRemainingTitleCharacter(0);
    } else {
      setTitle(inputTitle);
      setRemainingTitleCharacter(MAX_TITLE_CHAR - inputTitle.length);
    }
  };

  const handleSummaryChange = (e) => {
    const inputSummary = e.target.value;
    if (inputSummary.length > MAX_SUMMARY_CHAR) {
      const truncatedSummary = inputSummary.slice(0, MAX_SUMMARY_CHAR);
      setSummary(truncatedSummary);
      setRemainingSummaryCharacter(0);
    } else {
      setSummary(inputSummary);
      setRemainingSummaryCharacter(MAX_SUMMARY_CHAR - inputSummary.length);
    }
  };

  const editPost = async (e) => {
    setUpdating(true);
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/api/posts/edit/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ title, summary, content, postImg: imgUrl }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        setRedirect(true);
      }

      const post = await response.json();
      console.log(post);
    } catch (error) {
      console.log(error.message);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (redirect) {
      navigate(`/post/${id}`);
    }
  }, [redirect, navigate, id]);

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <div className="flex flex-col bg-white shadow-lg p-8 rounded-md w-full max-w-md">
        <div className='text-2xl font-medium mb-5'>Edit Post</div>
        <form>
          <input
            type='title'
            placeholder='Title'
            value={title}
            onChange={handleTitleChange}
            className="text-sm sm:text-base placeholder-gray-500 px-2 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-gray-700 my-2"
          />
          <div className='flex justify-end items-end text-xs w-full pr-2'>{remainingTitleCharacter}/{MAX_TITLE_CHAR}</div>
          <input
            type='summary'
            placeholder='Summary'
            value={summary}
            onChange={handleSummaryChange}
            className="text-sm sm:text-base placeholder-gray-500 px-2 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-gray-700 my-2"
          />
          <div className='flex justify-end items-end text-xs w-full pr-2'>{remainingSummaryCharacter}/{MAX_SUMMARY_CHAR}</div>
          <div className='flex flex-col justify-center items-center'>
            {<img src={imgUrl || files} alt='Selected img' className='h-[200px] mt-2' />}
            <button
              className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-gray-600 hover:bg-gray-700 rounded-lg py-2 w-full transition duration-150 ease-in my-2"
              onClick={(e) => {
                e.preventDefault();
                fileRef.current.click();
              }}>Change Image</button>
            <input type="file" className="hidden" ref={fileRef} onChange={handleImageChange} />
          </div>
          <div className="h-44 overflow-y-auto mb-4 custom-scrollbar">
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
            onClick={editPost}
            className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-gray-600 hover:bg-gray-700 rounded-lg py-2 w-full transition duration-150 ease-in"
          >
            <span className="mr-2 uppercase">Update</span>
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
  );
};

export default EditPost;
