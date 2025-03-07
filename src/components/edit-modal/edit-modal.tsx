import React, {
  memo,
  useState,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import Modal from "../modal/modal";

type EditModalProps = {
  isEditModalVisible: boolean;
  taskId: string;
  editTaskName: string;
  onEditUpdate: (id: string, task: string) => void;
  onEditDismiss: () => void;
};

const EditModal = ({
  isEditModalVisible,
  taskId,
  editTaskName,
  onEditUpdate,
  onEditDismiss,
}: EditModalProps) => {

  const [task, setTask] = useState<string>("");

  useEffect(() => {
    setTask(editTaskName);
  }, [isEditModalVisible, editTaskName]);

  useEffect(() => {
    const closeWindow = (e: any) => {
      if (e.code === "Escape") {
        onEditDismiss();
      }
    };
    document.addEventListener("keydown", closeWindow, false);
    return () => {
      document.removeEventListener("keydown", closeWindow, false);
    };
  }, [onEditDismiss]);

  const onEditTask = (e: ChangeEvent<HTMLInputElement>): void => {
    setTask(e.target.value);
  };

  const onUpdate = () => {
    onEditUpdate(taskId, task);
    setTask("");
    onEditDismiss();
  };

  const onKeydown = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === "Enter" && !getButtonDisable()) {
      onUpdate();
    }
  };

  const getButtonDisable = (): boolean => {
    if (task?.length > 0) {
      return false;
    }
    return true;
  };

  return (
    <>
      <Modal isModalVisible={isEditModalVisible}>
        <div className="flex items-start justify-between p-5 rounded-t ">
          <h3 className="text-3xl font-poppins-bold dark:text-white">
            Edit tasks
          </h3>
        </div>
        <div className="relative p-6 flex-auto">
          <form>
            <label className="block text-black text-sm font-poppins-bold mb-1 dark:text-white">
              Task
            </label>
            <input
              onChange={onEditTask}
              className="shadow appearance-none border rounded w-full text-black font-poppins-regular p-3 dark:bg-dark dark:text-white"
              placeholder="Edit your super task"
              value={task}
              onKeyDown={onKeydown}
            />
          </form>
        </div>
        <div className="flex items-center justify-end p-6 rounded-b">
          <button
            className="text-eliminate background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 font-poppins-medium"
            type="button"
            onClick={onEditDismiss}
          >
            Close
          </button>
          <button
            className={`text-white ${getButtonDisable()
              ? "bg-disable-button dark:bg-dark-gray"
              : "bg-delegate"
              } active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 font-poppins-medium`}
            type="button"
            onClick={onUpdate}
            disabled={getButtonDisable()}
          >
            Update
          </button>
        </div>
      </Modal>
    </>
  );
};

export default memo(EditModal);
