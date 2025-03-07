import React, { memo, useState } from "react";

import Modal from "../modal/modal";

type DeleteModalProps = {
  isDeleteModalVisible: boolean;
  onDeleteDismiss: () => void;
  onRemove: () => void;
  onCheckChange: (isChecked: boolean) => void;
};

const DeleteModal = ({
  isDeleteModalVisible,
  onDeleteDismiss,
  onRemove,
  onCheckChange,
}: DeleteModalProps) => {

  const [isCheck, setIsCheck] = useState<boolean>(false);

  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsCheck(event.target.checked)
  };

  const handleOnRemove = () => {
    onRemove();
    onCheckChange(isCheck);
  }

  return (
    <>
      <Modal isModalVisible={isDeleteModalVisible}>
        <div className="flex items-start justify-between p-5 rounded-t ">
          <div className="relative w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg">
              <button
                onClick={onDeleteDismiss}
                type="button"
                aria-label="dismiss"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="black"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
              <div className="p-6 text-center">
                <svg
                  aria-hidden="true"
                  className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
                  fill="none"
                  stroke="black"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <h3 className="mb-3 text-lg font-poppins-regular text-black">
                  Are you sure you want to delete this task?
                </h3>
                <div className="flex items-center mb-4 space-x-3">
                  <input
                    id="default-checkbox"
                    type="checkbox"
                    checked={isCheck}
                    onChange={handleCheckChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="default-checkbox"
                    className="ms-2 text-sm font-medium text-gray-900 font-poppins-regular"
                  >
                    Do not show again
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleOnRemove}
                  className="text-black bg-red-600 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2 font-poppins-light"
                >
                  Yes, I'm sure
                </button>
                <button
                  type="button"
                  className="text-black rounded-lg border border-gray-500 text-sm font-medium px-5 py-2.5 font-poppins-light"
                  onClick={onDeleteDismiss}
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default memo(DeleteModal);
