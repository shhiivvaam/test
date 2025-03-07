import React, { FC, useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged, User } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

import InvitationInput, {
  InvitationUser,
} from "../invitation-input/invitation-input";
import {
  resetEventMessage,
  setInvitedMembers,
  setSteps,
} from "../../redux/workspace/workspace.slice";
import {
  getInvitedMembers,
  getWorkspaceName,
} from "../../redux/workspace/workspace.selector";
import { auth } from "../../firebase/firebase";
import {
  completeOnboarding,
  createWorkSpace,
  sendBulkInvite,
} from "../../redux/workspace/workspace.api";
import { RootState } from "../../redux/store";
import { APP_PREFIX_PATH } from "../../configs/app-configs";

type RegisterInvitedMembersProps = {
  setLoading?: (isLoading: boolean) => void;
};

const workspaceId = uuidv4();

const OnboardingInvitedMembers: FC<RegisterInvitedMembersProps> = ({
  setLoading,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const workspaceName = useSelector(getWorkspaceName, shallowEqual);
  const invitedMembers = useSelector(getInvitedMembers, shallowEqual);
  const eventMessages = useSelector(
    (state: RootState) => state.workspace.eventMessages,
    shallowEqual
  );

  const [user, setUser] = useState<User>();

  const onPrevious = () => {
    dispatch(setSteps(1));
  };

  const onFinish = () => {
    if (user) {
      dispatch(
        createWorkSpace({
          uid: user.uid,
          subscriptionType: "",
          workspaceId,
          workspaceName,
        })
      );
    }
  };

  const onInvitedMembers = (members: InvitationUser[]): void => {
    dispatch(setInvitedMembers(members));
  };

  useEffect(() => {
    if (eventMessages === "Workspace created successfully") {
      if (user && invitedMembers.length > 0) {
        dispatch(
          sendBulkInvite({
            users: invitedMembers,
            fromUID: user.uid,
            fromName: user.displayName ?? "",
            workspaceId,
            workspaceName,
            subscriptionType: "",
          })
        );
      }
      navigate(`${APP_PREFIX_PATH}/workspace/${workspaceId}`, {
        state: { isPersonalWorkspace: true },
      });
    }

    return () => {
      dispatch(resetEventMessage());
      if (user) {
        dispatch(completeOnboarding(user?.uid));
      }
    };
  }, [eventMessages, dispatch, navigate, invitedMembers, user, workspaceName]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <h1 className="text-2xl mb-4 font-poppins-bold">Invite your team members</h1>
      <div className="flex items-center border-2 py-2 px-3 rounded-md mb-4 max-w-full">
        <InvitationInput onItemSelected={onInvitedMembers} user={user} />
      </div>
      <div className="flex justify-end">
        <button
          className="text-sm  text-eliminate bg-eliminate-alpha  px-3 py-2 rounded-md mr-2"
          onClick={onPrevious}
        >
          <span>Previous</span>
        </button>
        <button
          className="text-sm text-white bg-do-later px-3 py-2 rounded-md"
          onClick={onFinish}
        >
          <span>Finish</span>
        </button>
      </div>
    </>
  );
};

export default OnboardingInvitedMembers;
