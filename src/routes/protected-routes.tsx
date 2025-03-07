import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AUTH_PREFIX_PATH, REDIRECT_URL_KEY, UNAUTHENTICATED_ENTRY } from "../configs/app-configs";
import { shallowEqual, useSelector } from "react-redux";
import { getSettingsLoading, getUser } from "../redux/settings/settings.selector";
import Loader from "../components/loader/loader";

const ProtectedRoute = () => {
    const location = useLocation();

    const user = useSelector(getUser, shallowEqual);
    const loading = useSelector(getSettingsLoading, shallowEqual);

    if (loading) {
        return <Loader loadingMessage="Loading..." />;
    }

    if (!user) {
        return <Navigate to={`${AUTH_PREFIX_PATH}${UNAUTHENTICATED_ENTRY}?${REDIRECT_URL_KEY}=${location.pathname}`} replace />
    }

    return <Outlet />
}

export default ProtectedRoute;
