import React, { FC } from "react";
import { PlusIcon } from "@heroicons/react/outline";

import SuperTasksMenu from "../../assets/images/menu.png";
import { shallowEqual, useSelector } from "react-redux";
import {
  getInvitedMembers,
  getWorkspaceName,
} from "../../redux/workspace/workspace.selector";
import { NavLink } from "react-router-dom";
import { APP_PREFIX_PATH } from "../../configs/app-configs";

type QuadrantLayoutProps = {
  steps: number;
};

const QuadrantLayout: FC<QuadrantLayoutProps> = ({ steps }) => {
  const workspaceName = useSelector(getWorkspaceName, shallowEqual);
  const invitedMembers = useSelector(getInvitedMembers, shallowEqual);

  console.log('invited members', invitedMembers);
  return (
    <div className="w-full h-full inline-flex justify-center items-center flex-col">
      <div className="h-10 w-2/3 bg-black rounded-t-lg inline-flex items-center justify-center px-3 relative">
        <NavLink
          to={`${APP_PREFIX_PATH}`}>
          <img
            src={SuperTasksMenu}
            width={22}
            height={22}
            className="animate-rotate absolute top-1/2 left-3 transform -translate-y-1/2"
            alt="supertasks.io logo"
          />
        </NavLink>
        <span className="text-white text-sm font-poppins-light">
          {workspaceName}
        </span>
        {steps === 2 && (
          <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center">
            {invitedMembers.length === 0 ? (
              <PlusIcon className="w-5 h-5 text-white dark:text-black" />
            ) : (
              invitedMembers.map((member, index) => (
                <div key={index} className="relative group mx-1">
                  {/* Circle Icon */}
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-black">
                      {member.displayName?.charAt(0) || "?"}
                    </span>
                  </div>
                  {/* Tooltip or Name (optional) */}
                  <span className="absolute top-full mt-1 px-2 py-1 text-xs bg-black text-white rounded hidden group-hover:block">
                    {member.displayName || "Unknown"}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <div className="h-1/2 w-2/3 rounded-b-lg overflow-hidden">
        {/* Quadrants */}
        <div className="grid grid-cols-2 grid-rows-2 h-full">
          <div className="bg-do-first px-4 py-3">
            <div className="w-full h-7 rounded bg-white px-2 py-1 opacity-75"></div>

            <div className="w-full h-7 rounded bg-white px-2 py-1 mt-2 opacity-75"></div>

            <div className="w-full h-7 rounded bg-white px-2 py-1 mt-2 opacity-75"></div>
          </div>
          <div className="bg-delegate px-4 py-3">
            <div className="w-full h-7 rounded bg-white px-2 py-1 opacity-75"></div>

            <div className="w-full h-7 rounded bg-white px-2 py-1 mt-2 opacity-75"></div>
          </div>
          <div className="bg-do-later px-4 py-3">
            <div className="w-full h-7 rounded bg-white px-2 py-1 mt-2 opacity-75"></div>
          </div>
          <div className="bg-eliminate px-4 py-3"></div>
        </div>
      </div>
    </div>
  );
};

export default QuadrantLayout;
