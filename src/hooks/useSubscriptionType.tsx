import { useState, useEffect } from "react";
import { User } from "firebase/auth";

import userSubscriptionType from "../stripe/user-subscription-type";

const useSubscriptionType = (user: User | undefined): string | object | undefined => {
    const [premiumStatus, setPremiumStatus] = useState<string | object | undefined>('');
    useEffect(() => {
        if (user) {
            const checkPremiumStatus = async () => {
                setPremiumStatus(await userSubscriptionType());
            }

            checkPremiumStatus();
        }
    }, [user]);
    return premiumStatus;
}

export default useSubscriptionType;
