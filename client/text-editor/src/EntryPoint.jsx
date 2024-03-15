
import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react'

function EntryPoint(props) {

    const navigate = useNavigate();

    useEffect(()=>{
        const Page = localStorage.getItem('page')
        if(Page !== undefined)
        {
            props.saveLocal(Page)
            navigate(Page)
        }
        else
        {
            props.saveLocal('Login')
            navigate('/Login')
        }
    },[])


    
return(
    <>
    </>
)}

export default EntryPoint
