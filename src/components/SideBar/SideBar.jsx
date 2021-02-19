import React, { useContext, useState } from "react";
import { StatusContext } from "../Context/Components";
import { FaUsers } from "react-icons/fa";
import { BiCameraMovie, BiMovie } from "react-icons/bi";
import { CgLogOut } from "react-icons/cg";
import { deleteToken } from "../SessionStorage/Token";
import { disconnectDevice } from "../Login/LoginService";
import { LoginForm } from "../Login/LoginForm";

export const SideBar = () => {
  const { setUsuario, setVideo, setSerie } = useContext(StatusContext);
  const { data } = useContext(StatusContext);
  const [close, setClose] = useState(false);

  const logout = async () => {
    await disconnectDevice();
    deleteToken("token");
    deleteToken("refreshToken");
    deleteToken("username");
    setClose(true);
  };

  return (
    <>
      {close ? (
        <>
          <LoginForm />
        </>
      ) : (
        <>
          <aside className="sm:h-full sm:w-16 w-full h-12 bg-gray-800 text-gray-200">
            <ul className="text-center flex flex-row sm:flex-col w-full">
              <li className="h-14 border-b border-gray-900 hidden sm:block">
                <a
                  onClick={() => {
                    setVideo(false);
                    setSerie(false);
                    setUsuario(false);
                  }}
                  id="page-icon"
                  className="h-full w-full hover:bg-gray-700 block p-3"
                >
                  <img
                    className="sm:h-auto"
                    style={{ resize: "contain", height: 30, width: 50 }}
                    src="https://images-ethantv.s3-sa-east-1.amazonaws.com/logo/LogoETV.png"
                    alt="ethantv"
                  />
                </a>
              </li>
              <li className="h-14 border-b border-gray-900 hidden sm:block">
                <a
                  id="page-icon"
                  onClick={() => {
                    setVideo(false);
                    setSerie(false);
                    setUsuario(true);
                  }}
                  className="h-full w-full hover:bg-gray-700 block p-3"
                >
                  <FaUsers
                    style={{ fontSize: "30px", display: "inlineBlock" }}
                  />
                </a>
              </li>
              {data.acceso === 3 || data.acceso === 4 ? (
                <>
                  <li
                    className="sm:border-b border-gray-900 flex-1 sm:w-full"
                    title="Peliculas y canales"
                  >
                    <a
                      id="page-icon"
                      onClick={() => {
                        setUsuario(false);
                        setSerie(false);
                        setVideo(true);
                      }}
                      className="h-full w-full hover:bg-gray-700 block p-3"
                    >
                      <BiCameraMovie
                        style={{ fontSize: "30px", display: "inlineBlock" }}
                      />
                    </a>
                  </li>
                  <li
                    className="sm:border-b border-gray-900 flex-1 sm:w-full"
                    title="Series"
                  >
                    <a
                      id="page-icon"
                      onClick={() => {
                        setUsuario(false);
                        setVideo(false);
                        setSerie(true);
                      }}
                      className="h-full w-full hover:bg-gray-700 block p-3"
                    >
                      <BiMovie
                        style={{ fontSize: "30px", display: "inlineBlock" }}
                      />
                    </a>
                  </li>
                </>
              ) : (
                <></>
              )}

              <li
                style={{ width: "64px" }}
                className="sm:border-b border-gray-900 flex-1 absolute bottom-0"
                title="Cerrar sesión"
              >
                <a
                  id="page-icon"
                  onClick={() => {
                    logout();
                  }}
                  className="h-full w-full hover:bg-gray-700 block p-3"
                >
                  <CgLogOut
                    style={{ fontSize: "30px", display: "inlineBlock" }}
                  />
                </a>
              </li>
            </ul>
          </aside>
        </>
      )}
    </>
  );
};
