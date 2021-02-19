import React from "react";
import moment from "moment";
import * as serieService from "./SerieService";
import "moment/locale/es";
moment.locale("es");

export const SerieItem = ({
  serie,
  series,
  modal,
  getListSeason,
  openModalTemporadas,
}) => {
  const desactivate = async (id) => {
    await serieService.desactivarSerie(id);
    series();
  };

  const activate = async (id) => {
    await serieService.activarSerie(id);
    series();
  };

  return (
    <>
      <tr key={serie._id}>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-gray-900 whitespace-no-wrap">{serie.title}</p>
            </div>
          </div>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <div className="flex items-center">
            <div className="ml-3">
              <div className="flex relative w-5 h-5 bg-orange-500 justify-center items-center m-1 mr-2 w-4 h-4 mt-1 rounded-full ">
                <img
                  className="rounded-full"
                  alt={serie.country ? serie.country.name : "null"}
                  src={serie.country ? serie.country.flag : ""}
                />
              </div>
            </div>
          </div>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">{serie.year}</p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {serie.genres.map((genre) => genre.name + " ")}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {moment(serie.createdAt).format("LLLL")}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
            {serie.state === 1 ? (
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
          {serie.state === 1 ? (
            <>
              <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                <span
                  className="relative cursor-pointer"
                  onClick={() => {
                    desactivate(serie._id);
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
                    activate(serie._id);
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
                modal(serie._id);
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
                getListSeason(serie._id);
                openModalTemporadas();
              }}
            >
              + Temporadas
            </span>
          </span>
        </td>
      </tr>
    </>
  );
};
