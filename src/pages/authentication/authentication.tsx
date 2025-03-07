import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { AuthError } from 'firebase/auth';
import { useLocation } from 'react-router';
import { NavLink, useNavigate } from 'react-router-dom';

import SignIn from '../../components/sign-in/sign-in';
import SignUp from '../../components/sign-up/sign-up';
import withLoading from '../../hoc/loading/loading';
import { authErrors } from '../../utils/error-code';

import SuperTasksMenu from '../../assets/images/menu.png';
import { APP_PREFIX_PATH } from '../../configs/app-configs';

interface ILocation {
    showSignInToast: boolean;
}

type AuthenticationProps = {
    setLoading?: (isLoading: boolean) => void;
};

const Authentication = ({ setLoading }: AuthenticationProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [isSignIn, setShowSignIn] = useState(true);

    useEffect(() => {
        const { showSignInToast } = location?.state as ILocation ?? {};
        if (showSignInToast) {
            notify('Please sign in');
        }
    }, [location.state])

    const notify = (message: string) => {
        toast(message, {
            toastId: 'do-not-repeat',
            theme: "dark",
            progress: undefined,
        })
    }

    const onError = (error: AuthError): void => {
        const errorCode = error.code.replace('auth/', '');
        notify(authErrors[errorCode]);
    }

    const onHome = () => {
        navigate(`${APP_PREFIX_PATH}`);
    }

    return (
        <div className="h-screen flex">
            <div className="md:flex w-1/2 justify-around items-center border-0 border-black border-r-[1px] hidden">
                <span className="font-poppins-medium underline cursor-pointer absolute top-3 left-3 rounded-md py-2 px-3 text-eliminate bg-eliminate-alpha" onClick={onHome}>
                    Create todos on steroids!
                </span>
                <div className="flex flex-col cursor-pointer" onClick={onHome}>
                    <div className="text-black p-1 flex items-center">
                        <NavLink
                            to={`${APP_PREFIX_PATH}`}>
                            <img src={SuperTasksMenu} width={27} className="animate-rotate" alt='supertasks.io menu' />
                        </NavLink>
                        <p className="ml-5 text-lg md:text-2xl font-poppins-bold">supertasks.io</p>
                    </div>
                    <p className="text-xs text-do-later bg-do-later-alpha px-3 py-2 rounded-md text-center">Quick decision making tool</p>
                </div>
            </div>
            <div className="absolute top-0 w-full text-black py-5 p-1 flex items-center md:hidden justify-center border-0 border-black border-b-[1px]">
                <NavLink
                    to={`${APP_PREFIX_PATH}`}>
                    <img src={SuperTasksMenu} width={27} className="animate-rotate" alt='supertasks.io menu' />
                </NavLink>
                <p className="ml-5 text-lg md:text-2xl font-poppins-medium">supertasks.io</p>
                <span className="text-xs ml-3 text-do-later bg-do-later-alpha px-3 py-2 rounded-md hidden lg:block">Quick decision making tool</span>
            </div>
            {isSignIn ?
                <SignIn onSignUp={() => setShowSignIn(false)} setLoading={setLoading} onError={onError} />
                :
                <SignUp onSignIn={() => setShowSignIn(true)} setLoading={setLoading} onError={onError} />}
        </div>
    )
};

export default withLoading(Authentication, "Verifying your existence...");
