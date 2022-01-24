import React from 'react';
import "primereact/resources/themes/luna-green/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./App.css"
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import CreateLesson from "./components/tutor/CreateLesson";
import Main from "./components/Main";
import RoleSelector from "./components/layout/RoleSelector";

const App = () => {
    return (
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route exact path="/signin" element={<SignIn/>}/>
                <Route exact path="/signup" element={<SignUp/>}/>
                <Route exact path="/main" element={<Main/>}/>
                <Route exact path="/createlesson" element={<CreateLesson/>}/>
                <Route exact path="/roleselector" element={<RoleSelector/>}/>
                <Route path="*" element={<Navigate to="/main"/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
