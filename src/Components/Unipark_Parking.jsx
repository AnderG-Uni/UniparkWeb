import { Await, Navigate, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import '../style-home.css';
import Sidebar from './Unipark_Siderbar';

function parking(){

    const IDUSER = localStorage.getItem("IDUSER");  
    const NOMBRE = localStorage.getItem("NOMBRE");   
    const CORREO = localStorage.getItem("CORREO");

    if(IDUSER && NOMBRE && CORREO){

        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const [DatosParqueadero, setDatosParqueadero] = useState({});

        const CargarParqueaderos = async () => {    // historial de ingreso
            try {
                const Datosparqueaderos = await axios.post(`${API_BASE_URL}/parqueadero/listar`);
                setDatosParqueadero(Datosparqueaderos.data);
                //console.log(" DATOS H:::::: ", Datosparqueaderos.data);

            } catch (error) {
                console.error(error);
            }
        };

        useEffect(() => {
        CargarParqueaderos();
        }, []);

        return (
        <>
            <div className="wrapper">
                {/* Menu Desplegable */}
                <Sidebar /> {/* Aqui esta el menu lateral */}
                

                {/* Funcionalidad de la pagina */}
                <div className="main p-0 ps-4 pe-4">

                    <div className="Titulo_pagina pt-4 pb-3">
                        <h5>/ Parqueadero</h5>
                        <p className="text-muted small">Administra los espacios disponibles, ocupados y reservados de los parqueaderos.</p>
                    </div>

                    {/* tarjetas de resumen */}
                    <div className="row mb-4">

                        <div className="col-md-4">
                                <div className='card p-2'>
                                    <div className="d-flex align-items-center">
                                        <div className="bg-primary text-white rounded-circle p-2 me-3">
                                            
                                            .<i className="lni lni-map-marker-5 fs-4"></i>.
                                        </div>

                                        <div>
                                        <h6 className="mb-1 text-muted">Total de bahías </h6>
                                        <h4 className="mb-0 fw-bold">{DatosParqueadero.capacidad}</h4>
                                        </div>
                                    </div>
                                </div>
                        </div>

                        <div className="col-md-4">
                                <div className='card p-2'>
                                    <div className="d-flex align-items-center">
                                        <div className="bg-warning text-white rounded-circle p-2 me-3">
                                            .<i className="lni lni-map-marker-5 fs-4"></i>.
                                        </div>
                                        <div>
                                        <h6 className="mb-1 text-muted">Bahías ocupadas</h6>
                                        <h4 className="mb-0 fw-bold">65</h4>
                                        </div>
                                    </div>
                                </div>
                        </div>

                        <div className="col-md-4">
                                <div className='card p-2'>
                                    <div className="d-flex align-items-center">
                                        <div className="bg-success text-white rounded-circle p-2 me-3">
                                            .<i className="lni lni-map-marker-5 fs-4"></i>.
                                        </div>
                                        <div>
                                        <h6 className="mb-1 text-muted">Bahías disponibles</h6>
                                        <h4 className="mb-0 fw-bold">50</h4>
                                        </div>
                                    </div>
                                </div>
                        </div>
                            
                    </div>

                    
                    <div className="row mb-4 ps-2">

                        {DatosParqueadero.length > 0 ? (
                            DatosParqueadero.map((parqueadero) => (

                            <div  key={parqueadero._id} className="col-md-3 ps-1">
                                <div className='card p-2 ps-1 pe-1'>
                                    <div className="d-flex align-items-center">
                                        <div className=" text-white rounded-circle p-2 me-1">
                                            <img src={parqueadero.url_foto} alt="bicicleta" style={{ width: "100px"}} />
                                        </div>

                                        <div>
                                            <h6 className="mb-1 text-muted small">{parqueadero.nombre}</h6>
                                            <h6 className="mb-1 text-muted small">Capacidad: {parqueadero.capacidad}</h6>
                                            <h6 className="mb-1 text-muted small">Tipo: {parqueadero.tipo}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>  
                            ))
                        ) : (
                            <a>No tienes vehículos registrados.</a>
                        )}

                    </div>


                    {/* Tabla de Parqueaderos */}
                    <div className="card mt-4 p-3 pb-1 col-12">

                        <div className="d-flex justify-content-between mb-2">
                            <h5>Listado de Parqueaderos.</h5>
                            <button className="btn btn-warning   y">
                                <i className="lni lni-plus"></i>Agregar
                            </button>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Ubicación</th>
                                    <th>Tipo</th>
                                    <th>Capacidad</th>
                                    <th>Descripción</th>
                                    <th>Acciones</th>
                                </tr>
                                </thead>
                                <tbody>

                                {DatosParqueadero.length > 0 ? (
                                    DatosParqueadero.map((datosparq) => (
                                        <tr>
                                            <td>{datosparq.codigo}</td>
                                            <td>{datosparq.nombre}</td>
                                            <td>{datosparq.lugar}</td>
                                            <td>{datosparq.tipo}</td>
                                            <td>{datosparq.capacidad}</td>
                                            <td>{datosparq.descripcion}</td>
                                            <td>
                                            <button className="btn btn-sm btn-outline-info me-2" key={datosparq._id}> Editar </button>
                                            <button className="btn btn-sm btn-outline-danger">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td>No tienes vehículos registrados.</td></tr>
                                )}



                                {/* Puedes mapear más filas aquí desde una API */}
                                </tbody>
                            </table>
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

export default parking
