import React, {useEffect, useState} from 'react';
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
import TutorPrivateLessons from "./components/tutor/TutorPrivateLessons";
import {compose} from "redux";
import {firestoreConnect} from "react-redux-firebase";
import TeachingRoom from "./components/TeachingRoom";

const App = (props) => {
    const {auth, privateLessons} = props;
    const [teachingRoomRoutes, setTeachingRoomRoutes] = useState([])

    useEffect(() => {
        if (privateLessons) {
            const currentTime = Math.round(Date.now() / 1000);
            setTeachingRoomRoutes(privateLessons.filter((privateLesson) =>
                currentTime > privateLesson.dateFrom.seconds && currentTime < privateLesson.dateTo.seconds)
                .map((privateLesson) => {
                    // console.log(privateLesson)
                    const pathName = "/teaching-room/" + privateLesson.roomID;
                    const role = auth.uid === privateLesson.tutorUID ? "tutor" : "student";
                    return <Route key={privateLesson.roomID}
                                  exact
                                  path={pathName}
                                  element={auth.uid === privateLesson.tutorUID || auth.uid === privateLesson.studentUID
                                      ? <TeachingRoom role={role}/>
                                      : <Navigate to="/profile"/>}
                    />
                })
            )
        }
    }, [auth.uid, privateLessons])

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
                    element={auth.isEmpty ? <SignIn/> : <Navigate to="/main"/>}/>
                <Route
                    exact path="/signup"
                    element={auth.isEmpty ? <SignUp/> : <Navigate to="/main"/>}/>
                <Route
                    exact path="/profile"
                    element={!auth.isEmpty ? <Profile/> : <Navigate to="/main"/>}/>

                <Route
                    exact path="/tutor/advertisement"
                    element={!auth.isEmpty ? <Advertisement/> : <Navigate to="/main"/>}
                />
                <Route
                    exact path="/tutor/private-lessons"
                    element={!auth.isEmpty ? <TutorPrivateLessons/> : <Navigate to="/main"/>}
                />

                {/*<Route exact path="/test" element={<Test txt={"txt"}/>}/>*/}
                {/*<Route exact path="/test2" element={<Test txt={"txt2"}/>}/>*/}

                {teachingRoomRoutes.map((item) => {
                    // console.log(item)
                    return item
                })}

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
        auth: state.firebase.auth,
        privateLessons: state.firestore.ordered.privateLessons
    };
};

export default compose(
    firestoreConnect([{collection: "privateLessons"}]),
    connect(mapStateToProps)
)(App);
