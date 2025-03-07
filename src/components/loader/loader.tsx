import React from 'react';
import ReactLoading from 'react-loading';

type LoaderProps = {
    loadingMessage: string,
}

const Loader = ({ loadingMessage }: LoaderProps) => {
    return (
        <div className="min-w-full min-h-screen bg-white justify-center items-center flex flex-col">
            <ReactLoading type="spinningBubbles" color="#000000" height="5%" width="5%" className="self-center" />
            <span className='text-lg font-poppins-bold'>{loadingMessage}</span>
        </div>
    )
}

export default Loader;
