import React from 'react'

export default function Progress({progress}) {
    return (
        <div className='my-3'>
            <div className='rounded-xl h-[20px] overflow-hidden bg-gray-200'>
                <div className={`h-[20px] bg-green-700 w-[${progress}%]`}></div>
            </div>
        </div>
    )
}
