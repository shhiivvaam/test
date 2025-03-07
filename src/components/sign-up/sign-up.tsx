import React, { ChangeEvent, useState } from 'react';
import { createUserWithEmailAndPassword, UserCredential, AuthError, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { CheckCircleIcon } from '@heroicons/react/outline'

import { emailValidator } from '../../utils/validator';
import { auth, db } from '../../firebase/firebase';
import PasswordPrerequisite from '../password-prerequisite/password-prerequisite';

type SignUpProps = {
    onSignIn: () => void;
    setLoading?: (isLoading: boolean) => void;
    onError: (error: AuthError) => void;
}

const SignUp = ({ onSignIn, setLoading, onError }: SignUpProps) => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [pwdPrerequisite, setPwdPrerequisite] = useState<boolean>(false);
    const [confirmPwdPrerequisite, setConfirmPwdPrerequisite] = useState<boolean>(false);
    const [pwdMatch, setPwdMatch] = useState<boolean>(false);
    const [emailPrerequisite, setEmailPrerequisite] = useState<boolean>(false);
    const [validEmail, setValidEmail] = useState<boolean>(false);
    const [checks, setChecks] = useState({
        capsLetterCheck: false,
        numberCheck: false,
        pwdLengthCheck: false,
        specialCharCheck: false,
    });

    const notify = (message: string) => {
        toast(message, {
            toastId: "wrong-validation",
            theme: "dark",
            progress: undefined,
        })
    }

    const onEmail = (e: ChangeEvent<HTMLInputElement>): void => {
        const { value } = e.target;
        if (emailValidator(value)) {
            setValidEmail(true);
        } else {
            setValidEmail(false);
        }
        setEmail(value);
        setEmailPrerequisite(true);
    }

    const passwordCheck = (pwd: string) => {
        const capsLetterCheck = /[A-Z]/.test(pwd);
        const numberCheck = /[0-9]/.test(pwd);
        const pwdLengthCheck = pwd.length >= 8;
        const specialCharCheck = /[!@#$&%^&*]/.test(pwd);
        setChecks({
            capsLetterCheck,
            numberCheck,
            pwdLengthCheck,
            specialCharCheck,
        })
    }

    const onPassword = (e: ChangeEvent<HTMLInputElement>): void => {
        const { value } = e.target;
        passwordCheck(value)
        setPassword(value);
        setPwdPrerequisite(true);
    }

    const onConfirmPassword = (e: ChangeEvent<HTMLInputElement>): void => {
        const { value } = e.target;
        if (password === value && value.length > 0) {
            setPwdMatch(true);
        } else {
            setPwdMatch(false);
        }
        setConfirmPassword(value);
        setConfirmPwdPrerequisite(true);
    }

    const onFirstName = (e: ChangeEvent<HTMLInputElement>): void => {
        setFirstName(e.target.value);
    }

    const onLastName = (e: ChangeEvent<HTMLInputElement>): void => {
        setLastName(e.target.value);
    }

    const checkPassword = (): boolean => {
        if (checks.capsLetterCheck && checks.numberCheck && checks.pwdLengthCheck && checks.specialCharCheck && password === confirmPassword) {
            return true;
        }
        return false;
    }

    const isValidForm = (): boolean => {
        if (emailValidator(email) && checkPassword() && firstName.length > 0 && lastName.length > 0) {
            return true
        }
        return false;
    }

    const onRegister = (): void => {
        setLoading!(true);
        if (isValidForm()) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((credentials: UserCredential) => {
                    addUserData(credentials);
                }).catch(onError).finally(() => setLoading!(false))
        } else {
            setLoading!(false);
            notify("Please make sure you have entered all the necessary details")
        }
        setPwdPrerequisite(false);
        setConfirmPwdPrerequisite(false);
    }

    const addUserData = async (credentials: UserCredential) => {
        await setDoc(doc(db, 'customers', credentials.user.uid), {
            uid: credentials.user.uid,
            email: credentials.user.email,
            firstName,
            lastName,
        });
        await updateProfile(credentials.user, {
            displayName: `${firstName} ${lastName}`,
        })
    }

    return (
        <div className="flex w-full md:w-1/2 lg:w-1/2 justify-center items-center bg-white">
            <div className="bg-white">
                <h1 className="text-gray-800 font-poppins-bold text-2xl mb-1">Help us to remember you!</h1>
                <p className="text-sm font-poppins-regular text-gray-600 mb-7">Create an account</p>
                <div className="flex items-center border-2 py-2 px-3 rounded-md mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <input className="pl-2 outline-none border-none truncate font-poppins-regular w-full" type="firstName" id="firstName" placeholder="First name*" onChange={onFirstName} value={firstName} />
                </div>
                <div className="flex items-center border-2 py-2 px-3 rounded-md mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <input className="pl-2 outline-none border-none truncate font-poppins-regular w-full" type="lastName" id="lastName" placeholder="Last name*" onChange={onLastName} value={lastName} />
                </div>
                <div className="flex items-center border-2 py-2 px-3 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    <input className="pl-2 outline-none border-none truncate font-poppins-regular w-full" type="text" id="email" placeholder="Email Address" onChange={onEmail} value={email} />
                </div>
                {emailPrerequisite &&
                    <div className="flex flex-row items-center mb-4">
                        <CheckCircleIcon className={`${validEmail ? 'text-green-500' : 'text-gray-500'} h-5 w-5`} />
                        <p className={`${validEmail ? 'text-green-500' : 'text-gray-500'} ml-2 font-poppins-light`}>{validEmail ? 'Valid email' : 'Enter the valid email'}</p>
                    </div>}
                <div className="flex items-center border-2 py-2 px-3 rounded-md mt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <input className="pl-2 outline-none border-none truncate font-poppins-regular w-full" type="password" id="password" placeholder="Password" onChange={onPassword} value={password} />
                </div>
                {pwdPrerequisite && <PasswordPrerequisite
                    capsLetterFlag={checks.capsLetterCheck ? 'valid' : 'invalid'}
                    numberFlag={checks.numberCheck ? 'valid' : 'invalid'}
                    pwdLengthFlag={checks.pwdLengthCheck ? 'valid' : 'invalid'}
                    specialCharFlag={checks.specialCharCheck ? 'valid' : 'invalid'} />}
                <div className="flex items-center border-2 py-2 px-3 rounded-md mt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <input className="pl-2 outline-none border-none truncate font-poppins-regular w-full" type="password" placeholder="Confirm password" onChange={onConfirmPassword} value={confirmPassword} />
                </div>
                {confirmPwdPrerequisite &&
                    <div className="flex flex-row items-center">
                        <CheckCircleIcon className={`${pwdMatch ? 'text-green-500' : 'text-gray-500'} h-5 w-5`} />
                        <p className={`${pwdMatch ? 'text-green-500' : 'text-gray-500'} ml-2 font-poppins-light`}>Password matching</p>
                    </div>}
                <button type="submit" className={`block w-full mt-4 py-2 rounded-md text-white mb-2 font-poppins-medium ${!isValidForm() ? 'bg-gray-400' : 'bg-do-later-alpha text-do-later'}`} disabled={!isValidForm()} onClick={onRegister}>Register</button>
                <span className="text-sm ml-2 font-poppins-regular">Already have an account? <span className="text-do-first hover:text-blue-500 cursor-pointer" onClick={onSignIn}>Sign in</span></span>
            </div>
        </div>
    )
}

export default SignUp;
