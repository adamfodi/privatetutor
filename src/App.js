import React, {useEffect, useState} from 'react';
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
import PrivateLessons from "./components/tutor/PrivateLessons";
import {compose} from "redux";
import {firestoreConnect} from "react-redux-firebase";
import TeachingRoomRouter from "./components/TechingRoomRouter";
import TeachingRoom from "./components/TeachingRoom";

const App = (props) => {
    const {auth, privateLessons} = props;
    const [privateLessonsRoutes, setPrivateLessonsRouter] = useState([])

    // useEffect(() => {
    //     privateLessons &&
    //     setPrivateLessonsRouter(privateLessons.map((privateLesson) => {
    //         const pathName = "/teaching-room/" + privateLesson.id
    //         return <Route key={privateLesson.id}
    //                       exact path={pathName}
    //                       element={auth.uid === privateLesson.tutor || auth.uid === privateLesson.student
    //                           ? <TeachingRoom/>
    //                           : <Navigate to="/profile"/>}
    //         />
    //     }))
    // }, [auth.uid, privateLessons])

    return (
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route exact path="/main" element={<Main/>}/>

                <Route exact path="/signin" element={auth.isEmpty ? <SignIn/> : <Navigate to="/main"/>}/>
                <Route exact path="/signup" element={auth.isEmpty ? <SignUp/> : <Navigate to="/main"/>}/>

                <Route exact path="/mycourses" element={<MyCourses/>}/>
                <Route exact path="/profile" element={!auth.isEmpty ? <Profile/> : <Navigate to="/main"/>}/>

                <Route exact path="/tutor/advertisement"
                       element={!auth.isEmpty ? <Advertisement/> : <Navigate to="/main"/>}/>
                <Route exact path="/tutor/private-lessons"
                       element={!auth.isEmpty ? <PrivateLessons/> : <Navigate to="/main"/>}/>

                <Route exact path="/test" element={<Test txt={"txt"}/>}/>
                <Route exact path="/test2" element={<Test txt={"txt2"}/>}/>
                {/*<Route exact path="/teaching-room/asd123"*/}
                {/*       element={<TeachingRoom/>}*/}
                {/*/>*/}

                {/*{privateLessonsRoutes.map((item, index) => {*/}
                {/*    return item*/}
                {/*})}*/}

                {privateLessons &&

                    <Route path="/teaching-room"
                           element={auth.uid === privateLessons[0].tutor || auth.uid === privateLessons[0].student
                               ? <TeachingRoom/>
                               : <Navigate to="/profile"/>}
                    />
                }


                <Route path="*" element={<Navigate to="/main"/>}/>
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
