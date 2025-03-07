import React, { useState, useEffect, useMemo } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { User, onAuthStateChanged } from "firebase/auth";
import { useParams, useLocation } from "react-router-dom";
import { DataSnapshot, onValue, ref } from "firebase/database";

import { setWorkSpaceTaskFromDb } from "../../redux/workspace/workspace.slice";
import { auth, database } from "../../firebase/firebase";
import { getWorkSpaceTask } from "../../redux/workspace/workspace.selector";
import { checkWorkspaceAccess } from "../../redux/workspace/workspace.api";
import useSubscriptionType from "../../hooks/useSubscriptionType";
import WorkspaceNavItems from "../../components/workspace-nav-bar/workspace-nav-items";

const WorkspaceNav = () => {
    const dispatch = useDispatch();
    const { id: workspaceId } = useParams();
    const { pathname, state } = useLocation() as any;
    const isWorkspace = useMemo(() => pathname.includes("/workspace"), [pathname]);

    const tasks = useSelector(getWorkSpaceTask, shallowEqual);

    const [boardData, setBoardData] = useState(tasks);
    const [workspaceName, setWorkspaceName] = useState<string | undefined>();
    const [uid, setUID] = useState<string>("");
    const [user, setUser] = useState<User>();

    const subscriptionType = useSubscriptionType(user);

    useEffect(() => {
        const workspaceRef = ref(database, `workspace/${workspaceId}`);
        onValue(workspaceRef, async (snapshot: DataSnapshot) => {
            const workspaceTasks: string = snapshot.val()?.tasks as string;
            const workspaceName: string = snapshot.val()?.name as string;
            if (workspaceTasks !== undefined && workspaceId !== undefined) {
                setBoardData(JSON.parse(workspaceTasks));
            }
            setWorkspaceName(workspaceName);
        });
    }, [workspaceId, dispatch]);

    useEffect(() => {
        dispatch(setWorkSpaceTaskFromDb(boardData));
    }, [boardData, dispatch, workspaceId]);

    useEffect(() => {
        onAuthStateChanged(auth, (user: User | null) => {
            if (user) {
                setUID(user?.uid);
                setUser(user);
            }
        });
    }, []);

    useEffect(() => {
        if (workspaceId) {
            dispatch(checkWorkspaceAccess({ uid, workspaceId }));
        }
    }, [dispatch, uid, workspaceId]);

    return (
        <>
            {isWorkspace && (
                <WorkspaceNavItems
                    workspaceId={workspaceId}
                    name={workspaceName ?? "untitled"}
                    isPersonal={state?.isPersonalWorkspace}
                    subscriptionType={subscriptionType}
                />
            )}
            {/* <WorkspaceNavBar
                workspaceId={workspaceId}
                name={workspaceName ?? "untitled"}
                isPersonal={state?.isPersonalWorkspace}
                subscriptionType={subscriptionType}
            /> */}
        </>
    );
};

export default WorkspaceNav;