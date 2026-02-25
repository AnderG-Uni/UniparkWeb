import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import '../style-home.css';
import Sidebar from './Unipark_Siderbar';
import axios from 'axios';

function History(){

    const IDUSER = localStorage.getItem("IDUSER");  
    const NOMBRE = localStorage.getItem("NOMBRE");   
    const CORREO = localStorage.getItem("CORREO");

    if(IDUSER && NOMBRE && CORREO){

        const [DatosHistorial, setDatosHistorial] = useState({});
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

        const CargarHistorialIngresos = async () => {    // historial de ingreso
            try {
                const id_persona = localStorage.getItem("ID_PERSONA");
                //console.log("id_persona----------- ", id_persona);
                const DatosHistorial = await axios.post(`${API_BASE_URL}/autenticacion/historial`, {id_persona});
                setDatosHistorial(DatosHistorial.data);
                //console.log(" DATOS H:::::: ", DatosHistorial.data);

            } catch (error) {
                console.error(error);
            }
        };

        useEffect(() => {
        CargarHistorialIngresos();
        }, []);

        return (
        <>
            <div className="wrapper">
                {/* Menu Desplegable */}
                <Sidebar /> {/* Aqui esta el menu lateral */}
                

                {/* Funcionalidad de la pagina */}
                <div className="main p-0 ps-4">
                    <div className="Titulo_pagina pt-4 pb-3">
                        <h5> / Historial </h5>
                        <p className="text-muted small">see history a transfer from user to user and from admin to users</p>
                    </div>

                    <div className="row col-12 m-0 d-flex gap-3">

                        {/* Ingresos a la universidad */}
                        <div className="card col-6 p-4">

                            <h5 className="text-primary">Ingresos.</h5>
                            <p className="text-muted">Tu historial de ingresos a las distintas sedes de la universidad.</p>


                            <table className="table table-borderless ">

                                <thead>
                                    <tr>
                                        <th>Vehículo</th>
                                        <th>Sede</th>
                                        <th>Fecha ingreso</th>
                                        <th>Fecha salida</th>
                                    </tr>
                                </thead>

                                <tbody>
                                            
                                    {/* info de vehiculos  */}
                                    {DatosHistorial.length > 0 ? (
                                        DatosHistorial.map((Historial) => (

                                        <tr key={Historial._id}>
                                            <td>{Historial.datos_vehiculo.placa}</td>
                                            <td>{Historial.sede}</td>
                                            <td>{Historial.fecha_entrada + " " + Historial.hora_entrada}</td>
                                            <td>{Historial.fecha_salida + " " + Historial.hora_salida}</td>
                                        </tr>

                                        ))
                                    ) : (
                                        <tr><td>No tienes vehículos registrados.</td></tr>
                                    )}
                                        
                                </tbody>
                            </table>
                        </div>

                        {/* Ingresos a la plataforma */}
                        <div className="card col-5 p-4">
                            <h5 className="text-primary">Ingresos a Unipark.</h5>
                            <p className="text-muted">Historial de ingresos a la platafroma.</p>

                            <table className="table table-borderless">
                                <thead>
                                <tr>
                                    <th>Correo</th>
                                    <th>Fecha Ingreso</th>
                                    <th>Acción</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>{CORREO}</td>
                                    <td>06/06/2025 06:23</td>
                                    <td><i class="lni lni-xmark-circle fs-5 text-danger" title='Eliminar'></i></td>
                                </tr>
                                <tr>
                                    <td>{CORREO}</td>
                                    <td>04/06/2025 21:51</td>
                                    <td><i class="lni lni-xmark-circle fs-5 text-danger" title='Eliminar'></i></td>
                                </tr>
                                <tr>
                                    <td>{CORREO}</td>
                                    <td>30/05/2025 16:15</td>
                                    <td><i class="lni lni-xmark-circle fs-5 text-danger" title='Eliminar'></i></td>
                                </tr>
                                <tr>
                                    <td>{CORREO}</td>
                                    <td>30/05/2025 23:58</td>
                                    <td><i class="lni lni-xmark-circle fs-5 text-danger" title='Eliminar'></i></td>
                                </tr>
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

export default History
