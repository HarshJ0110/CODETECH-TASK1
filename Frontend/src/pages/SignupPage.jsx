import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../UserContext';
import Alert from '../components/Alert';

const SignupPage = () => {

    const { setUserInfo } = useContext(UserContext)

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [updating, setUpdating] = useState(false);
    const [alert, setAlert] = useState(false)
    const [message, setMessage] = useState('');

    const registerUser = async (e) => {
        setUpdating(true);
        e.preventDefault();
        try {
            const message = await fetch('http://localhost:4000/api/users/signup', {
                method: 'POST',
                body: JSON.stringify({ username, email, password }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            })
            const data = await message.json();
            console.log(data);

            if (data.error) {
                console.log(data.error);
                setMessage(data.error);
                setAlert(true);
                return;
            }
            setUserInfo(data.newUser)
        } catch (error) {
            console.log(error);
        } finally {
            setUpdating(false);
        }
    }

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert(false);
                setMessage('');
            }, 3000); // Hide alert after 3 seconds

            return () => clearTimeout(timer); // Cleanup the timer
        }
    }, [alert]);

    return (
        <div className="h-[90vh] flex flex-col items-center justify-center p-0 m-0">
            {alert && <Alert title="Error" message={message} />}

            <div className="flex flex-col bg-white shadow-lg px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
                <h1 className="text-2xl">Signup</h1>
                <div className="mt-10">
                    <form id="form" onSubmit={registerUser}>
                        <div className="flex flex-col mb-6">
                            <label
                                htmlFor="username"
                                className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                            >
                                Username:
                            </label>
                            <div className="relative">
                                <div
                                    className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-gray-700"
                                    placeholder="Username"
                                    value={username}
                                    required
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col mb-6">
                            <label
                                htmlFor="email"
                                className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                            >
                                Email:
                            </label>
                            <div className="relative">
                                <div
                                    className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                        />
                                    </svg>
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-gray-700"
                                    placeholder="Email"
                                    value={email}
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col mb-6">
                            <label
                                htmlFor="password"
                                className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                            >
                                Password:
                            </label>
                            <div className="relative">
                                <div
                                    className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400"
                                >
                                    <span>
                                        <svg
                                            className="h-6 w-6"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"

                                        >
                                            <path
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            />
                                        </svg>
                                    </span>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-gray-700"
                                    placeholder="Password"
                                    value={password}
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex w-full">
                            {!updating && <button
                                type="submit"
                                className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-gray-600 hover:bg-gray-700 rounded-lg py-2 w-full transition duration-150 ease-in"
                            >
                                <span className="mr-2 uppercase">signup</span>
                            </button>}
                            {updating && <div
                                className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-gray-600 hover:bg-gray-700 rounded-lg py-2 w-full transition duration-150 ease-in"
                            > <svg
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
                                </svg> </div>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
