import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AUTHENTICATED_ENTRY } from "../configs/app-configs";
import { shallowEqual, useSelector } from "react-redux";
import { getUser } from "../redux/settings/settings.selector";

const PublicRoute = () => {
    const user = useSelector(getUser, shallowEqual);

    return user ? <Navigate to={AUTHENTICATED_ENTRY} /> : <Outlet />
}

export default PublicRoute;
