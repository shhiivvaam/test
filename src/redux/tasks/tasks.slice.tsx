import {
  createSlice,
  createAsyncThunk,
  SerializedError,
} from "@reduxjs/toolkit";

import {
  MAX_TASK_FOR_FREE_USER,
  MAX_TASK_FOR_PREMIUM_USER,
} from "../../utils/constants";
import sync from "../../utils/sync";
import { addTag, getTag, removeTag, editTag } from "../../utils/tags";
import { isUserFirstTimeCompleted, isUserOnboardingCompleted } from "./tasks.api";

export interface TasksState {
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
    titles?: {
      "Do first": string;
      "Do later": string;
      Delegate: string;
      Eliminate: string;
    };
  };
  taskCount: number;
  tagsCount: number;
  canAddMoreTask: boolean;
  canAddMoreTags: boolean;
  isUserPremium: boolean;
  toggleNavbar: boolean;
  isOnboardingCompleted: boolean;
  isUserFirstTime: boolean;
  uploadSyncStatus: string | null;
  uploadSyncError: SerializedError | null;
  fetchSyncStatus: string | null;
  fetchSyncError: SerializedError | null;
  subscriptionType: string | null;
  doNotShowAgainDeleteModal: boolean;
  loading: boolean;
}

const initialState: TasksState = {
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
    titles: {
      "Do first": "",
      "Do later": "",
      Delegate: "",
      Eliminate: "",
    },
  },
  taskCount: 0,
  tagsCount: 0,
  canAddMoreTask: true,
  canAddMoreTags: true,
  isUserPremium: false,
  toggleNavbar: false,
  uploadSyncStatus: null,
  uploadSyncError: null,
  fetchSyncStatus: null,
  fetchSyncError: null,
  subscriptionType: null,
  doNotShowAgainDeleteModal: false,
  isOnboardingCompleted: false,
  isUserFirstTime: false,
  loading: false,
};

export const updateCloud = createAsyncThunk(
  "cloudSync/updateCloud",
  async (uid: string | undefined, { rejectWithValue}) => {
    const tasks = localStorage.getItem("@Tasks");
    try {
      //TODO: add isUserPremium to make cloud sync feature available for premium user only
      if (tasks !== null && uid !== undefined) {
        sync.sync(uid, tasks);
        // dispatch(fetchCloud(uid))
      }
    } catch (error) {
      console.error("error", error);
      return rejectWithValue(error);
    }
  }
);

