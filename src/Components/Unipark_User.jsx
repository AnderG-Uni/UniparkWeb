import { Await, Navigate, useNavigate, Link } from 'react-router-dom';
import React, { useState, useEffect} from "react";
import Modal from 'react-modal';
import axios from 'axios';
import '../style-home.css';
import Sidebar from './Unipark_Siderbar';

function User(){

    const IDUSER = localStorage.getItem("IDUSER");  
    const NOMBRE = localStorage.getItem("NOMBRE");   
    const CORREO = localStorage.getItem("CORREO");

    if(IDUSER && NOMBRE && CORREO){

        const Navigate = useNavigate();
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const [DatosUser, setDatosUser] = useState({});
    
        const CargarDatosUser = async() => {          // Se cargan los demas datos del usuario
                try {
                    const response = await axios.post(`${API_BASE_URL}/listar/persona`, {IDUSER});
                    setDatosUser(response.data);
                    //console.log(`DATOS;;;:`, response.data);
                    
                } catch (error) {
                    //console.error('Error:', error);
                    window.alert("Ha ocurrido un error al consultar las credenciales.");
                }
        };

        const EditarUsuario = (id_usuario) => {   // función para mandar el id del vehiculo a editar
            Navigate(`/Usuario/Actualizar/${id_usuario}`);
        };

        useEffect(() => {
            CargarDatosUser();
        }, []);

        return (
        <>
            <div className="wrapper">
                {/* Menu Desplegable */}
                <Sidebar /> {/* Aqui esta el menu lateral */}


                {/* Funcionalidad de la pagina */}

                <div className="main p-0 ps-4 pe-4 ">
                    <div className="Titulo_pagina pt-4 pb-3"> 
                        <h5> / Usuario </h5> 
                        <p className="text-muted small ">Usuarios transferencias de usuarios y administradores</p>
                    </div>

                    <div className='row col-12 p-0 m-0 '>

                        {/* Información personal */}
                            <div className="col-8 card border-0 p-4 m-0 ">
                                <h5 className="fw-bold mb-4 text-primary">Información</h5>
                                <div className="mb-2">
                                <strong className="text-warning">Nombre</strong>
                                <p>{DatosUser.nombres}</p>
                                </div>
                                <div className="mb-2">
                                <strong className="text-warning">Correo</strong>
                                <p>{CORREO}</p>
                                </div>
                                <div className="mb-2">
                                <strong className="text-warning">Carrera</strong>
                                <p>{DatosUser.carrera}</p>
                                </div>
                                <div className="mb-2">
                                <strong className="text-warning">Documento identidad</strong>
                                <p>{DatosUser.numero_documento}</p>
                                </div>
                                <div className="mb-2">
                                <strong className="text-warning">Teléfono</strong>
                                <p>{DatosUser.telefono}</p>
                                </div>
                                <div className="mb-2">
                                <strong className="text-warning">ID Universitario</strong>
                                <p>{DatosUser.id_universitario}</p>
                                </div>
                            </div>


                        {/* Perfil y resumen de vehículos */}
                        <div className=" m-0  ps-4 col-4 ">
                            <div className="card border-0  p-3  text-center">

                                <div className=" text-center ms-4 mb-4">
                                    <img
                                        src={DatosUser.url_foto}
                                        alt="Perfil"
                                        className="rounded-circle border border-3 border-primary"
                                        style={{ width: "160px", height: "160px", objectFit: "cover" }}
                                    />
                                </div>

                                <h6 className="fw-bold mb-3 text-primary text-center">Tus Vehículos</h6>
                                
                                <p>
                                    <i className="lni lni-motorbike me-2"></i> Motos: {}
                                </p>
                                <p>
                                    <i className="lni lni-car me-2"></i> Carros: {}
                                </p>
                                <p>
                                    <i className="lni lni-bike me-2"></i> Bicicletas: {}
                                </p>

                                    <button className="btn btn-warning mt-4 w-100 fw-bold" 
                                    onClick={() => EditarUsuario(DatosUser._id)}
                                    >Actualizar</button>
                            </div>
                        </div>

                    </div>

                </div>



            </div>

            <link href="https://cdn.lineicons.com/5.0/lineicons.css" rel="stylesheet" />
        </>
        );

    }else{
        window.location = '/'
    }

}

export default  User

