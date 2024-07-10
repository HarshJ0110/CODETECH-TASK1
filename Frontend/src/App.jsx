import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Navbar from './components/Navbar'
import { useContext } from 'react'
import CreatePost from './pages/CreatePost'
import PostPage from './pages/PostPage'
import EditPost from './pages/EditPost'
import Profile from './pages/Profile'
import { UserContext } from './UserContext'

function App() {

  const { userInfo } = useContext(UserContext);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/login' element={userInfo?.username ? <Navigate to={'/'} /> : <LoginPage />} />
        <Route exact path='/signup' element={userInfo?.username ? <Navigate to={'/'} /> : <SignupPage />} />
        <Route exact path='/create' element={<CreatePost />} />
        <Route exact path='/edit/:id' element={<EditPost />} />
        <Route exact path='/profile' element={<Profile />} />
        <Route exact path='/post/:id' element={<PostPage />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
