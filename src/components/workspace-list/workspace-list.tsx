import React, { useState } from "react";
import { Popover, ArrowContainer } from "react-tiny-popover";

import AddButton from "../add-button/add-button";
import { ReactComponent as DotIcon } from "../../assets/icons/ic_menu_dots.svg";

type WorkspaceListProps = {
  isPersonalWorkSpace: boolean;
  workspaceList: any;
  addWorkSpace?: () => void;
  removeWorkSpace?: (item: Array<string>) => void;
  onNavigateWorkspace: (
    id: Array<string>,
    isPersonalWorkSpace: boolean
  ) => void;
};

const WorkspaceList = ({
  isPersonalWorkSpace,
  workspaceList,
  addWorkSpace,
  removeWorkSpace,
  onNavigateWorkspace,
}: WorkspaceListProps) => {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

  const handleWorkspaceNavigation = (item: Array<string>) => {
    onNavigateWorkspace(item, isPersonalWorkSpace);
  };

  const handleMenuToggle = (index: number) => {
    setOpenMenuIndex((prev) => (prev === index ? null : index));
  };

  const workSpaceItems = (onClick: Function, onDelete: Function) => {
    return workspaceList?.map((item: Array<any>, index: number) => {
      return (
        <div className="inline-block pr-3" key={item[0]}>
          <div className="w-44 h-44 max-w-xs overflow-hidden rounded-lg shadow-md border-2 border-black dark:border-white animate__animated animate__slideInLeft flex">
            <div
              className="w-full h-full flex cursor-pointer"
              onClick={() => onClick(item)}
            >
              <div className="flex-1 inline-flex flex-col opacity-50">
                <div className="flex-1 inline-flex bg-do-first flex-col items-center">
                  <div className="w-[87%] h-3 bg-white mx-1 my-2 rounded-sm animate__animated animate__zoomIn animate__delay-1s animate__fast" />
                  <div className="w-[87%] h-3 bg-white mx-1 my-2 rounded-sm animate__animated animate__zoomIn animate__delay-1s animate__fast" />
                </div>
                <div className="flex-1 inline-flex bg-do-later flex-col items-center">
                  <div className="w-[87%] h-3 bg-white mx-1 my-2 rounded-sm animate__animated animate__zoomIn animate__delay-1s" />
                </div>
              </div>
              <div className="flex-1 inline-flex flex-col opacity-50">
                <div className="flex-1 inline-flex bg-delegate flex-col items-center">
                  <div className="w-[87%] h-3 bg-white mx-1 my-2 rounded-sm animate__animated animate__zoomIn animate__delay-1s animate__slow" />
                </div>
                <div className="flex-1 inline-flex bg-eliminate">
                  <div className="w-[87%] h-3 bg-white mx-1 my-2 rounded-sm animate__animated animate__zoomIn animate__delay-1s animate__slow" />
                </div>
              </div>
            </div>
            <div className="w-full h-9 bg-white absolute bottom-0 flex items-center justify-center">
              <span className="text-xs text-eliminate self-center bg-eliminate-alpha px-2 py-1 rounded-md font-poppins-regular animate__animated animate__bounceIn animate__slow animate__delay-1s ease-linear hover:scale-105 transition truncate max-w-[15ch]">
                {isPersonalWorkSpace ? item[1] : item[1]?.workspaceName}
              </span>
              {isPersonalWorkSpace && (
                <div
                  className="absolute right-0 h-full flex justify-center items-center cursor-pointer z-10"
                  onClick={() => handleMenuToggle(index)}
                >
                  <Popover
                    isOpen={openMenuIndex === index}
                    align="end"
                    positions={["bottom"]}
                    onClickOutside={() => setOpenMenuIndex(null)}
                    content={({ position, childRect, popoverRect }) => (
                      <ArrowContainer
                        position={position}
                        childRect={childRect}
                        popoverRect={popoverRect}
                        arrowColor={"#2a2e2d"}
                        arrowSize={8}>
                        <div
                          className="bg-[#2a2e2d] px-4 py-2 rounded-md hover:bg-[#4e5251] cursor-pointer"
                          onClick={() => {
                            onDelete(item);
                            setOpenMenuIndex(null);
                          }}
                        >
                          <div className="popover-content text-white">
                            Delete
                          </div>
                        </div>
                      </ArrowContainer>
                    )}
                  >
                    <DotIcon />
                  </Popover>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex overflow-x-scroll no-scrollbar">
      <div className="flex flex-nowrap">
        {isPersonalWorkSpace && (
          <div className="inline-block pr-3">
            <div className="w-44 h-44 max-w-xs overflow-hidden rounded-lg shadow-md border-2 border-black dark:border-white hover:shadow-xl transition-shadow duration-300 ease-in-out animate__animated animate__slideInLeft">
              <AddButton onClick={() => addWorkSpace!()} />
            </div>
          </div>
        )}
        {workSpaceItems(handleWorkspaceNavigation, removeWorkSpace!)}
      </div>
    </div>
  );
};

export default WorkspaceList;
