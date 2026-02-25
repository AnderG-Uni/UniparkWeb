import { Navigate, useNavigate, Link } from 'react-router-dom';
import React, { useState } from "react";
import Modal from 'react-modal';
import '../index.css'

Modal.setAppElement('#root');

function Login(){
  const Navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        correo: '',
        clave: '',
    });
    
      const validate = () => {             // validacion de campos
        const newErrors = {};
        
        if (!formData.correo.trim()) {
          newErrors.correo = 'El correo es obligatorio.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
          newErrors.correo = 'Correo inválido.';
        }
    
        if (!formData.clave) {
          newErrors.clave = 'La clave es obligatoria.';
        } else if (formData.clave.length < 8) {
          newErrors.clave = 'Debe tener al menos 6 caracteres.';
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e) => {          // Se envia formulario para login
        e.preventDefault();
        if (validate()) {          
            try {
              const response = await fetch( `${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({  correo: formData.correo, clave: formData.clave })
              });

              const result = await response.json();
              if (result.status === "Bienvenido"  ) {
                    //console.log(`User: ${result.user}, Role: ${result.rol}`);
                    localStorage.setItem('IDUSER', result._id);         // id del usuario
                    localStorage.setItem('NOMBRE', result.nombres);     // nombres del usuario
                    localStorage.setItem('CORREO', result.correo);      // correo del usuario
                    localStorage.setItem('ROL', result.rol);      // rol del usuario
                    Navigate("/Inicio");
              } else {
                //setError('Usuario o clave incorrecto');
                window.alert("Usuario o clave incorrecto");
              }
            } catch (error) {
              //console.error('Error:', error);
              window.alert("Ha ocurrido un error al consultar las credenciales.");
            }
        }
      };


    return (
    <>
      <div className="d-flex vh-100">

        {/* Formulario */}
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-light">

          <div className="card border-0 p-5 pt-4 shadow-sm w-75">
            <h2 className="mb-5 text-center Titulo_pagina ">Hola, Bienvenido a <span className="fw-bold text-warning">UniPark</span></h2>

            <form onSubmit={handleSubmit}>

              <div className="mb-2">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className={`form-control ${errors.correo ? 'is-invalid' : ''}`}
                  placeholder="example@example.com"
                />
                {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
              </div>

              

              <div className="mb-4">
                <label className="form-label">Clave  </label>
                <input
                  type="password"
                  name="clave"
                  value={formData.clave}
                  onChange={handleChange}
                  className={`form-control ${errors.clave ? 'is-invalid' : ''}`}
                  placeholder="***********"
                />
                {errors.clave && <div className="invalid-feedback">{errors.clave}</div>}
              </div>
              
              <button type="submit" className="btn btn-warning mb-1 mt-2 w-100">Iniciar Sesión</button>

              <div className='col-12 text-end mb-4 small'><a href="#"><span className='text-warning '>¿Olvidate tu contraseña?</span></a> </div>

                  <div className='row col-12 m-0 p-0'>
                    <div className='col-4 border-bottom'></div>
                    <div className='col-4 text-center small'> <span >o registrate con</span> </div>
                    <div className='col-4 border-bottom'></div>
                  </div>

                  <div className='container m-0 p-0  mt-4 mb-3'>
                    <div className='row col-12 m-0 p-0 '>
                      <div className='col-3'></div>
                      <div className='col-2 text-center'> <img src="https://img.icons8.com/?size=100&id=118497&format=png&color=000000" alt='star' height="50" title='Facebook'/> </div>
                      <div className='col-2 text-center'> <img src="https://img.icons8.com/?size=100&id=Xy10Jcu1L2Su&format=png&color=000000" alt='star' height="50" title='Instagram'/> </div>
                      <div className='col-2 text-center'> <img src="https://img.icons8.com/?size=100&id=13930&format=png&color=000000" alt='star' height="50" title='Linkedin'/> </div>
                      <div className='col-3'></div>
                    </div>
                  </div>

                  <div className='row col-12 m-0 p-0'>
                    <div className='col-12 text-center'> <span >¿Aún no tienes una cuenta?</span> <Link to="/Registro"><a className='text-warning' >Registrate aquí</a> </Link> </div>
                  </div>
              
            </form>

          </div>

        </div>

        {/* Lado derecho: Imagen + botones */}
        <div className="col-md-6 d-none d-md-block bg-primary text-white position-relative p-4" style={{ background: "linear-gradient(135deg, #0062FF, #00C6FF)" }}>
          <div className="text-center mb-4">
            <p className="fw-bold">¡Instala UniPark ahora mismo!</p>
            <div className="d-flex justify-content-center gap-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" style={{ height: "69px" }} />
              <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" style={{ height: "69px" }}/>
            </div>
          </div>

          <div className="d-flex justify-content-center">
            <img
              src="http://127.0.0.1:5000/iconos/celular.png"
              alt="Parqueadero"
              style={{
                height: '400px',
                width: 'auto',
                objectFit: 'cover',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            />
          </div>

          <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
            <h4 className="bg-white text-primary px-3 py-1 rounded">Uni<span className="text-warning">Park</span></h4>
          </div>
        </div>

    </div>
        
    </>
    );
}

export default Login