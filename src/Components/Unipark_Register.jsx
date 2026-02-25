import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register(){

    const Navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [errors, setErrors] = useState({});
    const [nombres, setNombre] = useState("");
    const [correo, setCorreo] = useState(null);
    const [clave, setClave] = useState(null);
    const rol = "Estudiante";

  const validate = () => {
    const newErrors = {};

    if (!nombres || nombres.trim().length < 3) {
      newErrors.nombres = "Debes ingresar al menos 3 caracteres para el nombre.";
    }

    if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      newErrors.correo = "Correo electrónico inválido.";
    }

    if (!clave || clave.length < 8) {
      newErrors.clave = "La clave debe tener al menos 8 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {

        try {
            const response = await fetch(`${API_BASE_URL}/nuevo/usuario`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ nombres, correo, clave, rol, fecha_login: null }),
            });
      
            const data = await response.json();
      
            if (response.ok) {
              alert('Registro exitoso', 'Tu cuenta ha sido creada.');
              Navigate("/");
            } else {
              alert('Error', data.message || 'Ocurrió un error al registrarse');
            }
        } catch (error) {
            console.error('Error al registrar:', error);
            alert('Error', 'No se pudo conectar con el servidor.');
        }
    }
  };



    return (
    <>

      <div className="d-flex vh-100">

        {/* Formulario */}
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-light">

          <div className="card border-0 p-5 shadow-sm w-75">
            <h2 className="mb-4 text-center Titulo_pagina ">Crea tu cuenta en <span className="fw-bold text-warning">UniPark</span></h2>



            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nombres</label>
                <input
                  type="text"
                  name="nombres"
                  value={nombres}
                  onChange={(e) => setNombre(e.target.value)}
                  className={`form-control ${errors.nombres ? 'is-invalid' : ''}`}
                  placeholder="Ej: Juan Pérez"
                />
                {errors.nombres && <div className="invalid-feedback">{errors.nombres}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  name="correo"
                  value={correo || ""}
                  onChange={(e) => setCorreo(e.target.value)}
                  className={`form-control ${errors.correo ? "is-invalid" : ""}`}
                  placeholder="example@example.com"
                />
                {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Clave</label>
                <input
                  type="password"
                  name="clave"
                  value={clave || ""}
                  onChange={(e) => setClave(e.target.value)}
                  className={`form-control ${errors.clave ? 'is-invalid' : ''}`}
                  placeholder="***********"
                />
                {errors.clave && <div className="invalid-feedback">{errors.clave}</div>}
              </div>

              <button type="submit" className=" form-group btn btn-warning w-100">Registrarse</button>
            </form>




            <div className="text-center mt-3">
              ¿Ya tienes una cuenta? <a href="/" className="text-warning">Inicia sesión</a>
            </div>
          </div>

        </div>

        {/* Lado derecho: Imagen + botones */}
        <div className="col-md-6 d-none d-md-block bg-primary text-white position-relative p-4" style={{ background: "linear-gradient(135deg, #0062FF, #00C6FF)" }}>
          <div className="text-center mb-4">
            <p className="fw-bold " >¡Instala UniPark ahora mismo!</p>
            <div className="d-flex justify-content-center gap-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play"  style={{ height: "69px" }}/>
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

export default Register