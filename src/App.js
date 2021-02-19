import React, { useState, useEffect } from "react";
import { Body } from "./components/Body/Body";
import { StatusProvider } from "./components/Context/Components";
import { LoginForm } from "./components/Login/LoginForm";
import { SideBar } from "./components/SideBar/SideBar";
import {
  deleteToken,
  getToken,
  setToken,
} from "./components/SessionStorage/Token";
import { getData } from "./components/Users/UserService";

function App() {
  const initalData = {
    codigo: "",
    habilitado: "",
    ide: "",
    acceso: "",
    rol: "",
    username: "",
  };

  const [video, setVideo] = useState(false);
  const [usuario, setUsuario] = useState(false);
  const [serie, setSerie] = useState(false);

  const [data, setData] = useState(initalData);

  const verifyLogin = async () => {
    const res = await getData();
    if (res.data.estado === 2) {
      setData({ ...data, habilitado: 2, online: false });
      deleteToken("token");
      deleteToken("refreshToken");
      deleteToken("username");
    }
  };
  const cargaUsuario = async () => {
    try {
      const res = await getData();
      setData({
        codigo: res.data.cod,
        habilitado: res.data.estado === 1 ? "si" : "no",
        ide: res.data.id,
        acceso: res.data.nivel,
        rol: res.data.rol,
        username: res.data.username,
      });
      setToken("username", res.data.username.toLowerCase());
    } catch (e) {
      //await disconnectDevice();
      setData({ ...data });
      deleteToken("token");
      deleteToken("refreshToken");
      deleteToken("username");
    }
  };

  useEffect(() => {
    cargaUsuario();
  }, []);

  if (data.habilitado === "no") {
    return <LoginForm />;
  }

  return (
    <StatusProvider
      value={{
        data,
        setData,
        video,
        setVideo,
        usuario,
        setUsuario,
        serie,
        setSerie,
      }}
    >
      <section
        //onbeforeunload={yamehapasao}
        className="h-screen w-screen bg-gray-200 flex flex-col-reverse sm:flex-row min-h-0 min-w-0 overflow-hidden"
      >
        {getToken() ? (
          <>
            <SideBar />
            <Body />
          </>
        ) : (
          <>
            <LoginForm />
          </>
        )}
      </section>
    </StatusProvider>
  );
}

export default App;
