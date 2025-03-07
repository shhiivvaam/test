import React, { memo, useRef, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { Popover, ArrowContainer } from 'react-tiny-popover';

import TaskItem from "../task-item/task-item";
import { ReactComponent as EditIcon } from "../../assets/icons/ic_line_edit.svg";

type DoLaterProps = {
  data: {
    "do-later": { title: string; ids: Array<string> };
    items: {
      [key: string]: {
        id: string;
        task: string;
        status: string;
        tag?: string | null;
        prevTag?: string | null;
      };
    };
    "titles"?: { "Do later": string }
  };
  onRemove: (type: string, id: string) => void;
  onEdit: (type: string, id: string, task: string) => void;
  onStatusUpdate: (id: string, status: string) => void;
  onTaskFocus: () => void;
  onTaskBlur: () => void;
  onTaskInput: (name: string | null, type: string) => void;
  isUserPremium?: boolean;
};

const DoLater = ({ data, isUserPremium, onRemove, onEdit, onStatusUpdate, onTaskFocus, onTaskBlur, onTaskInput }: DoLaterProps) => {
  const titleRef = useRef<HTMLParagraphElement>(null);

  const [isHover, setIsHover] = useState<boolean>(false);

  const onHover = () => {
    if (!isUserPremium) {
      setIsHover(true);
    } else {
      setIsHover(false);
    }
  }

  const onHoverLeft = () => {
    setIsHover(false);
  }

  const onEditTitleFocus = (): void => {
    titleRef.current?.focus();
  };

  return (
    <div className="p-0.5 pt-3 pl-2 overflow-hidden border-0 border-t-[1px] border-l-[1px] border-black dark:border-dark-gray dark:bg-dark pb-11">
      <div className="flex items-center justify-center mb-1">
        <p ref={titleRef} className="font-poppins-bold text-sm bg-do-later-alpha text-do-later rounded-md px-3 py-2 uppercase" contentEditable={isUserPremium} onInput={e => onTaskInput(e.currentTarget.textContent, data["do-later"].title)} onFocus={onTaskFocus} onBlur={onTaskBlur}>
          {data?.titles?.["Do later"] || data?.["do-later"]?.title}
        </p>
        <Popover
          isOpen={isHover}
          align="start"
          positions={["top"]}
          content={({ position, childRect, popoverRect }) => (
            <ArrowContainer
              position={position}
              childRect={childRect}
              popoverRect={popoverRect}
              arrowColor={"#2a2e2d"}
              arrowSize={8}
            >
              <div className="bg-[#2a2e2d] px-4 py-2 rounded-md hover:bg-[#4e5251] cursor-pointer">
                <div className="popover-content text-white text-xs font-poppins-light">Subscribe to premium to rename sections</div>
              </div>
            </ArrowContainer>
          )}
        >
          <EditIcon
            onClick={onEditTitleFocus}
            onMouseOver={onHover}
            onMouseLeave={onHoverLeft}
            className={`cursor-pointer ${isUserPremium
              ? "dark:fill-white fill-black"
              : "dark:fill-slate-500"
              } w-4 mx-1`}
          />
        </Popover>
      </div>
      <Droppable droppableId={data["do-later"].title}>
        {(droppableProvided, snapshot) => {
          return (
            <div
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
              className="w-full h-full overflow-y-scroll no-scrollbar"
            >
              <div>
                {data["do-later"]?.ids.map(
                  (id: string, index: number): JSX.Element => (
                    <TaskItem
                      key={id}
                      title={data["items"][id]?.task}
                      id={id}
                      status={data["items"][id]?.status}
                      index={index}
                      type="do-later"
                      className="bg-do-later-alpha"
                      onRemove={onRemove}
                      onEdit={onEdit}
                      onStatusUpdate={onStatusUpdate}
                    />
                  )
                )}
                {droppableProvided.placeholder}
              </div>
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};

export default memo(DoLater);
