import React, { useState, useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { User, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Popover, ArrowContainer } from "react-tiny-popover";
import { toast } from "react-toastify";

import WorkspaceList from "../../components/workspace-list/workspace-list";
import {
  createWorkSpace,
  getWorkSpace,
  removeWorkSpace,
  getGuestInvitationList,
  updateInvitationStatus,
} from "../../redux/workspace/workspace.api";
import { auth } from "../../firebase/firebase";
import useSubscriptionType from "../../hooks/useSubscriptionType";
import {
  getWorkSpaceSelector,
  getGuestInvitationSelector,
  getGuestWorkspaceSelector,
  workspaceError,
  getWorkSpaceLoading,
} from "../../redux/workspace/workspace.selector";
import { ReactComponent as CheckIcon } from "../../assets/icons/ic_check.svg";
import { ReactComponent as CloseIcon } from "../../assets/icons/ic_close.svg";
import { clearWorkspaceError } from "../../redux/workspace/workspace.slice";
import usePremiumStatus from "../../hooks/usePremiumStatus";
import Loader from "../../components/loader/loader";
import { APP_PREFIX_PATH } from "../../configs/app-configs";

const Workspace = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const myWorkspace = useSelector(getWorkSpaceSelector, shallowEqual);
  const guestInvitationList = useSelector(
    getGuestInvitationSelector,
    shallowEqual
  );
  const guestWorkspace = useSelector(getGuestWorkspaceSelector, shallowEqual);
  const errorWorkspace = useSelector(workspaceError, shallowEqual);
  const isWorkspaceLoading = useSelector(getWorkSpaceLoading, shallowEqual);

  const [user, setUser] = useState<User>();
  const [toggleInvitation, setToggleInvitation] = useState<boolean>(false);

  const { status: isUserPremium, isLoading } = usePremiumStatus(user);
  const subscriptionType = useSubscriptionType(user);

  const addWorkSpace = () => {
    if (user) {
      dispatch(createWorkSpace({ uid: user?.uid, subscriptionType, workspaceName: "untitled" }));
    }
  };

  const handleRemoveWorkSpace = (item: Array<string>) => {
    if (user) {
      dispatch(removeWorkSpace({ uid: user?.uid, workspaceId: item[0] }));
    }
  };

  const handleWorkspaceNavigation = (
    item: Array<string>,
    isPersonalWorkspace: boolean
  ) => {
    if (isUserPremium) {
      navigate(`${APP_PREFIX_PATH}/workspace/${item[0]}`, { state: { isPersonalWorkspace } });
    }
  };

  const handlePricingNavigation = () => {
    navigate(`${APP_PREFIX_PATH}/pricing-plan`);
  }

  const handleInvitationStatus = (status: string, workspaceId: string) => {
    if (user) {
      dispatch(updateInvitationStatus({ uid: user.uid, workspaceId, status }));
    }
  };

  const handleToggleInvitation = () => {
    setToggleInvitation((prev) => !prev);
  };

  const notify = (message: string): void => {
    toast(message, {
      toastId: "do-not-repeat",
      theme: "dark",
      progress: undefined,
    });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(getWorkSpace(user?.uid));
      dispatch(getGuestInvitationList(user?.uid));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (errorWorkspace) {
      notify(errorWorkspace);
      dispatch(clearWorkspaceError());
    }
  }, [errorWorkspace, dispatch]);

  const plan = ['Unlimited tasks and edits', 'Multi device sync support', 'Create Workspaces and invite members', 'Edit section names']

  if ((isWorkspaceLoading || isLoading) && user) {
    return (
      <Loader loadingMessage="" />
    )
  }

  if (isUserPremium === false || !user) {
    return (
      <div className="w-screen h-screen bg-white dark:bg-dark dark:border-dark-gray border-0 border-black border-t-[1px] relative">
        <div className="absolute top-5 right-5 inline-flex justify-center items-center">
          <span className="text-xs text-delegate bg-delegate-alpha px-3 py-2 rounded-md font-poppins-regular animate__animated animate__bounceIn">
            Workspace
          </span>
        </div>
        <main className="mt-20">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-normal md:text-3xl lg:text-4xl font-poppins-light text-dark dark:text-white">
              Upgrade your plan to create <span className="font-poppins-medium">shareable workspaces</span>
            </h1>
            <p className="text-sm font-normal text-gray-400 font-poppins-light">
              Upgrade for a team to share the workload (and the coffee).
            </p>
          </div>
          <div className="flex flex-col items-center justify-center mt-16 space-y-8 lg:flex-row lg:items-stretch lg:space-x-8 lg:space-y-0">

            <section className={`flex flex-col w-full max-w-sm p-12 space-y-6 bg-white dark:bg-dark dark:border-dark-gray border-done`}>

              <div className="flex-shrink-0 pb-6 space-y-2 border-b">
                <h2 className="text-2xl font-poppins-regular text-green-500">Upgrade your plan</h2>
              </div>

              <ul className="flex-1 space-y-4">
                {plan.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="flex-shrink-0 w-6 h-6 text-green-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                        className='animate__animated animate__bounceIn'
                      />
                    </svg>
                    <span className="ml-3 text-base font-poppins-medium text-dark dark:text-white">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex-shrink-0 pt-4">
                <button
                  className={`inline-flex items-center justify-center w-full max-w-xs px-4 py-2 transition-colors border rounded focus:outline-none font-poppins-bold text-do-first bg-do-first-alpha`}
                  onClick={handlePricingNavigation}
                >
                  Upgrade
                </button>
              </div>
            </section>

          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen relative bg-white px-4 py-16 dark:bg-dark dark:border-dark-gray border-0 border-black border-t-[1px]">
      <div className="absolute top-5 right-5 inline-flex ustify-center items-center">
        <Popover
          isOpen={toggleInvitation}
          align="end"
          onClickOutside={() => setToggleInvitation(false)}
          positions={["bottom"]}
          content={({ position, childRect, popoverRect }) => (
            <ArrowContainer
              position={position}
              childRect={childRect}
              popoverRect={popoverRect}
              arrowColor={"#2a2e2d"}
              arrowSize={8}
            >
              <div className="bg-[#2a2e2d] px-4 py-2 rounded-md flex flex-col relative h-48 w-56">
                {guestInvitationList?.some(
                  (invites: Array<any>) => invites[1]?.status === "pending"
                ) ? (
                  guestInvitationList?.map(
                    (invites: Array<any>) =>
                      invites[1]?.status === "pending" && (
                        <div className="inline-flex" key={invites[0]}>
                          <div className="flex-1 flex-col">
                            <div>
                              <span className="text-sm text-white font-poppins-regular">
                                {invites[1]?.workspaceName}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-white font-poppins-regular">
                                by: {invites[1]?.fromName}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 relative">
                            <div className="absolute bottom-0 right-0 inline-flex">
                              <CheckIcon
                                className="hover:bg-do-first-alpha rounded-md cursor-pointer"
                                onClick={() =>
                                  handleInvitationStatus("accepted", invites[0])
                                }
                              />
                              <CloseIcon
                                className="rounded-md hover:bg-eliminate-alpha cursor-pointer"
                                onClick={() =>
                                  handleInvitationStatus("rejected", invites[0])
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )
                  )
                ) : (
                  <div className="text-white font-poppins-regular text-center text-sm inline-flex flex-1 justify-center items-center">
                    Zero new invites-your inbox is enjoying some peace and
                    quiet!
                  </div>
                )}
              </div>
            </ArrowContainer>
          )}
        >
          <div className="relative">
            <span
              className={`mr-3 text-dark dark:text-white text-xs font-poppins-regular cursor-pointer relative`}
              onClick={handleToggleInvitation}
            >
              Invitations
              {guestInvitationList.length > 0 && (
                <span className="h-2 w-2 rounded-full bg-red absolute top-0" />
              )}
            </span>
          </div>
        </Popover>
        <span className="text-xs text-delegate bg-delegate-alpha px-3 py-2 rounded-md font-poppins-regular animate__animated animate__bounceIn">
          Workspace
        </span>
      </div>
      <div className="flex w-full flex-col space-y-4">
        <div className="flex flex-wrap">
          <span className="text-xs text-do-first bg-do-first-alpha px-3 py-2 rounded-md font-poppins-regular animate__animated animate__bounceIn animate__slow">
            Your workspace
          </span>
        </div>
        <WorkspaceList
          isPersonalWorkSpace={true}
          addWorkSpace={addWorkSpace}
          removeWorkSpace={handleRemoveWorkSpace}
          workspaceList={myWorkspace}
          onNavigateWorkspace={handleWorkspaceNavigation}
        />
        {guestWorkspace.length > 0 && (
          <>
            <div className="flex flex-wrap">
              <span className="text-xs text-do-later bg-do-later-alpha px-3 py-2 rounded-md font-poppins-regular animate__animated animate__bounceIn animate__slow">
                Guest workspace
              </span>
            </div>
            <WorkspaceList
              isPersonalWorkSpace={false}
              workspaceList={guestWorkspace}
              onNavigateWorkspace={handleWorkspaceNavigation}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Workspace;
