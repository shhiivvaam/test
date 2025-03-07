import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  doc,
  updateDoc,
  getDoc,
  deleteField,
  writeBatch,
} from "firebase/firestore";
import {
  update,
  ref,
  serverTimestamp,
  remove,
  get,
  child,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { User, getIdToken } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import cloneDeep from "lodash/cloneDeep";

import { database, db } from "../../firebase/firebase";
import { RootState } from "../store";
import { toast } from "react-toastify";
import { fetchToUIDs } from "../../utils/miscellaneous";
import { InvitationUser } from "./workspace.slice";

const setWorkSpace = async (
  uid: string,
  workspace: any,
  workspaceId?: string,
  workspaceName?: string,
): Promise<string> => {
  try {
    const userRef = doc(db, "customers", uid);
  const _workspaceId = workspaceId ?? uuidv4();
  const updateWorkspace = await updateDoc(userRef, {
    workspaces: {
      ...workspace,
      [_workspaceId]: workspaceName ?? "untitled",
    },
  });

  const initializeWorkspace = await update(ref(database, `workspace/${_workspaceId}`), {
    tasks: JSON.stringify({
      "do-first": { title: "Do first", ids: [] },
      "do-later": { title: "Do later", ids: [] },
      delegate: { title: "Delegate", ids: [] },
      eliminate: { title: "Eliminate", ids: [] },
      items: {},
      tags: {},
    }),
    participants: {
      owner: uid,
    },
    createdAt: serverTimestamp(),
    name: workspaceName,
  });

  await Promise.all([updateWorkspace, initializeWorkspace]);

  return _workspaceId
  } catch (error) {
    console.log('[workspace] - (setWorkSpace): ', error);
    throw new Error(`Failed to set workspace: ${error}`);
  }
};

export const completeOnboarding = createAsyncThunk(
  "customer/completeOnboarding",
  async (uid: string, { rejectWithValue }) => {
    try {
      // Firestore reference for the specific user
      const userDocRef = doc(db, "customers", uid);

      // Update the isOnboardingCompleted field to true
      await updateDoc(userDocRef, {
        isOnboardingCompleted: true,
      });

      // Return success message
      return { uid, message: "Onboarding marked as completed" };
    } catch (error) {
      // Handle errors and return a rejected value
      console.error("Error completing onboarding:", error);
      return rejectWithValue("Failed to complete onboarding");
    }
  }
);

const setSentInvite = async (
  toUID: string,
  toEmail: string | undefined,
  toDisplayName: string | undefined,
  fromUID: string,
  fromName: string | null,
  workspaceId: string,
  workspaceName: string
) => {
  const toUserRef = doc(db, "customers", toUID);
  const workspaceRef = ref(database, `workspace/${workspaceId}`);
  const workspaceSnapshot = await get(workspaceRef);
  updateDoc(toUserRef, {
    [`invitations.${workspaceId}`]: {
      fromName,
      fromUID,
      workspaceName,
      status: "pending",
    },
  });

  const { owner, members = [] } = workspaceSnapshot.val()?.participants || {
    owner: fromUID,
    members: [],
  };

  const isUserAlreadyMember = members.some(
    (member: any) => member.toUID === toUID
  );

  if (!isUserAlreadyMember) {
    const updatedMembers = [
      ...members,
      { uid: toUID, email: toEmail, displayName: toDisplayName, status: "pending" },
    ];

    update(workspaceRef, {
      participants: {
        owner: owner || fromUID,
        members: updatedMembers,
      },
    });
  }
};

const setSentBulkInvites = async (
  users: InvitationUser[],
  fromUID: string,
  fromName: string | null,
  workspaceId: string,
  workspaceName: string
) => {
  const workspaceRef = ref(database, `workspace/${workspaceId}`);
  const workspaceSnapshot = await get(workspaceRef);

  const batch = writeBatch(db);

  const { owner, members = [] } = workspaceSnapshot.val()?.participants || {
    owner: fromUID,
    members: [],
  };

  const updatedMembers = [...members];

  users.forEach(({ uid, email, displayName }) => {
    const toUserRef = doc(db, "customers", uid);

    batch.update(toUserRef, {
      [`invitations.${workspaceId}`]: {
        fromName,
        fromUID,
        workspaceName,
        status: "pending",
      },
    });

    const isUserAlreadyMember = members.some(
      (member: any) => member.toUID === uid
    );
    if (!isUserAlreadyMember) {
      updatedMembers.push({ uid, email, displayName, status: "pending" });
    }
  });

  await batch.commit();

  await update(workspaceRef, {
    participants: {
      owner: owner || fromUID,
      members: updatedMembers,
    },
  });
};

export const setDBWorkspaceName = createAsyncThunk(
  "workspace/set-workspace-name",
  async ({
    name,
    workspaceId,
    uid,
  }: {
    name: string;
    workspaceId: string | undefined;
    uid: string;
  }) => {
    const userRef = doc(db, "customers", uid);
    await updateDoc(userRef, {
      [`workspaces.${workspaceId}`]: name,
    });
    update(ref(database, `workspace/${workspaceId}`), {
      name,
    });
    const toUIDs = await fetchToUIDs(workspaceId);
    try {
      toUIDs.forEach(async (uid: string) => {
        const customerDocRef = doc(db, "customers", uid);
        const customerDocSnapshot = await getDoc(customerDocRef);
        if (customerDocSnapshot.exists()) {
          const customerData = customerDocSnapshot.data();
          const invitations = customerData.invitations || [];
          // Find the invitation with the matching workspaceId

          if (workspaceId) {
            invitations[workspaceId].workspaceName = name;

            // Update the document in Firestore
            await updateDoc(customerDocRef, {
              invitations: invitations,
            });
          } else {
            console.log("No invitation found with the provided workspaceId");
          }
        }
      });
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const removeWorkSpace = createAsyncThunk(
  "workspace/remove-workspace",
  async (
    { uid, workspaceId }: { uid: string; workspaceId: string },
    { dispatch }
  ) => {
    const userRef = doc(db, "customers", uid);
    await updateDoc(userRef, {
      [`workspaces.${workspaceId}`]: deleteField(),
    });
    await remove(ref(database, `workspace/${workspaceId}`));
    dispatch(getWorkSpace(uid));
  }
);

export const getInvitationUserList = createAsyncThunk(
  "workspace/invitation-user-list",
  async (user: User, { rejectWithValue }) => {
    return getIdToken(user)
      .then(async (token) => {
        const response = await fetch(
          "https://us-central1-supertasks-69420.cloudfunctions.net/app/get-authenticated-users",
          {
            headers: {
              authorization: "Bearer " + token,
            },
            method: "get",
          }
        );
        return response.json();
      })
      .catch((error) => {
        return rejectWithValue(error);
      });
  }
);

//TODO: Send invite as per the subscription type
export const sendInvite = createAsyncThunk(
  "workspace/invite",
  async (
    {
      toUID,
      toEmail,
      toDisplayName = "",
      fromUID,
      fromName,
      workspaceId,
      workspaceName,
      subscriptionType,
    }: {
      toUID: string;
      toEmail: string | undefined;
      toDisplayName: string | undefined;
      fromUID: string;
      fromName: string | null;
      workspaceId: string;
      workspaceName: string;
      subscriptionType: string | object | undefined;
    },
    { dispatch, fulfillWithValue, rejectWithValue }
  ) => {
    return dispatch(getInvitedUsersList(workspaceId))
      .then(({ payload }) => {
        const invitedMembers = Object.values(payload);
        switch (subscriptionType) {
          case "standard":
            if (invitedMembers.length < 8) {
              setSentInvite(
                toUID,
                toEmail,
                toDisplayName,
                fromUID,
                fromName,
                workspaceId,
                workspaceName
              )
                .then(() => {
                  dispatch(getInvitedUsersList(workspaceId));
                  return fulfillWithValue("member invited created");
                })
                .catch((error) => {
                  return rejectWithValue(`error while adding member ${error}`);
                });
            } else {
              return rejectWithValue("Please upgrade plan");
            }
            break;
          case "premium":
            if (invitedMembers.length < 12) {
              setSentInvite(
                toUID,
                toEmail,
                toDisplayName,
                fromUID,
                fromName,
                workspaceId,
                workspaceName
              )
                .then(() => {
                  dispatch(getInvitedUsersList(workspaceId));
                  return fulfillWithValue("member invited created");
                })
                .catch((error) => {
                  return rejectWithValue(`error while adding member ${error}`);
                });
            } else {
              return rejectWithValue("Please upgrade plan");
            }
            break;
          default:
            if (invitedMembers.length <= 3) {
              setSentInvite(
                toUID,
                toEmail,
                toDisplayName,
                fromUID,
                fromName,
                workspaceId,
                workspaceName
              )
                .then(() => {
                  dispatch(getInvitedUsersList(workspaceId));
                  return fulfillWithValue("member invited created");
                })
                .catch((error) => {
                  return rejectWithValue(`error while adding member ${error}`);
                });
            } else {
              return rejectWithValue("Please upgrade plan");
            }
            break;
        }
      })
      .catch((error) => {
        return rejectWithValue(`error while sending invite ${error}`);
      });
  }
);

export const sendBulkInvite = createAsyncThunk(
  "workspace/sent-bulk-invite",
  async (
    {
      users,
      fromUID,
      fromName,
      workspaceId,
      workspaceName,
      subscriptionType,
    }: {
      users: InvitationUser[];
      fromName: string;
      fromUID: string;
      workspaceId: string;
      workspaceName: string;
      subscriptionType: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const workspaceRef = ref(
        database,
        `workspace${workspaceId}/participants/members`
      );
      const workspaceSnapshot = await get(workspaceRef);
      const invitedMembers = workspaceSnapshot.val() || [];

      const subscriptionLimits: Record<string, number> = {
        standard: 8,
        premium: 12,
        default: 3,
      };

      const limit =
        subscriptionLimits[subscriptionType] || subscriptionLimits.default;

      if (invitedMembers.length + users.length > limit) {
        return rejectWithValue(
          "Please upgrade your plan to invite more members."
        );
      }

      await setSentBulkInvites(
        users,
        fromUID,
        fromName,
        workspaceId,
        workspaceName
      );
      return `Successfully invited ${users.length} members.`;
    } catch (error) {
      return rejectWithValue(`Error while sending bulk invites: ${error}`);
    }
  }
);

export const getInvitedUsersList = createAsyncThunk(
  "workspace/get-invited-user-list",
  async (workspaceId: string, { rejectWithValue }) => {
    const participantsRef = ref(
      database,
      `workspace/${workspaceId}/participants`
    );

    try {
      const snapshot = await get(child(participantsRef, "members"));

      if (snapshot.exists()) {
        return snapshot.val();
      }
      return [];
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const checkWorkspaceAccess = createAsyncThunk(
  "workspace/check-workspace-access",
  async (
    { uid, workspaceId }: { uid: string; workspaceId: string },
    { rejectWithValue }
  ) => {
    try {
      const workspaceRef = ref(
        database,
        `workspace/${workspaceId}/participants`
      );
      const workspaceSnapshot = await get(child(workspaceRef, "/"));
      const workspaceData = workspaceSnapshot.val();

      if (!workspaceData) {
        // Workspace doesn't exist
        return rejectWithValue("Workspace not found");
      }

      // Check if user has access as owner
      if (workspaceData.owner === uid) {
        return true;
      }

      // Check if user has access as a member
      const member = workspaceData.members.find(
        (member: any) => member.toUID === uid && member.status === "accepted"
      );

      if (member) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return rejectWithValue("Error checking access");
    }
  }
);

export const getGuestInvitationList = createAsyncThunk(
  "workspace/get-invitation-guest-list",
  async (uid: string, { rejectWithValue }) => {
    const userRef = doc(db, "customers", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.data()) {
      return userDoc.data()?.invitations ?? {};
    } else {
      return rejectWithValue("No such document!");
    }
  }
);

export const updateInvitationStatus = createAsyncThunk(
  "workspace/update-invitation-status",
  async (
    {
      uid,
      workspaceId,
      status,
    }: { uid: string; workspaceId: string; status: string },
    { rejectWithValue, dispatch }
  ) => {
    const userRef = doc(db, "customers", uid);
    const updateData = {
      [`invitations.${workspaceId}.status`]: status,
    };
    updateDoc(userRef, updateData).then(() => {
      dispatch(getGuestInvitationList(uid));
    });

    const membersRef = ref(
      database,
      `workspace/${workspaceId}/participants/members`
    );
    const membersQuery = query(membersRef, orderByChild("toUID"), equalTo(uid)); // Use 'toUID' for matching
    try {
      const snapshot = await get(membersQuery);

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          update(childSnapshot.ref, { status }); // Use childSnapshot.ref directly
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      rejectWithValue(error);
    }
  }
);

//TODO: handle reject with value when creation of workspace is extending limit
export const createWorkSpace = createAsyncThunk(
  "workspace/create-workspace",
  async (
    {
      uid,
      subscriptionType,
      workspaceId,
      workspaceName
    }: {
      uid: string;
      subscriptionType: string | object | undefined;
      workspaceId?: string | undefined;
      workspaceName?: string;
    },
    { dispatch, rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const workspaceAction = await dispatch(getWorkSpace(uid));
      const { payload } = workspaceAction as { payload: any };

      if (!payload) {
        return rejectWithValue("Failed to fetch workspaces");
      }

      const workspaces = Object.values(payload);

      let maxWorkspaces: number;
      switch (subscriptionType) {
        case "standard":
          maxWorkspaces = 4;
          break;
        case "premium":
          maxWorkspaces = 7;
          break;
        default:
          maxWorkspaces = 1;
          break;
      }

      if (workspaces.length >= maxWorkspaces) {
        toast("Please upgrade plan", { theme: "dark" });
        return rejectWithValue("Maximum workspace limit reached");
      }

      await setWorkSpace(uid, payload, workspaceId, workspaceName);
      await dispatch(getWorkSpace(uid));

      return fulfillWithValue("Workspace created successfully");
    } catch (error) {
      console.error("Error creating workspace:", error);
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);


export const addWorkspaceTask = createAsyncThunk(
  "workspace/add-workspace-task",
  async (
    {
      title,
      id,
      task,
      workspaceId,
    }: { title: string; id: string; task: string; workspaceId: string },
    { getState, rejectWithValue }
  ) => {
    const { workspace } = getState() as RootState;
    const state = cloneDeep(workspace);
    switch (title) {
      case "do-first":
        state.tasks["do-first"].ids.push(id);
        break;
      case "do-later":
        state.tasks["do-later"].ids.push(id);
        break;
      case "delegate":
        state.tasks["delegate"].ids.push(id);
        break;
      case "eliminate":
        state.tasks["eliminate"].ids.push(id);
        break;
    }

    state.tasks.items[id] = {
      task: task,
      id: id,
      status: "in-progress",
    };

    if (state.tasks !== undefined && state.tasks !== null) {
      setWorkSpaceTask(state.tasks, workspaceId);
    }
  }
);

export const setWorkSpaceTask = async (tasks: any, workspaceId: string) => {
  update(ref(database, `workspace/${workspaceId}`), {
    tasks: JSON.stringify(tasks),
  });
};

export const getWorkSpace = createAsyncThunk(
  "workspace/get-workspace",
  async (uid: string, { rejectWithValue }) => {
    const userRef = doc(db, "customers", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.data()) {
      return userDoc.data()?.workspaces ?? {};
    } else {
      return rejectWithValue("No such document!");
    }
  }
);
