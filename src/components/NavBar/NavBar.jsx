import React, { useContext } from "react";
import { StatusContext } from "../Context/Components";
export const NavBar = () => {
  const { data } = useContext(StatusContext);
  return (
    <>
      <nav className="border-b bg-white px-6 py-2 flex items-center min-w-0 h-14">
        {/**<h1 className="font-semibold text-lg" />
        <span className="flex-1" />
        <span className="mr-2">
          <input
            type="text"
            placeholder="Search"
            className="w-full border-2 px-2 py-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-gray-300 focus:bg-gray-100"
          />
        </span> */}
        <h1 className="font-semibold text-lg" />
        <span className="flex-1" />
        <span className="mr-2">Hola, {data.username}</span>

        <button className="ml-auto border rounded-full ml-2 w-10 h-10 text-center leading-none text-gray-200 bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent">
          <i className="fas fa-user fill-current" />
        </button>
      </nav>
    </>
  );
};
