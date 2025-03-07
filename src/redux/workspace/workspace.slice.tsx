import {
  ActionReducerMapBuilder,
  createSlice,
} from "@reduxjs/toolkit";

import {
  createWorkSpace,
  getWorkSpace,
  setWorkSpaceTask,
  setDBWorkspaceName,
  removeWorkSpace,
  getInvitationUserList,
  getInvitedUsersList,
  getGuestInvitationList,
  sendInvite,
  addWorkspaceTask,
  checkWorkspaceAccess,
  sendBulkInvite,
  completeOnboarding,
} from "./workspace.api";

export interface InvitationUser {
  uid: string;
  email: string;
  displayName: string;
}

interface WorkspaceState {
  workspaceList: any;
  guestInvitationList: any;
  loading: boolean;
  error: any;
  invitationMembersList: InvitationUser[];
  invitedMembersList: any;
  hasUserWorkspacePermission: boolean;
  isWorkspaceEditName: boolean;
  steps: number;
  workspaceName: string;
  invitedMembers: InvitationUser[];
  eventMessages: string | undefined | unknown;
  tasks: {
    "do-first": {
      title: string;
      ids: Array<string>;
    };
    "do-later": {
      title: string;
      ids: Array<string>;
    };
    delegate: {
      title: string;
      ids: Array<string>;
    };
    eliminate: {
      title: string;
      ids: Array<string>;
    };
    items: {
      [key: string]: {
        status: string;
        task: string;
        id: string;
        tag?: string | null;
        prevTag?: string | null;
      };
    };
    tags: {
      [key: string]: {
        tag: string | null;
        ids: Array<string>;
      };
    };
  };
}

const initialState: WorkspaceState = {
  workspaceList: {},
  loading: false,
  error: null,
  invitationMembersList: [],
  invitedMembersList: {},
  guestInvitationList: {},
  hasUserWorkspacePermission: false,
  isWorkspaceEditName: false,
  steps: 1,
  workspaceName: "",
  invitedMembers: [],
  eventMessages: "",
  tasks: {
    "do-first": {
      title: "Do first",
      ids: [],
    },
    "do-later": {
      title: "Do later",
      ids: [],
    },
    delegate: {
      title: "Delegate",
      ids: [],
    },
    eliminate: {
      title: "Eliminate",
      ids: [],
    },
    items: {},
    tags: {},
  },
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkSpaceTaskFromDb: (state: WorkspaceState, action) => {
      state.tasks = action.payload;
    },
    updateWorkspaceTask: (_, action) => {
      setWorkSpaceTask(action.payload?.tasks, action.payload?.workspaceId);
    },
    removeWorkspaceTask: (state: WorkspaceState, action) => {
      let index = -1;
      switch (action.payload.type) {
        case "do-first":
          index = state.tasks["do-first"].ids.indexOf(action.payload.id);
          state.tasks["do-first"].ids.splice(index, 1);
          break;
        case "do-later":
          index = state.tasks["do-later"].ids.indexOf(action.payload.id);
          state.tasks["do-later"].ids.splice(index, 1);
          break;
        case "delegate":
          index = state.tasks["delegate"].ids.indexOf(action.payload.id);
          state.tasks["delegate"].ids.splice(index, 1);
          break;
        case "eliminate":
          index = state.tasks["eliminate"].ids.indexOf(action.payload.id);
          state.tasks["eliminate"].ids.splice(index, 1);
          break;
      }
      delete state.tasks.items[action.payload.id];
      if (state.tasks !== undefined) {
        setWorkSpaceTask(state.tasks, action.payload?.workspaceId);
      }
    },
    editWorkspaceTask: (state: WorkspaceState, action) => {
      state.tasks.items[action.payload.id].task = action.payload.task;
      if (state.tasks !== undefined) {
        setWorkSpaceTask(state.tasks, action.payload?.workspaceId);
      }
    },
    setIsWorkspaceNameEdit: (state: WorkspaceState, action) => {
      state.isWorkspaceEditName = action.payload;
    },
    clearWorkspaceError: (state: WorkspaceState) => {
      state.error = null;
    },
    updateWorkspaceTaskStatus: (state: WorkspaceState, action) => {
      state.tasks.items[action.payload.id].status = action.payload.status;
      if (state.tasks !== undefined) {
        setWorkSpaceTask(state.tasks, action.payload?.workspaceId);
      }
    },
    setWorkspaceName: (state: WorkspaceState, action) => {
      state.workspaceName = action.payload;
    },
    setInvitedMembers: (state: WorkspaceState, action) => {
      state.invitedMembers = action.payload;
    },
    setSteps: (state: WorkspaceState, action) => {
      const _steps = action.payload;
      if (_steps >= 1 && _steps <= 4) {
        state.steps = action.payload;
      }
    },
    resetEventMessage: (state: WorkspaceState) => {
      state.eventMessages = "";
    }
  },
  extraReducers: (builder: ActionReducerMapBuilder<WorkspaceState>) => {
    builder
      .addCase(createWorkSpace.pending, (state) => {
        state.loading = true;
      })
      .addCase(createWorkSpace.fulfilled, (state, action) => {
        state.loading = false;
        state.eventMessages = action.payload;
      })
      .addCase(createWorkSpace.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload;
      })
      .addCase(addWorkspaceTask.fulfilled, (state, action) => {
        state.loading = false;
        // state.guestInvitationList = action.payload;
      })
      .addCase(addWorkspaceTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(addWorkspaceTask.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.error.message;
      })
      .addCase(getWorkSpace.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWorkSpace.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaceList = action.payload;
      })
      .addCase(getWorkSpace.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.error.message;
      })
      .addCase(setDBWorkspaceName.pending, (state) => {
        state.loading = true;
      })
      .addCase(setDBWorkspaceName.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(setDBWorkspaceName.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.error.message;
      })
      .addCase(removeWorkSpace.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeWorkSpace.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(removeWorkSpace.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.error.message;
      })
      .addCase(getInvitationUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.invitationMembersList = action.payload;
      })
      .addCase(getInvitationUserList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInvitationUserList.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.error.message;
      })
      .addCase(sendInvite.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(sendInvite.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendInvite.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.error.message;
      })
      .addCase(getInvitedUsersList.fulfilled, (state, action) => {
        state.loading = false;
        state.invitedMembersList = action.payload as any;
      })
      .addCase(getInvitedUsersList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInvitedUsersList.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.error.message;
      })
      .addCase(getGuestInvitationList.fulfilled, (state, action) => {
        state.loading = false;
        state.guestInvitationList = action.payload;
      })
      .addCase(getGuestInvitationList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGuestInvitationList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(checkWorkspaceAccess.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkWorkspaceAccess.fulfilled, (state, action) => {
        state.loading = false;
        state.hasUserWorkspacePermission = action.payload;
      })
      .addCase(checkWorkspaceAccess.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.error.message;
      })
      .addCase(sendBulkInvite.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(sendBulkInvite.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(sendBulkInvite.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(completeOnboarding.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(completeOnboarding.rejected, (state) => {
        state.loading = false;
      })
      .addCase(completeOnboarding.pending, (state) => {
        state.loading = true;
      });
  },
});

export const {
  setWorkSpaceTaskFromDb,
  updateWorkspaceTask,
  updateWorkspaceTaskStatus,
  removeWorkspaceTask,
  editWorkspaceTask,
  setIsWorkspaceNameEdit,
  clearWorkspaceError,
  setInvitedMembers,
  setSteps,
  setWorkspaceName,
  resetEventMessage
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
