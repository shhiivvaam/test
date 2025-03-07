import React from "react";
import Utils from "../../utils";
import TopNav from "../top-nav/top-nav";
import useBreakpoint from "../../hooks/useBreakpoint";
import { HeaderNav } from "../header-nav/header-nav";

type AppLayoutProps = {
    children: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = ({children}) => {
    const screens = Utils.getBreakPoint(useBreakpoint());

    const isMobile = !screens.includes('lg');

    return (
        <div>
            <HeaderNav isMobile={isMobile} />
            {!isMobile ? <TopNav type="protected" /> : null}
            {children}
        </div>
    )
}

export default React.memo(AppLayout);