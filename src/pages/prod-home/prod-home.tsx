import React, {
  useState,
  useEffect,
  useMemo,
  useLayoutEffect,
  memo,
  useCallback,
} from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { onAuthStateChanged, User } from "firebase/auth";
import cloneDeep from "lodash/cloneDeep";
import { toast } from "react-toastify";
import { ref, onValue, DataSnapshot, get } from "@firebase/database";
import Joyride, { ACTIONS, CallBackProps, EVENTS, STATUS } from "react-joyride";
import { DocumentData } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { logEvent } from "firebase/analytics";
import { useNavigate } from "react-router-dom";

import Layout from "../../hoc/layout/layout";
import { RootState } from "../../redux/store";
import {
  getTasks,
  updateTasks,
  getItemCount,
  setIsUserPremium,
  getCanAddMoreTask,
  updateCloud,
  fetchCloud,
  removeTask,
  TasksState,
  setSubscriptionType,
  addTask,
  editTask,
  completeTask,
  getIsDoNotShowAgainDeleteModal,
  setIsDoNotShowAgainDeleteModal,
  updateTitleName,
  setCanAddMoreTask,
  setNewTask,
} from "../../redux/tasks/tasks.slice";
import AddModal from "../../components/add-modal/add-modal";
import EditModal from "../../components/edit-modal/edit-modal";
import AddButton from "../../components/add-button/add-button";
import DoFirst from "../../components/do-first/do-first";
import DoLater from "../../components/do-later/do-later";
import Delegate from "../../components/delegate/delegate";
import Eliminate from "../../components/eliminate/eliminate";
import { getCreator, getUserData, uploadTasks } from "../../api/databse";
import { analytics, auth, database } from "../../firebase/firebase";
import usePremiumStatus from "../../hooks/usePremiumStatus";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import DeleteModal from "../../components/delete-modal/delete-modal";
import { deleteFileFromCloud, fetchUserDataFromCloud } from "../../api/storage";
import useSubscriptionType from "../../hooks/useSubscriptionType";
import { setIsWorkspaceNameEdit } from "../../redux/workspace/workspace.slice";
import {
  completeTutorial,
  isUserOnboardingCompleted,
} from "../../redux/tasks/tasks.api";
import { completeOnboarding } from "../../redux/workspace/workspace.api";
import { APP_PREFIX_PATH } from "../../configs/app-configs";

const ProdHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { width, height } = useWindowDimensions();

  const tasks = useSelector(
    (state: RootState) => state?.tasks.tasks,
    shallowEqual
  );
  const canAddMoreTask = useSelector(
    (state: RootState) => state?.tasks.canAddMoreTask,
    shallowEqual
  );
  const doNotShowAgainDeleteModal = useSelector(
    (state: RootState) => state.tasks.doNotShowAgainDeleteModal,
    shallowEqual
  );
  const isOnboardingCompleted = useSelector(
    (state: RootState) => state.tasks.isOnboardingCompleted,
    shallowEqual
  );
  const isUserFirstTime = useSelector(
    (state: RootState) => state.tasks.isUserFirstTime,
    shallowEqual
  );

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
  const [boardData, setBoardData] = useState(tasks);
  const [user, setUser] = useState<User>();
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [filterIds] = useState<Array<string>>([""]);
  const [tasksFromDB, setTasksFromDB] = useState<boolean>(false);
  const [steps, setSteps] = useState<Array<any>>([]);
  const [, setRun] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [isDeviceExceed, setIsDeviceExceed] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<{
    name: string | null;
    type: string;
  }>({ name: "", type: "" });

  const { status: userIsPremium } = usePremiumStatus(user);
  const subscriptionType = useSubscriptionType(user);

  const deleteOldDb = useMemo(() => new Promise((resolve, reject) => {
    const unparsedDB: string | null = localStorage.getItem("@Tasks");
    if (unparsedDB !== null) {
      let parsedDB = JSON.parse(unparsedDB);
      const tasks: TasksState = parsedDB;
      if (Array.isArray(parsedDB)) {
        localStorage.clear();
      }

      if (!Array.isArray(parsedDB) && (!parsedDB?.tags || !parsedDB?.titles)) {
        const updatedtasks = {
          ...tasks,
          tags: {},
          titles: {
            "Do first": "",
            "Do later": "",
            Delegate: "",
            Eliminate: "",
          },
        };
        if (updateTasks !== undefined) {
          localStorage.setItem("@Tasks", JSON.stringify(updatedtasks));
        }
      }
      resolve("success");
    } else {
      // reject();
    }
  }), [])

  useEffect(() => {
    if (!isFilter) {
      setBoardData(tasks);
    }
    deleteOldDb.then(() => {
      dispatch(getItemCount(tasks?.items));
      dispatch(getCanAddMoreTask());
    });
  }, [tasks, dispatch, deleteOldDb, isFilter]);

  useEffect(() => {
    const getDevices = async () => {
      if (subscriptionType === "standard" && user !== undefined) {
        const devices: DocumentData | undefined = await getUserData(user?.uid);
        const deviceId = devices?.deviceId;
        const devicesArray = Object.keys(deviceId);
        if (devicesArray.length <= 4) {
          setIsDeviceExceed(false);
        } else if (devicesArray.length >= 4) {
          setIsDeviceExceed(true);
        }
      } else if (subscriptionType === "premium" && user !== undefined) {
        const devices: DocumentData | undefined = await getUserData(user?.uid);
        const deviceId = devices?.deviceId;
        const devicesArray = Object.keys(deviceId);
        if (devicesArray.length <= 7) {
          setIsDeviceExceed(false);
        } else if (devicesArray.length >= 7) {
          setIsDeviceExceed(true);
        }
      } else if (user !== undefined) {
        const devices: DocumentData | undefined = await getUserData(user?.uid);
        const deviceId = devices?.deviceId;
        const devicesArray = Object.keys(deviceId);
        if (devicesArray.length <= 2) {
          setIsDeviceExceed(false);
        } else if (devicesArray.length >= 2) {
          setIsDeviceExceed(true);
        }
      }
    };
    getDevices();
    dispatch(setSubscriptionType(subscriptionType));
  }, [subscriptionType, user, dispatch]);

  useEffect(() => {
    dispatch(setIsUserPremium(userIsPremium));
    dispatch(getCanAddMoreTask());
  }, [userIsPremium, dispatch, user]);

  useEffect(() => {
    const creator = async () => {
      if (user !== undefined) {
        await getCreator(user.uid).then((creator) => {
          if (creator) {
            dispatch(setIsUserPremium(true));
            dispatch(getCanAddMoreTask());
          }
        });
      }
    };
    creator();
  }, [user, dispatch]);

  useEffect(() => {
    const uid = user?.uid;
    const dbTaskRef = ref(database, `tasks/${uid}`);

    //TODO: first upload local tasks then fetch data from the cloud
    onValue(
      dbTaskRef,
      async (snapshot: DataSnapshot) => {
        const tasksStored: string = snapshot.val()?.tasks as string;
        if (tasksStored === undefined && uid !== undefined) {
          fetchUserDataFromCloud(uid).then((resultBytes: ArrayBuffer) => {
            const bytes = new Uint8Array(resultBytes);
            const result = new TextDecoder().decode(bytes);
            if (result !== null && result !== undefined) {
              uploadTasks(uid, result);
              deleteFileFromCloud(uid);
              localStorage.setItem("@Tasks", result);
            }
          });
        } else {
          setTasksFromDB(true);
        }
      },
      { onlyOnce: true }
    );
  }, [user]);

  const syncTasksWithCloud = async (
    user: User,
    dispatch: any
  ) => {
    const localTasksString = localStorage.getItem("@Tasks");

    try {
      const dbRef = ref(database, `tasks/${user.uid}`);
      const snapshot = await get(dbRef);
      const cloudTasksString = snapshot.val()?.tasks;

      if (!localTasksString) return;

      const localTasks = JSON.parse(localTasksString);

      let finalTasks;
      if (cloudTasksString) {
        const cloudTasks = JSON.parse(cloudTasksString);

        finalTasks = {
          ...cloudTasks,
          items: { ...cloudTasks.items, ...localTasks.items },
          "do-first": {
            ...cloudTasks["do-first"],
            ids: [
              ...new Set([
                ...(cloudTasks["do-first"]?.ids || []),
                ...(localTasks["do-first"]?.ids || [])
              ])
            ]
          },
          "do-later": {
            ...cloudTasks["do-later"],
            ids: [
              ...new Set([
                ...(cloudTasks["do-later"]?.ids || []),
                ...(localTasks["do-later"]?.ids || [])
              ])
            ]
          },
          "delegate": {
            ...cloudTasks["delegate"],
            ids: [
              ...new Set([
                ...(cloudTasks["delegate"]?.ids || []),
                ...(localTasks["delegate"]?.ids || [])
              ])
            ]
          },
          "eliminate": {
            ...cloudTasks["eliminate"],
            ids: [
              ...new Set([
                ...(cloudTasks["eliminate"]?.ids || []),
                ...(localTasks["eliminate"]?.ids || [])
              ])
            ]
          },
          tags: { ...cloudTasks.tags, ...localTasks.tags },
          titles: { ...cloudTasks.titles, ...localTasks.titles }
        };
      } else {
        finalTasks = localTasks;
      }

      await uploadTasks(user.uid, JSON.stringify(finalTasks));
      localStorage.setItem("@Tasks", JSON.stringify(finalTasks));

      dispatch(setNewTask({ newTask: finalTasks }));
    } catch (error) {
      console.error("Task synchronization error:", error);
    }
  };

  useEffect(() => {
    const uid = user?.uid;
    const dbTimeRef = ref(database, `tasks/${uid}`);
    if (tasksFromDB) {
      onValue(dbTimeRef, async (snapshot: DataSnapshot) => {
        const tasks: string = snapshot.val()?.tasks as string;
        dispatch(fetchCloud({ uid, tasks }));
      });
    }
  }, [tasksFromDB, user, dispatch]);

  useEffect(() => {
    dispatch(getTasks());
    dispatch(getIsDoNotShowAgainDeleteModal());
  }, [dispatch]);

  useEffect(() => {
    if (isOnboardingCompleted) {
      localStorage.setItem("hasSeenSteps", JSON.stringify(true));
    }

    const isLocalOnboardingCompleted = localStorage.getItem("hasSeenSteps");
    if ((isLocalOnboardingCompleted && JSON.parse(isLocalOnboardingCompleted))) {
      if (user) {
        dispatch(completeOnboarding(user?.uid));
        dispatch(completeTutorial(user?.uid));
      }
    }

  }, [isOnboardingCompleted, user, dispatch]);

  useEffect(() => {

    let hasSeenSteps = false;

    const isLocalOnboardingCompleted = localStorage.getItem("hasSeenSteps");
    if ((isLocalOnboardingCompleted && JSON.parse(isLocalOnboardingCompleted)) || isOnboardingCompleted) {
      // if (user) {
      //   dispatch(completeOnboarding(user?.uid));
      //   dispatch(completeTutorial(user?.uid));
      // }
      hasSeenSteps = true;
    }
    if (!hasSeenSteps) {
      setRun(true);
      setSteps([
        {
          content: (
            <div className="font-poppins-regular">
              You can add tasks with the 'Plus' button &{" "}
              <kbd className="bg-dark dark:bg-white px-2 py-1 rounded-md text-white dark:text-dark text-xs">
                Space
              </kbd>
            </div>
          ),
          disableBeacon: true,
          placement: "bottom",
          spotlightClicks: true,
          disableOverlayClose: true,
          hideCloseButton: true,
          hideFooter: true,
          styles: {
            options: {
              zIndex: 10000,
            },
            buttonNext: {
              backgroundColor: "#d92b0437",
              borderRadius: "6px",
              border: "0px",
              color: "#d92b04",
              fontWeight: "bold",
            },
          },
          target: ".supertasks-add-button",
          title: <span className="font-poppins-regular">Add task</span>,
        },
        {
          content: (
            <div className="font-poppins-regular">
              You can type your tasks into the following input
            </div>
          ),
          disableBeacon: true,
          placement: "left",
          spotlightClicks: true,
          disableOverlayClose: true,
          hideCloseButton: true,
          hideFooter: true,
          styles: {
            options: {
              zIndex: 10000,
            },
            buttonNext: {
              backgroundColor: "#d92b0437",
              borderRadius: "6px",
              border: "0px",
              color: "#d92b04",
              fontWeight: "bold",
            },
          },
          target: ".supertasks-add-input",
          title: <span className="font-poppins-regular">Task input</span>,
        },
        {
          content: (
            <div className="font-poppins-regular">
              Move tasks as per the priority, click on the priorities or you can
              use the keys too
            </div>
          ),
          disableBeacon: true,
          placement: "right",
          spotlightClicks: true,
          disableOverlayClose: true,
          hideCloseButton: true,
          hideFooter: true,
          styles: {
            options: {
              zIndex: 10000,
            },
            buttonNext: {
              backgroundColor: "#d92b0437",
              borderRadius: "6px",
              border: "0px",
              color: "#d92b04",
              fontWeight: "bold",
            },
          },
          target: ".supertasks-add-tuts",
          title: <span className="font-poppins-regular">Task priority</span>,
        },
        {
          content: (
            <div className="font-poppins-regular">
              Yay!
              <br />
              &amp;
              <br />
              <span className="font-poppins-light text-xs">
                You have successfully added the tasks
              </span>
            </div>
          ),
          placement: "bottom",
          disableBeacon: true,
          hideBackButton: true,
          spotlightPadding: 0,
          styles: {
            options: {
              zIndex: 10000,
            },
            buttonNext: {
              backgroundColor: "#d92b0437",
              borderRadius: "6px",
              border: "0px",
              color: "#d92b04",
              fontWeight: "bold",
            },
          },
          target: ".supertasks-task-item",
          title: <span className="font-poppins-regular">Supertasks</span>,
        },
        {
          content: (
            <div className="font-poppins-regular">
              Menu for you to shift between the screens
              <br />
              &amp;
              <br />
              <span className="font-poppins-light text-xs">
                subscribe to premium features
              </span>
            </div>
          ),
          placement: "bottom",
          disableBeacon: true,
          spotlightPadding: 0,
          styles: {
            options: {
              zIndex: 10000,
            },
            buttonNext: {
              backgroundColor: "#d92b0437",
              borderRadius: "6px",
              border: "0px",
              color: "#d92b04",
              fontWeight: "bold",
            },
          },
          target: ".title-menu-cliqueraft",
          title: <span className="font-poppins-regular">Psst!</span>,
        },
      ]);
      // TODO: uncomment this if we are not concerned with user's (skipping/finished) status but explicilty want that users to see all the onBoarding Tutorial Steps
      // localStorage.setItem("hasSeenSteps", JSON.stringify(true));
    }
  }, [isOnboardingCompleted]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await syncTasksWithCloud(user, dispatch);
        dispatch(isUserOnboardingCompleted(user.uid));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  //TODO: uncomment and make it work properly
  // useEffect(() => {
  //   if (!isOnboardingCompleted && user) {
  //     navigate("/create-first-workspace");
  //   }
  // }, [isOnboardingCompleted, navigate, user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        logEvent(analytics, "login", {
          userId: user.uid,
          task_count: Object.keys(boardData?.items).length,
        });
      } else {
        logEvent(analytics, "not login", {
          userId: null,
          task_count: Object.keys(boardData?.items).length,
        });
      }
    });

    return () => unsubscribe();
  }, [user, boardData.items]);

  useEffect(() => {
    const item = Object.keys(boardData.items);
    if (item.length > 5 && user) {
      dispatch(setCanAddMoreTask(true));
    } else {
      dispatch(setCanAddMoreTask(false));
    }
  }, [boardData, user, dispatch]);


  const notify = (message: string): void => {
    toast(message, {
      toastId: "do-not-repeat",
      theme: "dark",
      progress: undefined,
      progressStyle: {
        backgroundColor: "white",
      },
      style: {
        backgroundColor: "#f2bd1d",
        color: "black",
      },
    });
  };

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
    dispatch(updateTasks(newBoardData));
    dispatch(updateCloud(user?.uid));
  };

  const onAddTask = (): void => {
    if (canAddMoreTask) {
      if (user) {
        setIsAddModal(true);
        setMenuOpen(true);
      } else {
        if (Object.keys(boardData.items).length < 5) {
          setIsAddModal(true);
          setMenuOpen(true);
        } else {
          notify("Please login to add more tasks");
        }
      }
    } else {
      // notify("Please clear your backlog");
    }
    setRun(false);
    setStepIndex(1);
    setTimeout(() => setRun(true), 400);
  };

  const onRemoveTask = (
    type: string,
    id: string,
    tag?: string | null
  ): void => {
    setIsDeleteModal(true);
    setDeleteTask({ type, id, tag });
    if (doNotShowAgainDeleteModal) {
      handleRemove(type, id, tag);
    }
  };

  const onEditTask = (type: string, id: string, task: string): void => {
    setIsEditModal(true);
    setEditInfo({ id, type, task });
  };

  const onEditUpdate = (id: string, task: string): void => {
    dispatch(editTask({ id, task }));
    dispatch(updateCloud(user?.uid));
    let newBoardData = cloneDeep(boardData);
    newBoardData["items"][id].task = task;
    setBoardData(newBoardData);
  };

  const removeBoardTask = (type: string, id: string): void => {
    let index = -1;
    switch (type) {
      case "do-first":
        index = boardData["do-first"].ids.indexOf(id);
        boardData["do-first"].ids.splice(index, 1);
        break;
      case "do-later":
        index = boardData["do-later"].ids.indexOf(id);
        boardData["do-later"].ids.splice(index, 1);
        break;
      case "delegate":
        index = boardData["delegate"].ids.indexOf(id);
        boardData["delegate"].ids.splice(index, 1);
        break;
      case "eliminate":
        index = boardData["eliminate"].ids.indexOf(id);
        boardData["eliminate"].ids.splice(index, 1);
        break;
    }
  };

  const onFilter = useCallback((ids: Array<string>): void => {
    let newBoardData = cloneDeep(boardData);
    const doFirstFilter = [...newBoardData["do-first"].ids];
    const doLaterFilter = [...newBoardData["do-later"].ids];
    const delegateFilter = [...newBoardData["delegate"].ids];
    const eliminateFilter = [...newBoardData["eliminate"].ids];
    newBoardData["do-first"].ids = ids.filter((_id) =>
      doFirstFilter?.includes(_id)
    );
    newBoardData["do-later"].ids = ids.filter((_id) =>
      doLaterFilter?.includes(_id)
    );
    newBoardData["delegate"].ids = ids.filter((_id) =>
      delegateFilter?.includes(_id)
    );
    newBoardData["eliminate"].ids = ids.filter((_id) =>
      eliminateFilter?.includes(_id)
    );
    setBoardData(newBoardData);
    setIsFilter(false);
  }, [boardData]);


  useLayoutEffect(() => {
    if (isFilter) {
      onFilter(filterIds);
    }
  }, [isFilter, filterIds, onFilter]);

  const onDeleteDismiss = (): void => {
    setIsDeleteModal(false);
  };

  const onEditDismiss = (): void => {
    setIsEditModal(false);
  };

  const onRemove = (): void => {
    dispatch(
      removeTask({
        type: deleteTask?.type,
        id: deleteTask?.id,
        tag: deleteTask?.tag,
      })
    );
    dispatch(updateCloud(user?.uid));
    if (isFilter) {
      removeBoardTask(deleteTask.type, deleteTask.id);
    }
    onDeleteDismiss();
  };

  const handleRemove = (
    type: string,
    id: string,
    tag?: string | null
  ): void => {
    dispatch(
      removeTask({
        type: type,
        id: id,
        tag: tag,
      })
    );
    dispatch(updateCloud(user?.uid));
    if (isFilter) {
      removeBoardTask(type, id);
    }
    onDeleteDismiss();
  };

  const onStatusUpdate = (id: string, status: string) => {
    dispatch(completeTask({ status, id }));
    dispatch(updateCloud(user?.uid));
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      setRun(false);
      setStepIndex(0);

      // marking the onboaring tour steps status flag as completed (becuase at this point the user has seen the all the onbaoring tour steps)
      localStorage.setItem("hasSeenSteps", JSON.stringify(true));

      if (user) {
        dispatch(completeTutorial(user?.uid));
        dispatch(completeOnboarding(user?.uid));
      }
    } else if (
      ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)
    ) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

      if (menuOpen && index === 0) {
        setTimeout(() => {
          setRun(true);
        }, 400);
      } else if (menuOpen && index === 1) {
        setRun(false);
        setMenuOpen(false);
        setStepIndex(nextStepIndex);
        setTimeout(() => {
          setRun(true);
        }, 400);
      } else if (index === 2 && action === ACTIONS.PREV) {
        setRun(false);
        setMenuOpen(true);
        setStepIndex(nextStepIndex);

        setTimeout(() => {
          setRun(true);
        }, 400);
      } else {
        // Update state to advance the tour
        setMenuOpen(false);
        setStepIndex(nextStepIndex);
      }
    }
  };

  const handleAddTask = (title: string, task: string) => {
    dispatch(addTask({ title, id: uuidv4(), task }));
    dispatch(updateCloud(user?.uid));
    setIsAddModal(false);
    setRun(false);
    setStepIndex(3);
    setTimeout(() => setRun(true), 400);
  };

  const onNextIndex = () => {
    setRun(false);
    setStepIndex(2);
    setTimeout(() => setRun(true), 400);
  };

  const handleDeleteModalCheckbox = (isCheck: boolean) => {
    dispatch(setIsDoNotShowAgainDeleteModal(isCheck));
  };

  const onTaskFocus = (): void => {
    dispatch(setIsWorkspaceNameEdit(true));
  };

  const onTaskBlur = (): void => {
    dispatch(setIsWorkspaceNameEdit(false));
    if (userIsPremium) {
      dispatch(updateTitleName(editTitle));
    }
  };

  const onTaskInput = (value: string | null, type: string): void => {
    setEditTitle({ name: value, type });
  };

  if (isDeviceExceed) {
    navigate(`${APP_PREFIX_PATH}/device-login-limit`);
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
      <Joyride
        continuous
        scrollToFirstStep
        showProgress
        showSkipButton
        steps={steps}
        callback={handleJoyrideCallback}
        stepIndex={stepIndex}
        run={!isUserFirstTime}
      />
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
              isUserPremium={userIsPremium}
            />
            <DoLater
              data={boardData}
              onRemove={onRemoveTask}
              onEdit={onEditTask}
              onStatusUpdate={onStatusUpdate}
              onTaskFocus={onTaskFocus}
              onTaskBlur={onTaskBlur}
              onTaskInput={onTaskInput}
              isUserPremium={userIsPremium}
            />
          </div>
          <AddButton onClick={onAddTask} />
          <div className="grid grid-cols-2 h-half">
            <Delegate
              data={boardData}
              onRemove={onRemoveTask}
              onEdit={onEditTask}
              onStatusUpdate={onStatusUpdate}
              onTaskFocus={onTaskFocus}
              onTaskBlur={onTaskBlur}
              onTaskInput={onTaskInput}
              isUserPremium={userIsPremium}
            />
            <Eliminate
              data={boardData}
              onRemove={onRemoveTask}
              onEdit={onEditTask}
              onStatusUpdate={onStatusUpdate}
              onTaskFocus={onTaskFocus}
              onTaskBlur={onTaskBlur}
              onTaskInput={onTaskInput}
              isUserPremium={userIsPremium}
            />
          </div>
          {!isEditModal && (
            <AddModal
              isAddModalVisible={isAddModal}
              onCancel={() => setIsAddModal(false)}
              onShow={onAddTask}
              handleAddTask={handleAddTask}
              onNextIndex={onNextIndex}
            />
          )}
          {!doNotShowAgainDeleteModal && (
            <DeleteModal
              isDeleteModalVisible={isDeleteModal}
              onDeleteDismiss={onDeleteDismiss}
              onRemove={onRemove}
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

export default memo(ProdHome);
