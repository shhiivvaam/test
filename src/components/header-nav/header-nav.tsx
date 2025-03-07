import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MenuAlt4Icon, XIcon } from "@heroicons/react/outline";
import { APP_PREFIX_PATH } from "../../configs/app-configs";

type HeaderProps = {
  isMobile: boolean;
};

export const HeaderNav: React.FC<HeaderProps> = ({ isMobile }) => {
  const navigate = useNavigate();

  const [isMenuShow, setMenuShow] = useState<boolean>(false);

  const navigateAndCloseMenu = (path: string) => {
    navigate(path);
    setMenuShow(false);
  };

  if (!isMobile) {
    return null;
  }
  return (
    <nav className="h-12 flex justify-end p-2 w-full relative dark:bg-dark">
      <div
        className="cursor-pointer h-full w-10"
        onClick={() => setMenuShow(true)}
      >
        <MenuAlt4Icon />
      </div>
      <div
        className={
          isMenuShow
            ? "block fixed w-full h-screen top-0 left-0 bg-white dark:bg-dark z-10"
            : "hidden"
        }
      >
        <div className="flex justify-end">
          <div
            className="w-10 cursor-pointer"
            onClick={() => setMenuShow(false)}
          >
            <XIcon />
          </div>
        </div>
        <ul className="flex flex-col items-center justify-between min-h-[250px] font-poppins-medium">
          <li
            className="my-5 text-black dark:text-white flex items-center no-underline py-0 px-4 h-full active:text-active-link cursor-pointer"
            onClick={() => navigateAndCloseMenu(`${APP_PREFIX_PATH}`)}
          >
            Home
          </li>
          <li
            className="my-5 text-black dark:text-white flex items-center no-underline py-0 px-4 h-full active:text-active-link cursor-pointer"
            onClick={() =>
              navigateAndCloseMenu(`${APP_PREFIX_PATH}/workspace/default`)
            }
          >
            Workspace
          </li>
          <li
            className="my-5 text-black dark:text-white flex items-center no-underline py-0 px-4 h-full active:text-active-link cursor-pointer"
            onClick={() => navigateAndCloseMenu(`${APP_PREFIX_PATH}/about`)}
          >
            About
          </li>
          <li
            className="my-5 text-black dark:text-white flex items-center no-underline py-0 px-4 h-full active:text-active-link cursor-pointer"
            onClick={() =>
              navigateAndCloseMenu(`${APP_PREFIX_PATH}/pricing-plan`)
            }
          >
            Pricing
          </li>
          <li className="my-5 text-black dark:text-white flex items-center no-underline py-0 px-4 h-full active:text-active-link cursor-pointer">
            <a
              href="https://forms.gle/KqsAFY4CLZZnUZDp8"
              target="_blank"
              rel="noreferrer"
            >
              Feedback
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};
