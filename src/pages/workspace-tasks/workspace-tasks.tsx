import React, { useState, useRef, memo, useEffect } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { User, onAuthStateChanged } from "firebase/auth";
import cloneDeep from "lodash/cloneDeep";
import { v4 as uuidv4 } from "uuid";
import { useParams, useNavigate } from "react-router-dom";
import { DataSnapshot, onValue, ref } from "firebase/database";

import Layout from "../../hoc/layout/layout";
import AddButton from "../../components/add-button/add-button";
import DoFirst from "../../components/do-first/do-first";
import DoLater from "../../components/do-later/do-later";
import Delegate from "../../components/delegate/delegate";
import Eliminate from "../../components/eliminate/eliminate";
import useWindowDimensions from "../../hooks/useWindowDimensions";
// import DeviceExceedPage from "../device-exceed/device-exceed";
import AddModal from "../../components/add-modal/add-modal";
import {
  setWorkSpaceTaskFromDb,
  updateWorkspaceTask,
  removeWorkspaceTask,
  editWorkspaceTask,
  updateWorkspaceTaskStatus,
  setIsWorkspaceNameEdit,
} from "../../redux/workspace/workspace.slice";
import { auth, database } from "../../firebase/firebase";
import DeleteModal from "../../components/delete-modal/delete-modal";
import EditModal from "../../components/edit-modal/edit-modal";
import {
  checkUserAccessSelector,
  getWorkSpaceTask,
  isDeleteNotShowAgain,
  workspaceLoader,
} from "../../redux/workspace/workspace.selector";
import {
  addWorkspaceTask,
  checkWorkspaceAccess,
} from "../../redux/workspace/workspace.api";
import withLoading from "../../hoc/loading/loading";
import Loader from "../../components/loader/loader";
import { setIsDoNotShowAgainDeleteModal } from "../../redux/tasks/tasks.slice";
import usePremiumStatus from "../../hooks/usePremiumStatus";
import { APP_PREFIX_PATH } from "../../configs/app-configs";

