import React, { useContext, useState, useEffect } from "react";
import { StatusContext } from "../Context/Components";
import { VideoList } from "../Video/VideoList";
import { UserList } from "../Users/UserList";
import { getUsers, getUser } from "../Users/UserService";
import { getAllVideos, getVideos } from "../Video/VideoService";
import { SerieList } from "../Serie/SerieList";
import * as serieService from "../Serie/SerieService";

export const Main = () => {
  const { data, usuario, video, serie } = useContext(StatusContext);

  const [distribuidores, setDistribuidores] = useState(0);
  const [usuarios, setUsuarios] = useState(0);
  const [videos, setVideos] = useState(0);
  const [series, setSeries] = useState(0);
  const [activos, setActivos] = useState(0);
  const [inactivos, setInactivos] = useState(0);
  const [asignados, setAsignados] = useState(0);
  const [resta, setResta] = useState(0);

  const calcularCantidad = async () => {
    const resUsers = await getUsers();
    const resUser = await getUser(await data.ide);
    const cantUsu = resUsers.data.filter((usu) => usu.role.name === "Usuario");
    const cantDsitri = resUsers.data.filter(
      (distri) => distri.role.name === "Distribuidor"
    );
    const cantActivos = resUsers.data.filter((activo) => activo.state === 1);
    const cantInactivos = resUsers.data.filter(
      (inactivo) => inactivo.state === 2
    );
    const cantOtorgada = resUser.data.cantOrtorgada || 0;
    const cantSobrante = resUser.data.cantSobrante || 0;
    setActivos(cantActivos.length);
    setInactivos(cantInactivos.length);
    setAsignados(cantOtorgada);
    setResta(cantSobrante);
    setUsuarios(cantUsu.length);
    setDistribuidores(cantDsitri.length);

    //Cantidad de series
    const resSeries = await serieService.getSeries();
    setSeries(resSeries.data.length);

    if (data.acceso === 3 || data.acceso === 4) {
      const resMovies = await getAllVideos();

      const filterMovies = resMovies.data.filter(
        (movie) => movie.typeVideo === "Pelicula"
      );
      setVideos(filterMovies.length);
    } else {
      const resMovies = await getVideos();
      const filterMovies = resMovies.data.filter(
        (movie) => movie.typeVideo === "Pelicula"
      );
      setVideos(filterMovies.length);
    }
  };

  useEffect(() => {
    calcularCantidad();
  }, [data.ide]);

  return (
    <>
      <section className="flex-1 pt-3 md:p-6 lg:mb-0 lg:min-h-0 lg:min-w-0">
        {video ? (
          <>
            <div className="flex flex-col lg:flex-row h-full w-full">
              <div className="border h-full w-full lg:flex-1 px-3 min-h-0 min-w-0">
                <div className="w-full h-full min-h-0 min-w-0 overflow-auto">
                  <VideoList calcularCantidad={calcularCantidad} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {usuario ? (
              <>
                <div className="flex flex-col lg:flex-row h-full w-full">
                  <div className="border h-full w-full lg:flex-1 px-3 min-h-0 min-w-0">
                    <div className="w-full h-full min-h-0 min-w-0 overflow-auto">
                      <UserList calcularCantidad={calcularCantidad} />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {serie ? (
                  <>
                    <div className="flex flex-col lg:flex-row h-full w-full">
                      <div className="border h-full w-full lg:flex-1 px-3 min-h-0 min-w-0">
                        <div className="w-full h-full min-h-0 min-w-0 overflow-auto">
                          <SerieList calcularCantidad={calcularCantidad} />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <section className="py-8 px-4 bg-white">
                      <div className="flex flex-wrap -mx-4">
                        <div className="w-full lg:w-1/4 px-4 mb-4 lg:mb-0">
                          <div className="h-full border rounded shadow">
                            <div className="flex items-center justify-between py-3 px-4 border-b">
                              <h3 className="text-lg font-semibold font-heading">
                                Distribuidores
                              </h3>
                              <span className="py-1 px-3 text-sm text-white font-semibold bg-green-500 rounded-full">
                                Beta
                              </span>
                            </div>
                            <div className="flex flex-col p-4">
                              <h3 className="text-center	text-3xl mb-3 font-semibold font-heading font-semibold">
                                {distribuidores}
                              </h3>
                              {/**<span>Total income</span>
                        <span className="text-green-500">82%</span> */}
                            </div>
                          </div>
                        </div>
                        <div className="w-full lg:w-1/4 px-4 mb-4 lg:mb-0">
                          <div className="h-full border rounded shadow">
                            <div className="flex items-center justify-between px-4 py-3 border-b">
                              <h3 className="text-lg font-semibold font-heading">
                                Usuarios
                              </h3>
                              <span className="py-1 px-3 text-sm text-white font-semibold bg-green-500 rounded-full">
                                Beta
                              </span>
                            </div>
                            <div className="flex flex-col p-4">
                              <h3 className="text-center	 text-3xl mb-3 font-semibold font-heading font-semibold">
                                {usuarios}
                              </h3>
                              {/**<span>New orders</span>
                        <span className="text-green-500">32%</span> */}
                            </div>
                          </div>
                        </div>
                        <div className="w-full lg:w-1/4 px-4 mb-4 lg:mb-0">
                          <div className="h-full border rounded shadow">
                            <div className="flex items-center justify-between px-4 py-3 border-b">
                              <h3 className="text-lg font-semibold font-heading">
                                Peliculas
                              </h3>
                              <span className="py-1 px-3 text-sm text-white font-semibold bg-green-500 rounded-full">
                                Beta
                              </span>
                            </div>
                            <div className="flex flex-col p-4">
                              <h3 className="text-center	 text-3xl mb-3 font-semibold font-heading font-semibold">
                                {videos}
                              </h3>
                              {/**<span>New visits</span>
                        <span className="text-green-500">24%</span> */}
                            </div>
                          </div>
                        </div>
                        <div className="w-full lg:w-1/4 px-4 mb-4 lg:mb-0">
                          <div className="h-full border rounded shadow">
                            <div className="flex items-center justify-between px-4 py-3 border-b">
                              <h3 className="text-lg font-semibold font-heading">
                                Series
                              </h3>
                              <span className="py-1 px-3 text-sm text-white font-semibold bg-green-500 rounded-full">
                                Beta
                              </span>
                            </div>
                            <div className="flex flex-col p-4">
                              <h3 className="text-center	 text-3xl mb-3 font-semibold font-heading font-semibold">
                                {series}
                              </h3>
                              {/**<span>Proximamente</span>
                        <span className="text-red-500">0%</span> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                    <section className="py-8 px-4 bg-white">
                      <div className="flex flex-wrap -mx-4">
                        <div className="w-full lg:w-1/4 px-4 mb-4 lg:mb-0">
                          <div className="h-full border rounded shadow">
                            <div className="flex items-center justify-between py-3 px-4 border-b">
                              <h3 className="text-lg font-semibold font-heading">
                                Activos
                              </h3>
                              <span className="py-1 px-3 text-sm text-white font-semibold bg-green-500 rounded-full">
                                Beta
                              </span>
                            </div>
                            <div className="flex flex-col p-4">
                              <h3 className="text-center	text-3xl mb-3 font-semibold font-heading font-semibold">
                                {activos}
                              </h3>
                              {/**<span>Total income</span>
                        <span className="text-green-500">82%</span> */}
                            </div>
                          </div>
                        </div>
                        <div className="w-full lg:w-1/4 px-4 mb-4 lg:mb-0">
                          <div className="h-full border rounded shadow">
                            <div className="flex items-center justify-between px-4 py-3 border-b">
                              <h3 className="text-lg font-semibold font-heading">
                                Inactivos
                              </h3>
                              <span className="py-1 px-3 text-sm text-white font-semibold bg-green-500 rounded-full">
                                Beta
                              </span>
                            </div>
                            <div className="flex flex-col p-4">
                              <h3 className="text-center	 text-3xl mb-3 font-semibold font-heading font-semibold">
                                {inactivos}
                              </h3>
                              {/**<span>New orders</span>
                        <span className="text-green-500">32%</span> */}
                            </div>
                          </div>
                        </div>
                        <div className="w-full lg:w-1/4 px-4 mb-4 lg:mb-0">
                          <div className="h-full border rounded shadow">
                            <div className="flex items-center justify-between px-4 py-3 border-b">
                              <h3 className="text-lg font-semibold font-heading">
                                Usuarios asignados
                              </h3>
                              <span className="py-1 px-3 text-sm text-white font-semibold bg-green-500 rounded-full">
                                Beta
                              </span>
                            </div>
                            <div className="flex flex-col p-4">
                              <h3 className="text-center	 text-3xl mb-3 font-semibold font-heading font-semibold">
                                {data.acceso === 3 || data.acceso === 4
                                  ? asignados
                                  : "+" + asignados}
                              </h3>
                              {/**<span>New visits</span>
                        <span className="text-green-500">24%</span> */}
                            </div>
                          </div>
                        </div>
                        <div className="w-full lg:w-1/4 px-4 mb-4 lg:mb-0">
                          <div className="h-full border rounded shadow">
                            <div className="flex items-center justify-between px-4 py-3 border-b">
                              <h3 className="text-lg font-semibold font-heading">
                                Usuarios restantes
                              </h3>
                              <span className="py-1 px-3 text-sm text-white font-semibold bg-green-500 rounded-full">
                                Beta
                              </span>
                            </div>
                            <div className="flex flex-col p-4">
                              <h3 className="text-center	 text-3xl mb-3 font-semibold font-heading font-semibold">
                                {resta}
                              </h3>
                              {/**<span>Proximamente</span>
                        <span className="text-red-500">0%</span> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </>
                )}
              </>
            )}
          </>
        )}
      </section>
    </>
  );
};
