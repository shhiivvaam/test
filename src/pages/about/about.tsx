import React from "react";

const About = () => {
  return (
    <div className="w-full h-screen relative">
      <div className="flex w-full h-96 flex-col md:flex-row">
        <div className="font-poppins-bold dark:bg-dark dark:border-dark-gray text-3xl w-full md:flex items-center justify-center md:w-1/2 hidden border-0 border-black border-t-[1px] border-r-[1px] border-b-[1px]">
          <span className="dark:text-white animate__animated animate__slideInLeft">
            What is <br /> Supertasks.io?
          </span>
        </div>
        <div className="md:hidden w-full border-b-[1px] border-t-[1px] border-0 border-black dark:bg-dark dark:border-dark-gray py-3">
          <span className="font-poppins-bold text-xl flex items-center justify-center dark:text-white animate__animated animate__slideInLeft">
            What is Supertasks.io?
          </span>
        </div>
        <div className="relative dark:bg-dark dark:border-dark-gray flex h-full w-full md:w-1/2 items-center justify-center font-poppins-regular flex-col border-0 border-black md:border-t-[1px]">
          <span className="absolute top-5 right-5 text-xs text-do-later bg-do-later-alpha px-3 py-2 rounded-md animate__animated animate__bounceIn">About</span>
          <div className="flex flex-col space-y-7">
            <span className="md:text-xl text-do-first bg-do-first-alpha px-3 py-2 rounded-md animate__animated animate__zoomIn animate_fast">
              Simple.
            </span>
            <span className="md:text-xl text-do-later bg-do-later-alpha px-3 py-2 rounded-md animate__animated animate__zoomIn">
              Minimal.
            </span>
            <span className="md:text-xl text-delegate bg-delegate-alpha px-3 py-2 rounded-md animate__animated animate__zoomIn animate__slow">
              Tool.
            </span>
          </div>
        </div>
      </div>
      <div className="flex w-full h-96 flex-col md:flex-row dark:bg-dark">
        <div className="md:hidden w-full dark:border-dark-gray border-b-[1px] border-t-[1px] border-0 border-black py-3">
          <span className="font-poppins-bold text-xl flex items-center justify-center dark:text-white animate__animated animate__slideInRight">
            Why did we built Supertasks.io?
          </span>
        </div>
        <div className="w-full flex items-start md:w-1/2 pt-7 pl-5 flex-col dark:bg-dark dark:border-dark-gray">
          <span className="md:text-xl text-eliminate bg-eliminate-alpha px-3 py-2 rounded-md font-poppins-medium animate__animated animate__bounceIn">
            Attention!
          </span>
          <div className="self-center animate__animated">
            <p className="font-poppins-medium mt-11 mb-3 dark:text-white animate__animated animate__slideInLeft">
              To make people buy subscriptions for our
            </p>
            <span className=" animate__animated animate__bounceIn text-xs text-do-later bg-do-later-alpha px-3 py-2 rounded-md">
              Quick decision making tool
            </span>
          </div>
        </div>
        <div className="hidden font-poppins-bold text-3xl relative md:flex h-full w-1/2 items-center justify-center border-0 border-black border-t-[1px] border-l-[1px] border-b-[1px] dark:bg-dark dark:border-dark-gray">
          <span className="dark:text-white animate__animated animate__slideInRight">
            Why did <br /> we built <br /> Supertasks.io?
          </span>
        </div>
      </div>
      <div className="flex w-full h-96 flex-col md:flex-row dark:bg-dark">
        <div className="md:hidden w-full dark:border-dark-gray border-b-[1px] border-t-[1px] border-0 border-black py-3">
          <span className="font-poppins-bold text-xl flex items-center justify-center dark:text-white">
            Who are we?
          </span>
        </div>
        <div className="font-poppins-bold dark:bg-dark border-b-[1px] dark:border-dark-gray text-3xl w-full md:flex items-center justify-center md:w-1/2 hidden border-0 border-black border-t-[1px] border-r-[1px]">
          <span className="dark:text-white">Who are we?</span>
        </div>
        <div className="w-full flex items-end md:w-1/2 pt-7 pr-5 flex-col dark:bg-dark dark:border-dark-gray">
          <span className="md:text-xl text-do-first bg-do-first-alpha px-3 py-2 rounded-md font-poppins-medium">
            Awe.
          </span>
          <div className="self-center dark:text-white">
            <p className="font-poppins-medium mt-11 mb-3 text-md">Two rivals</p>
            <p className="font-poppins-medium mb-3 text-lg">
              Who became friends
            </p>
            <p className="font-poppins-medium text-xl mb-3">
              Soon started a company
            </p>
            <a
              href="https://www.cliqueraft.com/"
              rel="noreferrer"
              target="_blank"
              className="font-poppins-bold underline text-2xl text-company bg-company-alpha px-3 py-2 rounded-md cursor-pointer"
            >
              Cliqueraft
            </a>
          </div>
        </div>
      </div>
      <div className="flex w-full h-96 flex-col md:flex-row dark:bg-dark">
        <div className="md:hidden w-full dark:border-dark-gray border-b-[1px] border-t-[1px] border-0 border-black py-3">
          <span className="font-poppins-bold text-xl flex items-center justify-center dark:text-white">
            What is Cliqueraft?
          </span>
        </div>
        <div className="w-full flex items-start md:w-1/2 pt-7 pl-5 flex-col dark:bg-dark dark:border-dark-gray">
          <span className="md:text-xl text-do-later bg-do-later-alpha px-3 py-2 rounded-md font-poppins-medium">
            {`;)`}
          </span>
          <div className="self-center">
            <p className="font-poppins-medium mt-11 mb-5 dark:text-white">
              It is a <span className="text-do-later bg-do-later-alpha px-3 py-2 rounded-md">SaaS</span> company
            </p>
            <p className="font-poppins-medium dark:text-white">
              building <span className="text-delegate bg-delegate-alpha px-3 py-2 rounded-md">microSaaS</span> products
            </p>
          </div>
        </div>
        <div className="hidden font-poppins-bold text-3xl relative md:flex h-full w-1/2 items-center justify-center border-0 border-black border-t-[1px] border-l-[1px] dark:bg-dark dark:border-dark-gray">
        <div className="self-center">
            <p className="font-poppins-bold mt-11 mb-3 dark:text-white">
              What is
            </p>
            <a
              href="https://www.cliqueraft.com/"
              rel="noreferrer"
              target="_blank"
              className="font-poppins-bold underline text-2xl text-company bg-company-alpha px-3 py-2 rounded-md cursor-pointer"
            >
              Cliqueraft?
            </a>
          </div>
        </div>
      </div>
      <div className="w-full h-12 bg-[#111111] flex justify-center items-center">
        <span className="text-white text-sm font-poppins-light">
          Copyright &#169; 2024 Cliqueraft
        </span>
      </div>
    </div>
  );
};

export default About;
