import React, { FC, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Popover, ArrowContainer } from "react-tiny-popover";
import { UserIcon } from "@heroicons/react/outline";

import { APP_PREFIX_PATH, AUTH_PREFIX_PATH } from "../../configs/app-configs";
import SuperTasksMenu from "../../assets/images/menu.png";
import Switcher from "../theme-switcher/theme-switcher";
import WorkspaceNav from "../workspace-nav-bar/workspace-nav";

type TopNavProps = {
  type: "protected" | "public";
};

const TopNav: FC<TopNavProps> = ({ type }) => {
  const [isHover, setIsHover] = useState<boolean>(false);
  const { pathname } = useLocation() as any;
  const isAuthPage = useMemo(() => pathname.includes("/auth"), [pathname]);
  const isDeviceLimitPage = useMemo(() => pathname.includes("/device-login-limit"), [pathname]);
  const isWorkspace = useMemo(() => pathname.includes("/workspace"), [pathname]);
  const isDefaultWorkspace = useMemo(() => pathname.includes("/default"), [pathname]);
  const isUserPremium = false;

  const onHover = () => {
    if (!isUserPremium) {
      setIsHover(true);
    } else {
      setIsHover(false);
    }
  };

  const onHoverLeft = () => {
    setIsHover(false);
  };

  if (isAuthPage || isDeviceLimitPage) {
    return (
      <></>
    )
  }

  if (type === "protected") {
    return (
      <nav className="h-16 flex justify-between p-2 w-full relative dark:bg-dark">
        <div className="inline-flex items-center">
          <NavLink
            to={`${APP_PREFIX_PATH}`}>
            <img
              src={SuperTasksMenu}
              width={27}
              height={27}
              className="animate-rotate"
              alt="supertasks.io logo"
            />
          </NavLink>
          {!isWorkspace && (
            <p className="ml-5 text-lg md:text-2xl hidden md:block dark:text-white font-poppins-bold">
              supertasks.io
            </p>
          )}
          {!isWorkspace && (
            <h1 className="text-xs text-do-later bg-do-later-alpha px-3 py-2 rounded-md hidden lg:block ml-3">
              Quick decision making tool
            </h1>
          )}
          {!isWorkspace && (
            <span className="text-xs ml-3 text-white bg-black rounded-md px-3 py-2 dark:text-black dark:bg-white">
              BETA
            </span>
          )}
        </div>
        <div className="inline-flex">
          {/* TODO: Add premium use case */}
          <div>
            {isWorkspace && !isDefaultWorkspace && (
              <div >
                <WorkspaceNav />
              </div>
            )}
            {!isWorkspace && (
              <div
                className="text-black dark:text-white hidden md:flex items-center no-underline py-0 px-4 h-full cursor-pointer active:text-active-link font-poppins-regular"
              >
                <Switcher />
              </div>
            )}
          </div>
          <div>
            <NavLink
              to={`${APP_PREFIX_PATH}`}
              className="text-black dark:text-white hidden md:flex items-center no-underline py-0 px-4 h-full cursor-pointer active:text-active-link font-poppins-regular"
            >
              Home
            </NavLink>
          </div>
          <Popover
            isOpen={isHover}
            align="end"
            positions={["bottom"]}
            content={({ position, childRect, popoverRect }) => (
              <ArrowContainer
                position={position}
                childRect={childRect}
                popoverRect={popoverRect}
                arrowColor={"#2a2e2d"}
                arrowSize={8}
              >
                <div className="bg-[#2a2e2d] px-4 py-2 rounded-md hover:bg-[#4e5251] cursor-pointer">
                  <div className="popover-content text-white text-xs font-poppins-light">
                    Workspaces are a premium feature, Click to subscribe!
                  </div>
                </div>
              </ArrowContainer>
            )}
          >
            <NavLink
              to={`${APP_PREFIX_PATH}/workspace/default`}
              className={`${isUserPremium ? "text-black dark:text-white" : "text-gray-500"
                } hidden md:flex items-center no-underline py-0 px-4 h-full cursor-pointer active:text-active-link font-poppins-regular`}
              onMouseOver={onHover}
              onMouseLeave={onHoverLeft}
            >
              Workspaces
            </NavLink>
          </Popover>
          <NavLink
            to={`${APP_PREFIX_PATH}/pricing-plan`}
            className="text-black dark:text-white hidden md:flex items-center no-underline py-0 px-4 h-full cursor-pointer active:text-active-link font-poppins-regular"
          >
            Pricing
          </NavLink>
          <NavLink
            to={`${APP_PREFIX_PATH}/about`}
            className="text-black dark:text-white hidden md:flex items-center no-underline py-0 px-4 h-full cursor-pointer active:text-active-link font-poppins-regular"
          >
            About
          </NavLink>
          <div>
            {!isWorkspace && (
              <a
                href="https://forms.gle/KqsAFY4CLZZnUZDp8"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black dark:text-white hidden md:flex items-center no-underline py-0 px-4 h-full cursor-pointer active:text-active-link font-poppins-regular"
              >
                Feedback
              </a>
            )}
          </div>
          <div className="inline-flex items-center">
            <div className="h-8 w-8 bg-slate-100 rounded-full p-1">
              <UserIcon />
            </div>
          </div>
        </div>
      </nav >
    );
  }

  return (
    <nav className="h-16 flex justify-between p-2 w-full relative dark:bg-dark">
      <div className="inline-flex items-center">
        <NavLink to={`${APP_PREFIX_PATH}`}>
          <img
            src={SuperTasksMenu}
            width={27}
            height={27}
            className="animate-rotate"
            alt="supertasks.io logo"
          />
        </NavLink>
        <p className="ml-5 text-lg md:text-2xl hidden md:block dark:text-white font-poppins-bold">
          supertasks.io
        </p>
        <h1 className="text-xs text-do-later bg-do-later-alpha px-3 py-2 rounded-md hidden lg:block ml-3">
          Quick decision making tool
        </h1>
        <span className="text-xs ml-3 text-white bg-black rounded-md px-3 py-2 dark:text-black dark:bg-white">
          BETA
        </span>
      </div>
      <div className="inline-flex">
        <div>
          <div
            className="text-black dark:text-white hidden md:flex items-center no-underline py-0 px-4 h-full cursor-pointer active:text-active-link font-poppins-regular"
          >
            <Switcher />
          </div>
        </div>
        <NavLink
          to={`${APP_PREFIX_PATH}`}
          className="text-black dark:text-white hidden md:flex items-center no-underline py-0 px-4 h-full cursor-pointer active:text-active-link font-poppins-regular"
        >
          Home
        </NavLink>
        <NavLink
          to={`${APP_PREFIX_PATH}/workspace/default`}
          className="text-black dark:text-white hidden md:flex items-center no-underline py-0 px-4 h-full cursor-pointer active:text-active-link font-poppins-regular"
        >
          Workspace
        </NavLink>
        <NavLink
          to={`${APP_PREFIX_PATH}/pricing-plan`}
          className="text-black dark:text-white hidden md:flex items-center no-underline py-0 px-4 h-full cursor-pointer active:text-active-link font-poppins-regular"
        >
          Pricing
        </NavLink>
        <NavLink
          to={`${APP_PREFIX_PATH}/about`}
          className="text-black dark:text-white hidden md:flex items-center no-underline py-0 px-4 h-full cursor-pointer active:text-active-link font-poppins-regular"
        >
          About
        </NavLink>
        <a
          href="https://forms.gle/KqsAFY4CLZZnUZDp8"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black dark:text-white hidden md:flex items-center no-underline py-0 px-4 h-full cursor-pointer active:text-active-link font-poppins-regular"
        >
          Feedback
        </a>
        <NavLink
          to={`${AUTH_PREFIX_PATH}/login`}
          className="text-black dark:text-white hidden md:flex items-center no-underline py-0 px-4 h-full cursor-pointer active:text-active-link font-poppins-regular"
        >
          Login
        </NavLink>
      </div>
    </nav>
  );
};

export default TopNav;
