import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DocumentData, updateDoc, doc, deleteField } from "firebase/firestore";

import { getUserData } from "../../api/databse";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import { APP_PREFIX_PATH } from "../../configs/app-configs";

const SessionToken = () => {
  const navigate = useNavigate();
  const [sessionList, setSessionList] = useState<any>(JSON.stringify({}));
  const [uid, setUID] = useState<string>("");
  useEffect(() => {
    const getDevices = async (uid: string) => {
      const devices: DocumentData | undefined = await getUserData(uid);
      setSessionList(JSON.stringify(devices?.deviceId));
    };

    //TODO: show user agent and manage device id to remove the loggedin session
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getDevices(user?.uid);
        setUID(user.uid);
      }
    });
  }, []);

  const handleDeleteSessionToken = async (token: string) => {
    if (uid) {
      const customerRef = doc(db, "customers", uid);
      updateDoc(customerRef, {
        [`deviceId.${token}`]: deleteField(),
      }).then(() => {
        navigate(`${APP_PREFIX_PATH}`);
      }).catch((error) => {
        console.log('error while removing session token', error);
      });
    }
  }

  return (
    <div className="w-full flex justify-center items-center flex-col mt-3">
      {Object.keys(JSON.parse(sessionList))?.map((token) => {
        return (
          <div className="inline-flex w-[80%] md:w-[30%] border items-center my-2 px-2 py-3 rounded-md justify-between">
            <span className="text-xs font-poppins-regular text-do-first bg-do-first-alpha px-3 py-2 rounded-md animate__animated animate__bounceIn">
              {JSON.parse(sessionList)[token]?.browserName} <br />
              version: {JSON.parse(sessionList)[token]?.fullBrowserVersion} <br />
              {new Date(JSON.parse(sessionList)[token]?.timestamp?.seconds * 1000).toDateString()}
              {" "}
              {new Date(JSON.parse(sessionList)[token]?.timestamp?.seconds * 1000).toLocaleTimeString()}
            </span>
            <span className="text-eliminate bg-eliminate-alpha text-xs px-3 py-2 rounded-md font-poppins-medium animate__animated animate__bounceIn  cursor-pointer"
              onClick={() => handleDeleteSessionToken(token)}>
              remove
            </span>
          </div>
        )
      })}
    </div>
  );
};

export default SessionToken;
