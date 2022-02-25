import React from 'react';
import "primereact/resources/themes/fluent-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./App.css"
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import Main from "./components/Main";
import MyCourses from "./components/courses/MyCourses";
import Profile from "./components/Profile";
import {Test} from "./components/Test";

const App = () => {
    return (
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route exact path="/signin" element={<SignIn/>}/>
                <Route exact path="/signup" element={<SignUp/>}/>
                <Route exact path="/main" element={<Main/>}/>
                <Route exact path="/mycourses" element={<MyCourses/>}/>
                <Route exact path="/profile" element={<Profile/>}/>
                <Route exact path="/test" element={<Test/>}/>
                <Route path="*" element={<Navigate to="/main"/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
