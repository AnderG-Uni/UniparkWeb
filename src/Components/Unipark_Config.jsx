import { Await, Navigate, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import '../style-home.css';
import Sidebar from './Unipark_Siderbar';

function Config(){
    
    const IDUSER = localStorage.getItem("IDUSER");  
    const NOMBRE = localStorage.getItem("NOMBRE");   
    const CORREO = localStorage.getItem("CORREO");

    if(IDUSER && NOMBRE && CORREO){

        const [idioma, setIdioma] = useState('es');

        useEffect(() => {
            const idiomaGuardado = localStorage.getItem('idioma');
            if (idiomaGuardado) setIdioma(idiomaGuardado);
        }, []);

        const handleIdiomaChange = (e) => {
            const nuevoIdioma = e.target.value;
            setIdioma(nuevoIdioma);
            localStorage.setItem('idioma', nuevoIdioma);
            // Aquí podrías añadir lógica para recargar idioma con i18n
        };

        return (
        <>
            <div className="wrapper">
                {/* Menu Desplegable */}
                <Sidebar /> {/* Aqui esta el menu lateral */}


                {/* Funcionalidad de la pagina */}

                <div className="main p-0 ps-4">
                    <div className="Titulo_pagina pt-4 pb-3"> 
                        <h5> / Configuraciones </h5>
                        <p className="text-muted small">Configuraciones  de ingresos y transferencias de usuarios y administradores</p>
                    </div>




                    <div className='row col-12 p-0 m-0 '>


                        <div className="row col-12 p-0 m-0 mb-4">
                            <div className="card border-0 col-6 p-4">
                                <h5 className="fw-bold mb-4 text-primary">Preferencias</h5>

                                <div className="mb-3">
                                <label htmlFor="selectIdioma" className="form-label text-warning">
                                    Idioma de la aplicación
                                </label>
                                <select
                                    id="selectIdioma"
                                    className="form-select"
                                    value={idioma}
                                    onChange={handleIdiomaChange}
                                >
                                    <option value="es">Español</option>
                                    <option value="en">Inglés</option>
                                </select>
                                <div className="form-text text-muted mt-1">
                                    Cambia el idioma en que se muestra la interfaz.
                                </div>
                                </div>
                            </div>
                        </div>


                        <div className=' col-7 bg-transparent card border-0 m-0 p-0 pe-4'>
                            
                            <div className='col-12 bg-white card border-0 mb-4 p-2'>
                                <p> Titulo: del inicio</p>
                                
                            </div>

                            <div className='col-12 bg-white card border-0 p-2'>
                                <p> Titulo card2</p>
                            </div>

                        </div>

                        <div className=' col-5 bg-transparent card border-0 m-0 p-0 pe-4'>
                            
                            <div className='col-12 bg-white card border-0 p-2'>
                                <p> Titulo card3</p>
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

export default Config
