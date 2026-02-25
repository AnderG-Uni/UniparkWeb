import { useNavigate, Link  } from 'react-router-dom';
import React, { useState } from "react";
import '../style-home.css';

function Sidebar(){
    const Navigate = useNavigate();

    const ExpandirMenu = async () => {
        document.querySelector("#sidebar").classList.toggle("expand");
    }

    const handleLogout = () => {
        localStorage.clear();
        Navigate("/");
    };


    return (
    <>
        <aside id="sidebar"  >
                <div className="d-flex ">
                    <button className="toggle-btn" type="button" onClick={ExpandirMenu}>
                    <i className="lni lni-dashboard-square-1" title='Menu'></i>
                    </button>
                    <div className="sidebar-logo">
                        <Link to="/Inicio"><span className='uni'>Uni</span><span className='park'>Park</span></Link>
                    </div>
                </div>
                <ul className="sidebar-nav">
                    <li className="sidebar-item">
                        <Link to="/Inicio" className="sidebar-link">
                            <i className="lni lni-home-2" title='Inicio'></i>
                            <span>Inicio</span>
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <Link to="/Vehiculo" className="sidebar-link">
                            <i className="lni lni-car-4" title='Vehículos'></i>
                            <span>Mis vehículos</span>
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <Link to="/Usuario" className="sidebar-link">
                            <i className="lni lni-user-multiple-4" title='Mis datos'></i>
                            <span>Mis datos</span>
                        </Link>
                    </li>
                    <li className="sidebar-item" >
                        <Link to="/Historial" className="sidebar-link">
                            <i className="lni lni-pen-to-square" title='Historial'></i>
                            <span>Historial</span>
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <Link to="/Reportes" className="sidebar-link">
                            <i className="lni lni-bar-chart-4" title='Reportes'></i>
                            <span>Reportes</span>
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <Link to="/Parqueadero" className="sidebar-link">
                            <i className="lni lni-signs-post-2" title='Parqueaderos'></i>
                            <span>Parqueaderos</span>
                        </Link>
                    </li>
                    
                </ul>

                <div className="sidebar-footer">

                    <Link to="/Configuracion" className="sidebar-link">
                        <i className="lni lni-gears-3" title='Ajustes'></i>
                        <span>Ajustes</span>
                    </Link>

                    <Link to="/" className="sidebar-link">
                        <i className="lni lni-exit" title='Cerar Sesión' onClick={handleLogout}></i>
                        <span>Salir</span>
                    </Link>

                    <Link to="/Configuracion" className="sidebar-link">
                        <i className="lni lni-question-mark-circle" title='Ayuda!'></i>
                        <span>Ayuda</span>
                    </Link>
                    
                </div>
        </aside>

        <link href="https://cdn.lineicons.com/5.0/lineicons.css" rel="stylesheet" />
    </>
    );
}

export default Sidebar
