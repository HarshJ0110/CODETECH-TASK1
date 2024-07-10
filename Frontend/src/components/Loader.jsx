import React from 'react'
import './Loader.css'

const Loader = () => {
    return (
        <div className='w-full h-[90vh] flex justify-center items-center' >
            <div className="loader">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
            </div>
        </div>
    )
}

export default Loader