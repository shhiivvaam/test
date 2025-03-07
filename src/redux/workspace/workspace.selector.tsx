import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const getWorkSpaceSelector = (state: RootState) => Object.entries(state?.workspace?.workspaceList);

export const getGuestInvitationSelector = (state: RootState) => Object.entries(state?.workspace?.guestInvitationList);

export const getWorkSpaceTask = (state: RootState) => state?.workspace?.tasks;

export const getWorkSpaceLoading = (state: RootState) => state?.workspace.loading;

export const getInvitationMemberListSelector = (state: RootState) => state?.workspace?.invitationMembersList;

export const getInvitedMembersListSelector = (state: RootState) => Object.values(state?.workspace?.invitedMembersList);

export const getWorkspaceName = (state: RootState) => state.workspace.workspaceName;

export const getInvitedMembers = (state: RootState) => state.workspace.invitedMembers;

export const getSteps = (state: RootState) => state.workspace.steps;

export const checkUserAccessSelector = (state: RootState) => state?.workspace?.hasUserWorkspacePermission;

export const workspaceLoader = (state: RootState) => state?.workspace?.loading;

export const isDeleteNotShowAgain = (state: RootState) => state?.tasks?.doNotShowAgainDeleteModal;

export const workspaceError = (state: RootState) => state?.workspace?.error;

export const getGuestWorkspaceSelector = createSelector(
    (state: RootState) => state?.workspace?.guestInvitationList,
    (guestInvitations) => {
      // Filter out entries where the status is "accepted"
      return Object.entries(guestInvitations)
        .filter(([_, value]: any) => value.status === 'accepted');
    }
  );
