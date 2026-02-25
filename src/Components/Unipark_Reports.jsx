import { useNavigate } from 'react-router-dom';
import React from "react";
import '../style-home.css';
import Sidebar from './Unipark_Siderbar';

function Reportes(){

    const IDUSER = localStorage.getItem("IDUSER");  
    const NOMBRE = localStorage.getItem("NOMBRE");   
    const CORREO = localStorage.getItem("CORREO");

    if(IDUSER && NOMBRE && CORREO){

        return (
        <>
            <div className="wrapper">
                {/* Menu Desplegable */}
                <Sidebar /> {/* Aqui esta el menu lateral */}
                
                {/* Funcionalidad de la pagina */}
                <div className="main ps-4 pe-4 pt-4">
                    
                        {/* Encabezado */}
                        <div className="Titulo_pagina mb-4">
                            <h5>/ Reportes</h5>
                            <p className="text-muted small">Ver historial de ingresos y transferencias de usuarios y administradores</p>
                        </div>

                        {/* Tarjetas de resumen */}
                        <div className="row mb-4">

                            <div className="col-md-4">
                                <div className="card p-3 text-center">
                                    <img src="https://img.icons8.com/ios-filled/50/FFB200/car--v1.png" alt="carro" width="40" className="mb-2" />
                                    <h6>Carros</h6>
                                    <p className="fw-bold text-primary">21 carros parqueados</p>
                                </div>
                            </div>
                            
                            <div className="col-md-4">
                                <div className="card p-3 text-center">
                                    <img src="https://img.icons8.com/ios-filled/50/FFB200/motorcycle.png" alt="moto" width="40" className="mb-2" />
                                    <h6>Motos</h6>
                                    <p className="fw-bold text-primary">35 motos parqueadas</p>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="card p-3 text-center">
                                    <img src="https://img.icons8.com/ios-filled/50/FFB200/bicycle.png" alt="bicicleta" width="40" className="mb-2" />
                                    <h6>Bicicletas</h6>
                                    <p className="fw-bold text-primary">35 bicicletas parqueadas</p>
                                </div>
                            </div>
                        </div>

                        {/* Gráficas de barras */}
                        <div className="row">
                            <div className="col-6 mb-4">
                                <div className="card p-3">
                                    <div className='Titulo_pagina'><h5 className="mb-3 ">Cantidad vehículos ingresados hoy</h5> </div>
                                    <p className="text-muted">TOTAL: 1452</p>
                                    <div style={{ height: "200px", backgroundColor: "#f1f1f1" }} className="rounded d-flex justify-content-center align-items-center text-muted">
                                        (Gráfico de barras aquí)
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 mb-4">
                                <div className="card p-3">
                                    <div className='Titulo_pagina'><h5 className="mb-3 Titulo_pagina">Cantidad vehículos ingresados en la semana</h5> </div>
                                    <p className="text-muted">TOTAL: 456</p>
                                    <div style={{ height: "200px", backgroundColor: "#f1f1f1" }} className="rounded d-flex justify-content-center align-items-center text-muted">
                                        (Gráfico de barras aquí)
                                    </div>
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

export default Reportes
