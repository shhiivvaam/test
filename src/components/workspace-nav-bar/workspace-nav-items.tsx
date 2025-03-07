import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { User, onAuthStateChanged } from "firebase/auth";
import { Popover, ArrowContainer } from "react-tiny-popover";

import Switcher from "../theme-switcher/theme-switcher";

import {
    setDBWorkspaceName,
    getInvitationUserList,
    getInvitedUsersList,
    sendInvite,
} from "../../redux/workspace/workspace.api";
import {
    getInvitationMemberListSelector,
    getInvitedMembersListSelector,
} from "../../redux/workspace/workspace.selector";
import { auth } from "../../firebase/firebase";
import { setIsWorkspaceNameEdit } from "../../redux/workspace/workspace.slice";

import "../workspace-nav-bar/workspace-nav-bar";
import { AvatarCircles } from "./invite-user-avatars";

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

const avatars = [
    {
        imageUrl: "https://avatars.githubusercontent.com/u/96204332?v=4",
        profileUrl: "https://github.com/shhiivvaam",
    },
    {
        imageUrl: "https://avatars.githubusercontent.com/u/81289921?v=4",
        profileUrl: "https://github.com/vinayak25",
    },
    {
        imageUrl: "https://avatars.githubusercontent.com/u/21158588?v=4",
        profileUrl: "https://github.com/shhiivvaam",
    },
];

const WorkspaceNavItems = ({
    name,
    workspaceId,
    isPersonal,
    subscriptionType,
}: WorkspaceNavbarProps) => {

    const dispatch = useDispatch();
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

    return (
        <nav className="inline-flex relative items-center mt-2 dark:bg-dark w-full">
            <div className="flex justify-between text-center items-center">
                <div className="">
                    {isWorkspaceText ? (
                        <span
                            className="text-black dark:text-white hidden md:flex items-center no-underline pt-0 pb-0 pr-4 pl-4 h-full active:text-active-link text-lg px-2 py-1 rounded-md font-poppins-regular hover:scale-105 transition cursor-pointer flex-row"
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
                                width: `${workspaceName?.length > 2
                                    ? workspaceName?.length * 13
                                    : workspaceName?.length * 25
                                }px`,
                            }}
                            className="flex justify-center align-middle items-center text-center "
                            value={workspaceEditingName}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            maxLength={21}
                        />
                    )}
                </div>
                <div className="flex items-center">
                    <div
                        className="text-black dark:text-white hidden md:flex items-center no-underline py-0 px-4 h-full cursor-pointer active:text-active-link font-poppins-regular"
                    >
                        <Switcher />
                    </div>
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
                                    arrowSize={0}
                                >
                                    <div className="bg-[#2a2e2d] px-4 py-2 rounded-md flex flex-col relative h-48 w-48">
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
                            <span onClick={handleToggleInvite}></span>
                            {/* <></> */}
                            {/* pass "numPeople", for showing total numbers of users invited */}
                        </Popover>
                        <AvatarCircles avatarUrls={avatars} onClick={handleToggleInvite} />
                    </span>
                </div>
            </div>
        </nav >
    )
}

export default WorkspaceNavItems;