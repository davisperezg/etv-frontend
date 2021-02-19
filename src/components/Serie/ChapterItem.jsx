import React from "react";
import moment from "moment";
import * as serieService from "./SerieService";
import "moment/locale/es";
moment.locale("es");

export const ChapterItem = ({
  chapter,
  getListChapters,
  setMostrarRegistroChapter,
  getChapterId,
  //openModalCapitulos,
}) => {
  const desactivate = async (id, season) => {
    await serieService.desactivarChapter(id);
    getListChapters(season);
  };

  const activate = async (id, season) => {
    await serieService.activarChapter(id);
    getListChapters(season);
  };

  return (
    <>
      <tr key={chapter._id}>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-gray-900 whitespace-no-wrap">{chapter.name}</p>
            </div>
          </div>
        </td>

        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {chapter.season.name}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {chapter.duration}min
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">{chapter.web}</p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">{chapter.server}</p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
            {chapter.state === 1 ? (
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
          {chapter.state === 1 ? (
            <>
              <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                <span
                  className="relative cursor-pointer"
                  onClick={() => {
                    desactivate(chapter._id, chapter.season._id);
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
                    activate(chapter._id, chapter.season._id);
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
                getChapterId(chapter._id);
                setMostrarRegistroChapter(true);
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
