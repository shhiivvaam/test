import React, { memo, useState, useRef, useEffect, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { User, onAuthStateChanged } from "firebase/auth";
import { Popover, ArrowContainer } from "react-tiny-popover";

import Switcher from "../theme-switcher/theme-switcher";

import SuperTasksMenu from "../../assets/images/menu.png";
import {
  setDBWorkspaceName,
  getInvitationUserList,
  getInvitedUsersList,
  sendInvite,
} from "../../redux/workspace/workspace.api";
import { ReactComponent as MenuIcon } from "../../assets/icons/ic_line_menu.svg";
import {
  getInvitationMemberListSelector,
  getInvitedMembersListSelector,
} from "../../redux/workspace/workspace.selector";
import { auth } from "../../firebase/firebase";
import { setIsWorkspaceNameEdit } from "../../redux/workspace/workspace.slice";

import "./workspace-nav-bar.css";
import { APP_PREFIX_PATH } from "../../configs/app-configs";

type WorkspaceNavbarProps = {
  workspaceId: string | undefined;
  name: string;
  isPersonal?: boolean;
  subscriptionType: string | object | undefined;
};

const getInvitedColors: any = {
  pending: {
    alpha: "delegate-alpha",
    solid: "delegate",
  },
  accepted: {
    alpha: "do-first-alpha",
    solid: "do-first",
  },
  rejected: {
    alpha: "eliminate-alpha",
    solid: "eliminate",
  },
};

const WorkspaceNavbar = ({
  name,
  workspaceId,
  isPersonal,
  subscriptionType,
}: WorkspaceNavbarProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const workspaceNameRef = useRef<HTMLInputElement>(null);

  const invitationMembersList = useSelector(
    getInvitationMemberListSelector,
    shallowEqual
  );
  const invitedMembersList = useSelector(
    getInvitedMembersListSelector,
    shallowEqual
  );

  const [workspaceName, setWorkspaceName] = useState<string>(name);
  const [workspaceEditingName, setWorkspaceEditingName] =
    useState<string>(name);
  const [isWorkspaceText, setIsWorkspaceText] = useState<boolean>(true);
  const [user, setUser] = useState<User>();
  const [members, setMembers] = useState<{
    email?: string;
    displayName?: string;
    uid?: string;
  }>({ email: "", displayName: "", uid: "" });
  const [isInvitePopupOpen, setIsInvitePopupOpen] = useState<boolean>(false);
  const [filteredMembers, setFilteredMembers] = useState<Array<any>>([]);
  const [memberHoverIndex, setMemberHoverIndex] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setWorkspaceEditingName(value);
  };

  const handleMemberInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setMembers({ email: event.target.value });

    const filtered = value
      ? invitationMembersList.filter((members: any) =>
        members.email.toLowerCase().includes(value.toLowerCase())
      )
      : [];
    setFilteredMembers(filtered);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    setWorkspaceName(workspaceEditingName || workspaceName);
    setIsWorkspaceText(true);
    dispatch(setIsWorkspaceNameEdit(false));
    if (user) {
      dispatch(
        setDBWorkspaceName({
          workspaceId,
          name: workspaceEditingName || workspaceName,
          uid: user?.uid,
        })
      );
    }
  };

  const handleShowTextInput = () => {
    if (isPersonal) {
      setIsWorkspaceText(false);
      dispatch(setIsWorkspaceNameEdit(true));
      workspaceNameRef.current?.focus();
    }
  };

  const handleToggleInvite = () => {
    setIsInvitePopupOpen((prev) => !prev);
  };

  const handleSendInvite = () => {
    debugger;
    if (members.uid && user && workspaceId) {
      dispatch(
        sendInvite({
          toUID: members.uid,
          toEmail: members.email,
          toDisplayName: members.displayName,
          fromUID: user.uid,
          fromName: user.displayName,
          workspaceId,
          workspaceName: name,
          subscriptionType,
        })
      );
      setMembers({ email: "", displayName: "", uid: "" });
    } else {
      setError("Please select member from the list");
      setTimeout(() => setError(""), 3000);
    }
  };

  const fetchInviteMembersList = useCallback(
    (user: User) => {
      dispatch(getInvitationUserList(user));
    },
    [dispatch]
  );

  useEffect(() => {
    if (workspaceId) {
      dispatch(getInvitedUsersList(workspaceId));
    }
  }, [dispatch, workspaceId]);

  useEffect(() => {
    if (workspaceNameRef.current) {
      workspaceNameRef.current?.focus();
    }
  }, [workspaceNameRef]);

  useEffect(() => {
    setWorkspaceName(name);
    setWorkspaceEditingName(name);
  }, [name]);

  useEffect(() => {
    onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUser(user);
        fetchInviteMembersList(user);
      }
    });
  }, [fetchInviteMembersList]);

  const getInvitiedMembersListView = useCallback(
    () =>
      invitedMembersList.map((members: any, index: number) => (
        <div
          className="inline-flex justify-between mt-2"
          key={index}
          onMouseEnter={() => setMemberHoverIndex(index)}
          onMouseLeave={() => setMemberHoverIndex(null)}
        >
          <span
            className={`font-poppins-light px-2 py-1 animate__animated animate__bounceIn animate__slow rounded-md text-xs bg-${getInvitedColors[members.status].alpha
              } text-${getInvitedColors[members.status].solid}`}
          >
            {memberHoverIndex === index ? members.status : members.email}
          </span>
        </div>
      )),
    [invitedMembersList, memberHoverIndex]
  );

  const getFilteredMembersListView = useCallback(
    () =>
      filteredMembers.length === 0 ? (
        <span className="text-xs text-black dark:text-white font-poppins-light inline-flex mt-2 self-center">
          No members found, maybe they're playing hide and seek!
        </span>
      ) : (
        filteredMembers.map((user: any) => (
          <>
            {user?.displayName?.trim()?.length > 0 && (
              <span
                className="text-white text-xs font-poppins-light py-2 cursor-pointer"
                onClick={() => setMembers(user)}
              >
                {user?.displayName}
              </span>
            )}
          </>
        ))
      ),
    [filteredMembers]
  );

  const getListView = () => {
    if (members.email?.length === 0) {
      return getInvitiedMembersListView();
    } else {
      return getFilteredMembersListView();
    }
  };

  const navigateAndCloseMenu = (path: string) => {
    navigate(path); // Navigate to the specified path
    setShowMenu(false); // Close the menu
  };

  const HamburgerMenu = () => (
    <div
      className={
        showMenu
          ? "showMenuNav title-menu-cliqueraft dark:bg-dark h-full"
          : "hideMenuNav title-menu-cliqueraft"
      }
    >
      <div className="absolute top-0 left-0 px-8 py-8 text-black p-1 flex flex-col">
        <div className="flex flex-row">
          <NavLink
            to={`${APP_PREFIX_PATH}`}>
            <img
              alt="supertasks.io menu"
              src={SuperTasksMenu}
              width={20}
              className="animate-rotate"
            />
          </NavLink>
          <p className="ml-5 text-md md:text-2xl font-poppins-medium dark:text-white">
            supertasks.io
          </p>
        </div>
        <span className="text-xs text-do-later bg-do-later-alpha px-3 py-2 rounded-md mt-2 font-poppins-regular">
          Quick decision making tool
        </span>
      </div>
      <div
        className="absolute top-0 right-0 px-8 py-8"
        onClick={() => setShowMenu(false)}
      >
        <svg
          className="h-8 w-8 text-gray-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
      <ul className="flex flex-col items-center space-around min-h-[250px] font-poppins-medium">
        <li className="my-5">
          <div
            onClick={() => navigateAndCloseMenu(`${APP_PREFIX_PATH}`)}
            className="text-black dark:text-white flex items-center no-underline pt-0 pb-0 pr-4 pl-4 h-full active:text-active-link"
          >
            Home
          </div>
        </li>
        <li className="my-5">
          <div
            onClick={() => navigateAndCloseMenu(`${APP_PREFIX_PATH}/workspace`)}
            className="text-black dark:text-white flex items-center no-underline pt-0 pb-0 pr-4 pl-4 h-full active:text-active-link"
          >
            Workspace
          </div>
        </li>
      </ul>
      <div className="absolute bottom-5 left-0 px-8 py-8 p-1 flex flex-col w-full">
        <div className="flex flex-row w-full items-center justify-between">
          <span className="text-xs text-white dark:text-black bg-black dark:bg-white rounded-md px-3 py-2 mb-2">
            BETA
          </span>
          <Switcher />
        </div>
      </div>
    </div>
  );

  return (
    <nav
      className="h-16 flex justify-end p-2 w-full relative dark:bg-dark title-input-cliqueraft"
      style={{ height: 70 }}
    >
      <NavLink to="/" />
      <div className="flex items-center font-poppins-medium title-menu-cliqueraft">
        <div className="absolute left-4 text-black p-1 flex items-center cursor-pointer dark:text-white">
          <NavLink
            to={`${APP_PREFIX_PATH}`}>
            <img
              src={SuperTasksMenu}
              width={27}
              height={27}
              className="animate-rotate"
              alt="supertasks.io logo"
            />
          </NavLink>
          <span className="text-xs ml-3 text-white bg-black rounded-md px-3 py-2 dark:text-black dark:bg-white">
            BETA
          </span>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {isWorkspaceText ? (
            <span
              className="text-md dark:text-white text-black px-2 py-1 rounded-md font-poppins-regular hover:scale-105 transition cursor-pointer inline-flex flex-row"
              onClick={handleShowTextInput}
            >
              {/* <span className="hidden md:block">workspace&nbsp;/</span>&nbsp; */}
              {workspaceName}
            </span>
          ) : (
            <input
              ref={workspaceNameRef}
              autoFocus={true}
              type="text"
              style={{
                width: `${workspaceEditingName.length > 2
                  ? workspaceEditingName.length * 13
                  : workspaceEditingName.length * 25
                  }px`,
              }}
              className="text-xs dark:text-white text-black bg-transparent px-2 py-1 rounded-md font-poppins-regular text-center"
              value={workspaceEditingName}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              maxLength={21}
            />
          )}
        </div>
        <div className="hidden md:flex">
          <Switcher />
        </div>
        <NavLink
          to={`${APP_PREFIX_PATH}`}
          className="text-black dark:text-white hidden md:flex items-center no-underline pt-0 pb-0 pr-4 pl-4 h-full cursor-pointer active:text-active-link"
        >
          Home
        </NavLink>
        <NavLink
          to="/workspace"
          className="text-black dark:text-white hidden md:flex items-center no-underline pt-0 pb-0 pr-4 pl-4 h-full cursor-pointer active:text-active-link"
        >
          Workspace
        </NavLink>
        <span className="text-black dark:text-white hidden md:flex items-center no-underline pt-0 pb-0 pr-4 pl-4 h-full cursor-pointer active:text-active-link">
          <Popover
            isOpen={isInvitePopupOpen}
            align="end"
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
                  {isPersonal && (
                    <div className="flex-row inline-flex justify-between items-center mt-3">
                      <input
                        ref={workspaceNameRef}
                        autoFocus={true}
                        type="email"
                        className="text-xs text-white bg-transparent border border-do-later px-2 py-1 rounded-md font-poppins-regular w-[90%]"
                        value={members.email}
                        onChange={handleMemberInput}
                        placeholder="email to invite"
                      />
                      <span
                        className="text-lg pl-3 ease-linear hover:scale-105 transition inline-flex cursor-pointer text-white"
                        onClick={handleSendInvite}
                      >
                        +
                      </span>
                    </div>
                  )}
                  <span className="text-xs font-poppins-light text-red">
                    {error}
                  </span>
                  <div className="inline-flex flex-col overflow-y-auto">
                    {getListView()}
                  </div>
                </div>
              </ArrowContainer>
            )}
          >
            <span onClick={handleToggleInvite}>Invite</span>
          </Popover>
        </span>
        <div className="md:hidden" onClick={() => setShowMenu((prev) => !prev)}>
          <MenuIcon className="dark:text-white" />
        </div>
      </div>
      <HamburgerMenu />
    </nav>
  );
};

export default memo(WorkspaceNavbar);
