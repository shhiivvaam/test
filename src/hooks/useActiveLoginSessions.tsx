import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, getDoc } from "firebase/firestore";

const auth = getAuth();
const firestore = getFirestore();

const activeLoginSessionsCollection = collection(firestore, "activeLoginSessions");

interface TActiveLoginSession {
    [x: string]: any;
    userId?: string;
    deviceId?: string;
    timestamp?: number;
}

const useActiveLoginSessions = (): TActiveLoginSession[] => {
    const [activeLoginSessions, setActiveLoginSessions] = useState<TActiveLoginSession[]>([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userId = user.uid;
                const deviceId = window.navigator.userAgent;

                const activeLoginSessionDoc = await getDoc(doc(activeLoginSessionsCollection, userId));
                const activeLoginSession = activeLoginSessionDoc.data();

                if (!activeLoginSession || activeLoginSession.deviceId !== deviceId) {
                    // The user is not signed in on this device, or they are signed in on another device.
                    // Prevent the user from signing in.
                } else {
                    // The user is signed in on this device.
                    setActiveLoginSessions([activeLoginSession]);
                }
            } else {
                // The user is signed out.
                setActiveLoginSessions([]);
            }
        });

        return unsubscribe;
    }, []);

    return activeLoginSessions;
};

export default useActiveLoginSessions;
