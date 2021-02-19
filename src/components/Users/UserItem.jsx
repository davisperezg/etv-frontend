import React, { useContext, useEffect, useState } from "react";
import { desaUser, actiUser } from "./UserService";
import * as userService from "./UserService";
import moment from "moment";
import "moment/locale/es"; // without this line it didn't work
import { StatusContext } from "../Context/Components";
import "moment-duration-format";
moment.locale("es");
export const UserItem = ({
  user,
  users,
  modal,
  calcularCantidad,
  getListUsers,
}) => {
  const { data } = useContext(StatusContext);
  const [time, setTime] = useState("");

  const desactivate = async (id) => {
    await desaUser(id);
    users();
    calcularCantidad();
  };

  const activate = async (id) => {
    await actiUser(id);
    users();
    calcularCantidad();
  };

  const calculaDiferenciaDias = async () => {
    if (user.terminaPlan) {
      let ini = moment().format("YYYY-MM-DD HH:mm:ss");
      let fin = moment(user.terminaPlan).format("YYYY-MM-DD HH:mm:ss");

      if (moment(ini).isSameOrAfter(fin)) {
        //await userService.desaUser(user._id);
        //getListUsers();
        //calcularCantidad();
        setTime("Culminado");
        return;
      }
      let fecha1 = moment(ini);
      let fecha2 = moment(fin);
      let duration = moment.duration(fecha2.diff(fecha1));
      setTime(duration.format("D[d], H[h] m[m] s[s]"));
    }
  };

  useEffect(() => {
    const interval = setInterval(calculaDiferenciaDias, 1000);
    return () => clearInterval(interval);
  }, []);

  //console.log();
  return (
    <>
      <tr key={user._id}>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-gray-900 whitespace-no-wrap">
                {user.username}
              </p>
            </div>
          </div>
        </td>

        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {user.role.name} - {user.celular ? user.celular : "Ninguno"}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {user.cantOrtorgada ? user.cantOrtorgada : "Ninguno"}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {user.cantSobrante ? user.cantSobrante : "Ninguno"}
          </p>
        </td>
        <td className="py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {/**{moment(user.createdAt).format("LLLL")} */}
            {user.iniciaPlan
              ? moment(user.iniciaPlan).format("DD-MM-YYYY HH:mm:ss")
              : "Ninguno"}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {user.terminaPlan
              ? moment(user.terminaPlan).format("DD-MM-YYYY HH:mm:ss")
              : "Ninguno"}
          </p>
        </td>
        {data.acceso === 4 || data.acceso === 3 ? (
          <>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p className="text-gray-900 whitespace-no-wrap">
                {user.ide ? (
                  data.username === user.ide.username ? (
                    <span className="font-semibold text-blue-900">YO</span>
                  ) : (
                    user.ide.username
                  )
                ) : (
                  "Ninguno"
                )}
              </p>
            </td>
          </>
        ) : (
          <></>
        )}
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {user.timeExpiration ? user.timeExpiration.name : "Ninguno"}
          </p>
        </td>

        <td className="py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {user.timeExpiration ? time : "Ninguno"}
          </p>
        </td>
        {/*{user.contAccess} */}
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <div>
            {user.contAccess === 0 ? (
              "No conectado"
            ) : user.contAccess === 1 ? (
              <div className="w-4 h-4 bg-green-600 rounded-2xl float-left" />
            ) : user.contAccess === 2 ? (
              <>
                <div className="w-4 h-4 bg-green-600 rounded-2xl float-left" />
                <div className="w-4 h-4 bg-green-600 rounded-2xl float-left ml-2" />
              </>
            ) : user.contAccess === 3 ? (
              <>
                <div className="w-4 h-4 bg-green-600 rounded-2xl float-left" />
                <div className="w-4 h-4 bg-green-600 rounded-2xl float-left ml-2" />
                <div className="w-4 h-4 bg-green-600 rounded-2xl float-left ml-2" />
              </>
            ) : (
              "Ninguno"
            )}
          </div>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
            {user.state === 1 ? (
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
          {data.acceso === 4 && user.role.name === "Owner" ? (
            <></>
          ) : (
            <>
              {user.state === 1 ? (
                <>
                  <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                    <span
                      className="relative cursor-pointer"
                      onClick={() => {
                        desactivate(user._id);
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
                        activate(user._id);
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
              )}{" "}
              <span className="relative inline-block px-3 py-1 font-semibold text-yellow-900 leading-tight">
                <span
                  className="relative cursor-pointer"
                  onClick={() => {
                    modal(user._id);
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
            </>
          )}{" "}
        </td>
      </tr>
    </>
  );
};
