import { ref, UploadResult, getBytes, uploadString, deleteObject } from "@firebase/storage";

import { storage } from "../firebase/firebase";

export const uploadCloud = async (uid: string, data: string): Promise<UploadResult> => {
    const storageRef = ref(storage, `files/${uid}`);
    return uploadString(storageRef, data);
}

export const fetchUserDataFromCloud = async (uid: string): Promise<ArrayBuffer> => {
    const storageRef = ref(storage, `files/${uid}`);
    return getBytes(storageRef);
}

export const deleteFileFromCloud = async (uid: string): Promise<void> => {
    const storageRef = ref(storage, `files/${uid}`);
    return deleteObject(storageRef);
}