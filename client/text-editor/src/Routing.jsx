import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Docs from './DocComponents/Docs.jsx'
import Signin from './Signin.jsx'
import Register from './Register.jsx'
import EntryPoint from './EntryPoint.jsx';
import TypingArea from './TypingArea.jsx'
import PrivateRoute from './PrivateRoute.jsx';
import './index.css'

function Routing() {

    const [page, setPage] = useState('Login')
    const [edit, setEdit] = useState()
    const [user, setUser] = useState({})
    const [currentOpenDoc, setcurrentOpenDoc] = useState(null);
    const [currentText, setcurrentText] = useState(null);

    const setToDocs = () => setPage('Docs')
    const setUserr = (user) => setUser(user)


    return (
        <>
            <Router>
                <Routes>

                    <Route path='/' element={<EntryPoint setPage={setToDocs} setUser={setUserr} />} />
                    <Route path='/Login' element={<Signin setPage={setPage} setUser={setUser} />} />
                    <Route path='/Register' element={<Register />} />
                    <Route element={<PrivateRoute viewSet="Docs" view={page} />}>
                        <Route path='/Docs' element={<Docs setPage={setPage} setEdit={setEdit}
                            userId={user} setCurrentOpenDoc={setcurrentOpenDoc} />} />
                    </Route>
                    <Route element={<PrivateRoute viewSet="Editor" view={page} />}>
                        <Route path='/Docs/:id' element={<TypingArea setPage={setPage} edit={edit}
                            currentUserEmail={user} currentOpenDoc={currentOpenDoc}
                            currentText={currentText} setCurrentText={setcurrentText} />} />
                    </Route>
                    <Route path='*' element={<EntryPoint setPage={setPage} setUser={setUser} />} />
                </Routes>
            </Router>
        </>
    );
}

export default Routing;
