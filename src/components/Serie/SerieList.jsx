import React, { useState, useEffect, useContext } from "react";

import Modal from "react-modal";

import { FiArrowLeft } from "react-icons/fi";

import { GenresItem } from "../Genres/GenresItem";
import { getGenres } from "../Genres/GenresService";
import { getCountrys } from "../Country/CountryService";
import { CountryItem } from "../Country/CountryItem";
import { AlertError, AlertSuccess } from "../lib/Alert";
import { StatusContext } from "../Context/Components";

import * as serieService from "./SerieService";
import * as videoService from "../Video/VideoService";
import { SerieItem } from "./SerieItem";
import { SeasonItem } from "./SeasonItem";
import { ChapterItem } from "./ChapterItem";

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
    height: "628px",
    top: "2%",
    left: "20%",
    right: "20%",
    bottom: "auto",
  },
};

const customStyleDefault = {
  top: "50%",
  left: "50%",
  right: "auto",
  bottom: "auto",
  marginRight: "-50%",
  transform: "translate(-50%, -50%)",
};

//Modal.AppElement("body");

export const SerieList = ({ calcularCantidad }) => {
  const initialValue = {
    title: "",
    image: "",
    description: "",
    year: "",
    genres: [],
    country: "Afganistán",
  };

  const initialSeason = {
    name: "",
    serie: "",
  };

  const initialChapter = {
    name: "",
    season: "",
    url: "",
    description: "",
    duration: "",
    web: "www13.pelisplus.movie",
    server: "Peliscloud",
  };

  const initialValueMessage = {
    error: false,
    success: false,
    title: "",
    message: "",
  };

  const [message, setMessage] = useState(initialValueMessage);
  const [serie, setSerie] = useState(initialValue);
  const [season, setSeason] = useState(initialSeason);
  const [chapter, setChapter] = useState(initialChapter);
  const [series, setSeries] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [genres, setGenres] = useState([]);
  const [countrys, setCountrys] = useState([]);
  const [loading, setLoading] = useState("Completar URL");
  const [isEncontrado, setEncontrado] = useState(false);
  const [Obtienegenre, setObtieneGenre] = useState([]);
  const [totalSeries, setTotalSeries] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpenTemporadas, setIsOpenTemporadas] = useState(false);
  const [modalIsOpenCapitulos, setIsOpenCapitulos] = useState(false);
  const [isRegistroSeason, setMostrarRegistroSeason] = useState(false);
  const [isRegistroChapter, setMostrarRegistroChapter] = useState(false);

  const [isVisible, setVisible] = useState({
    active: false,
  });

  const onKeyUpValuePeliiculas = async (e) => {
    const { value } = e.target;
    const res = await serieService.getSeries();
    //console.log(res.data[0].role.name);
    const buscarSeries = res.data.filter(
      (serie) =>
        String(serie.country.name).toLowerCase().indexOf(value) >= 0 ||
        String(serie.country.name).toUpperCase().indexOf(value) >= 0 ||
        String(serie.state).toLowerCase().indexOf(value) >= 0 ||
        String(serie.state).toUpperCase().indexOf(value) >= 0 ||
        String(serie.title).toLowerCase().indexOf(value) >= 0 ||
        String(serie.title).toUpperCase().indexOf(value) >= 0 ||
        String(serie.year).toLowerCase().indexOf(value) >= 0 ||
        String(serie.year).toUpperCase().indexOf(value) >= 0 ||
        String(serie.genres.map((pengre) => pengre.name))
          .toLowerCase()
          .indexOf(value) >= 0 ||
        String(serie.genres.map((pengre) => pengre.name))
          .toUpperCase()
          .indexOf(value) >= 0
    );
    const cantidadUsuarios = buscarSeries.length;
    setTotalSeries(cantidadUsuarios);
    if (cantidadUsuarios.length === 0) {
      console.log("Buscando alumnos...");
    } else {
      setSeries(buscarSeries);
    }
  };

  const classNameVisible = isVisible.active
    ? "w-full overflow-hidden focus:outline-none"
    : "hidden";

  const handleVisible = () => {
    setVisible({ active: !isVisible.active });
  };

  const handleInputChange = (e) => {
    setSerie({ ...serie, [e.target.name]: e.target.value });
  };

  const handleInputChangeSeason = (e) => {
    setSeason({ ...season, [e.target.name]: e.target.value });
  };

  const handleInputChangeChapter = (e) => {
    setChapter({ ...chapter, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e) => {
    setSerie({ ...serie, [e.target.name]: e.target.value });
  };

  const handleGenres = async (e) => {
    if (Obtienegenre.length === 0) {
      Obtienegenre.push(e.target.value);
    } else {
      const encontrado = Obtienegenre.filter(
        (genre) => genre === e.target.value
      );
      if (encontrado.length !== 0) {
        let position = Obtienegenre.indexOf(encontrado);
        Obtienegenre.splice(position, 1);
      } else {
        Obtienegenre.push(e.target.value);
      }
    }
    setSerie({ ...serie, genres: Obtienegenre });
  };

  const onKeyUpValue = async (e) => {
    const { value } = e.target;
    if (value.length <= 0) {
      setLoading("");
      setEncontrado(false);
    }

    if (chapter.server === "Peliscloud") {
      setLoading("Cargando...");
      try {
        const peli = await videoService.getURLPeli(value);

        if (peli.statusText === "OK") {
          setEncontrado(false);
          return setLoading("URL invalido");
        }

        setLoading("Espere...");
        let domain = value.substr(0, 31);
        let subdomain = peli.data.substr(-77, 76);
        setLoading(domain.trim() + subdomain.trim());
        setEncontrado(true);
      } catch (e) {
        setEncontrado(false);
        setLoading("URL invalido");
      }
    }
  };

  const onKeyFiltroGenres = async (e) => {
    const { value } = e.target;
    if (value.length < 0 || value.length === 0) {
      setVisible({ active: false });
    } else {
      setVisible({ active: true });
      const res = await getGenres();
      const buscarGenres = res.data.filter(
        (genre) =>
          genre.name.toLowerCase().indexOf(value) >= 0 ||
          genre.name.toUpperCase().indexOf(value) >= 0
      );
      setGenres(buscarGenres);
    }
  };

  const getListSeries = async () => {
    const res = await serieService.getSeries();
    setTotalSeries(res.data.length);
    setSeries(res.data);
  };

  const getListSeason = async (id) => {
    try {
      const res = await serieService.getSeasons(id);
      setSeasons(res.data);
      if (season._id) setSeason({ ...season });
      else setSeason({ name: "", serie: id });
    } catch (e) {
      if (e.request.status === 401) {
        setMessage({
          error: true,
          title: "ERROR",
          message: "Recargue la página",
        });
        return;
      }
      console.log(e.request);
    }
  };

  const getListChapters = async (id) => {
    try {
      const res = await serieService.getChapters(id);
      setChapters(res.data);
      if (chapter._id) setChapter({ ...chapter });
      else
        setChapter({
          name: "",
          url: "",
          description: "",
          duration: "",
          web: "www13.pelisplus.movie",
          server: "Peliscloud",
          season: id,
        });
    } catch (e) {
      if (e.request.status === 401) {
        setMessage({
          error: true,
          title: "ERROR",
          message: "Recargue la página",
        });
        return;
      }
    }
  };

  const getListGenres = async () => {
    const res = await getGenres();
    setGenres(res.data);
  };

  const getListCountrys = async () => {
    const res = await getCountrys();
    setCountrys(
      res.data.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
    );
  };

  const getSerieId = async (id) => {
    const res = await serieService.getSerie(id);
    setSerie({
      ...res.data,
      country: res.data.country ? res.data.country.name : "Afganistán",
      genres: res.data.genres.map((genre) => genre.name),
    });
  };

  const getSeasonId = async (id) => {
    const res = await serieService.getSeason(id);
    setSeason({
      ...res.data,
      serie: res.data.serie,
    });
  };

  const getChapterId = async (id) => {
    const res = await serieService.getChapter(id);
    setChapter({
      ...res.data,
      season: res.data.season,
    });
  };

  function openModal() {
    setIsOpen(true);
  }

  function openModalTemporadas() {
    setIsOpenTemporadas(true);
  }

  function closeModalTemporadas() {
    setIsOpenTemporadas(false);
  }

  const openModalCapitulos = () => {
    setIsOpenCapitulos(true);
  };

  const closeModalCapitulos = () => {
    setIsOpenCapitulos(false);
  };

  function opeMondalId(id) {
    getSerieId(id);
    setIsOpen(true);
  }

  function closeModal() {
    setSerie(initialValue);
    setMessage(initialValueMessage);
    setLoading("Completar URL");
    setIsOpen(false);
    setEncontrado(false);
    setVisible({ active: false });
    setObtieneGenre([]);
  }

  const eliminaGenre = async (mvgen) => {
    let totalGenre = await Obtienegenre.indexOf(mvgen);
    await Obtienegenre.splice(totalGenre, 1);
    const sobrante = Obtienegenre.map((name) => name);
    if (serie._id) setSerie({ ...serie, genres: sobrante });
    else setObtieneGenre(sobrante);
  };
  const handleSubmitChapter = async (e) => {
    e.preventDefault();
    if (chapter._id) {
      try {
        await serieService.updateChapter(chapter, chapter._id);
        getListChapters(chapter.season);
        setMessage({
          success: true,
          title: "ÉXITO",
          message: "Se actualizó correctamente. ",
        });
      } catch (e) {
        if (e.request.status === 401) {
          setMessage({
            error: true,
            title: "ERROR",
            message: "Recargue la página",
          });
          return;
        }
        console.log(e.request);
      }
    } else {
      try {
        await serieService.newChapter(chapter);
        setChapter({
          ...chapter,
          name: "",
          url: "",
          description: "",
          duration: "",
          web: "www13.pelisplus.movie",
          server: "Peliscloud",
        });
        getListChapters(chapter.season);
        setEncontrado(false);
        setMessage({
          success: true,
          title: "ÉXITO",
          message: "Se registró correctamente. ",
        });
      } catch (e) {
        const response = e.request.response || null;
        const error = JSON.parse(e.request.response) || null;
        if (e.request.status === 401) {
          setMessage({
            error: true,
            title: "ERROR",
            message: "Recargue la página",
          });
          return;
        }
        if (error.errors) {
          if (error.errors.url) {
            setMessage({
              error: true,
              title: "ERROR",
              message: "Completar URL",
            });
            return;
          }
          if (error.errors.name) {
            setMessage({
              error: true,
              title: "ERROR",
              message: "Completar nombre del capitulo",
            });
            return;
          }
        }
        if (response) {
          setMessage({
            error: true,
            title: "ERROR",
            message: JSON.parse(response),
          });
          return;
        }
      }
    }
  };

  const handleSubmitSeason = async (e) => {
    e.preventDefault();
    if (season._id) {
      try {
        await serieService.updateSeason(season, season._id);
        getListSeason(season.serie);
        setMessage({
          success: true,
          title: "ÉXITO",
          message: "Se actualizó correctamente. ",
        });
      } catch (e) {
        if (e.request.status === 401) {
          setMessage({
            error: true,
            title: "ERROR",
            message: "Recargue la página",
          });
          return;
        }
        console.log(e.request);
      }
    } else {
      try {
        await serieService.newSeason(season);
        setSeason({ ...season, name: "" });
        getListSeason(season.serie);
        setMessage({
          success: true,
          title: "ÉXITO",
          message: "Se registró correctamente. ",
        });
      } catch (e) {
        const response = e.request.response || null;
        const error = JSON.parse(e.request.response) || null;

        if (e.request.status === 401) {
          setMessage({
            error: true,
            title: "ERROR",
            message: "Recargue la página",
          });
          return;
        }
        if (error.errors) {
          if (error.errors.url) {
            setMessage({
              error: true,
              title: "ERROR",
              message: "Completar URL",
            });
            return;
          }
          if (error.errors.name) {
            setMessage({
              error: true,
              title: "ERROR",
              message: "Completar nombre de la temporada",
            });
            return;
          }
        }
        if (response) {
          setMessage({
            error: true,
            title: "ERROR",
            message: JSON.parse(response),
          });
          return;
        }
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (serie._id) {
      try {
        await serieService.updateSerie(serie._id, serie);
      } catch (e) {
        if (e.request.status === 401) {
          setMessage({
            error: true,
            title: "ERROR",
            message: "Recargue la página",
          });
          return;
        }
      }
    } else {
      try {
        await serieService.newSerie(serie);
        setSerie(initialValue);
        setMessage(initialValueMessage);
        calcularCantidad();
        setGenres([]);
        setCountrys([]);
        setEncontrado(false);
        setObtieneGenre([]);
        setLoading("Completar URL");
      } catch (e) {
        const error = JSON.parse(e.request.response) || null;
        console.log(error);
        if (e.request.status === 401) {
          setMessage({
            error: true,
            title: "ERROR",
            message: "Recargue la página",
          });
          return;
        }

        if (error.errors) {
          if (error.errors.url) {
            setMessage({
              error: true,
              title: "ERROR",
              message: "Completar URL",
            });
            return;
          }

          if (error.errors.image) {
            setMessage({
              error: true,
              title: "ERROR",
              message: "Completar URL portada",
            });
            return;
          }
          if (error.errors.title) {
            setMessage({
              error: true,
              title: "ERROR",
              message: "Completar título del video",
            });
            return;
          }
        }
        if (error.keyValue) {
          if (error.keyValue.image) {
            setMessage({
              error: true,
              title: "ERROR",
              message: "URL de la portada ya existe",
            });
            return;
          }
        }
        if (error) {
          setMessage({
            error: true,
            title: "ERROR",
            message: "URL Generado ya existe",
          });
          setEncontrado(false);
          return;
        }
      }
    }
  };

  useEffect(() => {
    getListSeries();
    getListGenres();
    getListCountrys();
    if (loading !== "Completar URL") setChapter({ ...chapter, url: loading });
    if (serie._id) setObtieneGenre(serie.genres.map((genre) => genre));
    if (season._id) getSeasonId(season._id);
    if (chapter._id) getChapterId(chapter._id);
  }, [loading, serie._id, season._id, chapter._id]);

  const MostrarGenre = ({ mvgen }) => {
    return (
      <>
        <div className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-teal-700 bg-blue-100 border border-blue-300 ">
          <div className="text-xs font-normal leading-none max-w-full flex-initial">
            {Obtienegenre.length === 0 ? setObtieneGenre([]) : mvgen}
          </div>
          <div className="flex flex-auto flex-row-reverse">
            <div>
              <svg
                onClick={() => eliminaGenre(mvgen)}
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-x cursor-pointer hover:text-teal-400 rounded-full w-4 h-4 ml-2"
              >
                <line x1={18} y1={6} x2={6} y2={18} />
                <line x1={6} y1={6} x2={18} y2={18} />
              </svg>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="px-4 sm:px-8">
      <div className="py-8">
        <div>
          <h2 className="text-2xl font-semibold leading-tight">Series</h2>
        </div>
        <div>
          Busca series por país, título, año, estado(1:activo, 2:inactivo) o
          género
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
              onKeyUp={onKeyUpValuePeliiculas}
              placeholder="Buscar"
              className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
            />
          </div>
        </div>
        <span>{totalSeries} Series</span>
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
            {serie._id ? (
              <>
                <div className="flex items-center space-x-5">
                  <div className="h-14 w-14 bg-yellow-200 rounded-full flex flex-shrink-0 justify-center items-center text-yellow-500 text-2xl font-mono">
                    i
                  </div>
                  <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                    <h2 className="leading-relaxed">Actualizar serie</h2>
                    <p className="text-sm text-gray-500 font-normal leading-relaxed">
                      Actualizar serie.
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
                    <h2 className="leading-relaxed">Registrar serie</h2>
                    <p className="text-sm text-gray-500 font-normal leading-relaxed">
                      Registrar serie.
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
                  <div className="flex flex-col">
                    <label className="leading-loose">URL Portada</label>
                    <input
                      onChange={handleInputChange}
                      value={serie.image}
                      type="url"
                      name="image"
                      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                      placeholder="https://www.google.com/imgres?imgurl=https%3A%2F%2Fwww.rockzonemag.com%2Fwp-content%2Fuploads%2F2020%2F04%2FSonic-Pelicula-poster.gif&imgrefurl=https%3A%2F%2Fwww.rockzonemag.com%2Fsonic-la-pelicula%2F&tbnid=nVbP0tLwbnTvAM&vet=12ahUKEwjjjqLlpavuAhV4L7kGHTH9BowQMygCegUIARCvAQ..i&docid=LWZWwOLJJoa-6M&w=1023&h=1279&q=imagen%20pelicula&ved=2ahUKEwjjjqLlpavuAhV4L7kGHTH9BowQMygCegUIARCvAQ"
                    />
                  </div>
                  <div className="-mx-3 flex mb-6">
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                      <label className="leading-loose">Nombre</label>
                      <input
                        onChange={handleInputChange}
                        name="title"
                        value={serie.title}
                        type="text"
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        placeholder="Soul"
                      />
                    </div>
                    <div className="md:w-1/2 px-3">
                      <label className="leading-loose">Año</label>
                      <input
                        onChange={handleInputChange}
                        name="year"
                        value={serie.year}
                        type="text"
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        placeholder="Año"
                      />
                    </div>
                  </div>
                  <div className="-mx-3 flex mb-6">
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                      <label className="leading-loose">Pais</label>
                      {/* INICIA EL DIV PARA PAISES */}
                      <div className="flex flex-col">
                        <div className="w-full flex flex-col items-center">
                          <div className="w-full">
                            <div className="flex flex-col items-center relative">
                              <div className="w-full">
                                <div className="p-1 bg-white flex border border-gray-300 rounded ">
                                  <select
                                    className="w-full outline-none"
                                    name="country"
                                    value={serie.country}
                                    onChange={handleSelectChange}
                                  >
                                    {countrys.map((country) => (
                                      <CountryItem
                                        key={country._id}
                                        country={country}
                                      />
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* FIN DIV PARA PAISES */}
                    </div>
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                      <label className="leading-loose">Generos</label>
                      <div className="w-full">
                        <div className="flex flex-col items-center relative">
                          <div className="w-full  svelte-1l8159u">
                            <div className="mb-2 p-1 flex border border-gray-200 bg-white rounded svelte-1l8159u">
                              <div className="flex flex-auto flex-wrap">
                                {Obtienegenre.map((mvgen) => (
                                  <MostrarGenre key={mvgen} mvgen={mvgen} />
                                ))}

                                <div className="flex-1">
                                  <input
                                    onChange={onKeyFiltroGenres}
                                    name="genres"
                                    //placeholder
                                    className="bg-transparent p-1 px-2 appearance-none outline-none h-full w-full text-gray-800"
                                  />
                                </div>
                              </div>
                              <div className="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200 svelte-1l8159u">
                                <button
                                  type="button"
                                  onClick={() => handleVisible()}
                                  className="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none"
                                >
                                  {isVisible.active ? (
                                    <>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="100%"
                                        height="100%"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-chevron-up w-4 h-4"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                                        ></path>
                                      </svg>
                                    </>
                                  ) : (
                                    <>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="100%"
                                        height="100%"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-chevron-up w-4 h-4"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                        ></path>
                                      </svg>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="absolute shadow top-100 bg-white z-40 w-full lef-0 rounded max-h-select overflow-y-auto svelte-5uyqqj">
                            <select
                              multiple={true}
                              className={classNameVisible}
                              //value={movie.country.name}
                              onChange={handleGenres}
                            >
                              {
                                // eslint-disable-next-line array-callback-return
                                genres.map((genre) => (
                                  <GenresItem
                                    key={genre._id}
                                    genre={genre}
                                    handleGenres={handleGenres}
                                  />
                                ))
                              }
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col h-30">
                    <textarea
                      onChange={handleInputChange}
                      name="description"
                      value={serie.description}
                      className="description text-gray-600 sec p-3 h-60 border focus:ring-gray-500 focus:border-gray-900 rounded-md outline-none"
                      spellCheck="false"
                      placeholder="Sinópsis"
                    />
                  </div>

                  <div className="pt-4 flex items-center space-x-4">
                    <button
                      type="button"
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
                    {serie._id ? (
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

          <Modal
            isOpen={modalIsOpenTemporadas}
            onRequestClose={closeModalTemporadas}
            style={customStyleDefault}
            contentLabel="Temporadas"
            shouldCloseOnOverlayClick={false}
          >
            {isRegistroSeason ? (
              <>
                {serie._id ? (
                  <>
                    <div className="flex items-center space-x-5">
                      <div className="h-14 w-14 bg-yellow-200 rounded-full flex flex-shrink-0 justify-center items-center text-yellow-500 text-2xl font-mono">
                        i
                      </div>
                      <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                        <h2 className="leading-relaxed">Actualizar serie</h2>
                        <p className="text-sm text-gray-500 font-normal leading-relaxed">
                          Actualizar serie.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {season._id ? (
                      <>
                        <div className="flex items-center space-x-5">
                          <div className="h-14 w-14 bg-yellow-200 rounded-full flex flex-shrink-0 justify-center items-center text-yellow-500 text-2xl font-mono">
                            i
                          </div>
                          <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                            <h2 className="leading-relaxed">
                              Actualizar Temporada
                            </h2>
                            <p className="text-sm text-gray-500 font-normal leading-relaxed">
                              Actualizar temporada.
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
                            <h2 className="leading-relaxed">
                              Registrar Temporada
                            </h2>
                            <p className="text-sm text-gray-500 font-normal leading-relaxed">
                              Registrar temporada.
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
                <br />
                {message.error ? <AlertError message={message} /> : ""}
                {message.success ? <AlertSuccess message={message} /> : ""}
                <div className="divide-y divide-gray-200">
                  <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                    <form onSubmit={handleSubmitSeason}>
                      <div className="flex flex-col">
                        <label className="leading-loose">Nombre</label>
                        <input
                          onChange={handleInputChangeSeason}
                          value={season.name}
                          type="text"
                          name="name"
                          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Temporada 1"
                        />
                      </div>

                      <div className="pt-4 flex items-center space-x-4">
                        <button
                          type="button"
                          onClick={() => {
                            setMessage(initialValueMessage);
                            setSeason({
                              ...season,
                              name: "",
                              state: "",
                              _id: "",
                              createdAt: "",
                              updatedAt: "",
                            });
                            setMostrarRegistroSeason(false);
                          }}
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
                        {serie._id ? (
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
              </>
            ) : (
              <>
                <button
                  onClick={() => setMostrarRegistroSeason(true)}
                  type="button"
                  className="border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
                >
                  Nueva Temporada
                </button>
                <button
                  onClick={() => closeModalTemporadas()}
                  type="button"
                  className="text-dark rounded-md px-4 py-2 m-2  select-none focus:outline-none focus:shadow-outline"
                >
                  Salir
                </button>
                <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                  <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
                      <thead>
                        <tr>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Nombre
                          </th>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Serie
                          </th>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Creado
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
                        {
                          // eslint-disable-next-line array-callback-return
                          seasons.map((season) => (
                            <SeasonItem
                              key={serie._id}
                              season={season}
                              getListSeason={getListSeason} //seasons={getLis}
                              setMostrarRegistroSeason={
                                setMostrarRegistroSeason
                              }
                              getListChapters={getListChapters}
                              getSeasonId={getSeasonId}
                              openModalCapitulos={openModalCapitulos}
                            />
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </Modal>

          <Modal
            isOpen={modalIsOpenCapitulos}
            onRequestClose={closeModalCapitulos}
            style={customStyleDefault}
            contentLabel="Capitulos"
            shouldCloseOnOverlayClick={false}
          >
            {isRegistroChapter ? (
              <>
                {chapter._id ? (
                  <>
                    <div className="flex items-center space-x-5">
                      <div className="h-14 w-14 bg-yellow-200 rounded-full flex flex-shrink-0 justify-center items-center text-yellow-500 text-2xl font-mono">
                        i
                      </div>
                      <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                        <h2 className="leading-relaxed">Actualizar Capítulo</h2>
                        <p className="text-sm text-gray-500 font-normal leading-relaxed">
                          Actualizar capítulo.
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
                        <h2 className="leading-relaxed">Registrar Capítulo</h2>
                        <p className="text-sm text-gray-500 font-normal leading-relaxed">
                          Registrar capítulo.
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
                    <form onSubmit={handleSubmitChapter}>
                      <div className="-mx-3 flex mb-6">
                        <div className="md:w-1/2 px-3">
                          <label className="leading-loose">Web</label>
                          <div className="p-1 bg-white flex border border-gray-300 rounded">
                            <select
                              className="w-full outline-none"
                              name="web"
                              value={chapter.web}
                              onChange={handleInputChangeChapter}
                            >
                              <option value={"www13.pelisplus.movie"}>
                                www13.pelisplus.movie
                              </option>
                              <option value={"www.pelisplus.com"}>
                                www.pelisplus.com
                              </option>
                              <option value={"www.pelisuplus.ne"}>
                                www.pelisuplus.ne
                              </option>
                              <option value={"Otro"}>Otro</option>
                            </select>
                          </div>
                        </div>
                        <div className="md:w-1/2 px-3">
                          <label className="leading-loose">Servidor</label>
                          <div className="p-1 bg-white flex border border-gray-300 rounded">
                            <select
                              className="w-full outline-none"
                              name="server"
                              value={chapter.server}
                              onChange={handleInputChangeChapter}
                            >
                              <option value={"Peliscloud"}>Peliscloud</option>
                              <option value={"Upload"}>Upload</option>
                              <option value={"Servidor"}>Servidor</option>
                              <option value={"Otro"}>Otro</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <label className="leading-loose">
                          URL - {chapter.web} - {chapter.server}
                        </label>
                        <input
                          type="url"
                          disabled={isEncontrado}
                          onKeyUp={onKeyUpValue}
                          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="https://stream01.peliscloud.net/playlist/d504281aba0f7f8d8acedda2f3997def/1611102539492"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="leading-loose">URL Generado</label>
                        <input
                          onChange={handleInputChangeChapter}
                          type="text"
                          name="url"
                          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          value={chapter._id ? chapter.url : loading}
                          disabled={true}
                          // eslint-disable-next-line react/jsx-no-duplicate-props
                        />
                      </div>
                      <div className="-mx-3 flex mb-6">
                        <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                          <label className="leading-loose">Nombre</label>
                          <input
                            onChange={handleInputChangeChapter}
                            name="name"
                            value={chapter.name}
                            type="text"
                            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                            placeholder="El inicio del fin"
                          />
                        </div>
                        <div className="md:w-1/2 px-3">
                          <label className="leading-loose">Duración</label>
                          <input
                            onChange={handleInputChangeChapter}
                            name="duration"
                            value={chapter.duration}
                            type="text"
                            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                            placeholder="Duración"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col h-30">
                        <textarea
                          onChange={handleInputChangeChapter}
                          name="description"
                          value={chapter.description}
                          className="description text-gray-600 sec p-3 h-60 border focus:ring-gray-500 focus:border-gray-900 rounded-md outline-none"
                          spellCheck="false"
                          placeholder="Sinópsis"
                        />
                      </div>
                      <div className="pt-4 flex items-center space-x-4">
                        <button
                          type="button"
                          onClick={() => {
                            setMessage(initialValueMessage);
                            setChapter({
                              ...chapter,
                              state: "",
                              name: "",
                              _id: "",
                              url: "",
                              description: "",
                              duration: "",
                              web: "",
                              server: "",
                              createdAt: "",
                              updatedAt: "",
                            });
                            setMostrarRegistroChapter(false);
                          }}
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
                        {serie._id ? (
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
              </>
            ) : (
              <>
                <button
                  onClick={() => setMostrarRegistroChapter(true)}
                  type="button"
                  className="border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
                >
                  Nuevo Capitulo
                </button>
                <button
                  onClick={() => {
                    setChapter(initialChapter);
                    closeModalCapitulos();
                  }}
                  type="button"
                  className="text-dark rounded-md px-4 py-2 m-2  select-none focus:outline-none focus:shadow-outline"
                >
                  Salir
                </button>
                <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                  <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
                      <thead>
                        <tr>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Nombre
                          </th>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Temporada
                          </th>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Duración
                          </th>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Web
                          </th>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Server
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
                        {
                          // eslint-disable-next-line array-callback-return
                          chapters.map((chapter) => (
                            <ChapterItem
                              key={chapter._id}
                              chapter={chapter}
                              getListChapters={getListChapters} //seasons={getLis}
                              setMostrarRegistroChapter={
                                setMostrarRegistroChapter
                              }
                              getChapterId={getChapterId}
                              //openModalCapitulos={openModalCapitulos}
                            />
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </Modal>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Origen
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Año
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Genero
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Creado
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
                {
                  // eslint-disable-next-line array-callback-return
                  series.map((serie) => (
                    <SerieItem
                      key={serie._id}
                      serie={serie}
                      series={getListSeries}
                      modal={opeMondalId}
                      openModalTemporadas={openModalTemporadas}
                      getListSeason={getListSeason}
                    />
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
