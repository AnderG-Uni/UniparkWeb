import { Await, Navigate, useNavigate } from 'react-router-dom';
import React, { useState, useRef } from "react";
import Modal from 'react-modal';
import '../style-home.css';
import Sidebar from './Unipark_Siderbar';

function UserRegister(){
    const Navigate = useNavigate();
    
    return (
    <>
        <div className="wrapper">
            {/* Menu Desplegable */}
            <Sidebar /> {/* Aqui esta el menu lateral */}


            {/* Funcionalidad de la pagina */}

            <div className="main p-0 ps-4">
                <div className="Titulo_pagina pt-4 pb-3"> <h5> / Usuarios / Registro </h5> </div>

                <div className='row col-12 p-0 m-0 '>

                    <div className=' col-7 bg-transparent card border-0 m-0 p-0 pe-4 bg-info'>
                        
                        <div className='col-12 bg-white card border-0 mb-4 p-2'>
                            <p> Titulo: </p>
                            
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
}

export default  UserRegister

