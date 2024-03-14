import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react'

import Docs from './Docs.jsx'
import Signin from './Signin.jsx'
import Register from './Register.jsx'
import EntryPoint from './EntryPoint.jsx';
import PrivateRoute from './PrivateRoute.jsx'
import './index.css'

function Routing() {

    const [page,setPage] = useState()
    const [user,setUser] = useState({})

    const saveLocal = (S) =>{
        setPage(S)
        localStorage.setItem('page', S);
    }
    
return(
    <>
        <Router>
            <Routes>
                <Route path='/' element={<EntryPoint saveLocal={saveLocal} setUser={setUser}/>}/>
                <Route path='/Login' element={<Signin saveLocal={saveLocal} setUser={setUser}/>}/>
                <Route path='/Register' element={<Register/>}/>
                <Route element={<PrivateRoute viewSet="Docs"  view={page}/>}>
                    <Route path='/Docs' element={<Docs saveLocal={saveLocal}/>}/> 
                </Route>
            </Routes>
        </Router>
    </>
)}

export default Routing
