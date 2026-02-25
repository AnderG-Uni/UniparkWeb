import { Await, Navigate, useNavigate, Link } from 'react-router-dom';
import React, { useState, useRef, useEffect  } from "react";
import Modal from 'react-modal';
import '../style-home.css';
import QRCodeStyling from 'qr-code-styling';
import axios from 'axios';
import Sidebar from './Unipark_Siderbar';

function Vehicle(){

    const IDUSER = localStorage.getItem("IDUSER");  
    const NOMBRE = localStorage.getItem("NOMBRE");   
    const CORREO = localStorage.getItem("CORREO");

    if(IDUSER && NOMBRE && CORREO){

        const Navigate = useNavigate();
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const IDUSER = localStorage.getItem("IDUSER");  
        const [DatosVehiculo, setDatosVehiculo] = useState({});
        const [modalIsOpen, setModalIsOpen] = useState(false);
        const [qrSeleccionado, setQrSeleccionado] = useState("");

        const CargarVehiclesUser = async () => {    // Vehículos
            try {

                //const id_usuario = await AsyncStorage.getItem('IDUSER'); //obtengo el id del usuario autenticado y hago consulta de datos
                const DATOSVEHICLE = await axios.post(`${API_BASE_URL}/listar/vehiculo`, {IDUSER});
                setDatosVehiculo(DATOSVEHICLE.data.vehiculos);
                //console.log(" DATOS V:::::: ", DATOSVEHICLE.data.vehiculos);

            } catch (error) {
                console.error(error);
            }
        };

        const EditarVehiculo = (id_vehiculo) => {   // función para mandar el id del vehiculo a editar
            Navigate(`/Vehiculo/Actualizar/${id_vehiculo}`);
        };


        const EliminarVehiculo = async (id_vehiculo, placa) => {
            const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar el vehículo con placa ${placa}?`);

            if (!confirmar) return;

            try {
                const respuesta = await axios.post(`${API_BASE_URL}/eliminar/vehiculo`, { id_vehiculo: id_vehiculo });

                if (respuesta.data.status) {
                    alert(respuesta.data.status);
                    CargarVehiclesUser(); // Recarga la lista
                } else {
                    alert("No se pudo eliminar el vehículo.");
                }
            } catch (error) {
                console.error("Error al eliminar vehículo:", error);
                alert("Error en la eliminación. Intenta más tarde.");
            }
        };


            // función para abrir el modal con el QR del vehículo
            const abrirModalQr = (qrUrl) => {
                setQrSeleccionado(qrUrl);
                setModalIsOpen(true);
            };

            // función para cerrar el modal
            const cerrarModal = () => {
                setModalIsOpen(false);
                setQrSeleccionado("");
            };  

            const descargarQR = () => {

                const img = new Image();
                img.crossOrigin = 'anonymous'; // Muy importante si es una URL externa
                img.src = qrSeleccionado;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    const dataURL = canvas.toDataURL('image/png');

                    const link = document.createElement('a');
                    link.href = dataURL;
                    link.download = 'codigo_qr_vehiculo.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                };

                img.onerror = () => {
                    console.error('Error cargando la imagen del QR');
                    alert('No se pudo descargar el código QR. Verifica la URL.');
                };

            };

        useEffect(() => {
            CargarVehiclesUser();
        }, []);
        
        return (
            <>
                <div className="wrapper">
                    {/* Menu Desplegable */}
                    <Sidebar /> {/* Aqui esta el menu lateral */}

                    {/* Funcionalidad de la pagina */}
                    <div className="main ps-4 pe-4">

                        <div className="row col-12">

                            <div className="col-8">
                                <div className="Titulo_pagina pt-3 pb-3">
                                    <h5>/ Vehículos</h5>
                                    <p className="text-muted small">vehículos  de ingresos y transferencias de usuarios y administradores</p>
                                </div>
                            </div>

                            <div className="col-4">
                                <div className="d-flex justify-content-end pt-5">
                                    <Link to="/Vehiculo/Registrar">
                                        <button  className="btn btn-warning text-white fw-bold">
                                        Añadir
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        

                        <div className="row col-12 m-0 d-flex flex-column gap-3">

                            {DatosVehiculo.length > 0 ? (
                                DatosVehiculo.map((Vehiculo) => (
                                
                                    <div key={Vehiculo._id} className="card pt-3 pb-3 ps-4 col-12 d-flex flex-row justify-content-between align-items-center" >
                                    
                                        <div className="d-flex align-items-center  gap-4">                             
                                            <div className="d-flex flex-column align-items-center ">

                                                <img src={Vehiculo.urlVehiculo} alt={Vehiculo.nombre} style={{ width: "150px", height: "auto" }} /> 
                                                
                                            </div>
                                        </div>

                                        {/* Datos del vehículo */}

                                        <div className="d-flex align-items-center gap-5 ">

                                            <div className="text-center" style={{ cursor: "pointer" }} onClick={() => abrirModalQr(Vehiculo.urlQr)}>
                                                <p className="fw-bold mb-1">Código QR</p>
                                                <img src={Vehiculo.urlQr? Vehiculo.urlQr : null} style={{ width: "40px", height: "auto" }} alt='QR' />
                                                <i className="lni lni-qr-code fs-3 text-warning"></i>
                                            </div>

                                            <div className="text-center">
                                                <p className="fw-bold mb-1">Tipo</p>
                                                <p>{Vehiculo.tipo}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="fw-bold mb-1">Marca</p>
                                                <p>{Vehiculo.marca}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="fw-bold mb-1">Placa</p>
                                                <p>{Vehiculo.placa}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="fw-bold mb-1">Color</p>
                                                <p>{Vehiculo.color}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="fw-bold mb-1">Modelo</p>
                                                <p>{Vehiculo.modelo}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="fw-bold mb-1">Registrado</p>
                                                <p>{Vehiculo.fecha_registro}</p>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-column gap-2 pe-4">
                                            <button className="btn btn-sm btn-outline-secondary" title='Editar' onClick={() => EditarVehiculo(Vehiculo._id)} >
                                                <i className="lni lni-pencil-1"></i>
                                            </button>

                                            <button className="btn btn-sm btn-outline-danger " title='Eliminar' onClick={() => EliminarVehiculo(Vehiculo._id, Vehiculo.placa)}>
                                                <i className="lni lni-trash-3"></i>
                                            </button>
                                            
                                        </div>

                                    </div>

                                ))
                            ) : (
                                <h5>No tienes vehículos registrados.</h5>
                            )}

                        </div>
                    </div>
                </div>

                <link href="https://cdn.lineicons.com/5.0/lineicons.css" rel="stylesheet" />




                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={cerrarModal}
                    contentLabel="Código QR del Vehículo"
                    style={{
                        overlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.6)'
                        },
                        content: {
                            maxWidth: '400px',
                            margin: 'auto',
                            padding: '2rem',
                            borderRadius: '12px',
                            textAlign: 'center',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                        }
                    }}
                >
                    <h5 className="mb-3">Código QR del Vehículo</h5>
                    <img src={qrSeleccionado} alt="Código QR" style={{ width: "100%", maxWidth: "300px", height: "auto" }} />

                    <div className="d-flex justify-content-center gap-3 pt-4">
                        <button onClick={cerrarModal} className="btn btn-secondary">
                            Cerrar
                        </button>
                        <button onClick={descargarQR} className="btn btn-warning text-white fw-bold">
                            Descargar
                        </button>
                    </div>

                </Modal>


            </>
        );

    }else{
        window.location = '/'
    }
}

export default Vehicle