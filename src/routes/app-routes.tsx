import React, { FC } from "react";

interface AppRouteProps {
    component: FC<any>;
    routeKey: string;
    [key: string]: any;
}

const AppRoute: FC<AppRouteProps> = ({ component: Component, routeKey, ...props }) => {
    return (
        <Component {...props} />
    );
}

export default AppRoute;
