import { configureStore } from "@reduxjs/toolkit";
import logger from 'redux-logger';
import type { Middleware } from 'redux';

import tasksReducer from './tasks/tasks.slice';
import workspaceReducer from "./workspace/workspace.slice";
import settingsReducer from "./settings/settings.slice";

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        workspace: workspaceReducer,
        settings: settingsReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }).concat(logger as Middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;