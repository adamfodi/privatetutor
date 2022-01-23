import React from 'react';
import "primereact/resources/themes/luna-green/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./App.css"
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Navbar from "./components/Navbar";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import IndexStudent from "./components/student/IndexStudent";
import CreateLesson from "./components/tutor/CreateLesson";

const App = () => {
    return (
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route exact path="/signin" element={<SignIn/>}/>
                <Route exact path="/signup" element={<SignUp/>}/>
                <Route exact path="/indexStudent" element={<IndexStudent/>}/>
                <Route exact path="/createlesson" element={<CreateLesson/>}/>
                <Route path="*" element={<Navigate to="/indexStudent"/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
