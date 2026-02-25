import { useParams, Navigate, useNavigate, Link } from 'react-router-dom';
import React, { useState, useRef, useEffect } from "react";
import Modal from 'react-modal';
import '../style-home.css';
import QRCodeStyling from 'qr-code-styling';
import axios from 'axios';
import Sidebar from './Unipark_Siderbar';

function VehicleRegister(){
    
    const IDUSER = localStorage.getItem("IDUSER");
    const NOMBRE = localStorage.getItem("NOMBRE");
    const CORREO = localStorage.getItem("CORREO");

    if(IDUSER && NOMBRE && CORREO){

        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 
        const ROLUSER = localStorage.getItem("ROL");

        //datos del código QR
        const [id_vehiculo, setIdVehiculo] = useState('');
        const [color, setColor] = useState('');
        const [placa, setPlaca] = useState('');
        const [tipo, setTipo] = useState('');
        const [modelo, setModelo] = useState('');
        const [marca, setMarca] = useState('');
        const [ImagenVehiculo, setImagenVehiculo] = useState(null);
        const [UrlVehiculo, setUrlVehiculo] = useState(''); // ruta de url imagen seleccionada para visualizar
        const [mensajeActualizacion, setMensajeActualizacion] = useState(''); //mensaje de actualizdo exitoso
        const [vehiculoCreado, setVehiculoCreado] = useState(false);  // verifico si el vehiculo ya fue creado
            
        const qrRef = useRef(null);
        let CodigoQR;

        const tiposVehiculo = [
            { tipo: "Bicicleta", imagen: "http://127.0.0.1:5000/iconos/bike.png" },
            { tipo: "Carro", imagen: "http://127.0.0.1:5000/iconos/car.png" },
            { tipo: "Moto", imagen: "http://127.0.0.1:5000/iconos/motorcycle.png" },
        ];

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
                    Tipo: tipo,
                    Marca: marca,
                    Modelo: modelo,
                    url_vechiculo: UrlVehiculo,
                    id_usuario: IDUSER,
                    id_vehiculo: id_vehiculo
                };
                
                const qrdatos = JSON.stringify(datos);
                //console.log("datos;;; ", qrdatos);
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

            canvas.toBlob(async (blob) => {
                const QRIMG = new FormData();
                QRIMG.append("qrimagen", blob, "CodigoQR-prueba2.png");

                try {
                    const Respuesta = await axios.post("http://localhost:5000/api-rest/v1/subir/qr", QRIMG, {
                        headers: { "Content-Type": "multipart/form-data" }
                    });

                    alert("QR guardado en el servidor con éxito.", Respuesta.data.qrUrl);
                    console.error("Se guardo exitosamente:", Respuesta.data.qrUrl);

                } catch (error) {
                    console.error("Error subiendo el QR:", error);
                    alert("Error subiendo el código QR.");
                }
            }, "image/png");

        }

        const fechaActual = new Date().toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
        });

        const SubirImagenVehiculo = async () => {

            if (!ImagenVehiculo) {
                alert("Primero selecciona una imagen.");
                return;
            }

            const IMGVehiculo = new FormData();
            const tipoV = (tipo || 'tipo').replace(/\s+/g, '_');
            const ColorV = (color || 'color').replace(/\s+/g, '_');
            const PlacaV = (placa || 'placa').replace(/\s+/g, '_');
            const nombreArchivo = `IMG_${tipoV}_${ColorV}_${PlacaV}.jpg`; //nombre del archivo
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

        const CrearDatosVehiculo = async () => {
            try {

                {/* Se sube la imagen del vehículo */}
                let urlVehiculo = UrlVehiculo;
                if (ImagenVehiculo) { 
                    const nuevaUrl = await SubirImagenVehiculo(); // tiene que terminar para seguir
                    if (nuevaUrl) { urlVehiculo = nuevaUrl; }  // defino la nueva url ya generada en el backend
                }

                {/* se crea el vechiculo */}
                try { // se actualiza la información del vehículo
                        let id_usuario = IDUSER;
                        let urlQr = null;
                        //console.log(" url save QR: ----- ", placa, " - ", urlVehiculo, " - ", id_usuario, " - ", urlQr, " - ", color, " - ", tipo, " - ", modelo, " - ", marca );
                        const Create = await axios.post(`${API_BASE_URL}/nuevo/vehiculo`, {placa, tipo, color, marca, modelo, id_usuario, urlQr, urlVehiculo });
                        
                        setIdVehiculo(Create.data.DatosVehiculo._id);
                        setVehiculoCreado(true);
                        setMensajeActualizacion("Vehiculo Creado, por favor guarda los datos.");
                        
                } catch (error) {
                    console.error("Fallo al Guedar los datos del vehiculo. ", error);
                }
            } catch (error) {
                console.error("Fallo al subir la imagen nueva. ", error);
            }
        }

        const GuardarQRVehiculo = async () => {

            try{
                {/* Se sube el código QR generado */}
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
                    const tipoV = (tipo || 'tipo').replace(/\s+/g, '_');
                    const PlacaV = (placa || 'placa').replace(/\s+/g, '_');
                    const nombreArchivo = `QR_${tipoV}_${PlacaV}.jpg`; //defino el nombre de la imagen
                                
                    QRIMG.append("qrimagen", blob, nombreArchivo); 
                    try {

                        const Respuesta = await axios.post(`${API_BASE_URL}/subir/qr`, QRIMG, {
                            headers: { "Content-Type": "multipart/form-data" }
                        });

                        // se asigna la nueva url del QR almacenada en el servidor
                        const urlQr = Respuesta.data.qrUrl;
                        //se debe actualizar el campo de urlQr en vehiculo
                        const Update = await axios.post(`${API_BASE_URL}/actualizar/vehiculo`, {placa, urlQr});
                        setMensajeActualizacion(Update.data.status); // ← Mostrar mensaje del backend en la interfaz
                                        
                        } catch (error) {
                            console.error("Error subiendo el QR:", error);
                            //alert("Error subiendo el código QR.", error);
                        }
                }, "image/png");

            }catch(e){
                console.error("Error general subiendo el código QR.", error);
                alert("Error general subiendo el código QR.", error);
            }

        }

        useEffect(() => {
            GenerarQR();
        }, []);

        useEffect(() => {
            if (color || placa || tipo || marca || modelo) {
                GenerarQR();
            }
        }, [color, placa, tipo, marca, modelo]);  // aqui puedo agregar el campo de imagen para que tambien se actualice la url 

        useEffect(() => {
            if (vehiculoCreado) {
                GenerarQR();
            }
        }, [vehiculoCreado]);  // aqui puedo agregar el campo de imagen para que tambien se actualice la url 

        return (
            <>
                <div className="wrapper">
                    {/* Menu Desplegable */}
                    <Sidebar /> {/* Aqui esta el menu lateral */}


                    {/* Funcionalidad de la pagina */}

                    <div className="main p-0 ps-4">
                        <div className="Titulo_pagina pt-4 pb-3"> <h5> <Link className='Titulo_pagina' to="/Vehiculo"> / Vehículos</Link> / Registro </h5> </div>



                        <div className='row col-12 p-0 m-0 '>

                            <div className='col-7 bg-transparent card border-0 m-0 p-0 pe-4'>

                                <div className="card  p-4 mb-4 col-12">

                                    {mensajeActualizacion && (
                                        <div className="alert alert-success mt-2" role="alert">
                                            {mensajeActualizacion}
                                        </div>
                                    )}

                                    <h5 className="fw-bold mb-3">Tipo Vehículo</h5>
                                    <div className="d-flex gap-4 align-items-center">
                                        {tiposVehiculo.map((veh) => (
                                            <div
                                            key={veh.tipo}
                                            onClick={ () => setTipo(veh.tipo) }
                                            className={`d-flex flex-column align-items-center justify-content-center text-center text-center cursor-pointer ${
                                                tipo === veh.tipo ? "border border-warning rounded p-2" : ""
                                            }`}
                                            style={{ width: "120px", height: "150px" }}
                                            >
                                            <img
                                                src={tipo === veh.tipo && UrlVehiculo ? UrlVehiculo : veh.imagen}
                                                alt={veh.tipo}
                                                className="img-fluid mb-2"
                                                style={{ maxHeight: "70px", objectFit: "contain" }}
                                            />



                                            {/*<span className="badge bg-warning text-white px-3 py-2">
                                                {veh.tipo}
                                            </span>*/}

                                                <label
                                                    htmlFor={veh.tipo}
                                                    className="badge bg-warning top-0 end-0  border shadow"
                                                    style={{ cursor: 'pointer' }}
                                                    title={"Seleccionar foto de " + veh.tipo}
                                                >
                                                <i className="lni lni-select-cursor-1 text-white fs-5 p-0 m-0"></i>
                                                
                                                {veh.tipo}
                                                </label>

                                                <input
                                                    type="file"
                                                    id={veh.tipo}
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
                                        ))}
                                    </div>
                                </div>

                                <div className="card p-4 col-12">
                                    <h5 className="fw-bold mb-3">Información del vehículo</h5>
                                    <div className="row g-3">
                                        
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Marca del vehículo</label>
                                            <input type="text" className="form-control" onChange={(e) => setMarca(e.target.value)}  placeholder="Mazda, Pulsar..." />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Modelo del vehículo</label>
                                            <input type="text" className="form-control" onChange={(e) => setModelo(e.target.value)}  placeholder="CX-5, 150NS..." />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Color</label>
                                            <input type="text" className="form-control" onChange={(e) => setColor(e.target.value)}  placeholder="Negro, Rojo..." />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Matrícula</label>
                                            <input type="text" className="form-control" onChange={(e) => setPlaca(e.target.value)}  placeholder="XXX123" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold"><strong>Fecha de registro</strong></label>
                                            <label className="form-control">{fechaActual}</label>
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
                                {/* quiero que se  GuardarQRVehiculo */}
                                <button className="btn btn-warning w-100 fw-bold" onClick={vehiculoCreado ? GuardarQRVehiculo : CrearDatosVehiculo}>
                                    {vehiculoCreado ? "Guardar datos" : "Crear Vehículo"}
                                </button>
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

export default VehicleRegister