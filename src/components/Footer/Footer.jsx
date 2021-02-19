import React from "react";

export const Footer = () => {
  return (
    <>
      <footer className="px-6 py-3 border-t flex w-full items-end">
        <p className="text-gray-600">
          developed by{" "}
          <a href="https://quedape.com" target="_blank">
            @quedape
          </a>
        </p>
        {/**
           * <div className="flex-1" />
        <button className="shadow-md ml-auto border rounded-full ml-2 w-14 h-14 text-center leading-none text-green-200 bg-green-600 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent">
          <i className="fas fa-question fill-current" />
        </button>
           */}
      </footer>
    </>
  );
};
