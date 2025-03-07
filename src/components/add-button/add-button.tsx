import React from 'react';
import { PlusIcon } from "@heroicons/react/outline";

type AddButtonProps = {
    onClick: () => void;
}

const AddButton = ({ onClick }: AddButtonProps) => (
    <div className="h-12 w-12 absolute rounded-full top-1/2 left-1/2 
    transform -translate-x-1/2 -translate-y-1/2 cursor-pointer 
    justify-center items-center bg-black dark:bg-white flex ease-linear hover:scale-105 transition supertasks-add-button" onClick={onClick}>
        <PlusIcon className="w-5 h-5 text-white dark:text-black" />
    </div>
)

export default AddButton
