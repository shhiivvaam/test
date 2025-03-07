import React, { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { doc, setDoc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { signInWithEmailAndPassword, UserCredential, AuthError, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import { browserName, fullBrowserVersion } from "react-device-detect";

import { emailValidator } from '../../utils/validator';
import { auth, db } from '../../firebase/firebase';
import { toast } from 'react-toastify';

type SignInProps = {
    onSignUp: () => void;
    setLoading?: (isLoading: boolean) => void;
    onError: (error: AuthError) => void;
}

const SignIn = ({ onSignUp, setLoading, onError }: SignInProps) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [forgetPassEmail, setForgetPassEmail] = useState<string>('');
    const [isForgetPassword, setForgetPassword] = useState<boolean>(false);

    const notify = (message: string) => {
        toast(message, {
            toastId: "sign-in-do-not-repeat",
            theme: "dark",
            progress: undefined,
        })
    }

    const onEmail = (e: ChangeEvent<HTMLInputElement>): void => {
        setEmail(e.target.value);
    }

    const onPassword = (e: ChangeEvent<HTMLInputElement>): void => {
        setPassword(e.target.value);
    }

    const onForgetPasswordEmail = (e: ChangeEvent<HTMLInputElement>): void => {
        setForgetPassEmail(e.target.value);
    }

    const isFormValid = (): boolean => {
        if (emailValidator(email) && password.length > 0) {
            return true;
        }
        return false;
    }

    const onSignIn = (): void => {
        if (isFormValid()) {
            setLoading!(true)
            signInWithEmailAndPassword(auth, email, password).then((credentails: UserCredential) => {
                const user = credentails.user;
                const deviceId = uuidv4();
                if (user) {
                    addUserData(credentails, deviceId).then(() => navigate('/'))
                }
            }).catch(onError).finally(() => setLoading!(false))
        } else {
            notify("Please fill the necessary details");
        }
    }

    const onForgetPassword = (): void => {
        if (emailValidator(forgetPassEmail)) {
            setLoading!(true)
            sendPasswordResetEmail(auth, forgetPassEmail)
                .then(() => {
                    notify("Password reset email sent");
                }).catch(onError).finally(() => setLoading!(false))
        } else {
            notify("Please enter valid email");
        }
    }

    const onGoogleSignIn = (): void => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider).then((result) => {
            setLoading!(true)
            const user = result.user;
            const deviceId = uuidv4();
            if (user) {
                addUserData(result, deviceId).then(() => navigate('/'));
            }
        }).catch(onError).finally(() => setLoading!(false))
    }

    const addUserData = async (credentials: UserCredential, deviceId: string): Promise<void> => {
        const userRef = doc(db, 'customers', credentials.user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            const userData = docSnap.data();
            if (userData.deviceId && userData.deviceId.hasOwnProperty(deviceId)) {
                // If the deviceId already exists, do not add it again
                return;
            }
            await updateDoc(userRef, {
                deviceId: {
                    ...userData.deviceId,
                    [deviceId]: {
                        browserName,
                        fullBrowserVersion,
                        timestamp: serverTimestamp()
                    }
                }
            });
        } else {
            await setDoc(userRef, {
                uid: credentials.user.uid,
                email: credentials.user.email,
                firstName: credentials.user.displayName?.split(" ")[0] || "",
                lastName: credentials.user.displayName?.split(" ")[1] || "",
                isOnboardingCompleted: false,
                isUserFirstTime: false,
                deviceId: {
                    [deviceId]: {
                        browserName,
                        fullBrowserVersion,
                        timestamp: serverTimestamp()
                    }
                }
            });
        }
    }

    const SignIn = () => (
        <div className="bg-white">
            <h1 className="text-gray-800 font-bold text-2xl mb-1 font-poppins-bold ">Hello Again!</h1>
            <p className="text-sm font-normal text-gray-600 mb-7 font-poppins-regular">Welcome Back</p>
            <div className="flex items-center border-2 py-2 px-3 rounded-md mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input className="pl-2 outline-none border-none truncate font-poppins-regular w-full" type="text" id="email" placeholder="Email Address" onChange={onEmail} value={email} />
            </div>
            <div className="flex items-center border-2 py-2 px-3 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <input className="pl-2 outline-none border-none truncate font-poppins-regular w-full" type="password" id="password" placeholder="Password" onChange={onPassword} value={password} />
            </div>
            <span className="text-sm ml-2 hover:text-blue-500 cursor-pointer font-poppins-regular" onClick={() => setForgetPassword(true)}>Forgot Password?</span>
            <button type="submit" className={`block w-full mt-4 py-2 rounded-md text-white font-poppins-bold mb-2 ${!isFormValid() ? 'bg-gray-400' : 'bg-do-later-alpha text-do-later'}`} disabled={!isFormValid()} onClick={onSignIn}>Login</button>
            <span className="text-sm ml-2 font-poppins-medium">Don't have an account? <span className="text-do-first hover:text-blue-500 cursor-pointer" onClick={onSignUp}>Sign up</span></span>
            <div className="flex flex-row items-center justify-between">
                <div className="w-[40%] h-[.5px] bg-slate-700 mt-5 mb-5 font-poppins-light" />
                <span>or</span>
                <div className="w-[40%] h-[.5px] bg-slate-700 mt-5 mb-5" />
            </div>
            <div className="flex-row w-full flex justify-center items-center rounded-md border-solid border-[1px] cursor-pointer" onClick={onGoogleSignIn}>
                <img alt='google logo' src='https://developers.google.com/identity/images/g-logo.png' className="w-9 h-9 p-2 border-solid border-1 border-black rounded-full mr-2" />
                <span className="font-poppins-light">Continue with google</span>
            </div>
            <span className="text-xs flex-wrap font-poppins-regular">By signing in you agree to our <br />
                <Link to="/terms-condition" className="text-pricing-feature font-poppins-regular">Terms & condition</Link> and&nbsp;
                <Link to="/privacy-policy" className="text-pricing-feature font-poppins-regular">Privacy policy</Link></span>
        </div>
    )

    const ForgotPassword = () => (
        <div className="bg-white">
            <h1 className="text-gray-800 font-poppins-bold text-2xl mb-1">Forgot password?</h1>
            <p className="text-sm font-poppins-regular text-gray-600 mb-7">Don't worry we will try to recover it for you</p>
            <div className="flex items-center border-2 py-2 px-3 rounded-md mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input className="pl-2 outline-none border-none truncate font-poppins-regular" type="text" id="email" placeholder="Email Address" onChange={onForgetPasswordEmail} value={forgetPassEmail} />
            </div>
            <button type="submit" className="block w-full bg-do-first mt-4 py-2 rounded-md text-white font-poppins-medium mb-2" onClick={onForgetPassword}>Recover</button>
            <button type="submit" className="block w-full bg-white mt-4 py-2 rounded-md text-black font-poppins-medium mb-2" onClick={() => setForgetPassword(false)}>Cancel</button>
        </div>
    )

    return (
        <div className="flex w-full md:w-1/2 lg:w-1/2 justify-center items-center">
            {isForgetPassword ? ForgotPassword() : SignIn()}
        </div>
    )
}

export default SignIn;
