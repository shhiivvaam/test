import React, {
  memo,
  useState,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useRef
} from "react";
import { useSelector, shallowEqual } from "react-redux";
import { toast } from "react-toastify";

import { RootState } from "../../redux/store";

import Modal from "../modal/modal";

type AddModalProps = {
  isAddModalVisible: boolean;
  onCancel: () => void;
  onShow: () => void;
  handleAddTask: (quad: string, task: string) => void;
  onNextIndex?: () => void;
};

const AddModal = ({
  isAddModalVisible,
  onCancel,
  onShow,
  handleAddTask,
  onNextIndex,
}: AddModalProps) => {
  const addTaskInputRef = useRef<any>(null);

  const [task, setTask] = useState<string>("");
  const [isTuts, setShowTuts] = useState<boolean>(false);

  const canAddMoreTags = useSelector(
    (state: RootState) => state?.tasks.canAddMoreTags,
    shallowEqual
  );
  const isWorkspaceEditName = useSelector(
    (state: RootState) => state.workspace.isWorkspaceEditName,
  )

  const addingTask = useCallback(
    (title: string, task: string): void => {
      setShowTuts(false);
      handleAddTask(title, task);
      setTask("");
    },
    [handleAddTask]
  );

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.code === "Enter") {
      if (!getButtonDisable()) {
        setShowTuts(true);
        onNextIndex!();
      }
    }
  };

  const onAddTask = (e: ChangeEvent<HTMLInputElement>): void => {
    setTask(e.target.value);
  };

  const onSubmit = () => {
    if (canAddMoreTags || !task.includes("|")) {
      setShowTuts(true);
    } else {
      notify("You can not add more than 4 tags");
    }
    onNextIndex!();
  };

  const notify = (message: string): void => {
    toast(message, {
      toastId: "do-not-repeat",
      theme: "dark",
      progress: undefined,
    });
  };

  const getButtonDisable = useCallback(() => {
    if (task.length > 0 && /\S/.test(task)) {
      return false;
    }
    return true;
  }, [task]);

  useEffect(() => {
    const moveTaskList = (e: any) => {
      if (task.length > 0 && isTuts) {
        if (e.shiftKey && e.code === "ArrowUp") {
          addingTask("do-first", task);
        }
        if (e.shiftKey && e.code === "ArrowRight") {
          addingTask("do-later", task);
        }
        if (e.shiftKey && e.code === "ArrowLeft") {
          addingTask("delegate", task);
        }
        if (e.shiftKey && e.code === "ArrowDown") {
          addingTask("eliminate", task);
        }
      }
      if (e.code === "Escape") {
        onCancel();
        setShowTuts(false);
        setTask("");
      }

      if (e.code === "Space" && !isWorkspaceEditName) {
        onShow();
      }
    };
    document.addEventListener("keydown", moveTaskList, false);
    return () => {
      document.removeEventListener("keydown", moveTaskList, false);
    };
  }, [isTuts, onShow, onCancel, addingTask, task, isWorkspaceEditName, getButtonDisable]);

  useEffect(() => {
    if (addTaskInputRef.current) {
      addTaskInputRef.current?.focus();
    }
    if (!isAddModalVisible) {
      addTaskInputRef.current?.blur();
    }
  }, [addTaskInputRef, isAddModalVisible])

  return (
    <>
      <Modal isModalVisible={isAddModalVisible}>
        <div className="flex items-start justify-between p-5 rounded-t">
          <h3 className="text-3xl font-poppins-bold dark:text-white">
            Add tasks
          </h3>
        </div>
        {!isTuts ? (
          <div className="supertasks-add-input">
            <div className="relative p-6 flex-auto">
              <label className="block text-black dark:text-white text-sm font-poppins-bold mb-1">
                Task
              </label>
              <input
                ref={addTaskInputRef}
                onChange={onAddTask}
                className="shadow appearance-none border rounded w-full text-black p-3 font-poppins-regular dark:bg-dark dark:text-white"
                placeholder="Add your super task"
                onKeyDown={onKeyDown}
                autoFocus={true}
              />
            </div>
            <div className="flex items-center justify-end p-6 rounded-b">
              <div
                className="text-eliminate background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 font-poppins-medium cursor-pointer"
                onClick={() => {
                  onCancel();
                  setShowTuts(false);
                  setTask("");
                }}
              >
                Close
              </div>
              <button
                className={`text-white ${getButtonDisable()
                  ? "bg-disable-button dark:bg-dark-gray"
                  : "bg-delegate"
                  } active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 font-poppins-medium`}
                onClick={onSubmit}
                disabled={getButtonDisable()}
              >
                Submit
              </button>
            </div>
          </div>
        ) : (
          <div className="supertasks-add-tuts">
            <div className="relative p-6 flex flex-row">
              <div className="flex-col flex">
                <span className="bg-keys text-white pt-4 pb-4 pr-2.5 pl-2.5 rounded-md mr-2 mt-2 font-poppins-medium text-center">
                  {" "}
                  Shift ⇧ + Arrow ↑
                </span>
                <span className="bg-keys text-white pt-4 pb-4 pr-2.5 pl-2.5 rounded-md mr-2 mt-2 font-poppins-medium text-center">
                  {" "}
                  Shift ⇧ + Arrow →
                </span>
                <span className="bg-keys text-white pt-4 pb-4 pr-2.5 pl-2.5 rounded-md mr-2 mt-2 font-poppins-medium text-center">
                  {" "}
                  Shift ⇧ + Arrow ←
                </span>
                <span className="bg-keys text-white pt-4 pb-4 pr-2.5 pl-2.5 rounded-md mr-2 mt-2 font-poppins-medium text-center">
                  {" "}
                  Shift ⇧ + Arrow ↓
                </span>
              </div>
              <div className="flex-col flex">
                <span
                  className="pt-4 pb-4 pr-2.5 pl-2.5 rounded-md bg-do-first cursor-pointer text-white mt-2 font-poppins-medium text-center"
                  onClick={() => {
                    addingTask("do-first", task);
                  }}
                >
                  Do first{" "}
                </span>
                <span
                  className="pt-4 pb-4 pr-2.5 pl-2.5 rounded-md bg-do-later cursor-pointer text-white mt-2 font-poppins-medium text-center"
                  onClick={() => {
                    addingTask("do-later", task);
                  }}
                >
                  {" "}
                  Do later{" "}
                </span>
                <span
                  className="pt-4 pb-4 pr-2.5 pl-2.5 rounded-md bg-delegate cursor-pointer text-white mt-2 font-poppins-medium text-center"
                  onClick={() => {
                    addingTask("delegate", task);
                  }}
                >
                  {" "}
                  Delegate{" "}
                </span>
                <span
                  className="pt-4 pb-4 pr-2.5 pl-2.5 rounded-md bg-eliminate cursor-pointer text-white mt-2 font-poppins-medium text-center"
                  onClick={() => {
                    addingTask("eliminate", task);
                  }}
                >
                  {" "}
                  Eliminate{" "}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-end p-6 rounded-b">
              <button
                className="text-eliminate background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 font-poppins-medium"
                onClick={() => {
                  onCancel();
                  setShowTuts(false);
                  setTask("");
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default memo(AddModal);
