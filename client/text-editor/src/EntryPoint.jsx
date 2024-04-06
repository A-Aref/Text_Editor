
import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react'

function EntryPoint(props) {

    const navigate = useNavigate();
    const page =localStorage.getItem('page')
    const user =localStorage.getItem('user')
    useEffect(()=>{
        
        if(page === 'Docs')
        {
            props.setPage()
            props.setUser(user)
            navigate('Docs')
        }
        else
        {
            navigate('Login')
        }  
    },[])

return(
    <>
    </>
)}

export default EntryPoint
