import { RootState } from "../store";

export const getUser = (state: RootState) => state?.settings.user;

export const getSettingsLoading = (state: RootState) => state?.settings.loading;