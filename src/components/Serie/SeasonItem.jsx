import React from "react";
import moment from "moment";
import * as serieService from "./SerieService";
import "moment/locale/es";
moment.locale("es");

export const SeasonItem = ({
  season,
  getListSeason,
  setMostrarRegistroSeason,
  getSeasonId,
  openModalCapitulos,
  getListChapters,
}) => {
  const desactivate = async (id, serie) => {
    await serieService.desactivarSeason(id);
    getListSeason(serie);
  };

  const activate = async (id, serie) => {
    await serieService.activarSeason(id);
    getListSeason(serie);
  };

  return (
    <>
      <tr key={season._id}>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-gray-900 whitespace-no-wrap">{season.name}</p>
            </div>
          </div>
        </td>

        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {season.serie.title}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {moment(season.createdAt).format("LLLL")}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
            {season.state === 1 ? (
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
          {season.state === 1 ? (
            <>
              <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                <span
                  className="relative cursor-pointer"
                  onClick={() => {
                    desactivate(season._id, season.serie._id);
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
                    activate(season._id, season.serie._id);
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
                getSeasonId(season._id);
                setMostrarRegistroSeason(true);
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
          <span className="relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight">
            <span
              className="relative cursor-pointer"
              onClick={() => {
                getListChapters(season._id);
                openModalCapitulos();
              }}
            >
              + Series
            </span>
          </span>
        </td>
      </tr>
    </>
  );
};
