import React from 'react';
import "primereact/resources/themes/fluent-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./App.css"
import "../src/assets/css/util/dialog.css"
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Navbar from "./components/Navbar";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import Main from "./components/Main";
import MyCourses from "./components/courses/MyCourses";
import Profile from "./components/profile/Profile";
import {Test} from "./components/Test";
import {connect} from "react-redux";
import Advertisement from "./components/tutor/Advertisement";

const App = (props) => {
    const {auth} = props;

    return (
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route exact path="/main" element={<Main/>}/>

                <Route exact path="/signin" element={!auth.loggedIn ? <SignIn/> : <Navigate to="/main"/>}/>
                <Route exact path="/signup" element={!auth.loggedIn ? <SignUp/> : <Navigate to="/main"/>}/>

                <Route exact path="/mycourses" element={<MyCourses/>}/>
                <Route exact path="/profile" element={auth.loggedIn ? <Profile/> : <Navigate to="/main"/>}/>

                <Route exact path="/tutor/advertisement" element={auth.loggedIn ? <Advertisement/> : <Navigate to="/main"/>}/>

                <Route exact path="/test" element={<Test/>}/>
                <Route path="*" element={<Navigate to="/main"/>}/>
            </Routes>
        </BrowserRouter>
    );
};

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

export default connect(mapStateToProps)(App);
