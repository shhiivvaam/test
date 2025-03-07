import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/outline'

type PasswordPrerequisiteProps = {
    capsLetterFlag: string,
    numberFlag: string,
    pwdLengthFlag: string,
    specialCharFlag: string,
}

const PasswordPrerequisite = ({ capsLetterFlag, numberFlag, pwdLengthFlag, specialCharFlag }: PasswordPrerequisiteProps) => {
    return (
        <div className="font-poppins-light">
            <div className="flex flex-row items-center">
                <CheckCircleIcon className={`${capsLetterFlag === 'valid' ? 'text-green-500' : 'text-gray-500'} h-5 w-5`} />
                <p className={`${capsLetterFlag === 'valid' ? 'text-green-500' : 'text-gray-500'} ml-1`}>Must contain one capital letter</p>
            </div>
            <div className="flex flex-row items-center">
                <CheckCircleIcon className={`${numberFlag === 'valid' ? 'text-green-500' : 'text-gray-500'} h-5 w-5`} />
                <p className={`${numberFlag === 'valid' ? 'text-green-500' : 'text-gray-500'} ml-1`}>Must contain a number</p>
            </div>
            <div className="flex flex-row items-center">
                <CheckCircleIcon className={`${pwdLengthFlag === 'valid' ? 'text-green-500' : 'text-gray-500'} h-5 w-5`} />
                <p className={`${pwdLengthFlag === 'valid' ? 'text-green-500' : 'text-gray-500'} ml-1`}>Must be 8 char long</p>
            </div>
            <div className="flex flex-row items-center">
                <CheckCircleIcon className={`${specialCharFlag === 'valid' ? 'text-green-500' : 'text-gray-500'} h-5 w-5`} />
                <p className={`${specialCharFlag === 'valid' ? 'text-green-500' : 'text-gray-500'} ml-1`}>Must contain special character <br /> (!,@,#,$,&,%,^,&,*)</p>
            </div>
        </div>
    );
};

export default PasswordPrerequisite;
