import { ref, set, remove } from '@firebase/database';
import {doc, getDoc, DocumentData} from '@firebase/firestore';

import {database, db} from '../firebase/firebase';

export const setTimeCreate = async (uid: string, time: string): Promise<void> => {
    localStorage.setItem('@Time', JSON.stringify(time));
    return set(ref(database, `time_creation/${uid}`), {
        time,
    });
}

export const deleteTimeCreate = async (uid: string): Promise<void> => {
    remove(ref(database, `time_creation/${uid}`));
}

export const uploadTasks = async (uid: string, tasks: string): Promise<void> => {
    return set(ref(database, `tasks/${uid}`), {
        tasks,
    })
}

export const getCreator = async (uid: string): Promise<boolean | void> => {
    const docRef = doc(db, "creators", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()){
        return docSnap.data()?.creator;
    }
}

export const getUserData = async (uid: string): Promise<DocumentData | undefined> => {
    const docRef = doc(db, "customers", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()){
        return docSnap.data();
    }
}
