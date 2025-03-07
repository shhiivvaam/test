import React from "react";
import { Draggable } from "react-beautiful-dnd";
import Lottie from "react-lottie";

import { ReactComponent as DeleteIcon } from "../../assets/icons/ic_line_delete.svg";
import { ReactComponent as EditIcon } from "../../assets/icons/ic_line_edit.svg";
import checkAnim from "../../assets/lottie/check.json";

type TaskItemProps = {
  title: string;
  id: string;
  status: string;
  index: number;
  type: string;
  onRemove: (type: string, id: string, tag?: string | null) => void;
  onEdit: (type: string, id: string, task: string) => void;
  onStatusUpdate: (id: string, status: string) => void;
  className?: string;
};

const TaskItem = ({
  title,
  id,
  status,
  index,
  type,
  onRemove,
  onEdit,
  onStatusUpdate,
  className,
}: TaskItemProps) => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: checkAnim,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const highlightLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text?.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="underline">
            {part}
          </a>
        );
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  };

  return (
    <Draggable index={index} draggableId={id}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`flex items-center flex-row mt-1 mr-2 pr-2 last:mb-0 rounded-md ${className} supertasks-task-item`}
        >
          <div className="w-10 flex align-center justify-center">
            {status === "in-progress" ? (
              <div
                className="h-4 w-4 md:rounded-full border border-black dark:border-white ml-2 cursor-pointer"
                onClick={() => onStatusUpdate(id, "done")}
              />
            ) : (
              <div onClick={() => onStatusUpdate(id, "in-progress")}>
                <Lottie options={defaultOptions} height={30} width={30} />
              </div>
            )}
          </div>
          <div className="p-3 w-[92%] overflow-hidden font-poppins-regular text-xs md:text-sm text-ellipsis dark:text-white">
            {highlightLinks(title)}
          </div>
          <div className="lg:w-[8%]  flex flex-row justify-between">
            <EditIcon
              className="cursor-pointer  md:w-9 dark:fill-white fill-black w-4 mr-1"
              onClick={() => onEdit(type, id, title)}
            />
            <DeleteIcon
              className="cursor-pointer md:w-9 w-4 ml-1"
              onClick={() => onRemove(type, id)}
            />
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskItem;
