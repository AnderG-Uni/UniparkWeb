import { Await, Navigate, useNavigate, Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import axios from 'axios';
import '../style-home.css';
import Sidebar from './Unipark_Siderbar';

function Home(){

    const IDUSER = localStorage.getItem("IDUSER");  
    const NOMBRE = localStorage.getItem("NOMBRE");   
    const CORREO = localStorage.getItem("CORREO");

    if(IDUSER && NOMBRE && CORREO){

        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const [DatosPersona, setDatosPersona] = useState({});
        const [DatosVehiculo, setDatosVehiculo] = useState({});
        const [DatosHistorial, setDatosHistorial] = useState({});

        // Selector del vehículo
        const [selectedVehicle, setSelectedVehicle] = useState('');
        const handleSelect = (type) => { setSelectedVehicle(type); };
        const isSelected = (type) => selectedVehicle === type;

        const CargarDatosUser = async () => {    // foto, nombre , carrera
            try {
                const DATOSUSER = await axios.post(`${API_BASE_URL}/listar/persona`, {IDUSER});
                setDatosPersona(DATOSUSER.data);
                //console.log(" DATOS:::::: ", DATOSUSER.data)

                //Se guardan tres datos  Nombres, Carrera, Foto
                localStorage.setItem('ID_PERSONA', DATOSUSER.data._id);         // id del usuario
                localStorage.setItem('FOTO_PERFIL', DATOSUSER.data.url_foto);     // nombres del usuario
                
            } catch (error) {
                console.error(error);
            }
        };

        const CargarVehiclesUser = async () => {    // Vehículos
            try {

                //const id_usuario = await AsyncStorage.getItem('IDUSER'); //obtengo el id del usuario autenticado y hago consulta de datos
                const DATOSVEHICLE = await axios.post(`${API_BASE_URL}/listar/vehiculo`, {IDUSER});
                setDatosVehiculo(DATOSVEHICLE.data.vehiculos);
                //console.log(" DATOS V:::::: ", DATOSVEHICLE.data.vehiculos);
                //console.log(" DATOS::: ", DatosVehicles)

            } catch (error) {
                console.error(error);
            }
        };
        
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
        CargarDatosUser();
        CargarVehiclesUser();
        CargarHistorialIngresos();
        }, []);
        
        return (
        <>
            <div className="wrapper">
                <Sidebar /> {/* Aqui esta el menu lateral */}
                
                {/* Funcionalidad de la pagina */}
                <div className="main p-0 ps-4 pe-4">
                    <div className="row  col-12 m-0 p-0">
                        <div className="Titulo_pagina col-6 pt-4 pb-3"> <h5> / Inicio </h5> </div>
                        <div className="text-end col-6 pt-3 pb-3 ">
                            <Link to="/Usuario">
                                <span className='Titulo_pagina pe-2 '>{NOMBRE}</span>
                                <img
                                    src={DatosPersona.url_foto}
                                    alt="Perfil"
                                    className="rounded-circle border border-1 border-primary"
                                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                />
                            </Link>
                        </div>
                    </div>    
                        <div className='row col-12 p-0 m-0'>

                            {/* Sección izquierda */}
                            <div className='col-7 bg-transparent card border-0 m-0 p-0 pe-4'>
                                
                                {/* Mis vehículos registrados (tipo) */}
                                <div className='col-12 bg-white card border-0 mb-4 p-3'>
                                    <h5 className="mb-3">Mis vehículos</h5>

                                    <div className="d-flex justify-content-around align-items-center">

                                        {DatosVehiculo.length > 0 ? (
                                            DatosVehiculo.map((IMGVehiculo) => (

                                                <div key={IMGVehiculo._id} className="text-center" onClick={() => handleSelect('bicicleta')} style={{ cursor: 'pointer' }}>
                                                <div className="border-warning">
                                                    <img src={IMGVehiculo.urlVehiculo} alt="bicicleta" style={{ width: "100px"}} />
                                                </div>
                                                <a className=" text-warning btn-outline-warning">{IMGVehiculo.placa}</a>
                                                <p className=" text-warning btn-outline-warning">{IMGVehiculo.marca}</p>
                                                
                                                </div>
                                            ))
                                        ) : (
                                            <h5>No tienes vehículos registrados.</h5>
                                        )}
                                        
                                    </div>
                                </div>

                                {/* Tabla de vehículos registrados */}
                                <div className='col-12 bg-white card border-0 p-3'>
                                <h5 className="mb-3">Mis vehículos registrados</h5>
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th>QR</th>
                                        <th>Tipo vehículo </th>
                                        <th>Marca</th>
                                        <th>Matrícula</th>
                                        <th>Fecha Registrado</th>
                                    </tr>
                                    </thead>
                                    <tbody> 
                                        {/* info de vehiculos  */}
                                        {DatosVehiculo.length > 0 ? (
                                            DatosVehiculo.map((vehiculo) => (
                                            <tr key={vehiculo._id}>
                                                <td><i className="lni lni-qrcode" style={{ fontSize: '20px' }}></i>
                                                    <img src={vehiculo.urlQr? vehiculo.urlQr : null } alt="QR" style={{ width: '20px', height: '20px' }} />
                                                </td>
                                                <td>{vehiculo.tipo}</td>
                                                <td><i className="lni lni-car"></i> {vehiculo.marca}</td>
                                                <td>{vehiculo.placa}</td>
                                                <td><i className="lni lni-calendar"></i>{vehiculo.fecha_registro}</td>
                                            </tr>
                                            ))
                                        ) : (
                                            <tr><td>No tienes vehículos registrados.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                                </div>
                            </div>

                            {/* Sección derecha - Registros recientes */}
                            <div className='col-5  card border-0 m-0 p-0 pe-4 '>

                                <div className='col-12 bg-white card border-0 p-3'> 
                                    <h5 className="Titulo_pagina ">Ingresos a la universidad</h5>
                                    <p className="text-warning">Select one or more that you want to transfer</p>

                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <button className="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                                        Filtrar por fecha
                                        </button>
                                    </div>

                                    <table className="table table-borderless">
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
                                                    <td>{Historial.fecha_entrada}</td>
                                                    <td>{Historial.fecha_salida}</td>
                                                </tr>

                                            ))
                                            ) : (
                                                <tr><td>No tienes vehículos registrados.</td></tr>
                                            )}
                                        
                                        </tbody>
                                    </table>

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

export default Home