const WorkspaceTasks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { width, height } = useWindowDimensions();
  const { workspaceId } = useParams();

  const addButtonRef = useRef<HTMLDivElement>(null);
  const tasks = useSelector(getWorkSpaceTask, shallowEqual);
  const userAccess = useSelector(checkUserAccessSelector, shallowEqual);
  const loader = useSelector(workspaceLoader, shallowEqual);
  const doNotShowAgainDeleteModal = useSelector(
    isDeleteNotShowAgain,
    shallowEqual
  );

  const [boardData, setBoardData] = useState(tasks);
  const [isDeviceExceed] = useState<boolean>(false);
  const [isAddModal, setIsAddModal] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [deleteTask, setDeleteTask] = useState<{
    id: string;
    tag?: string | null;
    type: string;
  }>({ id: "", tag: "", type: "" });
  const [editInfo, setEditInfo] = useState<{
    id: string;
    type: string;
    task: string;
  }>({ id: "", task: "", type: "" });
  const [uid, setUID] = useState<string>("");
  const [user, setUser] = useState<User>();

  const isUserPremium = usePremiumStatus(user);

  const onDragEnd = (result: DropResult): void => {
    if (!result.destination) return;
    let newBoardData = cloneDeep(boardData);
    let dragStart: string = result.source.droppableId;
    let dragEnd: string = result.destination?.droppableId;
    var dragItem: string = "";
    switch (dragStart) {
      case "Do first":
        dragItem = newBoardData["do-first"].ids[result.source.index];
        newBoardData["do-first"].ids.splice(result.source.index, 1);
        onDrop(dragEnd, result, newBoardData, dragItem);
        break;
      case "Do later":
        dragItem = newBoardData["do-later"].ids[result.source.index];
        newBoardData["do-later"].ids.splice(result.source.index, 1);
        onDrop(dragEnd, result, newBoardData, dragItem);
        break;
      case "Delegate":
        dragItem = newBoardData["delegate"].ids[result.source.index];
        newBoardData["delegate"].ids.splice(result.source.index, 1);
        onDrop(dragEnd, result, newBoardData, dragItem);
        break;
      case "Eliminate":
        dragItem = newBoardData["eliminate"].ids[result.source.index];
        newBoardData["eliminate"].ids.splice(result.source.index, 1);
        onDrop(dragEnd, result, newBoardData, dragItem);
        break;
    }
  };

  const onDrop = (
    dragEnd: string,
    result: DropResult,
    newBoardData: any,
    dragItem: string
  ): void => {
    switch (dragEnd) {
      case "Do first":
        newBoardData["do-first"].ids.splice(
          result.destination?.index,
          0,
          dragItem
        );
        break;
      case "Do later":
        newBoardData["do-later"].ids.splice(
          result.destination?.index,
          0,
          dragItem
        );
        break;
      case "Delegate":
        newBoardData["delegate"].ids.splice(
          result.destination?.index,
          0,
          dragItem
        );
        break;
      case "Eliminate":
        newBoardData["eliminate"].ids.splice(
          result.destination?.index,
          0,
          dragItem
        );
        break;
    }
    setBoardData(newBoardData);
    dispatch(updateWorkspaceTask({ tasks: newBoardData, workspaceId }));
  };

  const onAddTask = (): void => {
    if (isUserPremium) {
      setIsAddModal(true);
    }
  };

  const onAddModalDismiss = (): void => {
    setIsAddModal(false);
  };

  const onDeleteDismiss = (): void => {
    setIsDeleteModal(false);
  };

  const onEditDismiss = (): void => {
    setIsEditModal(false);
  };

  const onEditUpdate = (id: string, task: string): void => {
    dispatch(editWorkspaceTask({ id, task, workspaceId }));
    let newBoardData = cloneDeep(boardData);
    newBoardData["items"][id].task = task;
    setBoardData(newBoardData);
  };

  const onRemove = (type: string, id: string) => {
    dispatch(
      removeWorkspaceTask({
        type: type,
        id: id,
        workspaceId,
      })
    );
    onDeleteDismiss();
  };

  const onRemoveTask = (
    type: string,
    id: string,
    tag?: string | null
  ): void => {
    setIsDeleteModal(true);
    setDeleteTask({ type, id, tag });
    if (doNotShowAgainDeleteModal) {
      onRemove(type, id);
    }
  };

  const onEditTask = (type: string, id: string, task: string): void => {
    if (isUserPremium) {
      setIsEditModal(true);
      setEditInfo({ id, type, task });
    }
  };

  const onStatusUpdate = (id: string, status: string) => {
    dispatch(updateWorkspaceTaskStatus({ id, status, workspaceId }));
  };

  const handleAddTask = (title: string, task: string) => {
    if (workspaceId) {
      dispatch(addWorkspaceTask({ title, id: uuidv4(), task, workspaceId }));
    }
    setIsAddModal(false);
  };

  const handleRemoveTask = () => {
    dispatch(
      removeWorkspaceTask({
        type: deleteTask?.type,
        id: deleteTask?.id,
        workspaceId,
      })
    );
    onDeleteDismiss();
  };

  useEffect(() => {
    const workspaceRef = ref(database, `workspace/${workspaceId}`);
    onValue(workspaceRef, async (snapshot: DataSnapshot) => {
      const workspaceTasks: string = snapshot.val()?.tasks as string;
      if (workspaceTasks !== undefined && workspaceId !== undefined) {
        setBoardData(JSON.parse(workspaceTasks));
      }
    });
  }, [workspaceId, dispatch]);

  useEffect(() => {
    dispatch(setWorkSpaceTaskFromDb(boardData));
  }, [boardData, dispatch, workspaceId]);

  useEffect(() => {
    onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUID(user?.uid);
        setUser(user);
      }
    });
  }, []);

  useEffect(() => {
    if (workspaceId) {
      dispatch(checkWorkspaceAccess({ uid, workspaceId }));
    }
  }, [dispatch, uid, workspaceId]);

  if (loader) {
    <Loader loadingMessage="Hold on! It's loading, not napping. Or is it? We may never know." />;
  }

  if (!userAccess && !loader) {
    return (
      <div className="w-screen h-screen flex flex-col bg-white dark:bg-dark">
        <div className="flex-[0.2] justify-center items-center inline-flex">
          <h1 className="font-poppins-regular text-xl text-eliminate bg-eliminate-alpha px-3 py-2 rounded-md animate__animated animate__bounceIn animate__slow ease-linear hover:scale-105 transition cursor-pointer">
            Link broken
          </h1>
        </div>
        <div className="flex-1 inline-flex items-center justify-center">
          <span className="text-md font-poppins-regular  text-dark dark:text-white">
            Houston, we have a problem! The link is lost in cyberspace.
          </span>
        </div>
      </div>
    );
  }

  const handleDeleteModalCheckbox = (isCheck: boolean) => {
    dispatch(setIsDoNotShowAgainDeleteModal(isCheck));
  };

  const onTaskFocus = (): void => {
    dispatch(setIsWorkspaceNameEdit(true));
  };

  const onTaskBlur = (): void => {
    dispatch(setIsWorkspaceNameEdit(false));
  };

  const onTaskInput = (value: string | null, type: string): void => {
    // console.log("value", value, "type", type);
  };

  const handlePricingNavigation = () => {
    navigate(`${APP_PREFIX_PATH}/pricing-plan`);
  }

  if (isDeviceExceed) {
    navigate(`${APP_PREFIX_PATH}/device-login-limit`);
  }

  const plan = ['Unlimited tasks and edits', 'Multi device sync support', 'Create Workspaces and invite members', 'Edit section names']

  if (!isUserPremium) {
    return (
      <div className="w-screen h-screen bg-white dark:bg-dark dark:border-dark-gray border-0 border-black border-t-[1px] relative">
        <div className="absolute top-5 right-5 inline-flex justify-center items-center">
          <span className="text-xs text-delegate bg-delegate-alpha px-3 py-2 rounded-md font-poppins-regular animate__animated animate__bounceIn">
            Workspace
          </span>
        </div>
        <main className="mt-20">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-normal md:text-3xl lg:text-4xl font-poppins-light text-dark dark:text-white">
              Upgrade your plan to create <span className="font-poppins-medium">shareable workspaces</span>
            </h1>
            <p className="text-sm font-normal text-gray-400 font-poppins-light">
              Upgrade for a team to share the workload (and the coffee).
            </p>
          </div>
          <div className="flex flex-col items-center justify-center mt-16 space-y-8 lg:flex-row lg:items-stretch lg:space-x-8 lg:space-y-0">
            <section
              className={`flex flex-col w-full max-w-sm p-12 space-y-6 bg-white dark:bg-dark dark:border-dark-gray border-done`}
            >
              <div className="flex-shrink-0 pb-6 space-y-2 border-b">
                <h2 className="text-2xl font-poppins-regular text-green-500">
                  Upgrade your plan
                </h2>
              </div>

              <ul className="flex-1 space-y-4">
                {plan.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="flex-shrink-0 w-6 h-6 text-green-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                        className="animate__animated animate__bounceIn"
                      />
                    </svg>
                    <span className="ml-3 text-base font-poppins-medium text-dark dark:text-white">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex-shrink-0 pt-4">
                <button
                  className={`inline-flex items-center justify-center w-full max-w-xs px-4 py-2 transition-colors border rounded focus:outline-none font-poppins-bold text-do-first bg-do-first-alpha`}
                  onClick={handlePricingNavigation}
                >
                  Upgrade
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }
  // if (isDeviceExceed) {
  //   return (
  //     <>
  //       <DeviceExceedPage />
  //     </>
  //   );
  // }

  return (
    <Layout>
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ width, height }} className="relative">
          <div className="grid grid-cols-2 h-half">
            <DoFirst
              data={boardData}
              onRemove={onRemoveTask}
              onEdit={onEditTask}
              onStatusUpdate={onStatusUpdate}
              onTaskFocus={onTaskFocus}
              onTaskBlur={onTaskBlur}
              onTaskInput={onTaskInput}
            />
            <DoLater
              data={boardData}
              onRemove={onRemoveTask}
              onEdit={onEditTask}
              onStatusUpdate={onStatusUpdate}
              onTaskFocus={onTaskFocus}
              onTaskBlur={onTaskBlur}
              onTaskInput={onTaskInput}
            />
          </div>
          <div ref={addButtonRef}>
            <AddButton onClick={onAddTask} />
          </div>
          <div className="grid grid-cols-2 h-half">
            <Delegate
              data={boardData}
              onRemove={onRemoveTask}
              onEdit={onEditTask}
              onStatusUpdate={onStatusUpdate}
              onTaskFocus={onTaskFocus}
              onTaskBlur={onTaskBlur}
              onTaskInput={onTaskInput}
            />
            <Eliminate
              data={boardData}
              onRemove={onRemoveTask}
              onEdit={onEditTask}
              onStatusUpdate={onStatusUpdate}
              onTaskFocus={onTaskFocus}
              onTaskBlur={onTaskBlur}
              onTaskInput={onTaskInput}
            />
          </div>
          {!isEditModal && (
            <AddModal
              isAddModalVisible={isAddModal}
              onCancel={onAddModalDismiss}
              onShow={onAddTask}
              handleAddTask={handleAddTask}
            />
          )}
          {!doNotShowAgainDeleteModal && (
            <DeleteModal
              isDeleteModalVisible={isDeleteModal}
              onDeleteDismiss={onDeleteDismiss}
              onRemove={handleRemoveTask}
              onCheckChange={handleDeleteModalCheckbox}
            />
          )}
          <EditModal
            isEditModalVisible={isEditModal}
            taskId={editInfo.id}
            editTaskName={editInfo.task}
            onEditUpdate={onEditUpdate}
            onEditDismiss={onEditDismiss}
          />
        </div>
      </DragDropContext>
    </Layout>
  );
};

export default withLoading(
  memo(WorkspaceTasks),
  "Hold on! It's loading, not napping. Or is it? We may never know."
);
