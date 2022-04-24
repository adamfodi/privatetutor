import React from 'react';
import "primereact/resources/themes/fluent-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./App.css"
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Navbar from "./components/Navbar";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import Main from "./components/Main";
import Profile from "./components/profile/Profile";
import {connect} from "react-redux";
import Ad from "./components/tutor/Ad";
import {compose} from "redux";
import TeachingRoom from "./components/TeachingRoom";
import YOLO from "./components/YOLO";
import PrivateLessons from "./components/PrivateLessons";
import Messages from "./components/Messages";


const App = (props) => {
    const {role, firebaseAuth} = props;

    return (
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route
                    exact path="/main"
                    element={<Main/>}
                />

                <Route
                    exact path="/signin"
                    element={firebaseAuth.isEmpty ? <SignIn/> : <Navigate to="/main"/>}
                />

                <Route
                    exact path="/signup"
                    element={firebaseAuth.isEmpty ? <SignUp/> : <Navigate to="/main"/>}
                />

                <Route
                    exact path="/profile"
                    element={!firebaseAuth.isEmpty ? <Profile/> : <Navigate to="/main"/>}
                />

                <Route
                    exact path="/messages"
                    element={!firebaseAuth.isEmpty ? <Messages/> : <Navigate to="/main"/>}
                />

                <Route
                    exact path="/private-lessons"
                    element={!firebaseAuth.isEmpty ? <PrivateLessons/> : <Navigate to="/main"/>}
                />

                <Route
                    exact path="/teaching-room"
                    element={!firebaseAuth.isEmpty ? <TeachingRoom/> : <Navigate to="/profile"/>}
                />


                <Route
                    exact path="/tutor/ad"
                    element={!firebaseAuth.isEmpty && role === "tutor" ? <Ad/> : <Navigate to="/main"/>}
                />


                <Route
                    exact path="/yolo"
                    element={!firebaseAuth.isEmpty ? <YOLO/> : <Navigate to="/main"/>}
                />

                <Route
                    path="*"
                    element={<Navigate to="/main"/>}
                />
            </Routes>
        </BrowserRouter>
    );
};

const mapStateToProps = state => {
    return {
        role: state.role,
        firebaseAuth: state.firebase.auth
    };
};

export default compose(connect(mapStateToProps))(App);
