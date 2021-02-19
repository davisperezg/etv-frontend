import React, { useEffect } from "react";
import { Footer } from "../Footer/Footer";
import { LoginForm } from "../Login/LoginForm";
import { Main } from "../Main/Main";
import { NavBar } from "../NavBar/NavBar";
import { useBeforeunload } from "react-beforeunload";
import { disconnectDevice } from "../Login/LoginService";
import { Beforeunload } from "react-beforeunload";

export const Body = () => {
  const logout = async () => {
    //event.preventDefault();
    await disconnectDevice();
  };

  return (
    <>
      <main className="sm:h-full flex-1 flex flex-col min-h-0 min-w-0 overflow-auto">
        <>
          <Beforeunload onBeforeunload={logout}>
            <NavBar />
            <Main />
            <Footer />
          </Beforeunload>
        </>
      </main>
    </>
  );
};
