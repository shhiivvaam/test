import React, { ChangeEvent, useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { CheckCircleIcon } from "@heroicons/react/outline";

import { getWorkspaceName } from "../../redux/workspace/workspace.selector";
import {
  setSteps,
  setWorkspaceName,
} from "../../redux/workspace/workspace.slice";
const OnboardingWorkspace = () => {
  const dispatch = useDispatch();

  const workspaceName = useSelector(getWorkspaceName, shallowEqual);

  const [workspacePrerequisite, setWorkspacePrerequisite] =
    useState<boolean>(false);
  const [validWorkspaceName, setValidWorkspaceName] = useState<boolean>(false);

  const onWorkspaceName = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    dispatch(setWorkspaceName(value));
    const isNameValid = value.length > 3;
    setValidWorkspaceName(isNameValid);
  };

  const isValidForm = () => {
    const isNameValid = workspaceName.length > 3;
    setValidWorkspaceName(isNameValid);

    if (isNameValid) {
      return true;
    }

    if (!isNameValid) setWorkspacePrerequisite(true);
    return false;
  };

  const onNext = () => {
    if (isValidForm()) {
      dispatch(setSteps(2));
    }
  };

  useEffect(() => {
    return () => setWorkspacePrerequisite(false);
  }, []);

  return (
    <>
      <h1 className="text-2xl mb-4 font-poppins-bold">It all starts with the workspace</h1>
      <div className="flex items-center border-2 py-2 px-3 rounded-md mt-4 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400"
          viewBox="0 0 24 24"
        >
          <g fill="none" fill-rule="evenodd">
            <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
            <path
              fill="currentColor"
              d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm10 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"
            />
          </g>
        </svg>
        <input
          className="pl-2 outline-none border-none truncate font-poppins-regular w-full"
          type="text"
          id="workspace"
          placeholder="Workspace name"
          onChange={onWorkspaceName}
          value={workspaceName}
        />
      </div>
      {workspacePrerequisite && (
        <div className="flex flex-row items-center mb-4">
          <CheckCircleIcon
            className={`${validWorkspaceName ? "text-green-500" : "text-gray-500"
              } h-5 w-5`}
          />
          <p
            className={`${validWorkspaceName ? "text-green-500" : "text-gray-500"
              } ml-2 font-poppins-light`}
          >
            {validWorkspaceName ? "Valid name" : "Enter the valid name"}
          </p>
        </div>
      )}
      <div className="flex justify-end">
        <button
          className="text-sm text-do-later bg-do-later-alpha px-3 py-2 rounded-md"
          onClick={onNext}
        >
          <span>Next</span>
        </button>
      </div>
    </>
  );
};

export default OnboardingWorkspace;