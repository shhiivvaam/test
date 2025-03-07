import React from "react";

import "./device-exceed.css"
import { useNavigate } from "react-router-dom";
import SessionToken from "../../components/session-token/session-token";
import { APP_PREFIX_PATH } from "../../configs/app-configs";

const DeviceExceedPage = () => {
    const navigate = useNavigate();

    const onPricingPlan = () => {
        navigate(`${APP_PREFIX_PATH}/pricing-plan`);
    }
    return (
        <div className="svg-exceed">
            <svg viewBox="0 0 1320 300">
                <text className="svg-text-exceed font-poppins-bold" x="50%" y="50%" dy=".35em" text-anchor="middle">
                    Attention!
                </text>
            </svg>
            <span className="flex items-center justify-center font-poppins-regular text-xl">
                You have exceed your device login limit
            </span>
            <span className="flex items-center justify-center font-poppins-regular">
                Change your&nbsp; <span className="text-done underline cursor-pointer" onClick={onPricingPlan}>pricing plan</span>
            </span>
            <SessionToken />
        </div>

    )
}

export default DeviceExceedPage;