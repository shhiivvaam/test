import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { onAuthStateChanged, User, signOut } from "@firebase/auth";
import { doc, DocumentData, getDoc, updateDoc } from "firebase/firestore";
import { XIcon } from "@heroicons/react/outline";
import { useDispatch } from "react-redux";

import Modal from "../../components/modal/modal";
import { auth, db } from "../../firebase/firebase";
import { resetTheReducer } from "../../redux/tasks/tasks.slice";
import { getUserData } from "../../api/databse";
import { createCustomerPortal } from "../../api/stripe";
import usePremiumStatus from "../../hooks/usePremiumStatus";
import { toast } from "react-toastify";
import { APP_PREFIX_PATH, AUTH_PREFIX_PATH } from "../../configs/app-configs";

type ProfileProps = {
  isProfileModalVisible: boolean;
  onClose: () => void;
};

const Profile = ({ isProfileModalVisible, onClose }: ProfileProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showProfile, setShowProfile] = useState<boolean>(true);
  const [user, setUser] = useState<User>();
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [userId, setUserId] = useState<string>();

  const userIsPremium = usePremiumStatus(user);

  const showMenu = () => {
    if (showProfile) {
      return profileMenu();
    }
    return subscriptionMenu();
  };

  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, (user) => {
      if (user !== null) {
        setUser(user);
        setUserId(user.uid);
        getUserData(user?.uid).then((result: DocumentData | undefined) => {
          if (result) {
            setFirstName(result.firstName);
            setLastName(result.lastName);
            setEmail(result.email);
          }
        });
      }
    });
    return () => unsubcribe();
  }, []);

  const onSubscribe = (): void => {
    navigate(`${APP_PREFIX_PATH}/pricing-plan`);
    onClose();
  };

  const notify = (message: string): void => {
    toast(message, {
      toastId: "do-not-repeat",
      theme: "dark",
      progress: undefined,
    });
  };

  const getCustomerId = async (): Promise<string> => {
    const docRef = doc(db, "customers", `${userId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data()?.stripeId;
    }
    return "user is not subscribed";
  };

  const onRenewal = (): void => {
    getCustomerId().then((customerId: string) => {
      if (customerId !== "user is not subscribed") {
        navigateToCustomerPortal(customerId);
      } else {
        notify("User is not subscribed");
      }
    });
  };

  const navigateToCustomerPortal = (customerId: string) => {
    createCustomerPortal(customerId)
      .then((response) => {
        const url = response.data?.url;
        window.location.href = url;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onLogout = (): void => {
    if (user) {
      removeFirstDevice(user?.uid)
        .then(() => {
          deleteLocalDb()
            .then(() => {
              dispatch(resetTheReducer());
              signOut(auth)
                .then(async () => {
                  navigate(`${AUTH_PREFIX_PATH}/login`);
                  onClose();
                })
                .catch((error) => {
                  console.error("error", error);
                });
            })
            .catch((error) =>
              console.error("Error while deleting local db", error)
            );
        })
        .catch((error) => console.log("error ===", error));
    }
  };

  const removeFirstDevice = async (userId: string) => {
    const userRef = doc(db, "customers", userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      if (userData.deviceId) {
        const deviceIds = Object.keys(userData.deviceId);
        if (deviceIds.length > 0) {
          const updatedData = { ...userData };
          delete updatedData.deviceId[deviceIds[0]];
          await updateDoc(userRef, {
            deviceId: updatedData.deviceId,
          });
        }
      }
    }
  };

  const deleteLocalDb = () =>
    new Promise((resolve, reject) => {
      try {
        localStorage.removeItem("@Tasks");
        resolve("success");
      } catch (error) {
        reject(error);
      }
    });

  const profileMenu = () => (
    <div>
      <label className="text-sm ml-2 font-poppins-regular dark:text-white">
        First name
      </label>
      <div className="flex items-center border-2 py-2 px-3 rounded-md mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
        <input
          className="pl-2 outline-none border-none text-gray-500 truncate font-poppins-regular w-full bg-transparent"
          type="firstName"
          id="firstName"
          disabled
          placeholder="First name"
          value={firstName}
        />
      </div>
      <label className="text-sm ml-2 font-poppins-regular dark:text-white">
        Last name
      </label>
      <div className="flex items-center border-2 py-2 px-3 rounded-md mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
        <input
          className="pl-2 outline-none font-poppins-regular border-none text-gray-500 truncate w-full bg-transparent"
          type="lastName"
          id="lastName"
          disabled
          placeholder="Last name"
          value={lastName}
        />
      </div>
      <label className="text-sm ml-2 font-poppins-regular dark:text-white">
        Email
      </label>
      <div className="flex items-center border-2 py-2 px-3 rounded-md mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
          />
        </svg>
        <input
          className="pl-2 font-poppins-regular outline-none border-none text-gray-500 truncate w-full bg-transparent"
          disabled
          type="text"
          id="email"
          placeholder="Email Address"
          value={email}
        />
      </div>
    </div>
  );

  const subscriptionMenu = () => (
    <div className="flex flex-col">
      <span className="font-poppins-regular dark:text-white">
        Subscription status
      </span>
      <div className="flex flex-row ml-3 mt-2 mb-5 items-center">
        <div
          className={`w-2 h-2 rounded-full ${
            userIsPremium ? "bg-green-500" : "bg-gray-400"
          } mr-2`}
        />
        <span className="text-gray-400 text-sm font-poppins-light">
          {userIsPremium ? "On" : "Off"}
        </span>
      </div>
      {userIsPremium ? (
        <>
          <span className="font-poppins-regular dark:text-white">
            Modify your plan?
          </span>
          <br />
          <button
            className="font-poppins-light text-sm mt-3 py-2 px-3 bg-do-later-alpha rounded-md text-do-later"
            onClick={onRenewal}
          >
            Modify
          </button>
        </>
      ) : (
        <div>
          <span className="font-poppins-regular dark:text-white">
            Want more amazing features?
          </span>
          <br />
          <button
            className="text-sm mt-3 py-2 px-3 font-poppins-medium bg-do-later-alpha rounded-md text-do-later"
            onClick={onSubscribe}
          >
            Subscribe
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Modal isModalVisible={isProfileModalVisible}>
        <div className="flex items-start justify-between p-5 flex-col h-[470px] lg:h-[400px] w-full">
          <div
            className="flex cursor-pointer w-full justify-end"
            onClick={onClose}
          >
            <XIcon className="h-6 w-6 dark:text-white" />
          </div>
          <div className="flex flex-col lg:flex-row h-full w-full">
            <div className="flex h-full flex-row lg:flex-col">
              <span
                onClick={(): void => setShowProfile(true)}
                className={`cursor-pointer mr-3 lg:mr-0 h-16 flex items-center font-poppins-medium ${
                  showProfile ? "text-do-later" : "text-black dark:text-white"
                }`}
              >
                Profile
              </span>
              <span
                onClick={(): void => setShowProfile(false)}
                className={`cursor-pointer h-16 flex items-center font-poppins-medium ${
                  !showProfile ? "text-do-later" : "text-black dark:text-white"
                }`}
              >
                Subscription
              </span>
            </div>
            <div className="h-auto w-[.7px] bg-blue-400 ml-3" />
            <div className="w-full h-full mx-2 lg:ml-5">{showMenu()}</div>
          </div>
          <div className="self-center py-4">
            <button
              className="text-xl text-eliminate py-2 px-3 rounded hover:bg-eliminate-alpha hover:text-eliminate transition-colors duration-300 font-poppins-medium"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Profile;
