import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { useEffect, useState } from 'react'

import Docs from './Docs.jsx'
import Signin from './Signin.jsx'
import Register from './Register.jsx'
import EntryPoint from './EntryPoint.jsx';
import TypingArea from './TypingArea.jsx'
import PrivateRoute from './PrivateRoute.jsx';
import './index.css'

function Routing() {

    const [page,setPage] = useState()
    const [edit,setEdit] = useState()
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
                    <Route path='/Docs' element={<Docs saveLocal={saveLocal} setEdit={setEdit}/> }/> 
                </Route>
                <Route path='/Docs/:id' element={<TypingArea saveLocal={saveLocal} edit={edit}/>}/>
                <Route path='*' element={<EntryPoint saveLocal={saveLocal} setUser={setUser}/>}/>
            </Routes>
        </Router>
    </>
  );
}

export default Routing;
