import React from "react";
import { desaVideo, actiVideo } from "./VideoService";
import moment from "moment";
import "moment/locale/es"; // without this line it didn't work
moment.locale("es");

export const VideoItem = ({ video, videos, modal }) => {
  const desactivate = async (id) => {
    await desaVideo(id);
    videos();
  };

  const activate = async (id) => {
    await actiVideo(id);
    videos();
  };

  return (
    <>
      <tr key={video._id}>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <div className="flex items-center">
            {/*
                       * <div className="flex-shrink-0 w-10 h-10">
                        <img
                          className="w-full h-full rounded-full"
                          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                          alt=""
                        />
                      </div>
                       */}
            <div className="ml-3">
              <p className="text-gray-900 whitespace-no-wrap">{video.title}</p>
            </div>
          </div>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <div className="flex items-center">
            <div className="ml-3">
              <div className="flex relative w-5 h-5 bg-orange-500 justify-center items-center m-1 mr-2 w-4 h-4 mt-1 rounded-full ">
                <img
                  className="rounded-full"
                  alt={video.country ? video.country.name : "null"}
                  src={video.country ? video.country.flag : ""}
                />
              </div>
            </div>
          </div>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">{video.year}</p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {video.genres.map((genre) => genre.name + " ")}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {moment(video.createdAt).format("LLLL")}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
            {video.state === 1 ? (
              <>
                <span
                  aria-hidden
                  className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                />
                <span className="relative">Activo</span>
              </>
            ) : (
              <>
                <span
                  aria-hidden
                  className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
                />
                <span className="relative">Inactivo</span>
              </>
            )}
          </span>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          {video.state === 1 ? (
            <>
              <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                <span
                  className="relative cursor-pointer"
                  onClick={() => {
                    desactivate(video._id);
                  }}
                >
                  <svg
                    className="w-6 h-6 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              </span>
            </>
          ) : (
            <>
              <span className="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                <span
                  className="relative cursor-pointer"
                  onClick={() => {
                    activate(video._id);
                  }}
                >
                  <svg
                    className="w-6 h-6 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </span>
              </span>
            </>
          )}
          <span className="relative inline-block px-3 py-1 font-semibold text-yellow-900 leading-tight">
            <span
              className="relative cursor-pointer"
              onClick={() => {
                modal(video._id);
              }}
            >
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </span>
          </span>
        </td>
      </tr>
    </>
  );
};
