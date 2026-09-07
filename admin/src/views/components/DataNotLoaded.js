import React from 'react'

const DataNotLoaded = () => {
    return (
        <div className='flex h-[600px] justify-center flex-col items-center text-center p-4 w-full'>
            <h1 className='text-2xl font-bold mb-2 w-full text-center text-primary'>Failed to Load Your Data</h1>
            <p className='text-gray-600 w-full text-center'>We will retry automatically. Please wait...</p>
        </div>

    )
}

export default DataNotLoaded