import { useParams, Navigate, useNavigate, Link } from 'react-router-dom';
import React, { useState, useRef, useEffect } from "react";
import Modal from 'react-modal';
import '../style-home.css';
import QRCodeStyling from 'qr-code-styling';
import axios from 'axios';
import Sidebar from './Unipark_Siderbar';

function VehicleUpdate(){

    const IDUSER = localStorage.getItem("IDUSER");
    const NOMBRE = localStorage.getItem("NOMBRE");
    const CORREO = localStorage.getItem("CORREO");

    if(IDUSER && NOMBRE && CORREO){

        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 
        const { id_vehiculo } = useParams(); // Obtengo el parámetro idvehiculo desde la URL
        const ROLUSER = localStorage.getItem("ROL");

        //datos del código QR
        const [DatosVehiculo, setDatosVehiculo] = useState({});
        const [color, setColor] = useState('');
        const [placa, setPlaca] = useState('');
        const [ImagenVehiculo, setImagenVehiculo] = useState(null);
        const [UrlVehiculo, setUrlVehiculo] = useState(''); // ruta de url imagen seleccionada para visualizar
        const [mensajeActualizacion, setMensajeActualizacion] = useState(''); //mensaje de actualizdo exitoso
        
        const qrRef = useRef(null);
        let CodigoQR;
        
        function GenerarQR () {
            try {

                if (qrRef.current) {
                    qrRef.current.innerHTML = ""; // Limpia cualquier contenido anterior
                }

                const datos = {
                    nombre: NOMBRE,
                    correo: CORREO,
                    rol: ROLUSER,
                    Placa: placa,
                    Color: color,
                    url_vechiculo: UrlVehiculo,
                    id_usuario: IDUSER,
                    id_vehiculo: id_vehiculo
                };
                const qrdatos = JSON.stringify(datos);
                CodigoQR = new QRCodeStyling({ 
                    type:"canvas",
                    shape:"square",
                    data: qrdatos,
                    width:250,
                    height:250,
                    margin:1,
                    image:"http://localhost:5173/logounipark.png",
                    qrOptions:{"typeNumber":"0","mode":"Byte","errorCorrectionLevel":"L"},
                    imageOptions:{"saveAsBlob":true,"hideBackgroundDots":true,"imageSize":0.9,"margin":1},
                    dotsOptions:{"type":"rounded","color":"#5D5D5D","roundSize":true,"gradient":null},
                    backgroundOptions:{"round":0,"color":"#ffffff"},
                    dotsOptionsHelper:{"colorType":{"single":true,"gradient":false}},
                    cornersSquareOptions:{"type":"extra-rounded","color":"#EFB023"},
                    cornersSquareOptionsHelper:{"colorType":{"single":true,"gradient":false}},
                    cornersDotOptions:{"type":"","color":"#EFB023"},
                    cornersDotOptionsHelper:{"colorType":{"single":true,"gradient":false}},
                    backgroundOptionsHelper:{"colorType":{"single":true,"gradient":false}}
                });
                CodigoQR.append(qrRef.current);
                
            }catch (error) {
                console.log("error: ", error);
            window.alert("Ha ocurrido un error al generar el QR.");
            }
        }

        const SubirQR = async () => {
            if (!qrRef.current) {
                alert("No se encontró el contenedor del QR.");
                return;
            }

            const canvas = qrRef.current?.querySelector("canvas");
            if (!canvas) {
                alert("Primero genera un código QR.");
                return;
            }

            const urlQr = "";
            canvas.toBlob(async (blob) => {
                if (!blob) return reject("No se pudo generar blob del QR.");

                const QRIMG = new FormData();
                const tipo = (DatosVehiculo.tipo || 'tipo').replace(/\s+/g, '_');
                const Placa = (placa || 'placa').replace(/\s+/g, '_');
                const nombreArchivo = `QR_${tipo}_${Placa}.jpg`; //defino el nombre de la imagen
                
                QRIMG.append("qrimagen", blob, nombreArchivo); 
                try {
                    console.log("dato a guardar QR::::: ", QRIMG, " - ", nombreArchivo);
                    const Respuesta = await axios.post(`${API_BASE_URL}/subir/qr`, QRIMG, {
                        headers: { "Content-Type": "multipart/form-data" }
                    });

                    urlQr = Respuesta.data.qrUrl;
                    console.log("Respuesta :::: ;;;;; ", urlQr);
                    setNewUrlQR(urlQr);
                    return reject(urlQr);

                    
                    
                    //setNewUrlQR(Respuesta.data.qrUrl);
                    //resolve(Respuesta.data.qrUrl);
                    //return Respuesta.data.qrUrl;

                } catch (error) {
                    //console.error("Error subiendo el QR:", error);
                    alert("Error subiendo el código QR.");
                }
            }, "image/png");

                return urlQr;

        }

        const CargarInfoVehiculo = async () => {    // Vehículos
            try {
                const DATOSVEHICLE = await axios.post(`${API_BASE_URL}/listar/vehiculoid`, {id_vehiculo});
                setDatosVehiculo(DATOSVEHICLE.data.vehiculos[0]);
                setColor(DATOSVEHICLE.data.vehiculos[0].color || '');
                setPlaca(DATOSVEHICLE.data.vehiculos[0].placa || '');
                setUrlVehiculo(DATOSVEHICLE.data.vehiculos[0].urlVehiculo || '');
                //setIdVehiculo(DATOSVEHICLE.data.vehiculos[0]._id || '');
            
            } catch (error) {
                console.error(error);
            }
        };

        const SubirImagenVehiculo = async () => {

            if (!ImagenVehiculo) {
                alert("Primero selecciona una imagen.");
                return;
            }

            const IMGVehiculo = new FormData();
            const tipo = (DatosVehiculo.tipo || 'tipo').replace(/\s+/g, '_');
            const Color = (color || 'color').replace(/\s+/g, '_');
            const Placa = (placa || 'placa').replace(/\s+/g, '_');
            const nombreArchivo = `IMG_${tipo}_${Color}_${Placa}.jpg`; //nombre del archivo
            IMGVehiculo.append("ImagenVehiculo", ImagenVehiculo, nombreArchivo);  // preparo el archivo  a subir
            try {
                const response = await axios.post(`${API_BASE_URL}/subir/imagenvehiculo`, IMGVehiculo, {
                    headers: { "Content-Type": "multipart/form-data" }
                });

                //setNewUrlVehiculo(response.data.qrUrl);
                // alert("Imagen subida con éxito", response.data.qrUrl);
                //console.log("URL imagen:", response.data.qrUrl);
                return response.data.qrUrl;

            } catch (error) {
                console.error("Error al subir la imagen:", error);
                alert("Error al subir la imagen.");
            }
        };

        const ActualizarDatos = async () => {
            
            try {

                {/* Se sube la imagen del vehículo */}
                let urlVehiculo = UrlVehiculo;
                if (ImagenVehiculo) { 
                    const nuevaUrl = await SubirImagenVehiculo(); // tiene que terminar para seguir
                    if (nuevaUrl) { urlVehiculo = nuevaUrl; }  // defino la nueva url ya generada en el backend
                }

                {/* Se sube el código QR */}
                if (!qrRef.current) {
                    alert("No se encontró el contenedor del QR.");
                    return;
                }

                const canvas = qrRef.current?.querySelector("canvas");
                if (!canvas) {
                    alert("Primero genera un código QR.");
                    return;
                }

                canvas.toBlob(async (blob) => {
                    if (!blob) return reject("No se pudo generar blob del QR.");

                    const QRIMG = new FormData();
                    const tipo = (DatosVehiculo.tipo || 'tipo').replace(/\s+/g, '_');
                    const Placa = (placa || 'placa').replace(/\s+/g, '_');
                    const nombreArchivo = `QR_${tipo}_${Placa}.jpg`; //defino el nombre de la imagen
                    
                    QRIMG.append("qrimagen", blob, nombreArchivo); 
                    try {
                        const Respuesta = await axios.post(`${API_BASE_URL}/subir/qr`, QRIMG, {
                            headers: { "Content-Type": "multipart/form-data" }
                        });
                        const urlQr = Respuesta.data.qrUrl;
                        
                        try { // se actualiza la información del vehículo
                            //console.log(" url save QR: ----- ", urlQr);
                            const Update = await axios.post(`${API_BASE_URL}/actualizar/vehiculo`, {placa, urlVehiculo, urlQr, color});
                            setMensajeActualizacion(Update.data.status); // ← Mostrar mensaje del backend en la interfaz
                            
                        } catch (error) {
                            console.error("Fallo al Actualizar los datos. ", error);
                        }

                    } catch (error) {
                        console.error("Error subiendo el QR:", error);
                        alert("Error subiendo el código QR.", error);
                    }
                }, "image/png");

            } catch (error) {
                console.error("Fallo al subir la imagen nueva. ", error);
            }
        }

        useEffect(() => {
            CargarInfoVehiculo();
            GenerarQR();
        }, []);

        useEffect(() => {
            if (color && placa && UrlVehiculo && id_vehiculo) {
                GenerarQR();
            }
        }, [color, UrlVehiculo]);  // aqui puedo agregar el campo de imagen para que tambien se actualice la url 

        return (
            <>
                <div className="wrapper">
                    {/* Menu Desplegable */}
                    <Sidebar /> {/* Aqui esta el menu lateral */}

                    {/* Funcionalidad de la pagina */}
                    <div className="main p-0 ps-4">
                        <div className="Titulo_pagina pt-4 pb-3"> <h5> <Link className='Titulo_pagina' to="/Vehiculo"> / Vehículos</Link> / Actualizar </h5> </div>

                        <div className='row col-12 p-0 m-0 '>
                            <div className='col-7 bg-transparent card border-0 m-0 p-0 pe-4'>
                                <div className="card p-4 col-12">

                                    {mensajeActualizacion && (
                                        <div className="alert alert-success mt-2" role="alert">
                                            {mensajeActualizacion}
                                        </div>
                                    )}

                                    <h5 className="fw-bold mb-3">Información del vehículo</h5>

                                    <div className="row col-12 m-0 p-0">
                                        <div className="col-4"></div>
                                        {/* Imagen del vehículo */}
                                        <div className="card bg-transparent  border-0 col-4  p-0 mb-4" >
                                            <img className="img-fluid " src={UrlVehiculo || DatosVehiculo.urlVehiculo}  />

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
                                                        setImagenVehiculo(file); // Guardar archivo (datos)
                                                        setUrlVehiculo(url); // Actualiza vista previa local
                                                    }
                                                }}
                                            />
                                        </div>  

                                        <div className="col-4"></div> 
                                    </div> 

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label"><strong>Color</strong></label>
                                            <input type="text" className="form-control" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Negro, Rojo..." />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label"><strong>Tipo Vehículo</strong></label>
                                            <label className="form-control">{DatosVehiculo.tipo}</label>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label"><strong>Marca del vehículo</strong></label>
                                            <label className="form-control">{DatosVehiculo.marca}</label>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label"><strong>Modelo del vehículo</strong></label>
                                            <label className="form-control">{DatosVehiculo.modelo}</label>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label"><strong>Matrícula</strong></label>
                                            <label className="form-control">{DatosVehiculo.placa}</label>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label"><strong>Registrado</strong></label>
                                            <label className="form-control">{DatosVehiculo.fecha_registro}</label>
                                        </div>
                                    </div>

                                </div>

                            </div>


                            {/* Información lateral con QR */}
                            <div className=' col-5 bg-transparent card border-0 m-0 p-0 pe-4'>
                                
                                <div className="card p-4 col-12 ">
                                <h5 className="fw-bold Titulo_pagina mb-0">Tu código QR</h5>
                                <p className=" mb-3 text-warning small"> Otros datos del código QR</p>

                                <div className='row col-12  p-0 pb-2'> 
                                    <div className="col-6 pe-1">
                                        <strong>Nombre usuario</strong>
                                        <p className='text-muted small p-0 m-0'>{NOMBRE}</p>
                                    </div>
                                    <div className="col-6 pe-0  ps-1">
                                        <strong>ID de usuario</strong>
                                        <p className='text-muted small p-0 m-0'> {IDUSER}</p>
                                    </div>
                                </div>

                                <div className='row col-12 p-0 pb-3'> 
                                    <div className="col-6 pe-1">
                                        <strong>Tipo de usuario</strong>
                                        <p className='text-muted small p-0 m-0'>{ROLUSER}</p>
                                    </div>
                                    <div className="col-6 pe-1  ps-1">
                                        <strong>Estado</strong>
                                        <p className='text-muted small p-0 m-0'>Activo</p>
                                    </div>
                                </div>

                                <div className=" row col-12 p-0  border-top ms-0 mb-2 pt-3 justify-content-center">

                                    <div className="d-flex justify-content-center">
                                        <div ref={qrRef} className="border-0 "></div>
                                    </div>
                                    
                                </div>
                                <button className="btn btn-warning w-100 fw-bold" onClick={ActualizarDatos}>Guardar QR</button>
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

export default VehicleUpdate