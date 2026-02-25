import React, { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './Components/Unipark_Login.jsx';
import Register from './Components/Unipark_Register.jsx';
import Home from './Components/Unipark_Home.jsx';
import Config from './Components/Unipark_Config.jsx';
import User from './Components/Unipark_User.jsx';
import UserRegister from './Components/Unipark_User_Registrer.jsx';
import UserUpdate from './Components/Unipark_User_Update.jsx';
import Vehicle from './Components/Unipark_Vehicle.jsx';
import VehicleRegister from './Components/Unipark_Vehicle_Register.jsx';
import VehicleUpdate from './Components/Unipark_Vehicle_Update.jsx';
import Parking from './Components/Unipark_Parking.jsx';
import Report from './Components/Unipark_Reports.jsx';
import History from './Components/Unipark_History.jsx';


function App() {
  const [user, setUser] = useState(0)

  return (

    <BrowserRouter>
      <Routes>
        <Route index element={<Login callback={setUser}/>}></Route>                 {/* // primera ruta  LOGIN */}
        <Route path='/Registro' element={<Register user={user}/>} ></Route>         {/* // Segunda ruta INICIO */}
        <Route path='/Inicio' element={<Home user={user}/>} ></Route>               {/* // Segunda ruta INICIO */}
        <Route path='/Configuracion' element={<Config user={user}/>} ></Route>              {/* // Segunda ruta INICIO */}
        <Route path='/Usuario' element={<User user={user}/>} ></Route>                      {/* // Segunda ruta INICIO */}
        <Route path='/Usuario/Registro' element={<UserRegister user={user}/>} ></Route>
        <Route path='/Usuario/Actualizar/:id_usuario' element={<UserUpdate user={user}/>} ></Route>
        <Route path='/Vehiculo' element={<Vehicle user={user}/>} ></Route>
        <Route path='/Vehiculo/Registrar' element={<VehicleRegister user={user}/>} ></Route>
        <Route path='/Vehiculo/Actualizar/:id_vehiculo' element={<VehicleUpdate user={user}/>} ></Route>
        <Route path='/Parqueadero' element={<Parking user={user}/>} ></Route>
        <Route path='/Historial' element={<History user={user}/>} ></Route>
        <Route path='/Reportes' element={<Report user={user}/>} ></Route>

      </Routes>
    </BrowserRouter>

  )
}

export default App
