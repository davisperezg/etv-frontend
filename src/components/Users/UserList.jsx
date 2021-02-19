import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import { getUsers, getUser, newUser, updateUser } from "../Users/UserService";
import { getPlans } from "../Plan/PlanService";
import { getRoles } from "../Role/RoleService";
import { RoleItem } from "../Role/RoleItem";
import { UserItem } from "./UserItem";
import { AlertError, AlertSuccess } from "../lib/Alert";
import { PlanItem } from "../Plan/PlanItem.jsx";
import { StatusContext } from "../Context/Components";
import moment from "moment";
import "moment/locale/es"; // without this line it didn't work
import "moment-duration-format";
moment.locale("es");
//import Autocomplete from "react-autocomplete"
/*
 * top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)", 
 */
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("body");

export const UserList = ({ calcularCantidad }) => {
  const initialValue = {
    username: "",
    password: "",
    role: "default",
    timeExpiration: "default",
    cantOrtorgada: 10,
    celular: "",
  };
  const initialValueMessage = {
    error: false,
    success: false,
    title: "",
    message: "",
  };
  const [modalIsOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(initialValue);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [plans, setPlans] = useState([]);
  const { data, setData } = useContext(StatusContext);
  const [message, setMessage] = useState(initialValueMessage);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const getListUsers = async () => {
    const res = await getUsers();
    setUsers(res.data);
    setTotalUsuarios(res.data.length);
  };

  const getListRoles = async () => {
    const res = await getRoles();
    setRoles(res.data);
  };

  const getListPlans = async () => {
    const res = await getPlans();
    setPlans(res.data);
  };

  const getUserId = async (id) => {
    const res = await getUser(id);
    let ini = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    let fin = moment(res.data.terminaPlan).format("YYYY-DD-MM HH:mm:ss");
    if (moment(ini).isSameOrBefore(fin)) {
      setDisabled(true);
    }
    setUser({
      ...res.data,
      role: res.data.role.name,
      timeExpiration: res.data.timeExpiration.name,
    });
  };
  const onKeyUpValue = async (e) => {
    const { value } = e.target;
    const res = await getUsers();
    //console.log(res.data[0].role.name);
    const buscarUsuarios = res.data.filter((usuario) =>
      data.acceso === 3 || data.acceso === 4
        ? usuario.role.name === "Owner"
          ? ""
          : String(usuario.username).toLowerCase().indexOf(value) >= 0 ||
            String(usuario.username).toUpperCase().indexOf(value) >= 0 ||
            String(usuario.role.name.toLowerCase()).indexOf(value) >= 0 ||
            String(usuario.role.name.toUpperCase()).indexOf(value) >= 0 ||
            String(usuario.timeExpiration.name.toLowerCase()).indexOf(value) >=
              0 ||
            String(usuario.timeExpiration.name.toUpperCase()).indexOf(value) >=
              0 ||
            String(usuario.state).toLowerCase().indexOf(value) >= 0 ||
            String(usuario.state).toUpperCase().indexOf(value) >= 0 ||
            String(usuario.ide.username.toLowerCase()).indexOf(value) >= 0 ||
            String(usuario.ide.username.toUpperCase()).indexOf(value) >= 0
        : String(usuario.username).toLowerCase().indexOf(value) >= 0 ||
          String(usuario.username).toUpperCase().indexOf(value) >= 0 ||
          String(usuario.role.name.toLowerCase()).indexOf(value) >= 0 ||
          String(usuario.role.name.toUpperCase()).indexOf(value) >= 0 ||
          String(usuario.timeExpiration.name.toLowerCase()).indexOf(value) >=
            0 ||
          String(usuario.timeExpiration.name.toUpperCase()).indexOf(value) >=
            0 ||
          String(usuario.state).toLowerCase().indexOf(value) >= 0 ||
          String(usuario.state).toUpperCase().indexOf(value) >= 0
    );

    const cantidadUsuarios = buscarUsuarios.length;
    setTotalUsuarios(cantidadUsuarios);
    if (cantidadUsuarios.length === 0) {
      console.log("Buscando alumnos...");
    } else {
      setUsers(buscarUsuarios);
    }
  };

  function openModal() {
    setIsOpen(true);
  }

  function opeMondalId(id) {
    getUserId(id);

    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setUser(initialValue);
    setMessage(initialValueMessage);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user._id) {
      try {
        await updateUser(user._id, user);
        getListUsers();
        calcularCantidad();
        setMessage({
          success: true,
          title: "ÉXITO",
          message: "Usuario actualizado",
        });
      } catch (e) {
        console.log(e.request);
        const error = e.request;
        if (error.status === 401) {
          setMessage({
            error: true,
            title: "ERROR",
            message: "No autorizado",
          });
          return;
        }
        setMessage({
          error: true,
          title: "ERROR",
          message: JSON.parse(e.request.response),
        });
      }
    } else {
      try {
        await newUser(user);
        setUser(initialValue);
        getListUsers();
        calcularCantidad();
        setMessage({
          success: true,
          title: "ÉXITO",
          message: "Usuario creado",
        });
      } catch (e) {
        const error = JSON.parse(e.request.response);
        //console.log(error.errors);
        if (e.request.response === "Unauthorized") {
          setMessage({
            error: true,
            title: "ERROR",
            message: "No autorizado. Recargue la página",
          });
          return;
        }

        if (error.errors) {
          if (error.errors.celular) {
            setMessage({
              error: true,
              title: "ERROR",
              message: error.errors.celular.message,
            });
          }
          if (error.errors.username) {
            setMessage({
              error: true,
              title: "ERROR",
              message: error.errors.username.message,
            });
          }
          return;
        }
        //if(e.request.error.path)
        setMessage({
          error: true,
          title: "ERROR",
          message: JSON.parse(e.request.response),
        });
      }
    }
  };

  useEffect(() => {
    getListUsers();
    getListRoles();
    getListPlans();
  }, []);

  return (
    <div className="px-4 sm:px-8">
      <div className="py-8">
        <div>
          <h2 className="text-2xl font-semibold leading-tight">Usuarios</h2>
        </div>
        <div>
          Busca usuarios por username, rol, plan, estado(1:activo, 2:inactivo){" "}
          {data.acceso === 3 || data.acceso === 4 ? "o registrador" : ""}
        </div>
        <div className="my-2 sm:flex-row flex flex-row">
          <div className="relative">
            <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-current text-gray-500"
              >
                <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"></path>
              </svg>
            </span>
            <input
              onKeyUp={onKeyUpValue}
              placeholder="Buscar"
              className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
            />
          </div>
        </div>
        <span>{totalUsuarios} Usuarios</span>
        <div className="flex flex-row-reverse">
          <button
            onClick={openModal}
            type="button"
            className="border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
          >
            Registrar
          </button>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Pelicula"
            shouldCloseOnOverlayClick={false}
          >
            {user._id ? (
              <>
                <div className="flex items-center space-x-5">
                  <div className="h-14 w-14 bg-yellow-200 rounded-full flex flex-shrink-0 justify-center items-center text-yellow-500 text-2xl font-mono">
                    i
                  </div>
                  <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                    <h2 className="leading-relaxed">Actualizar usuario</h2>
                    <p className="text-sm text-gray-500 font-normal leading-relaxed">
                      Actualizar usuario.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-5">
                  <div className="h-14 w-14 bg-green-200 rounded-full flex flex-shrink-0 justify-center items-center text-green-500 text-2xl font-mono">
                    <svg
                      className="w-6 h-6 "
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                    <h2 className="leading-relaxed">Registrar usuario</h2>
                    <p className="text-sm text-gray-500 font-normal leading-relaxed">
                      Registrar usuario.
                    </p>
                  </div>
                </div>
              </>
            )}
            <br />
            {message.error ? <AlertError message={message} /> : ""}
            {message.success ? <AlertSuccess message={message} /> : ""}
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <form onSubmit={handleSubmit}>
                  <div className="-mx-3 flex mb-6">
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                      <label className="leading-loose">Username</label>
                      {user._id ? (
                        <>
                          <input
                            disabled={true}
                            onChange={handleInputChange}
                            name="username"
                            value={user.username}
                            type="text"
                            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                            placeholder="Username"
                          />
                        </>
                      ) : (
                        <>
                          <input
                            onChange={handleInputChange}
                            name="username"
                            value={user.username}
                            type="text"
                            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                            placeholder="Username"
                          />
                        </>
                      )}
                    </div>
                    <div className="md:w-1/2 px-3">
                      <label className="leading-loose">Password</label>
                      <input
                        onChange={handleInputChange}
                        name="password"
                        value={user.password}
                        type="text"
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        placeholder="Password"
                      />
                    </div>
                    <div className="md:w-1/2 px-3">
                      <label className="leading-loose">Celular</label>
                      <input
                        onChange={handleInputChange}
                        name="celular"
                        value={user.celular}
                        type="text"
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        placeholder="Celular de contacto"
                      />
                    </div>
                  </div>
                  <div className="-mx-3 flex mb-6">
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                      <label className="leading-loose">Rol</label>
                      {/* INICIA EL DIV PARA ROLES */}
                      <div className="flex flex-col">
                        <div className="w-full flex flex-col items-center">
                          <div className="w-full">
                            <div className="flex flex-col items-center relative">
                              <div className="w-full">
                                <div className="p-1 bg-white flex border border-gray-200 rounded">
                                  <select
                                    className="w-full outline-none"
                                    name="role"
                                    value={user.role}
                                    onChange={handleSelectChange}
                                  >
                                    <option value="default" disabled={true}>
                                      [SELECCIONE UNA OPCIÓN]
                                    </option>
                                    {roles.map((role) => (
                                      <RoleItem key={role._id} role={role} />
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* FIN DIV PARA ROLES */}
                    </div>
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                      <label className="leading-loose">Plan</label>
                      {/* INICIA EL DIV PARA PLANES */}
                      <div className="flex flex-col">
                        <div className="w-full flex flex-col items-center">
                          <div className="w-full">
                            <div className="flex flex-col items-center relative">
                              <div className="w-full">
                                <div className="p-1 bg-white flex border border-gray-200 rounded">
                                  <select
                                    className="w-full outline-none"
                                    name="timeExpiration"
                                    value={user.timeExpiration}
                                    onChange={handleSelectChange}
                                    disabled={disabled}
                                  >
                                    <option value="default" disabled={true}>
                                      [SELECCIONE UNA OPCIÓN]
                                    </option>
                                    {plans.map((plan) => (
                                      <PlanItem key={plan._id} plan={plan} />
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* FIN DIV PARA PLANES */}
                    </div>
                    {user.role === "Usuario" ||
                    user.role === "Administrador" ||
                    user.role === "Owner" ||
                    user.role === "default" ? (
                      ""
                    ) : (
                      <>
                        {data.acceso === 3 || data.acceso === 4 ? (
                          <>
                            {user._id ? (
                              <>
                                <div className="md:w-1/2 px-3">
                                  <label className="leading-loose">
                                    Aumentar nueva cantidad de usuarios
                                  </label>
                                  <input
                                    onChange={handleInputChange}
                                    name="cantOrtorgada"
                                    value={user.cantOrtorgada}
                                    type="text"
                                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                                    placeholder="Nueva cantidad"
                                  />
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="md:w-1/2 px-3">
                                  <label className="leading-loose">
                                    Cantidad de usuarios
                                  </label>
                                  <input
                                    onChange={handleInputChange}
                                    name="cantOrtorgada"
                                    value={user.cantOrtorgada}
                                    type="text"
                                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                                    placeholder="Cantidad de usuarios"
                                  />
                                </div>
                              </>
                            )}
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                  </div>
                  <div className="pt-4 flex items-center space-x-4">
                    <button
                      onClick={closeModal}
                      className="flex justify-center items-center w-full text-gray-900 px-4 py-3 rounded-md focus:outline-none"
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
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>{" "}
                      Cancelar
                    </button>
                    {user._id ? (
                      <>
                        <button
                          type="submit"
                          className="bg-red-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                        >
                          Actualizar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="submit"
                          className="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                        >
                          Registrar
                        </button>
                      </>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </Modal>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Usuarios asignados
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Por asignar
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Inicia
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Termina
                  </th>
                  {data.acceso === 3 || data.acceso === 4 ? (
                    <>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Registrador
                      </th>
                    </>
                  ) : (
                    <></>
                  )}
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Resta
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Conectados
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                <>
                  {users.map((user) => (
                    <UserItem
                      getListUsers={getListUsers}
                      key={user._id}
                      user={user}
                      users={getListUsers}
                      modal={opeMondalId}
                      calcularCantidad={calcularCantidad}
                    />
                  ))}
                </>
              </tbody>
            </table>
            {/**
               * <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
              <span className="text-xs xs:text-sm text-gray-900">
                Showing 1 to 4 of 50 Entries
              </span>
              <div className="inline-flex mt-2 xs:mt-0">
                <button className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l">
                  Prev
                </button>
                <button className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r">
                  Next
                </button>
              </div>
            </div>
               */}
          </div>
        </div>
      </div>
    </div>
  );
};
