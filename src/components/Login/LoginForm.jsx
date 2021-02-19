import React, { useState } from "react";
import { AlertError, AlertSuccess } from "../lib/Alert";
import { setToken } from "../SessionStorage/Token";
import { postLogin, disconnectDevice } from "./LoginService";
import { getData } from "../Users/UserService";
import { FaUserAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
export const LoginForm = () => {
  const initialValueMessage = {
    error: false,
    success: false,
    title: "",
    message: "",
  };
  const [message, setMessage] = useState(initialValueMessage);

  const [login, setLogin] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async () => {
    try {
      const res = await postLogin(login.username, login.password);
      setToken("token", res.data.token);
      setToken("refreshToken", res.data.refreshToken);
      const resTest = await getData();
      if (resTest.data.nivel === 1) {
        await disconnectDevice();
        setMessage({
          error: true,
          title: "UPS",
          message: "No tiene acceso",
        });
        return;
      }
      setMessage({
        success: true,
        title: "ÉXITO",
        message: "Bienvenido " + login.username,
      });
      window.location.reload();
    } catch (e) {
      setMessage({
        error: true,
        title: "ERROR",
        message: JSON.parse(e.request.response).message,
      });
    }
  };

  const handleInputChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const runLogin = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      {/* This is an example component */}

      <div
        style={{ left: "0px" }}
        className="flex justify-center items-center top-10 right-0  absolute "
      >
        {message.error ? <AlertError message={message} /> : ""}
        {message.success ? <AlertSuccess message={message} /> : ""}
      </div>
      <div className="w-screen h-screen overflow-hidden flex justify-center items-center bg-white">
        <div className="w-full md:w-3/5 lg:w-2/5">
          <div className="flex justify-center items-center">
            <img
              className="sm:h-auto"
              style={{ resize: "contain", height: 150, width: 200 }}
              src="https://images-ethantv.s3-sa-east-1.amazonaws.com/logo/LogoETV.png"
              alt="ethantv"
            />
          </div>
          <div className="flex my-8 mx-4 md:mx-2 border-b-2 border-gray-700 hover:border-green-800">
            <label className="self-center">
              <FaUserAlt />
            </label>
            <input
              className="w-full py-3 pl-5 md:pl-20 border-0 focus:outline-none"
              type="text"
              name="username"
              placeholder="qwerty"
              autoComplete="on"
              required
              onKeyPress={runLogin}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex my-8 mx-4 md:mx-2 border-b-2 border-gray-700 hover:border-green-800">
            <RiLockPasswordFill className="self-center" />
            <input
              className="w-full py-3 pl-2 md:pl-8 border-0 focus:outline-none"
              type="password"
              required
              name="password"
              onKeyPress={runLogin}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};
