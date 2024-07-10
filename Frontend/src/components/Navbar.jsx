import React, { useEffect, useContext } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { FaUserCircle } from "react-icons/fa";
import { UserContext } from '../UserContext';


const Navbar = () => {

    const { userInfo, setUserInfo } = useContext(UserContext)

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/users/me', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    setUserInfo(data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        getUser();

    }, []);

    return (
        <div className='flex justify-between items-center h-12 mt-2'>
            <Link to='/' className='font-bold text-xl pl-3 text-black'>WriteFlow</Link>
            <ul className='flex items-center gap-4'>
                {userInfo?.username ? (
                    <>
                        <Link to='/create' className='font-semibold px-2 py-1 rounded-lg transition duration-300 ease-in-out transform hover:bg-slate-200 text-black'>Create</Link>
                        <Link to='/profile' className='text-xl px-2 py-1 rounded-lg transition duration-300 ease-in-out transform hover:bg-slate-200 text-black'><FaUserCircle /></Link>
                    </>
                ) : (
                    <>
                        <Link to='/login' className='font-semibold px-3 py-1 rounded-lg transition duration-300 ease-in-out transform hover:bg-slate-200 text-black'><li>Login</li></Link>
                        <Link to='/signup' className='font-semibold px-3 py-1 rounded-lg transition duration-300 ease-in-out transform hover:bg-slate-200 text-black'><li>Signup</li></Link>
                    </>
                )}

            </ul>
        </div>
    )
}

export default Navbar