import { useState, useEffect } from "react";
import { User } from "firebase/auth";

import isUserPremium from "../stripe/is-user-premium";

const usePremiumStatus = (user: User | undefined): { status: boolean | undefined; isLoading: boolean } => {
    const [premiumStatus, setPremiumStatus] = useState<boolean | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state

    useEffect(() => {
        if (user) {
            const checkPremiumStatus = async () => {
                setIsLoading(true);
                setPremiumStatus(await isUserPremium());
                setIsLoading(false)
            }

            checkPremiumStatus();
        }
    }, [user]);
    return { status: premiumStatus, isLoading };
}

export default usePremiumStatus;
