import { useParams, Navigate, useNavigate, Link } from 'react-router-dom';
import React, { useState, useRef, useEffect } from "react";
import Modal from 'react-modal';
import '../style-home.css';
import axios from 'axios';
import Sidebar from './Unipark_Siderbar';

function UserUpdate(){

    const IDUSER = localStorage.getItem("IDUSER");  
    const NOMBRE = localStorage.getItem("NOMBRE");   
    const CORREO = localStorage.getItem("CORREO");

    if(IDUSER && NOMBRE && CORREO){

        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 
        const { id_usuario } = useParams(); // Obtengo el parámetro idusuario de la URL
        const [DatosUser, setDatosUser] = useState({});
        const [ImagenUser, setImagenUser] = useState(null);
        const [UrlFoto, setUrlFoto] = useState(''); // ruta de url imagen seleccionada para visualizar
        const [mensajeActualizacion, setMensajeActualizacion] = useState(''); //mensaje de actualizdo exitoso
        const [Nombres, setNombres] = useState('');
        const [NumDoc, setNumDoc] = useState('');
        const [Telefono, setTelefono] = useState('');
        const [Carrera, setCarrera] = useState('');
        const [IDUni, setIdUni] = useState('');
        const ROLUSER = localStorage.getItem("ROL");

        const [form, setForm] = useState({
            nombre: "Feby Sabilhul Hanafi",
            email: "Febysabilhul@gmail.com",
            nacimiento: "1998-03-02",
            telefono: "6282230114136",
            provincia: "Jawa Timur",
            ciudad: "Banyuwangi",
            passwordActual: "",
            passwordNuevo: "",
            confirmarPassword: "",
        })

        const handleChange = (e) => {
            const { name, value } = e.target;
            setForm((prev) => ({ ...prev, [name]: value }));
        };

        const CargarDatosUser = async() => {          // Se cargan los demas datos del usuario
                try {
                    const response = await axios.post(`${API_BASE_URL}/listar/persona`, {IDUSER});

                    setNombres(response.data.nombres || '');
                    setNumDoc(response.data.numero_documento || '');
                    setTelefono(response.data.telefono || '');
                    setCarrera(response.data.carrera || '');
                    setIdUni(response.data.id_universitario || '');
                    setDatosUser(response.data);
                    //console.log(`DATOS;;;:`, response.data);
                    
                } catch (error) {
                    //console.error('Error:', error);
                    window.alert("Ha ocurrido un error al consultar las credenciales.");
                }
        };

        const ActualizarDatos = async () => {
            
            try { // se actualiza la información del vehículo
                console.log(" Datos a actualizar::: ----- ", id_usuario, " - ", Nombres, " - ", NumDoc,  " - ", Telefono,  " - ", Carrera);
                let idUsuario = id_usuario;
                const Update = await axios.post(`${API_BASE_URL}/actualizar/usuario`, {idUsuario, Nombres, NumDoc, Telefono, Carrera});
                setMensajeActualizacion(Update.data.status); // ← Mostrar mensaje del backend en la interfaz
                //Navigate("/Usuario");

            } catch (error) {
                console.error("Fallo al Actualizar los datos. ", error);
            }
        }

        useEffect(() => {
            CargarDatosUser();
        }, []);

        return (
        <>
            <div className="wrapper">
                {/* Menu Desplegable */}
                <Sidebar /> {/* Aqui esta el menu lateral */}


                {/* Funcionalidad de la pagina */}

                <div className="main p-0 ps-4 pe-4">
                    <div className="Titulo_pagina pt-4 pb-3"> <h5> <Link className='Titulo_pagina' to="/Usuario"> / Usuario </Link> / Actualizar </h5> </div>

                    <div className="row col-12">
                        <div className="col-2"></div>

                        <div className="card p-4 col-8 d-flex flex-row justify-content-between align-items-start">
                            
                            {/* Formulario de perfil */}
                            <div className="col-12 pe-4 ">

                                {mensajeActualizacion && (
                                    <div className="alert alert-success " role="alert">
                                        {mensajeActualizacion}
                                    </div>
                                )}

                                {/* Imagen del vehículo */}
                                <div className="row col-12">
                                    <div className="col-5"></div>

                                    <div className="card bg-transparent   border-0 col-2   p-0 mb-2" >
                                        <img className="img-fluid " src={UrlFoto || DatosUser.url_foto}  />

                                        {/* Botón de editar sobre la imagen */}
                                        <label
                                            htmlFor="inputImagenVehiculo"
                                            className="position-absolute top-0 end-0 bg-warning border rounded-circle shadow"
                                            style={{ cursor: 'pointer' }}
                                            title="Editar imagen"
                                        >
                                        <i className="lni lni-pencil-1 text-white fs-3 p-0 pt-1 ps-1 pe-1 m-0"></i>
                                        </label>
                                        <input
                                            type="file"
                                            id="inputImagenVehiculo"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={(e) => {
                                            const file = e.target.files[0];
                                                if (file) {
                                                    const url = URL.createObjectURL(file);  // Vista del archivo
                                                    setImagenUser(file); // Guardar archivo (datos)
                                                    setUrlFoto(url); // Actualiza vista previa local
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="col-5"></div>
                                </div>



                                <div className="mb-3">
                                <label className='text-warning fw-bold'>Nombre completo</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    className="form-control"
                                    value={Nombres}
                                    onChange={(e) => setNombres(e.target.value)}
                                />
                                </div>

                                <div className="mb-3">
                                <label className='text-warning fw-bold'>correo electronico</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={CORREO}
                                    readOnly
                                />
                                </div>

                                <div className="mb-3 d-flex gap-3">
                                <div className="flex-fill">
                                    <label className='text-warning fw-bold'>Número documento</label>
                                    <input
                                    type="text"
                                    name="nacimiento"
                                    className="form-control"
                                    value={NumDoc}
                                    onChange={(e) => setNumDoc(e.target.value)}
                                    />
                                </div>
                                <div className="flex-fill">
                                    <label className='text-warning fw-bold'>Número teléfono</label>
                                    <input
                                    type="text"
                                    name="telefono"
                                    className="form-control"
                                    value={Telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    />
                                </div>
                                </div>

                                <div className="mb-3 d-flex gap-3">
                                <div className="flex-fill">
                                    <label className='text-warning fw-bold'>Carrera</label>
                                    <input
                                    type="text"
                                    name="provincia"
                                    className="form-control"
                                    value={Carrera}
                                    onChange={(e) => setCarrera(e.target.value)}
                                    />
                                </div>
                                <div className="flex-fill">
                                    <label className='text-warning fw-bold'>id Universitario</label>
                                    <input
                                    type="text"
                                    name="ciudad"
                                    className="form-control"
                                    value={IDUni}
                                    readOnly
                                    />
                                </div>
                                </div>


                                <button type="submit" className="btn btn-warning w-10 fw-bold mt-2" onClick={ActualizarDatos}>
                                Guardar
                                </button>

                            </div>

                        </div>

                        <div className="col-2"></div>

                    </div>


                <p></p>

                </div>



            </div>

            <link href="https://cdn.lineicons.com/5.0/lineicons.css" rel="stylesheet" />
        </>
        );
        
    }else{
        window.location = '/'
    }

}

export default  UserUpdate

