import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { useEffect, useState } from 'react'

import Signin from './Signin.jsx'
import Register from './Register.jsx'
import Docs from './Docs.jsx'
import PrivateRoute from './PrivateRoute.jsx'
import './index.css'
function Routing() {

    const [view,setView] = useState('none')
    const [user,setUser] = useState({})
    
return(
    <>
        <Router>
            <Routes>
                <Route path='/' element={<Signin view={setView} setUser={setUser}/>}/>
                <Route path='/Register' element={<Register/>}/>
                <Route path='/Docs' element={<Docs/>}/>
            </Routes>
        </Router>
    </>
)}

export default Routing
