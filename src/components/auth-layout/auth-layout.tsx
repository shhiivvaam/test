import React from "react";
import Utils from "../../utils";
import useBreakpoint from "../../hooks/useBreakpoint";
import TopNav from "../top-nav/top-nav";

type AuthLayoutProps = {
    children: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({children}) => {
    const screens = Utils.getBreakPoint(useBreakpoint());

    const isMobile = !screens.includes('lg')
    const isNavTop = true;
    return (
        <div>
            {(isNavTop && !isMobile) ? <TopNav type="public" /> : null}
            {children}
        </div>
    )
}

export default React.memo(AuthLayout);