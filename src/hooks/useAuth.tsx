import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase/firebase";

const useAuth = (): User | null => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (_user) => {
            setUser(_user);
        })

        return unsubscribe;
    }, []);
    return user;

}

export default useAuth;