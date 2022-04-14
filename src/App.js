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
import Advertisement from "./components/tutor/Advertisement";
import {compose} from "redux";
import {firestoreConnect} from "react-redux-firebase";
import TeachingRoom from "./components/TeachingRoom";
import YOLO from "./components/YOLO";
import PrivateLessons from "./components/PrivateLessons";
import Test from "./components/Test";

const App = (props) => {
    const {firebaseAuth} = props;

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
                    element={firebaseAuth.isEmpty ? <SignIn/> : <Navigate to="/main"/>}/>
                <Route
                    exact path="/signup"
                    element={firebaseAuth.isEmpty ? <SignUp/> : <Navigate to="/main"/>}/>
                <Route
                    exact path="/profile"
                    element={!firebaseAuth.isEmpty ? <Profile/> : <Navigate to="/main"/>}/>

                <Route
                    exact path="/private-lessons"
                    element={!firebaseAuth.isEmpty ? <PrivateLessons/> : <Navigate to="/main"/>}
                />

                <Route
                    exact path="/teaching-room"
                    element={!firebaseAuth.isEmpty ? <TeachingRoom/> : <Navigate to="/profile"/>}
                />


                <Route
                    exact path="/tutor/advertisement"
                    element={!firebaseAuth.isEmpty ? <Advertisement/> : <Navigate to="/main"/>}
                />


                <Route
                    exact path="/yolo"
                    element={!firebaseAuth.isEmpty ? <YOLO/> : <Navigate to="/main"/>}
                />

                <Route exact path="/test" element={<Test txt={"txt"}/>}/>

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
        firebaseAuth: state.firebase.auth,
        privateLessons: state.firestore.ordered.privateLessons
    };
};

export default compose(
    firestoreConnect([{collection: "privateLessons"}]),
    connect(mapStateToProps)
)(App);
