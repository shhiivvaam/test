import React, { ReactNode } from 'react';

type ModalProps = {
  children: ReactNode;
  isModalVisible: boolean;
};

const Modal = ({ children, isModalVisible = false }: ModalProps) => {

  return (
    <div
      className={`${isModalVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } transition-opacity duration-300 ease-in-out flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-modal-background`}
    >
      <div className="relative w-full md:w-1/3 my-6 mx-5">
        <div className="border-0 rounded-md shadow-md relative flex flex-col w-full bg-white dark:bg-dark outline-none focus:outline-none animate__animated animate__zoomIn animate__fast">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