export const fetchCloud = createAsyncThunk(
  "cloudSync/fetchCloud",
  async (
    { uid, tasks }: { uid: string | undefined; tasks: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      // TODO: add isUserPremium to make cloud sync feature available for premium user only
      if (uid !== undefined && tasks !== undefined && tasks !== null) {
        localStorage.setItem("@Tasks", tasks);
        dispatch(getTasks());
      }
    } catch (error) {
      console.error("check error", error);
      return rejectWithValue(error);
    }
  }
);

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state: TasksState, action) => {
      if (state.canAddMoreTask) {
        switch (action.payload?.title) {
          case "do-first":
            state?.tasks["do-first"].ids.push(action.payload.id);
            break;
          case "do-later":
            state?.tasks["do-later"].ids.push(action.payload.id);
            break;
          case "delegate":
            state?.tasks["delegate"].ids.push(action.payload.id);
            break;
          case "eliminate":
            state?.tasks["eliminate"].ids.push(action.payload.id);
            break;
        }
        const tag = getTag(action.payload.task);
        if (tag !== null && state.canAddMoreTags) {
          state.tasks.tags[tag] = addTag(state.tasks, action.payload);
        }
        state.tasks.items[action.payload.id] = {
          status: "in-progress",
          task: action.payload.task,
          id: action.payload.id,
          tag: getTag(action.payload.task),
          prevTag: null,
        };

        if (state.tasks !== undefined && state.tasks !== null) {
          localStorage.setItem("@Tasks", JSON.stringify(state?.tasks));
        }
      }
    },
    getTasks: (state: TasksState) => {
      let tasks: string | null = localStorage.getItem("@Tasks");
      if (tasks !== null) {
        let parseTasks = JSON.parse(tasks);
        state.tasks = parseTasks;
      }
    },
    removeTask: (state: TasksState, action) => {
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
      removeTag(state.tasks, action.payload, action.payload.tag);
      delete state.tasks.items[action.payload.id];
      if (state.tasks !== undefined) {
        localStorage.setItem("@Tasks", JSON.stringify(state.tasks));
      }
    },
    editTask: (state: TasksState, action) => {
      editTag(state.tasks, action.payload);
      state.tasks.items[action.payload.id].task = action.payload.task;
      if (state.tasks !== undefined) {
        localStorage.setItem("@Tasks", JSON.stringify(state.tasks));
      }
    },
    completeTask: (state: TasksState, action) => {
      state.tasks.items[action.payload.id].status = action.payload.status;
      if (state.tasks !== undefined) {
        localStorage.setItem("@Tasks", JSON.stringify(state.tasks));
      }
    },
    setNewTask: (state: TasksState, action) => {
      state.tasks = action.payload.newTask;
    },
    updateTasks: (state: TasksState, action) => {
      state.tasks = { ...action.payload };
      if (state.tasks !== undefined) {
        localStorage.setItem("@Tasks", JSON.stringify(state.tasks));
      }
    },
    updateTitleName: (state: TasksState, action) => {
      const { type, name } = action.payload as {
        type: "Do first" | "Do later" | "Delegate" | "Eliminate";
        name: string;
      };
      state.tasks.titles![type] = name;
      if (state.tasks !== undefined && state.isUserPremium) {
        localStorage.setItem("@Tasks", JSON.stringify(state.tasks));
      }
    },
    getItemCount: (state: TasksState, action) => {
      state.taskCount = Object.keys(action?.payload)?.length;
    },
    setIsUserPremium: (state: TasksState, action) => {
      state.isUserPremium = action.payload;
    },
    toggleNavbar: (state: TasksState, action) => {
      state.toggleNavbar = action.payload;
    },
    setCanAddMoreTask: (state: TasksState, action) => {
      state.canAddMoreTags = action.payload;
    },
    getCanAddMoreTask: (state: TasksState) => {
      state.canAddMoreTask = state.isUserPremium
        ? state.taskCount <= MAX_TASK_FOR_PREMIUM_USER
        : state.taskCount < MAX_TASK_FOR_FREE_USER;
    },
    setSubscriptionType: (state: TasksState, action) => {
      state.subscriptionType = action.payload;
    },
    setIsDoNotShowAgainDeleteModal: (state: TasksState, action) => {
      state.doNotShowAgainDeleteModal = action.payload;
      localStorage.setItem(
        "@DeleteModal",
        JSON.stringify(state?.doNotShowAgainDeleteModal)
      );
    },
    getIsDoNotShowAgainDeleteModal: (state) => {
      const value = localStorage.getItem("@DeleteModal") as string;
      state.doNotShowAgainDeleteModal = JSON.parse(value);
    },
    resetTheReducer: () => {
      try {
        localStorage.removeItem("@Tasks");
        localStorage.removeItem("@Time");
        localStorage.removeItem("@User");
      } catch (error) {
        console.log('error', error);
      }
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateCloud.fulfilled, (state: TasksState) => {
      state.uploadSyncStatus = "fulfilled";
    });
    builder.addCase(updateCloud.pending, (state: TasksState) => {
      state.uploadSyncStatus = "pending";
    });
    builder.addCase(updateCloud.rejected, (state: TasksState, { error }) => {
      state.uploadSyncStatus = "rejected";
      state.uploadSyncError = error;
    });
    builder.addCase(fetchCloud.fulfilled, (state: TasksState) => {
      state.fetchSyncStatus = "fulfilled";
    });
    builder.addCase(fetchCloud.pending, (state: TasksState) => {
      state.fetchSyncStatus = "pending";
    });
    builder.addCase(fetchCloud.rejected, (state: TasksState, { error }) => {
      state.fetchSyncStatus = "rejected";
      state.fetchSyncError = error;
    });
    builder.addCase(isUserOnboardingCompleted.fulfilled, (state: TasksState, action) => {
      state.loading = false;
      state.isOnboardingCompleted = action.payload;
    });
    builder.addCase(isUserOnboardingCompleted.pending, (state: TasksState) => {
      state.loading = true;
    });
    builder.addCase(isUserOnboardingCompleted.rejected, (state: TasksState, action) => {
      state.loading = false;
    });
    builder.addCase(isUserFirstTimeCompleted.fulfilled, (state: TasksState, action) => {
      state.loading = false;
      state.isUserFirstTime = action.payload;
    });
    builder.addCase(isUserFirstTimeCompleted.pending, (state: TasksState) => {
      state.loading = true;
    });
    builder.addCase(isUserFirstTimeCompleted.rejected, (state: TasksState) => {
      state.loading = false;
    });
  },
});

export const {
  addTask,
  removeTask,
  editTask,
  completeTask,
  getTasks,
  setNewTask,
  updateTasks,
  getItemCount,
  setIsUserPremium,
  toggleNavbar,
  getCanAddMoreTask,
  resetTheReducer,
  setSubscriptionType,
  setIsDoNotShowAgainDeleteModal,
  getIsDoNotShowAgainDeleteModal,
  updateTitleName,
  setCanAddMoreTask,
} = tasksSlice.actions;

export default tasksSlice.reducer;
