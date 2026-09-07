import React from 'react'

const ProviderHeader = ({name}) => {
  return (
    <div className='h-20 bg-slate-400/20 rounded-md w-full flex justify-start items-center px-4'>
        <p className='font-semibold text-3xl'>{name}</p>
    </div>
  )
}

export default ProviderHeader