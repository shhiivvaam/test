import React, {useEffect} from "react";
import { setCurrentScreen, logEvent } from "@firebase/analytics";
import { useLocation } from "react-router";

import { analytics } from "../firebase/firebase";

const logCurrentPage = (pathname: string) => {
    setCurrentScreen(analytics, pathname);
    logEvent(analytics, 'page_view');
}

const AnalyticsComponent = () => {
    const location = useLocation();
    useEffect(() => {
        logCurrentPage(location.pathname);
    }, [location]);

    return (<div />)
}

export default AnalyticsComponent;
