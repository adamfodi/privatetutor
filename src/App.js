import React from 'react';
import "primereact/resources/themes/luna-green/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Navbar from "./components/Navbar";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import {connect} from "react-redux";

const App = props => {

    return (
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route exact path="/signin" element={<SignIn auth2={props.auth}/>}/>
                <Route exact path="/signup" element={<SignUp/>}/>
                <Route path="/" element={<SignUp/>}/>
            </Routes>
        </BrowserRouter>
    );
}

const mapStateToProps = state => {
    return {
        authError: state.auth.authError,
        auth: state.firebase.auth
    };
};

export default connect(mapStateToProps)(App);
